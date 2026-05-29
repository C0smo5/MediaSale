<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

test('google callback creates user and redirects to plan selection', function () {
    Socialite::fake('google', (new SocialiteUser)->map([
        'id' => 'google-123',
        'name' => 'Usuario Google',
        'email' => 'google.user@gmail.com',
        'avatar' => 'https://example.com/avatar.jpg',
    ]));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('register.plan'));

    $user = User::query()->where('email', 'google.user@gmail.com')->first();

    expect($user)->not->toBeNull();
    expect($user->google_id)->toBe('google-123');
    expect($user->accountType())->toBe('google');
    expect($user->accountTypeLabel())->toBe('Google');
    expect($user->email_verified_at)->not->toBeNull();
    expect($user->verify_account)->toBeFalse();
    expect($user->phone)->toBeNull();
    $this->assertAuthenticatedAs($user);
});

test('google callback links existing user by email', function () {
    $existing = User::factory()->registrationIncomplete()->create([
        'email' => 'existing@gmail.com',
        'phone' => null,
        'cpf' => null,
        'google_id' => null,
    ]);

    Socialite::fake('google', (new SocialiteUser)->map([
        'id' => 'google-456',
        'name' => 'Usuario Google',
        'email' => 'existing@gmail.com',
        'avatar' => null,
    ]));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('register.plan'));

    $existing->refresh();

    expect($existing->google_id)->toBe('google-456');
    expect($existing->accountType())->toBe($existing->hasOrinCredentials() ? 'linked' : 'google');
});

test('google registration follows plan profile verification and payment', function () {
    config(['registration.allow_payment_skip' => true]);

    Socialite::fake('google', (new SocialiteUser)->map([
        'id' => 'google-flow',
        'name' => 'Usuario Google',
        'email' => 'google.flow@gmail.com',
    ]));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('register.plan'));

    $user = User::query()->where('email', 'google.flow@gmail.com')->firstOrFail();

    $this->actingAs($user)
        ->post(route('register.plan.store'), [
            'plan_key' => 'starter',
            'plan_billing' => 'monthly',
        ])
        ->assertRedirect(route('register.complete-profile'));

    $this->actingAs($user)
        ->post(route('register.complete-profile.store'), [
            'phone' => '11987654321',
            'cpf' => '52998224725',
        ])
        ->assertRedirect(route('register.verify'));

    $this->actingAs($user->fresh())
        ->post(route('register.verify.phone'), ['code' => '123456'])
        ->assertRedirect(route('register.payment'));

    $this->actingAs($user->fresh())
        ->post(route('register.payment.skip'))
        ->assertRedirect(route('dashboard'));

    $user->refresh();

    expect($user->accountType())->toBe('google');
    expect($user->verify_account)->toBeTrue();
    expect($user->hasCompletedPayment())->toBeTrue();
});
