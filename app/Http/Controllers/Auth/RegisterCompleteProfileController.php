<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterCompleteProfileRequest;
use App\Services\Verification\VerificationCodeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        Log::info('[debug-acf904] complete-profile store: profile saved, sending SMS', [
            'hypothesisId' => 'H-A',
            'sms_driver' => config('registration.sms.driver'),
            'user_id' => $user->id,
        ]);
        // #endregion

        try {
            $this->verificationCodeService->sendPhoneCode($user);

            // #region agent log
            Log::info('[debug-acf904] complete-profile store: SMS sent successfully', [
                'hypothesisId' => 'H-A',
                'user_id' => $user->id,
            ]);
            // #endregion
        } catch (\Throwable $e) {
            // #region agent log
            Log::error('[debug-acf904] complete-profile store: SMS FAILED', [
                'hypothesisId' => 'H-A',
                'error' => $e->getMessage(),
                'class' => get_class($e),
            ]);
            // #endregion
        }

        return redirect()
            ->route('register.verify')
            ->with('status', 'phone-code-sent');
    }
}
