<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterCompleteProfileRequest;
use App\Services\Verification\VerificationCodeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegisterCompleteProfileController extends Controller
{
    public function __construct(
        private readonly VerificationCodeService $verificationCodeService,
    ) {}

    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user->needsProfileCompletion()) {
            $nextRoute = $user->nextRegistrationStep();

            return redirect()->to($nextRoute ? route($nextRoute) : route('dashboard'));
        }

        return Inertia::render('Auth/RegisterCompleteProfile', [
            'accountType' => $user->accountType(),
            'accountTypeLabel' => $user->accountTypeLabel(),
            'status' => session('status'),
        ]);
    }

    public function store(RegisterCompleteProfileRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->update([
            'phone' => $request->string('phone')->value(),
            'cpf' => $request->string('cpf')->value(),
        ]);

        // #region agent log
        error_log('[debug-acf904] store: reached, sms_driver='.config('registration.sms.driver').' user='.$user->id);
        // #endregion

        try {
            $this->verificationCodeService->sendPhoneCode($user);

            // #region agent log
            error_log('[debug-acf904] store: SMS sent OK user='.$user->id);
            // #endregion
        } catch (\Throwable $e) {
            // #region agent log
            error_log('[debug-acf904] store: SMS FAILED '.get_class($e).': '.substr($e->getMessage(), 0, 150));
            // #endregion
        }

        return redirect()
            ->route('register.verify')
            ->with('status', 'phone-code-sent');
    }
}
