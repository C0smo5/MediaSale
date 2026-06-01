<?php

use App\Models\User;
use App\Services\Auth\TwoFactorService;
use Illuminate\Support\Facades\Auth;

test('user with 2FA can reach dashboard after completing challenge', function (): void {
    $user = createUser();
    $twoFactor = app(TwoFactorService::class);

    // Enable 2FA for the user.
    $secret = app(\PragmaRX\Google2FA\Google2FA::class)->generateSecretKey();
    $user->forceFill([
        'two_factor_secret' => $secret,
        'two_factor_confirmed_at' => now(),
    ])->save();

    // Step 1: POST /login parks pending_2fa_user_id and logs the user out.
    $this->post(route('login'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('two-factor.challenge'));

    $this->assertGuest();

    // Step 2: Submit a valid TOTP code.
    $code = app(\PragmaRX\Google2FA\Google2FA::class)->getCurrentOtp($secret);

    $this->post(route('two-factor.verify'), ['code' => $code])
        ->assertRedirect(route('dashboard'));

    // Step 3: Authenticated user can access dashboard.
    $this->assertAuthenticated();
    $this->get(route('dashboard'))->assertOk();
});

test('user with 2FA is blocked from dashboard before challenge', function (): void {
    $user = createUser();

    $user->forceFill([
        'two_factor_secret' => app(\PragmaRX\Google2FA\Google2FA::class)->generateSecretKey(),
        'two_factor_confirmed_at' => now(),
    ])->save();

    // Simulate a session where Auth::login was called but two_factor_verified was NOT set.
    Auth::login($user);

    $this->get(route('dashboard'))->assertRedirect(route('two-factor.challenge'));
});

test('user without 2FA can access dashboard directly after login', function (): void {
    $user = createUser();

    $this->post(route('login'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('dashboard'));

    $this->get(route('dashboard'))->assertOk();
});

test('invalid TOTP code does not grant access', function (): void {
    $user = createUser();

    $user->forceFill([
        'two_factor_secret' => app(\PragmaRX\Google2FA\Google2FA::class)->generateSecretKey(),
        'two_factor_confirmed_at' => now(),
    ])->save();

    $this->post(route('login'), ['email' => $user->email, 'password' => 'password']);

    $this->post(route('two-factor.verify'), ['code' => '000000'])
        ->assertSessionHasErrors('code');

    $this->assertGuest();
});
