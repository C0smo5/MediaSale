<?php

namespace App\Http\Middleware;

use App\Services\Auth\TwoFactorService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorVerified
{
    public function __construct(
        private readonly TwoFactorService $twoFactor,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null || ! $this->twoFactor->isEnabled($user)) {
            return $next($request);
        }

        // Allow the 2FA challenge routes through without looping.
        if ($request->routeIs('two-factor.*')) {
            return $next($request);
        }

        // If the session hasn't passed the 2FA challenge yet, redirect.
        if (! $request->session()->get('two_factor_verified')) {
            return redirect()->route('two-factor.challenge');
        }

        return $next($request);
    }
}
