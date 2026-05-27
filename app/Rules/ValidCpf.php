<?php

namespace App\Rules;

use App\Support\BrazilianIdentifiers;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidCpf implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! BrazilianIdentifiers::isValidCpf((string) $value)) {
            $fail('O :attribute informado não é válido.');
        }
    }
}
