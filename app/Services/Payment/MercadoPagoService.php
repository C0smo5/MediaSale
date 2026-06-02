<?php

namespace App\Services\Payment;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use MercadoPago\Client\Common\RequestOptions;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\Client\PreApproval\PreApprovalClient;
use MercadoPago\Exceptions\InvalidWebhookSignatureException;
use MercadoPago\Webhook\WebhookSignatureValidator;

class MercadoPagoService
{
    public function __construct(
        private readonly PreApprovalClient $preApprovalClient,
        private readonly PaymentClient $paymentClient,
    ) {}

    /**
     * Charge the card token from Checkout Bricks via the Payments API.
     *
     * Card Payment Brick tokens are not accepted by the PreApproval API (sandbox returns
     * "Card token service not found"). Recurring billing can be wired later via preapproval
     * checkout or subscription plans.
     *
     * @param  array{
     *     token: string,
     *     issuer_id: string|null,
     *     payment_method_id: string,
     *     transaction_amount: float|int|string,
     *     installments: int,
     *     payer: array{email: string, identification: array{type: string, number: string}}
     * }  $cardData
     * @return array{id: string, status: 'authorized'|'pending', init_point: null}
     */
    public function createCardPayment(User $user, array $cardData, Subscription $subscription): array
    {
        $identificationNumber = preg_replace(
            '/\D/',
            '',
            (string) $cardData['payer']['identification']['number'],
        ) ?? '';

        $request = [
            'transaction_amount' => round((float) $cardData['transaction_amount'], 2),
            'token' => $cardData['token'],
            'description' => 'Orin — '.ucfirst($subscription->plan_key).' '.ucfirst($subscription->billing),
            'installments' => (int) $cardData['installments'],
            'payment_method_id' => $cardData['payment_method_id'],
            'external_reference' => (string) $subscription->id,
            'payer' => [
                'email' => $cardData['payer']['email'],
                'identification' => [
                    'type' => $cardData['payer']['identification']['type'],
                    'number' => $identificationNumber,
                ],
            ],
        ];

        $notificationUrl = config('services.mercadopago.notification_url');
        $includesNotificationUrl = is_string($notificationUrl)
            && $notificationUrl !== ''
            && $this->isMercadoPagoReachableUrl($notificationUrl);

        if ($includesNotificationUrl) {
            $request['notification_url'] = $notificationUrl;
        }

        $options = new RequestOptions;
        $options->setCustomHeaders([
            'X-Idempotency-Key: orin-sub-'.$subscription->id.'-'.Str::uuid(),
        ]);

        $payment = $this->paymentClient->create($request, $options);

        if (in_array($payment->status, ['rejected', 'cancelled'], true)) {
            throw new \RuntimeException(
                'Pagamento recusado: '.(string) ($payment->status_detail ?? $payment->status),
            );
        }

        $mappedStatus = match ($payment->status) {
            'approved' => 'authorized',
            'pending', 'in_process' => 'pending',
            default => 'pending',
        };

        return [
            'id' => (string) $payment->id,
            'status' => $mappedStatus,
            'init_point' => null,
        ];
    }

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
        // Payment IDs (Checkout Bricks one-time charge) have no preapproval to cancel.
        if (ctype_digit($preApprovalId)) {
            return;
        }

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

    /**
     * Mercado Pago rejects localhost/private hosts for notification_url.
     */
    private function isMercadoPagoReachableUrl(string $url): bool
    {
        $host = parse_url($url, PHP_URL_HOST);

        if (! is_string($host) || $host === '') {
            return false;
        }

        $host = strtolower($host);

        if (in_array($host, ['localhost', '127.0.0.1', '::1'], true)) {
            return false;
        }

        if (str_ends_with($host, '.local') || str_ends_with($host, '.test')) {
            return false;
        }

        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }
}
