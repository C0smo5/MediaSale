<?php

use App\Models\User;
use Tests\Support\TotpCodeGenerator;

test('user with 2FA can complete challenge using TOTP code', function (): void {
    $user = createUser();
    $secret = enableTwoFactorForUser($user);

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect(route('two-factor.login'));

    $this->assertGuest();

    $this->post(route('two-factor.login.store'), [
        'code' => TotpCodeGenerator::forSecret($secret),
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticated();
});
