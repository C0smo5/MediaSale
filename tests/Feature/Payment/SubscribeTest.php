<?php

use App\Models\Subscription;
use App\Services\Payment\MercadoPagoService;

$validCardPayload = [
    'token' => 'card_token_test',
    'issuer_id' => '24',
    'payment_method_id' => 'visa',
    'transaction_amount' => 29.99,
    'installments' => 1,
    'payer' => [
        'email' => 'payer@example.com',
        'identification' => ['type' => 'CPF', 'number' => '12345678900'],
    ],
];

function makeMpServiceWithStatus(string $status): MercadoPagoService
{
    $mock = Mockery::mock(MercadoPagoService::class);
    $mock->allows('createCardPayment')->andReturn([
        'id' => 'payment_test_' . $status,
        'status' => $status,
        'init_point' => null,
    ]);
    $mock->allows('cancelPreApproval')->andReturnNull();

    return $mock;
}

function makePaymentReadyUser(): \App\Models\User
{
    return createUser([
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
        'payment_completed' => false,
        'email_verified_at' => now(),
        'phone_verified_at' => now(),
    ]);
}

// ─── Registration subscribe flow ────────────────────────────────────────────

test('register subscribe with MP authorized response completes payment and redirects to dashboard', function () use ($validCardPayload) {
    $user = makePaymentReadyUser();

    $this->app->instance(MercadoPagoService::class, makeMpServiceWithStatus('authorized'));

    $this->actingAs($user)
        ->post(route('register.payment.subscribe'), $validCardPayload)
        ->assertRedirect(route('dashboard'));

    $user->refresh();
    expect($user->payment_completed)->toBeTrue();

    expect(Subscription::query()->where('user_id', $user->id)->count('*'))->toBe(1);
    $sub = Subscription::query()->where('user_id', $user->id)->first();
    expect($sub->status)->toBe(Subscription::STATUS_AUTHORIZED);
    expect($sub->mp_preapproval_id)->toBe('payment_test_authorized');
});

test('register subscribe with MP pending response creates pending subscription and redirects to pending page', function () use ($validCardPayload) {
    $user = makePaymentReadyUser();

    $this->app->instance(MercadoPagoService::class, makeMpServiceWithStatus('pending'));

    $this->actingAs($user)
        ->post(route('register.payment.subscribe'), $validCardPayload)
        ->assertRedirect(route('register.payment.pending'));

    $user->refresh();
    expect($user->payment_completed)->toBeFalse();

    $sub = Subscription::query()->where('user_id', $user->id)->first();
    expect($sub)->not->toBeNull();
    expect($sub->status)->toBe(Subscription::STATUS_PENDING);
});

test('register subscribe validates required card fields', function () {
    $user = makePaymentReadyUser();

    $this->app->instance(MercadoPagoService::class, makeMpServiceWithStatus('authorized'));

    $this->actingAs($user)
        ->post(route('register.payment.subscribe'), [])
        ->assertSessionHasErrors(['token', 'payment_method_id', 'transaction_amount', 'installments']);
});

test('register subscribe is blocked for user who already completed payment', function () use ($validCardPayload) {
    $user = createUser([
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
        'payment_completed' => true,
        'email_verified_at' => now(),
        'phone_verified_at' => now(),
    ]);

    $this->app->instance(MercadoPagoService::class, makeMpServiceWithStatus('authorized'));

    $this->actingAs($user)
        ->post(route('register.payment.subscribe'), $validCardPayload)
        ->assertRedirect(route('dashboard'));

    // No subscription should have been created
    expect(Subscription::query()->where('user_id', $user->id)->count('*'))->toBe(0);
});

// ─── Subscription upgrade flow ───────────────────────────────────────────────

test('subscription subscribe with MP authorized response applies plan change', function () use ($validCardPayload) {
    $user = createUser([
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
        'payment_completed' => true,
        'email_verified_at' => now(),
        'phone_verified_at' => now(),
    ]);

    $this->app->instance(MercadoPagoService::class, makeMpServiceWithStatus('authorized'));

    // Set pending plan change in session
    $this->actingAs($user)
        ->withSession(['pending_plan_change' => [
            'plan_key' => 'pro',
            'plan_billing' => 'monthly',
            'from_plan_key' => 'starter',
            'from_plan_billing' => 'monthly',
            'amount_due' => 31.91,
            'complement' => 30.0,
            'interest_rate' => 0.0638,
            'interest_amount' => 1.91,
            'uses_complement' => true,
            'from_is_trial' => false,
        ]])
        ->post(route('subscription.payment.subscribe'), $validCardPayload)
        ->assertRedirect(route('profile.edit', ['section' => 'plans']));

    $user->refresh();
    expect($user->plan_key)->toBe('pro');

    $sub = Subscription::query()->where('user_id', $user->id)->first();
    expect($sub)->not->toBeNull();
    expect($sub->status)->toBe(Subscription::STATUS_AUTHORIZED);
    expect($sub->plan_key)->toBe('pro');
});

test('subscription subscribe cancels existing active MP subscription before creating new one', function () use ($validCardPayload) {
    $user = createUser([
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
        'payment_completed' => true,
        'email_verified_at' => now(),
        'phone_verified_at' => now(),
    ]);

    $existingSub = Subscription::factory()->create([
        'user_id' => $user->id,
        'mp_preapproval_id' => 'old_preapproval_id',
        'plan_key' => 'starter',
        'billing' => 'monthly',
        'status' => 'authorized',
        'amount_due' => 29.99,
    ]);

    $mpMock = Mockery::mock(MercadoPagoService::class);
    $mpMock->expects('cancelPreApproval')->with('old_preapproval_id')->once();
    $mpMock->allows('createCardPayment')->andReturn([
        'id' => 'new_payment_id',
        'status' => 'authorized',
        'init_point' => null,
    ]);

    $this->app->instance(MercadoPagoService::class, $mpMock);

    $this->actingAs($user)
        ->withSession(['pending_plan_change' => [
            'plan_key' => 'pro',
            'plan_billing' => 'monthly',
            'from_plan_key' => 'starter',
            'from_plan_billing' => 'monthly',
            'amount_due' => 31.91,
            'complement' => 30.0,
            'interest_rate' => 0.0638,
            'interest_amount' => 1.91,
            'uses_complement' => true,
            'from_is_trial' => false,
        ]])
        ->post(route('subscription.payment.subscribe'), $validCardPayload)
        ->assertRedirect(route('profile.edit', ['section' => 'plans']));

    $existingSub->refresh();
    expect($existingSub->status)->toBe(Subscription::STATUS_CANCELLED);
});
