<?php

namespace App\Rules;

use App\Support\BrazilianIdentifiers;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidCnpj implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! BrazilianIdentifiers::isValidCnpj((string) $value)) {
            $fail('O :attribute informado não é válido.');
        }
    }
}
