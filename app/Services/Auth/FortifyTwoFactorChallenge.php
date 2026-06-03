<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Events\TwoFactorAuthenticationChallenged;
class FortifyTwoFactorChallenge
{
    /**
     * Park pending login for Fortify's two-factor challenge (same session keys as RedirectIfTwoFactorAuthenticatable).
     */
    public function redirectIfEnabled(Request $request, User $user, bool $remember = false): ?RedirectResponse
    {
        if (! $user->hasEnabledTwoFactorAuthentication()) {
            return null;
        }

        Auth::logout();

        $request->session()->put([
            'login.id' => $user->getKey(),
            'login.remember' => $remember,
        ]);

        TwoFactorAuthenticationChallenged::dispatch($user);

        return redirect()->route('two-factor.login');
    }
}
