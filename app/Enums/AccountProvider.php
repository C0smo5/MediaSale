<?php

namespace App\Enums;

enum AccountProvider: string
{
    case Orin = 'orin';
    case Google = 'google';
    case Linked = 'linked';

    public function label(): string
    {
        return match ($this) {
            self::Orin => (string) config('accounts.providers.orin.label'),
            self::Google => (string) config('accounts.providers.google.label'),
            self::Linked => (string) config('accounts.providers.linked.label'),
        };
    }

    public static function fromConfig(string $key): self
    {
        $value = config("accounts.providers.{$key}.value");

        return self::from(is_string($value) ? $value : $key);
    }
}
