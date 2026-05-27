<?php

namespace App\Rules;

use App\Support\BrazilianIdentifiers;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class BrazilianMobilePhone implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! BrazilianIdentifiers::isValidMobilePhone((string) $value)) {
            $fail('Informe um celular válido com DDD (ex.: 11987654321).');
        }
    }
}
