<?php

return [

    'allowed_email_domains' => [
        'gmail.com',
        'googlemail.com',
        'outlook.com',
        'hotmail.com',
        'live.com',
        'yahoo.com',
        'yahoo.com.br',
        'icloud.com',
        'me.com',
        'proton.me',
        'protonmail.com',
    ],

    'otp' => [
        'length' => 6,
        'expires_minutes' => (int) env('REGISTRATION_OTP_EXPIRES_MINUTES', 10),
        'max_attempts' => 5,
        'resend_cooldown_seconds' => 60,
    ],

    'sms' => [
        'driver' => env('SMS_DRIVER', 'log'),
        'mock_code' => env('SMS_MOCK_CODE'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Pular pagamento no cadastro (somente testes / desenvolvimento)
    |--------------------------------------------------------------------------
    */
    'allow_payment_skip' => (bool) env(
        'REGISTRATION_ALLOW_PAYMENT_SKIP',
        env('APP_DEBUG', false)
    ),

    /*
    |--------------------------------------------------------------------------
    | Exclusao automatica de cadastros incompletos
    |--------------------------------------------------------------------------
    |
    | Contas com verify_account = false sao removidas apos este tempo sem
    | atividade nas etapas de cadastro (verificacao, plano, pagamento).
    |
    */
    'inactivity_minutes' => (int) env('REGISTRATION_INACTIVITY_MINUTES', 1),

];
