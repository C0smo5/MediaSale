<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\Auth\TwoFactorService;
use App\Services\Registration\RegistrationAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'redirect' => $request->query('redirect'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $user = Auth::user();

        // If 2FA is active, park the user ID in session and redirect to challenge.
        if ($user !== null && app(TwoFactorService::class)->isEnabled($user)) {
            $request->session()->put('pending_2fa_user_id', $user->id);
            $request->session()->put('pending_2fa_sms_fallback', (bool) $user->two_factor_sms_fallback);
            Auth::logout();

            return redirect()->route('two-factor.challenge');
        }

        $request->session()->regenerate();

        $redirect = $request->input('redirect');

        if (is_string($redirect) && $this->isValidInternalRedirect($redirect)) {
            if (str_contains($redirect, '/plans')) {
                return redirect()->route('profile.edit', ['section' => 'plans']);
            }

            return redirect($redirect);
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request, RegistrationAccountService $registrationAccounts): RedirectResponse
    {
        $user = $request->user();

        if ($user !== null && ! $user->hasVerifiedAccount()) {
            $registrationAccounts->deleteIncompleteRegistration($user);
        } else {
            Auth::guard('web')->logout();
        }

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    private function isValidInternalRedirect(string $url): bool
    {
        if (str_starts_with($url, '/') && ! str_starts_with($url, '//')) {
            return true;
        }

        $appUrl = rtrim((string) config('app.url'), '/');

        return $appUrl !== '' && str_starts_with($url, $appUrl);
    }
}
