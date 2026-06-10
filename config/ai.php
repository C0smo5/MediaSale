<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AI Engine Driver
    |--------------------------------------------------------------------------
    |
    | Supported: "log", "http"
    |
    | "log"  — returns a local stub and logs the call (no network, safe for CI).
    | "http" — forwards to the FastAPI microservice defined in AI_ENGINE_URL.
    |
    */

    'driver' => env('AI_ENGINE_DRIVER', 'log'),

    'http' => [
        'base_url' => env('AI_ENGINE_URL', 'http://ai-engine:8000'),
        'timeout'  => (int) env('AI_ENGINE_TIMEOUT', 30),
        'token'    => env('AI_ENGINE_TOKEN'),
    ],

];
