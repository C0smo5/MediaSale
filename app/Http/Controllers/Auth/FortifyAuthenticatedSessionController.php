<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Services\Registration\RegistrationAccountService;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LogoutResponse;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController as BaseAuthenticatedSessionController;

class FortifyAuthenticatedSessionController extends BaseAuthenticatedSessionController
{
    public function destroy(Request $request): LogoutResponse
    {
        $user = $request->user();

        if ($user instanceof User && ! $user->hasVerifiedAccount()) {
            app(RegistrationAccountService::class)->deleteIncompleteRegistration($user);
        } else {
            $this->guard->logout();
        }

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return app(LogoutResponse::class);
    }
}
