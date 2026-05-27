<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterStepOneRequest;
use App\Models\User;
use App\Services\Verification\VerificationCodeService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        private readonly VerificationCodeService $verificationCodeService,
    ) {}

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(RegisterStepOneRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->string('name')->value(),
            'email' => $request->string('email')->value(),
            'phone' => $request->string('phone')->value(),
            'cpf' => $request->string('cpf')->value(),
            'password' => $request->string('password')->value(),
        ]);

        event(new Registered($user));

        $this->verificationCodeService->sendAll($user);

        Auth::login($user);

        return redirect()->route('register.verify');
    }
}
