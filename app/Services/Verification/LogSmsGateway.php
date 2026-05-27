<?php

namespace App\Services\Verification;

use App\Contracts\Verification\SmsGateway;
use Illuminate\Support\Facades\Log;

class LogSmsGateway implements SmsGateway
{
    public function send(string $phone, string $message): void
    {
        Log::info('SMS verification message sent.', [
            'phone' => $phone,
            'message' => $message,
        ]);
    }
}
