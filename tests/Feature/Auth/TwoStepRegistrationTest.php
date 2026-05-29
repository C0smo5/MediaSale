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

    $user = User::query()->where('email', 'newuser@gmail.com')->firstOrFail();

    expect($user->verify_account)->toBeFalse();

    return $user;
}

function completeRegistrationVerification(User $user): void
{
    $emailCode = captureEmailOtp($user);

    test()->from(route('register.verify'))
        ->post(route('register.verify.email'), ['code' => $emailCode])
        ->assertRedirect(route('register.verify', absolute: false));

    test()->from(route('register.verify'))
        ->post(route('register.verify.phone'), ['code' => '123456'])
        ->assertRedirect(route('register.plan', absolute: false));
}

function selectRegistrationPlan(User $user, string $planKey = 'starter', string $billing = 'monthly'): void
{
    $expectedRedirect = $planKey === 'trial'
        ? route('dashboard', absolute: false)
        : route('register.payment', absolute: false);

    test()->actingAs($user)
        ->post(route('register.plan.store'), [
            'plan_key' => $planKey,
            'plan_billing' => $billing,
        ])
        ->assertRedirect($expectedRedirect);
}

function captureEmailOtp(User $user): string
{
    Notification::assertSentTo($user, RegistrationOtpNotification::class);

    $notification = Notification::sent($user, RegistrationOtpNotification::class)->first();

    expect($notification)->toBeInstanceOf(RegistrationOtpNotification::class);

    return $notification->code;
}

test('user completes registration with verification, plan selection and payment redirect', function () {
    $user = registerTestUser();
    completeRegistrationVerification($user);
    selectRegistrationPlan($user, 'starter');

    $user->refresh();

    expect($user->verify_account)->toBeFalse();
    expect($user->hasVerifiedEmail())->toBeTrue();
    expect($user->hasVerifiedPhone())->toBeTrue();
    expect($user->isFullyVerified())->toBeTrue();
    expect($user->plan_key)->toBe('starter');
    expect($user->plan_billing)->toBe('monthly');
    expect($user->planRequiresPayment())->toBeTrue();
    expect($user->isRegistrationComplete())->toBeFalse();
});

test('trial plan skips payment and completes registration', function () {
    $user = registerTestUser();
    completeRegistrationVerification($user);
    selectRegistrationPlan($user, 'trial');

    $user->refresh();

    expect($user->verify_account)->toBeTrue();
    expect($user->isRegistrationComplete())->toBeTrue();

    test()->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk();
});

test('dashboard is blocked until verification is complete', function () {
    $user = registerTestUser();

    test()->actingAs($user->fresh())
        ->get(route('dashboard'))
        ->assertRedirect(route('register.verify', absolute: false));
});

test('dashboard is blocked until plan is selected', function () {
    $user = registerTestUser();
    completeRegistrationVerification($user);

    test()->actingAs($user->fresh())
        ->get(route('dashboard'))
        ->assertRedirect(route('register.plan', absolute: false));
});

test('dashboard is blocked until payment for paid plans', function () {
    $user = registerTestUser();
    completeRegistrationVerification($user);
    selectRegistrationPlan($user, 'starter');

    test()->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('register.payment', absolute: false));
});

test('paid plan user can skip payment in debug to access dashboard', function () {
    config(['registration.allow_payment_skip' => true]);

    $user = registerTestUser();
    completeRegistrationVerification($user);
    selectRegistrationPlan($user, 'starter');

    test()->actingAs($user)
        ->post(route('register.payment.skip'))
        ->assertRedirect(route('dashboard', absolute: false));

    $user->refresh();

    expect($user->hasCompletedPayment())->toBeTrue();
    expect($user->verify_account)->toBeTrue();
    expect($user->isRegistrationComplete())->toBeTrue();

    test()->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk();
});

test('invalid verification code is rejected', function () {
    $user = registerTestUser();
    captureEmailOtp($user);

    test()->from(route('register.verify'))
        ->post(route('register.verify.email'), ['code' => '000000'])
        ->assertSessionHasErrors('code');
});

test('expired verification code is rejected', function () {
    $user = registerTestUser();
    $emailCode = captureEmailOtp($user);

    $user->verificationCodes()->latest()->first()->update([
        'expires_at' => now()->subMinute(),
    ]);

    test()->from(route('register.verify'))
        ->post(route('register.verify.email'), ['code' => $emailCode])
        ->assertSessionHasErrors('code');
});

test('verification resend is throttled', function () {
    $user = registerTestUser();
    captureEmailOtp($user);

    test()->from(route('register.verify'))
        ->post(route('register.verify.resend.email'))
        ->assertSessionHasErrors('email');
});

test('registration rejects invalid cpf email and phone', function () {
    $response = test()->from('/register')->post('/register', [
        'name' => 'Test User',
        'email' => 'test@empresa.com.br',
        'phone' => '1132654321',
        'cpf' => '11111111111',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors(['email', 'phone', 'cpf']);
    test()->assertGuest();
});
