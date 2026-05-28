<?php

use App\Models\User;
use App\Services\Plan\PlanPricingService;

test('paid plan upgrade uses complement plus interest on complement', function () {
    $pricing = new PlanPricingService;

    $charge = $pricing->calculateUpgradeCharge('starter', 'monthly', 'pro', 'monthly');

    expect($charge['uses_complement'])->toBeTrue();
    expect($charge['from_is_trial'])->toBeFalse();
    expect($charge['complement'])->toBe(30.0);
    expect($charge['interest_rate'])->toBe(0.0638);
    expect($charge['interest_amount'])->toBe(1.91);
    expect($charge['amount_due'])->toBe(31.91);
});

test('upgrade from trial charges full fixed plan price without interest or complement label', function () {
    $pricing = new PlanPricingService;

    $charge = $pricing->calculateUpgradeCharge('trial', 'monthly', 'starter', 'monthly');

    expect($charge['uses_complement'])->toBeFalse();
    expect($charge['from_is_trial'])->toBeTrue();
    expect($charge['complement'])->toBe(29.99);
    expect($charge['interest_amount'])->toBe(0.0);
    expect($charge['amount_due'])->toBe(29.99);
});

test('upgrade to trial is not allowed', function () {
    $pricing = new PlanPricingService;

    $pricing->calculateUpgradeCharge('starter', 'monthly', 'trial', 'monthly');
})->throws(InvalidArgumentException::class);

test('plan upgrade redirects to subscription payment without applying plan', function () {
    $user = createUser([
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
        'payment_completed' => true,
    ]);

    $this->actingAs($user)
        ->from(route('profile.edit', ['section' => 'plans']))
        ->post(route('plans.update'), [
            'plan_key' => 'pro',
            'plan_billing' => 'monthly',
        ])
        ->assertRedirect(route('subscription.payment'));

    $user->refresh();

    expect($user->plan_key)->toBe('starter');

    $pending = session('pending_plan_change');
    expect($pending)->not->toBeNull();
    expect($pending['plan_key'])->toBe('pro');
    expect($pending['amount_due'])->toBe(31.91);
    expect($pending['interest_amount'])->toBe(1.91);
});

test('completing subscription payment applies pending upgrade', function () {
    config(['registration.allow_payment_skip' => true]);

    $user = createUser([
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
        'payment_completed' => true,
    ]);

    $this->actingAs($user)
        ->post(route('plans.update'), [
            'plan_key' => 'pro',
            'plan_billing' => 'monthly',
        ]);

    $this->actingAs($user)
        ->post(route('subscription.payment.complete'))
        ->assertRedirect(route('profile.edit', ['section' => 'plans']))
        ->assertSessionHas('status', 'plan-updated');

    $user->refresh();

    expect($user->plan_key)->toBe('pro');
    expect($user->payment_completed)->toBeTrue();
});

test('downgrade attempt is rejected', function () {
    $user = createUser([
        'plan_key' => 'pro',
        'plan_billing' => 'monthly',
        'payment_completed' => true,
    ]);

    $this->actingAs($user)
        ->from(route('profile.edit', ['section' => 'plans']))
        ->post(route('plans.update'), [
            'plan_key' => 'starter',
            'plan_billing' => 'monthly',
        ])
        ->assertSessionHasErrors('plan_key');

    $user->refresh();

    expect($user->plan_key)->toBe('pro');
});

test('cancel subscription returns user to trial without upgrade charges', function () {
    $user = createUser([
        'plan_key' => 'pro',
        'plan_billing' => 'monthly',
        'payment_completed' => true,
    ]);

    $this->actingAs($user)
        ->post(route('plans.update'), [
            'plan_key' => 'business',
            'plan_billing' => 'monthly',
        ]);

    expect(session('pending_plan_change'))->not->toBeNull();

    $this->actingAs($user)
        ->post(route('subscription.cancel'))
        ->assertRedirect(route('profile.edit', ['section' => 'plans']))
        ->assertSessionHas('status', 'subscription-cancelled');

    $user->refresh();

    expect($user->plan_key)->toBe('trial');
    expect($user->plan_billing)->toBe('monthly');
    expect($user->payment_completed)->toBeFalse();
    expect(session('pending_plan_change'))->toBeNull();
});
