<?php

use App\Models\User;

test('incomplete registration cannot access dashboard without verification', function () {
    $user = User::factory()->registrationIncomplete()->create([
        'email' => 'pending@gmail.com',
        'phone' => '+5511987654321',
        'cpf' => '52998224725',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('register.verify', absolute: false));
});

test('verified user without plan cannot access dashboard', function () {
    $user = User::factory()->verifiedAwaitingPlan()->create([
        'email' => 'pending@gmail.com',
        'phone' => '+5511987654321',
        'cpf' => '52998224725',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('register.plan', absolute: false));
});

test('incomplete registration cannot access chat without verification', function () {
    $user = User::factory()->awaitingVerification()->create([
        'email' => 'pending@gmail.com',
        'phone' => '+5511987654321',
        'cpf' => '52998224725',
    ]);

    $this->actingAs($user)
        ->get(route('chat'))
        ->assertRedirect(route('register.verify', absolute: false));
});

test('paid plan user cannot access dashboard until payment', function () {
    $user = User::factory()->awaitingPayment()->create([
        'email' => 'pending@gmail.com',
        'phone' => '+5511987654321',
        'cpf' => '52998224725',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('register.payment', absolute: false));
});

test('fully verified user with trial plan can access dashboard', function () {
    $user = User::factory()->create([
        'plan_key' => 'trial',
        'plan_billing' => 'monthly',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk();
});

test('fully verified user with paid plan and no payment is redirected to payment', function () {
    $user = User::factory()->awaitingPayment()->create([
        'email' => 'pending@gmail.com',
        'phone' => '+5511987654321',
        'cpf' => '52998224725',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('register.payment', absolute: false));
});
