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
        'twilio' => [
            'account_sid' => env('TWILIO_ACCOUNT_SID'),
            'auth_token' => env('TWILIO_AUTH_TOKEN'),
            'from' => env('TWILIO_FROM'),
        ],
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
    | Opcao 3 — Exclusao por inatividade (cadastro abandonado)
    |--------------------------------------------------------------------------
    |
    | Ordem de exclusao de contas incompletas (verify_account = false):
    | 1. Cancelar cadastro → imediato
    | 2. Logout / sair → imediato
    | 3. Sem atividade por este tempo → purge automatico (scheduler + web)
    |
    */
    'inactivity_minutes' => (int) env('REGISTRATION_INACTIVITY_MINUTES', 1),

];
