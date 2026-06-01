<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;

test('2FA challenge is throttled after 6 failed attempts', function (): void {
    $user = createUser();
    $user->forceFill([
        'two_factor_secret' => app(\PragmaRX\Google2FA\Google2FA::class)->generateSecretKey(),
        'two_factor_confirmed_at' => now(),
    ])->save();

    $this->post(route('login'), ['email' => $user->email, 'password' => 'password']);

    for ($i = 0; $i < 6; $i++) {
        $this->post(route('two-factor.verify'), ['code' => '000000']);
    }

    $this->post(route('two-factor.verify'), ['code' => '000000'])
        ->assertStatus(429);
});

test('SMS 2FA send is throttled after 6 attempts', function (): void {
    $user = createUser();
    $user->forceFill([
        'two_factor_secret' => app(\PragmaRX\Google2FA\Google2FA::class)->generateSecretKey(),
        'two_factor_confirmed_at' => now(),
        'two_factor_sms_fallback' => true,
    ])->save();

    $this->post(route('login'), ['email' => $user->email, 'password' => 'password']);

    for ($i = 0; $i < 6; $i++) {
        $this->post(route('two-factor.challenge.sms'));
    }

    $this->post(route('two-factor.challenge.sms'))
        ->assertStatus(429);
});
