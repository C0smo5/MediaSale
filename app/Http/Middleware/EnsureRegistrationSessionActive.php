<?php

namespace App\Http\Middleware;

use App\Services\Registration\RegistrationAccountService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRegistrationSessionActive
{
    public function __construct(
        private readonly RegistrationAccountService $registrationAccounts,
    ) {}

    /**
     * Cadastro incompleto expirado por inatividade: encerra sessão e pede novo cadastro.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->hasVerifiedAccount() && $this->registrationAccounts->isInactive($user)) {
            $this->registrationAccounts->deleteIncompleteRegistration($user);

            return redirect()
                ->route('register')
                ->with('status', 'registration-expired');
        }

        return $next($request);
    }
}
