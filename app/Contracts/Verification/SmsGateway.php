<?php

namespace App\Contracts\Verification;

interface SmsGateway
{
    public function send(string $phone, string $message): void;
}
