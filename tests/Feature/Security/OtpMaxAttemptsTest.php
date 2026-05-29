<?php

use App\Models\User;
use App\Models\VerificationCode;
use App\Notifications\RegistrationOtpNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

beforeEach(function (): void {
    Notification::fake();
});

test('OTP is blocked after max attempts', function (): void {
    $user = createUser(['email_verified_at' => null]);

    $user->verificationCodes()->create([
        'channel' => VerificationCode::CHANNEL_EMAIL,
        'code_hash' => Hash::make('999999'),
        'expires_at' => now()->addMinutes(10),
        'attempts' => 5,
    ]);

    $this->actingAs($user)
        ->from(route('register.verify'))
        ->post(route('register.verify.email'), ['code' => '999999'])
        ->assertSessionHasErrors('code');
});

test('new resend clears attempts and accepts valid code', function (): void {
    $user = createUser([
        'email_verified_at' => null,
        'phone_verified_at' => null,
        'verify_account' => false,
    ]);

    // Burn the old code by maxing out attempts.
    $user->verificationCodes()->create([
        'channel' => VerificationCode::CHANNEL_EMAIL,
        'code_hash' => Hash::make('000000'),
        'expires_at' => now()->subSeconds(1),
        'attempts' => 5,
    ]);

    // A fresh code issued after max-attempts is rejected on the old slot.
    $code = app(\App\Services\Verification\VerificationCodeService::class)
        ->sendEmailCode($user);

    $this->actingAs($user)
        ->from(route('register.verify'))
        ->post(route('register.verify.email'), ['code' => $code])
        ->assertRedirect();

    expect($user->fresh()->email_verified_at)->not->toBeNull();
});

test('expired OTP is rejected', function (): void {
    $user = createUser(['email_verified_at' => null]);

    $user->verificationCodes()->create([
        'channel' => VerificationCode::CHANNEL_EMAIL,
        'code_hash' => Hash::make('123456'),
        'expires_at' => now()->subSeconds(1),
    ]);

    $this->actingAs($user)
        ->from(route('register.verify'))
        ->post(route('register.verify.email'), ['code' => '123456'])
        ->assertSessionHasErrors('code');
});
