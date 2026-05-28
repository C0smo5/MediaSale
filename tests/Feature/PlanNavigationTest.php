<?php

use App\Models\User;

test('guest can access public plans page', function () {
    $this->get(route('plans'))
        ->assertOk();
});

test('authenticated user visiting plans is redirected to profile plans section', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('plans'))
        ->assertRedirect(route('profile.edit', ['section' => 'plans']));
});

test('authenticated user upgrade is sent to subscription payment', function () {
    $user = User::factory()->create([
        'plan_key' => 'pro',
        'plan_billing' => 'monthly',
        'payment_completed' => true,
    ]);

    $this->actingAs($user)
        ->from(route('profile.edit', ['section' => 'plans']))
        ->post(route('plans.update'), [
            'plan_key' => 'business',
            'plan_billing' => 'annual',
        ])
        ->assertRedirect(route('subscription.payment'));

    $user->refresh();

    expect($user->plan_key)->toBe('pro');
});

test('login redirects to plans when redirect param is provided', function () {
    User::factory()->create([
        'email' => 'plansuser@gmail.com',
        'password' => bcrypt('password'),
    ]);

    $redirect = route('plans', ['plan' => 'starter', 'billing' => 'monthly'], false);

    $this->post(route('login'), [
        'email' => 'plansuser@gmail.com',
        'password' => 'password',
        'redirect' => $redirect,
    ])->assertRedirect(route('profile.edit', ['section' => 'plans']));
});

test('login rejects external redirect urls', function () {
    User::factory()->create([
        'email' => 'safeuser@gmail.com',
        'password' => bcrypt('password'),
    ]);

    $this->post(route('login'), [
        'email' => 'safeuser@gmail.com',
        'password' => 'password',
        'redirect' => 'https://evil.example/phish',
    ])->assertRedirect(route('dashboard', absolute: false));
});
