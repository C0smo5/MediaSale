<?php

test('2FA challenge is throttled after 6 failed attempts', function (): void {
    $user = createUser();
    enableTwoFactorForUser($user);

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password']);

    for ($i = 0; $i < 6; $i++) {
        $this->post(route('two-factor.login.store'), ['code' => '000000']);
    }

    $this->post(route('two-factor.login.store'), ['code' => '000000'])
        ->assertStatus(429);
});
