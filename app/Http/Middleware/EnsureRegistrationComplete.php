<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRegistrationComplete
{
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
                    'register.payment.skip',
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
