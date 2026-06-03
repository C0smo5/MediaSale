<?php

namespace App\Http\Responses\Fortify;

use App\Support\Auth\InternalRedirectValidator;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        $redirect = $request->input('redirect');

        if (is_string($redirect) && InternalRedirectValidator::isValid($redirect)) {
            return redirect()->to(InternalRedirectValidator::resolveRedirect($redirect));
        }

        return redirect()->intended(Fortify::redirects('login', config('fortify.home')));
    }
}
