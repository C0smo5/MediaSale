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
        file_put_contents(
            base_path('.cursor/debug-2f7f46.log'),
            json_encode([
                'sessionId' => '2f7f46',
                'hypothesisId' => 'A',
                'location' => 'TwilioSmsGateway.php:send',
                'message' => 'twilio send preflight',
                'data' => [
                    'fromSuffix' => substr($normalizedFrom, -4),
                    'toSuffix' => substr($normalizedTo, -4),
                    'sameNumber' => $sameNumber,
                ],
                'timestamp' => (int) (microtime(true) * 1000),
            ])."\n",
            FILE_APPEND
        );
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
            file_put_contents(
                base_path('.cursor/debug-2f7f46.log'),
                json_encode([
                    'sessionId' => '2f7f46',
                    'hypothesisId' => 'B,D',
                    'location' => 'TwilioSmsGateway.php:send:catch',
                    'message' => 'twilio api error',
                    'data' => [
                        'exceptionClass' => $exception::class,
                        'code' => $exception->getCode(),
                        'errorSnippet' => substr($exception->getMessage(), 0, 120),
                    ],
                    'timestamp' => (int) (microtime(true) * 1000),
                ])."\n",
                FILE_APPEND
            );
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
