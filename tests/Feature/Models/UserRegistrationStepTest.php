<?php

use App\Enums\AccountProvider;
use App\Models\User;

test('orin account type is orin', function () {
    $user = User::factory()->make(['google_id' => null]);

    expect($user->accountType())->toBe('orin')
        ->and($user->accountTypeLabel())->toBe('Orin')
        ->and($user->accountProvider())->toBe(AccountProvider::Orin);
});

test('google account type is google', function () {
    $user = User::factory()->make([
        'google_id' => 'google-abc',
        'password' => null,
    ]);

    expect($user->accountType())->toBe('google')
        ->and($user->accountTypeLabel())->toBe('Google')
        ->and($user->accountProvider())->toBe(AccountProvider::Google);
});

test('linked account type when google and orin password exist', function () {
    $user = User::factory()->create([
        'google_id' => 'google-abc',
    ]);

    expect($user->accountType())->toBe('linked')
        ->and($user->accountTypeLabel())->toBe('Orin + Google')
        ->and($user->accountProvider())->toBe(AccountProvider::Linked);
});

test('google registration starts at plan selection', function () {
    $user = User::factory()->make([
        'google_id' => 'google-abc',
        'email_verified_at' => now(),
        'phone' => null,
        'cpf' => null,
        'plan_key' => null,
        'verify_account' => false,
    ]);

    expect($user->nextRegistrationStep())->toBe('register.plan');
});

test('orin registration starts at verification when profile is complete', function () {
    $user = User::factory()->make([
        'google_id' => null,
        'phone' => '11987654321',
        'cpf' => '52998224725',
        'email_verified_at' => null,
        'phone_verified_at' => null,
        'plan_key' => null,
        'verify_account' => false,
    ]);

    expect($user->nextRegistrationStep())->toBe('register.verify');
});

test('google registration after plan requires profile then verification', function () {
    $user = User::factory()->make([
        'google_id' => 'google-abc',
        'email_verified_at' => now(),
        'phone' => null,
        'cpf' => null,
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
        'phone_verified_at' => null,
        'verify_account' => false,
    ]);

    expect($user->nextRegistrationStep())->toBe('register.complete-profile');
});

test('google registration after profile requires phone verification', function () {
    $user = User::factory()->make([
        'google_id' => 'google-abc',
        'email_verified_at' => now(),
        'phone' => '11987654321',
        'cpf' => '52998224725',
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
        'phone_verified_at' => null,
        'verify_account' => false,
    ]);

    expect($user->nextRegistrationStep())->toBe('register.verify');
});
