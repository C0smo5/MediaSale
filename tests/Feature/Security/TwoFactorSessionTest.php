<?php

use App\Models\User;

test('user with 2FA can reach dashboard after completing challenge', function (): void {
    $user = createUser();
    enableTwoFactorForUser($user);

    /** @var string $recoveryCode */
    $recoveryCode = $user->fresh()->recoveryCodes()[0];

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('two-factor.login'));

    $this->assertGuest();
    $this->post(route('two-factor.login.store'), ['recovery_code' => $recoveryCode])
        ->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();
    $this->get(route('dashboard'))->assertOk();
});

test('user without 2FA can access dashboard directly after login', function (): void {
    $user = createUser();

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('dashboard'));

    $this->get(route('dashboard'))->assertOk();
});

test('invalid TOTP code does not grant access', function (): void {
    $user = createUser();
    enableTwoFactorForUser($user);

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password']);

    $this->post(route('two-factor.login.store'), ['code' => '000000'])
        ->assertSessionHasErrors('code');

    $this->assertGuest();
});

test('two factor secret is stored encrypted in database', function (): void {
    $user = createUser();
    enableTwoFactorForUser($user);

    $raw = \Illuminate\Support\Facades\DB::table('users')->where('id', $user->id)->value('two_factor_secret');

    expect($raw)->not->toBeNull();
    expect($raw)->not->toContain(' ');
});
