<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Auth\SessionManagementService;
use App\Services\Auth\TwoFactorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorController extends Controller
{
    public function __construct(
        private readonly TwoFactorService $twoFactor,
        private readonly SessionManagementService $sessions,
    ) {}

    // ─── Settings: enable / confirm / disable ────────────────────────────────

    public function setup(Request $request): JsonResponse
    {
        $data = $this->twoFactor->generateSetup($request->user());

        // Store secret temporarily in session until the user confirms it.
        $request->session()->put('2fa_pending_secret', $data['secret']);

        return response()->json([
            'qr_code_svg' => $data['qr_code_svg'],
            'secret' => $data['secret'],
        ]);
    }

    public function confirm(Request $request): RedirectResponse
    {
        $request->validate(['code' => ['required', 'string', 'digits:6']]);

        $secret = $request->session()->pull('2fa_pending_secret');

        if ($secret === null || ! $this->twoFactor->confirmSetup($request->user(), $secret, $request->string('code')->value())) {
            return back()->withErrors(['code' => 'Código inválido. Tente novamente.']);
        }

        $this->sessions->rotateSession($request);

        return redirect()->route('settings')->with('status', '2fa-enabled');
    }

    public function disable(Request $request): RedirectResponse
    {
        $request->validate(['password' => ['required', 'current_password']]);

        $this->twoFactor->disable($request->user());
        $this->sessions->rotateSession($request);

        return redirect()->route('settings')->with('status', '2fa-disabled');
    }

    public function recoveryCodes(Request $request): JsonResponse
    {
        return response()->json([
            'codes' => $request->user()->two_factor_recovery_codes ?? [],
        ]);
    }

    public function toggleSmsFallback(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $this->twoFactor->isEnabled($user)) {
            return back()->withErrors(['2fa' => 'Ative o 2FA primeiro.']);
        }

        $user->two_factor_sms_fallback
            ? $this->twoFactor->disableSmsFallback($user)
            : $this->twoFactor->enableSmsFallback($user);

        return back()->with('status', 'sms-fallback-toggled');
    }

    // ─── Login challenge ──────────────────────────────────────────────────────

    public function challengeView(Request $request): Response|RedirectResponse
    {
        if (! $request->session()->has('pending_2fa_user_id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/TwoFactorChallenge', [
            'smsFallbackAvailable' => (bool) $request->session()->get('pending_2fa_sms_fallback'),
        ]);
    }

    public function challengeVerify(Request $request): RedirectResponse
    {
        $userId = $request->session()->get('pending_2fa_user_id');

        if ($userId === null) {
            return redirect()->route('login');
        }

        $user = \App\Models\User::findOrFail($userId);

        $request->validate(['code' => ['required', 'string']]);
        $code = $request->string('code')->value();

        $verified = strlen($code) === 6 && ctype_digit($code)
            ? $this->twoFactor->verifyTotp($user, $code)
            : $this->twoFactor->verifyRecoveryCode($user, $code);

        if (! $verified) {
            return back()->withErrors(['code' => 'Código inválido.']);
        }

        $request->session()->forget(['pending_2fa_user_id', 'pending_2fa_sms_fallback']);
        Auth::login($user);
        $this->sessions->rotateSession($request);

        return redirect()->intended(route('dashboard'));
    }

    public function challengeSendSms(Request $request): RedirectResponse
    {
        $userId = $request->session()->get('pending_2fa_user_id');

        if ($userId === null) {
            return redirect()->route('login');
        }

        $user = \App\Models\User::findOrFail($userId);

        $this->twoFactor->sendSmsFallback($user);

        return back()->with('status', 'sms-sent');
    }
}
