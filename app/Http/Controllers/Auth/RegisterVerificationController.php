<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\VerificationCode;
use App\Services\Verification\VerificationCodeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisterVerificationController extends Controller
{
    public function __construct(
        private readonly VerificationCodeService $verificationCodeService,
    ) {}

    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if ($user->needsProfileCompletion()) {
            return redirect()->route('register.complete-profile');
        }

        if ($user->isFullyVerified()) {
            if (! $user->hasSelectedPlan()) {
                return redirect()->route('register.plan');
            }

            if ($user->planRequiresPayment() && ! $user->hasCompletedPayment()) {
                return redirect()->route('register.payment');
            }

            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/RegisterVerify', [
            'emailVerified' => $user->hasVerifiedEmail(),
            'phoneVerified' => $user->hasVerifiedPhone(),
            'maskedEmail' => $this->maskEmail($user->email),
            'maskedPhone' => $this->maskPhone($user->phone),
            'resendCooldown' => [
                'email' => $this->verificationCodeService->resendCooldownRemaining($user, VerificationCode::CHANNEL_EMAIL),
                'phone' => $this->verificationCodeService->resendCooldownRemaining($user, VerificationCode::CHANNEL_PHONE),
            ],
            'debugSmsCode' => config('app.debug') ? config('registration.sms.mock_code') : null,
            'status' => session('status'),
        ]);
    }

    public function verifyEmail(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:'.config('registration.otp.length', 6)],
        ]);

        $this->verificationCodeService->verify(
            $request->user(),
            VerificationCode::CHANNEL_EMAIL,
            $request->string('code')->value()
        );

        if ($request->user()->fresh()->isFullyVerified()) {
            return redirect()->route('register.plan');
        }

        return redirect()
            ->route('register.verify')
            ->with('status', 'email-verified');
    }

    public function verifyPhone(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string', 'size:'.config('registration.otp.length', 6)],
        ]);

        $this->verificationCodeService->verify(
            $request->user(),
            VerificationCode::CHANNEL_PHONE,
            $request->string('code')->value()
        );

        if ($request->user()->fresh()->isFullyVerified()) {
            return redirect()->route('register.plan');
        }

        return redirect()
            ->route('register.verify')
            ->with('status', 'phone-verified');
    }

    public function resendEmail(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return back();
        }

        if (! $this->verificationCodeService->canResend($user, VerificationCode::CHANNEL_EMAIL)) {
            throw ValidationException::withMessages([
                'email' => 'Aguarde antes de solicitar um novo codigo por e-mail.',
            ]);
        }

        $this->verificationCodeService->sendEmailCode($user);

        return back()->with('status', 'email-code-sent');
    }

    public function resendPhone(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedPhone()) {
            return back();
        }

        if (! $this->verificationCodeService->canResend($user, VerificationCode::CHANNEL_PHONE)) {
            throw ValidationException::withMessages([
                'phone' => 'Aguarde antes de solicitar um novo codigo por SMS.',
            ]);
        }

        $this->verificationCodeService->sendPhoneCode($user);

        return back()->with('status', 'phone-code-sent');
    }

    private function maskEmail(string $email): string
    {
        [$local, $domain] = explode('@', $email, 2);
        $visible = substr($local, 0, min(2, strlen($local)));

        return $visible.str_repeat('*', max(strlen($local) - 2, 1)).'@'.$domain;
    }

    private function maskPhone(?string $phone): string
    {
        if ($phone === null) {
            return '';
        }

        $digits = preg_replace('/\D/', '', $phone) ?? '';

        if (strlen($digits) < 4) {
            return $phone;
        }

        return str_repeat('*', max(strlen($digits) - 4, 0)).substr($digits, -4);
    }
}
