<?php

use App\Models\User;
use App\Notifications\RegistrationOtpNotification;
use Illuminate\Support\Facades\Notification;

function registerTestUser(): User
{
    Notification::fake();

    test()->post('/register', [
        'name' => 'Test User',
        'email' => 'newuser@gmail.com',
        'phone' => '11987654321',
        'cpf' => '52998224725',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect(route('register.verify', absolute: false));

    return User::query()->where('email', 'newuser@gmail.com')->firstOrFail();
}

function captureEmailOtp(User $user): string
{
    Notification::assertSentTo($user, RegistrationOtpNotification::class);

    $notification = Notification::sent($user, RegistrationOtpNotification::class)->first();

    expect($notification)->toBeInstanceOf(RegistrationOtpNotification::class);

    return $notification->code;
}

test('user completes two step registration with email and sms codes', function () {
    $user = registerTestUser();
    $emailCode = captureEmailOtp($user);

    $this->from(route('register.verify'))
        ->post(route('register.verify.email'), ['code' => $emailCode])
        ->assertRedirect(route('register.verify', absolute: false));

    $this->from(route('register.verify'))
        ->post(route('register.verify.phone'), ['code' => '123456'])
        ->assertRedirect(route('dashboard', absolute: false));

    $user->refresh();

    expect($user->hasVerifiedEmail())->toBeTrue();
    expect($user->hasVerifiedPhone())->toBeTrue();
    expect($user->isFullyVerified())->toBeTrue();
});

test('invalid verification code is rejected', function () {
    $user = registerTestUser();
    captureEmailOtp($user);

    $this->from(route('register.verify'))
        ->post(route('register.verify.email'), ['code' => '000000'])
        ->assertSessionHasErrors('code');
});

test('expired verification code is rejected', function () {
    $user = registerTestUser();
    $emailCode = captureEmailOtp($user);

    $user->verificationCodes()->latest()->first()->update([
        'expires_at' => now()->subMinute(),
    ]);

    $this->from(route('register.verify'))
        ->post(route('register.verify.email'), ['code' => $emailCode])
        ->assertSessionHasErrors('code');
});

test('verification resend is throttled', function () {
    $user = registerTestUser();
    captureEmailOtp($user);

    $this->from(route('register.verify'))
        ->post(route('register.verify.resend.email'))
        ->assertSessionHasErrors('email');
});

test('registration rejects invalid cpf email and phone', function () {
    $response = $this->from('/register')->post('/register', [
        'name' => 'Test User',
        'email' => 'test@empresa.com.br',
        'phone' => '1132654321',
        'cpf' => '11111111111',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['email', 'phone', 'cpf']);
    $this->assertGuest();
});
