<?php

namespace App\Http\Middleware;

use App\Services\Registration\RegistrationAccountService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRegistrationComplete
{
    public function __construct(
        private readonly RegistrationAccountService $registrationAccounts,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $nextStep = $user->nextRegistrationStep();

        // All registration steps are complete but verify_account was never set
        // (e.g. direct navigation or Google OAuth edge cases). Fix it lazily.
        if ($nextStep === null && ! $user->hasVerifiedAccount()) {
            $this->registrationAccounts->markAccountVerified($user);
        }

        if ($nextStep !== null) {
            $allowed = match ($nextStep) {
                'register.complete-profile' => [
                    'register.complete-profile',
                    'register.complete-profile.store',
                    'register.cancel',
                    'logout',
                    'plans',
                ],
                'register.verify' => [
                    'register.verify',
                    'register.verify.*',
                    'register.cancel',
                    'logout',
                    'plans',
                ],
                'register.plan' => [
                    'register.plan',
                    'register.plan.*',
                    'register.cancel',
                    'logout',
                    'plans',
                ],
                'register.payment' => [
                    'register.payment',
                    'register.payment.*',
                    'register.cancel',
                    'logout',
                    'plans',
                ],
                default => [],
            };

            if (! $request->routeIs(...$allowed)) {
                return redirect()->route($nextStep);
            }
        }

        return $next($request);
    }
}
