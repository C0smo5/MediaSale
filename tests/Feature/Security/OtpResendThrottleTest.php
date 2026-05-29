<?php

use App\Models\User;
use App\Models\VerificationCode;

beforeEach(function (): void {
    \Illuminate\Support\Facades\Notification::fake();
});

test('email resend is throttled within cooldown', function (): void {
    $user = createUser(['email_verified_at' => null, 'verify_account' => false]);

    $user->verificationCodes()->create([
        'channel' => VerificationCode::CHANNEL_EMAIL,
        'code_hash' => 'x',
        'expires_at' => now()->addMinutes(10),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->actingAs($user)
        ->from(route('register.verify'))
        ->post(route('register.verify.resend.email'))
        ->assertSessionHasErrors();
});

test('phone resend is throttled within cooldown', function (): void {
    $user = createUser(['phone_verified_at' => null, 'verify_account' => false]);

    $user->verificationCodes()->create([
        'channel' => VerificationCode::CHANNEL_PHONE,
        'code_hash' => 'x',
        'expires_at' => now()->addMinutes(10),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->actingAs($user)
        ->from(route('register.verify'))
        ->post(route('register.verify.resend.phone'))
        ->assertSessionHasErrors();
});

test('email resend succeeds after cooldown expires', function (): void {
    $user = createUser(['email_verified_at' => null, 'phone_verified_at' => null, 'verify_account' => false]);

    $user->verificationCodes()->create([
        'channel' => VerificationCode::CHANNEL_EMAIL,
        'code_hash' => 'x',
        'expires_at' => now()->addMinutes(10),
        'created_at' => now()->subSeconds(61),
        'updated_at' => now()->subSeconds(61),
    ]);

    $this->actingAs($user)
        ->from(route('register.verify'))
        ->post(route('register.verify.resend.email'))
        ->assertRedirect();
});
