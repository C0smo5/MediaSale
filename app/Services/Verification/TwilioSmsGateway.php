<?php

namespace App\Services\Verification;

use App\Contracts\Verification\SmsGateway;
use Illuminate\Validation\ValidationException;
use Twilio\Rest\Client;

class TwilioSmsGateway implements SmsGateway
{
    public function __construct(
        private readonly Client $client,
        private readonly string $from,
    ) {}

    public function send(string $phone, string $message): void
    {
        $normalizedTo = $this->normalizeE164($phone);
        $normalizedFrom = $this->normalizeE164($this->from);
        $sameNumber = $normalizedFrom === $normalizedTo;

        // #region agent log
        error_log('[debug-acf904] TwilioGateway::send from=*'.substr($normalizedFrom, -4).' to=*'.substr($normalizedTo, -4).' sameNumber='.($sameNumber ? 'true' : 'false'));
        // #endregion

        if ($sameNumber) {
            throw ValidationException::withMessages([
                'phone' => 'TWILIO_FROM no .env nao pode ser o mesmo celular do cadastro. Use o numero comprado no Twilio Console (Phone Numbers), nao o numero verificado.',
            ]);
        }

        try {
            $this->client->messages->create($normalizedTo, [
                'from' => $normalizedFrom,
                'body' => $message,
            ]);
        } catch (\Throwable $exception) {
            // #region agent log
            error_log('[debug-acf904] TwilioGateway::send ERROR '.get_class($exception).' code='.$exception->getCode().' msg='.substr($exception->getMessage(), 0, 150));
            // #endregion

            throw $exception;
        }
    }

    private function normalizeE164(string $number): string
    {
        $digits = preg_replace('/\D/', '', $number) ?? '';

        return '+'.$digits;
    }
}
