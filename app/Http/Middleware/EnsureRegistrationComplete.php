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

        if (! $user->isFullyVerified()) {
            if (! $request->routeIs('register.verify', 'register.verify.*', 'register.cancel', 'logout', 'plans')) {
                return redirect()->route('register.verify');
            }

            return $next($request);
        }

        if (! $user->hasSelectedPlan()) {
            if (! $request->routeIs('register.plan', 'register.plan.*', 'register.cancel', 'logout', 'plans')) {
                return redirect()->route('register.plan');
            }

            return $next($request);
        }

        if ($user->planRequiresPayment() && ! $user->hasCompletedPayment()) {
            if (! $request->routeIs('register.payment', 'register.payment.skip', 'register.cancel', 'logout', 'plans')) {
                return redirect()->route('register.payment');
            }
        }

        return $next($request);
    }
}
