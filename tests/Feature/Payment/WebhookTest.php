<?php

use App\Http\Controllers\MercadoPagoWebhookController;
use App\Models\Subscription;
use App\Services\Payment\MercadoPagoService;
use Illuminate\Support\Facades\Log;

beforeEach(function () {
    Log::spy();
});

function makeMpService(bool $signatureValid = true): MercadoPagoService
{
    $mock = Mockery::mock(MercadoPagoService::class);
    $mock->allows('verifyWebhookSignature')->andReturn($signatureValid);
    $mock->allows('cancelPreApproval')->andReturnNull();

    return $mock;
}

test('webhook returns 401 when signature is invalid', function () {
    $this->app->instance(MercadoPagoService::class, makeMpService(false));

    $this->postJson('/webhooks/mercadopago', ['type' => 'payment'])
        ->assertStatus(401);
});

test('webhook returns 200 for unknown event type without side effects', function () {
    $this->app->instance(MercadoPagoService::class, makeMpService(true));

    $this->postJson('/webhooks/mercadopago', ['type' => 'unknown_event'])
        ->assertOk()
        ->assertJson(['ok' => true]);
});

test('payment webhook authorizes subscription and marks payment completed', function () {
    $user = createUser([
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
        'payment_completed' => false,
        'email_verified_at' => now(),
        'phone_verified_at' => now(),
    ]);

    $subscription = Subscription::factory()->create([
        'user_id' => $user->id,
        'plan_key' => 'starter',
        'billing' => 'monthly',
        'status' => 'pending',
        'amount_due' => 29.99,
    ]);

    $this->app->instance(MercadoPagoService::class, makeMpService(true));

    $this->postJson('/webhooks/mercadopago', [
        'type' => 'payment',
        'data' => [
            'external_reference' => (string) $subscription->id,
        ],
    ])->assertOk()->assertJson(['ok' => true]);

    $subscription->refresh();
    expect($subscription->status)->toBe(Subscription::STATUS_AUTHORIZED);

    $user->refresh();
    expect($user->payment_completed)->toBeTrue();
});

test('preapproval webhook updates subscription status to cancelled', function () {
    $user = createUser([
        'plan_key' => 'starter',
        'plan_billing' => 'monthly',
    ]);

    $subscription = Subscription::factory()->create([
        'user_id' => $user->id,
        'mp_preapproval_id' => 'preapproval_abc123',
        'plan_key' => 'starter',
        'billing' => 'monthly',
        'status' => 'authorized',
        'amount_due' => 29.99,
    ]);

    $this->app->instance(MercadoPagoService::class, makeMpService(true));

    $this->postJson('/webhooks/mercadopago', [
        'type' => 'preapproval',
        'data' => [
            'id' => 'preapproval_abc123',
            'status' => 'cancelled',
        ],
    ])->assertOk();

    $subscription->refresh();
    expect($subscription->status)->toBe(Subscription::STATUS_CANCELLED);
});

test('payment webhook for unknown external_reference returns 200 without error', function () {
    $this->app->instance(MercadoPagoService::class, makeMpService(true));

    $this->postJson('/webhooks/mercadopago', [
        'type' => 'payment',
        'data' => ['external_reference' => '999999'],
    ])->assertOk()->assertJson(['ok' => true]);
});
