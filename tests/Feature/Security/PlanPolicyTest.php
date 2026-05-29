<?php

use App\Models\User;

test('unverified user cannot upgrade plan', function (): void {
    $user = createUser(['verify_account' => false, 'plan_key' => 'trial']);

    $this->actingAs($user)->post('/plans/select', [
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
    ])->assertForbidden();
});

test('verified user can upgrade plan', function (): void {
    $user = createUser(['verify_account' => true, 'plan_key' => 'trial', 'plan_billing' => 'monthly']);

    $this->actingAs($user)->post('/plans/select', [
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
    ])->assertRedirect();
});

test('user cannot cancel trial subscription', function (): void {
    $user = createUser(['verify_account' => true, 'plan_key' => 'trial', 'payment_completed' => false]);

    $this->actingAs($user)->post('/subscription/cancel')
        ->assertForbidden();
});

test('user can cancel paid subscription', function (): void {
    $user = createUser(['verify_account' => true, 'plan_key' => 'pro', 'plan_billing' => 'monthly', 'payment_completed' => true]);

    $this->actingAs($user)->post('/subscription/cancel')
        ->assertRedirect();

    expect($user->fresh()->plan_key)->toBe('trial');
});
