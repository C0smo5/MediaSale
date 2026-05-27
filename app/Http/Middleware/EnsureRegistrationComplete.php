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

        if ($user && ! $user->isFullyVerified()) {
            if (! $request->routeIs('register.verify', 'register.verify.*', 'logout')) {
                return redirect()->route('register.verify');
            }
        }

        return $next($request);
    }
}
