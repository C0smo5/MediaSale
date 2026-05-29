<?php

namespace App\Http\Middleware;

use App\Services\Registration\RegistrationAccountService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TouchRegistrationActivity
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

        if ($user && ! $user->hasVerifiedAccount()) {
            $this->registrationAccounts->touchActivity($user);
        }

        return $next($request);
    }
}
