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

        $this->verificationCodeService->sendPhoneCode($user);

        return redirect()
            ->route('register.verify')
            ->with('status', 'phone-code-sent');
    }
}
