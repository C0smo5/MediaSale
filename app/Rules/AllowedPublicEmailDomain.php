<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AllowedPublicEmailDomain implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $email = strtolower(trim((string) $value));
        $domain = substr(strrchr($email, '@') ?: '', 1);

        if ($domain === '') {
            $fail('Informe um e-mail válido.');

            return;
        }

        $allowedDomains = array_map(
            strtolower(...),
            config('registration.allowed_email_domains', [])
        );

        if (! in_array($domain, $allowedDomains, true)) {
            $fail('Use um e-mail de provedor conhecido (Gmail, Outlook, Yahoo, iCloud, etc.).');
        }
    }
}
