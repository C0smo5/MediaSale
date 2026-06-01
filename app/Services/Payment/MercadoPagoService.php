<?php

namespace App\Services\Payment;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use MercadoPago\Client\PreApproval\PreApprovalClient;
use MercadoPago\Exceptions\InvalidWebhookSignatureException;
use MercadoPago\Webhook\WebhookSignatureValidator;

class MercadoPagoService
{
    public function __construct(
        private readonly PreApprovalClient $preApprovalClient,
    ) {}

    /**
     * Create a Mercado Pago pre-approval (subscription) for the user.
     *
     * @param  array{
     *     token: string,
     *     issuer_id: string,
     *     payment_method_id: string,
     *     installments: int,
     *     payer: array{email: string, identification: array{type: string, number: string}}
     * }  $cardData  Tokenized card data from Checkout Bricks.
     * @return array{id: string, status: string, init_point: string|null}
     */
    public function createPreApproval(User $user, array $cardData, Subscription $subscription): array
    {
        $billingCycleType = $subscription->billing === 'annual' ? 'years' : 'months';
        $billingCycleFrequency = 1;
        $appUrl = rtrim((string) config('app.url'), '/');

        $preApproval = $this->preApprovalClient->create([
            'reason' => 'Orin — '.ucfirst($subscription->plan_key).' '.ucfirst($subscription->billing),
            'auto_recurring' => [
                'frequency' => $billingCycleFrequency,
                'frequency_type' => $billingCycleType,
                'transaction_amount' => $subscription->amount_due,
                'currency_id' => 'BRL',
            ],
            'payer_email' => $cardData['payer']['email'],
            'card_token_id' => $cardData['token'],
            'external_reference' => (string) $subscription->id,
            'back_url' => $appUrl.'/dashboard',
            'status' => 'authorized',
        ]);

        return [
            'id' => (string) $preApproval->id,
            'status' => (string) ($preApproval->status ?? 'pending'),
            'init_point' => $preApproval->init_point ?? null,
        ];
    }

    /**
     * Cancel (pause) a Mercado Pago subscription so no further charges occur.
     */
    public function cancelPreApproval(string $preApprovalId): void
    {
        $this->preApprovalClient->update($preApprovalId, ['status' => 'cancelled']);
    }

    /**
     * Verify the HMAC-SHA256 signature on an incoming webhook request.
     * Returns false if the signature is missing, invalid, or the secret is not configured.
     */
    public function verifyWebhookSignature(Request $request): bool
    {
        $secret = config('services.mercadopago.webhook_secret');

        if (empty($secret)) {
            return false;
        }

        try {
            WebhookSignatureValidator::validate(
                xSignature: $request->header('x-signature'),
                xRequestId: $request->header('x-request-id'),
                dataId: $request->query('data.id') ?? $request->input('data.id'),
                secret: $secret,
            );

            return true;
        } catch (InvalidWebhookSignatureException) {
            return false;
        }
    }
}
