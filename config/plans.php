<?php

return [

    'free_plan_keys' => [
        'trial',
    ],

    /*
    |--------------------------------------------------------------------------
    | Preços mensais base (BRL) — manter alinhado com resources/js/data/plans.ts
    |--------------------------------------------------------------------------
    */
    'monthly_prices' => [
        'trial' => 0,
        'starter' => 29.99,
        'pro' => 59.99,
        'business' => 149.99,
        'elite' => 299.99,
    ],

    'annual_discount_percent' => [
        'trial' => 0,
        'starter' => 15,
        'pro' => 15,
        'business' => 15,
        'elite' => 15,
    ],

    /** Juros sobre o valor do plano escolhido no upgrade */
    'upgrade_interest_rate' => 0.0638,

    'session_pending_change_key' => 'pending_plan_change',

];
