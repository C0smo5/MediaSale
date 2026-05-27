<?php

namespace App\Support;

class BrazilianIdentifiers
{
    public static function digitsOnly(?string $value): string
    {
        return preg_replace('/\D/', '', $value ?? '') ?? '';
    }

    public static function normalizeCpf(?string $value): string
    {
        return self::digitsOnly($value);
    }

    public static function normalizePhone(?string $value): string
    {
        $digits = self::digitsOnly($value);

        if (str_starts_with($digits, '55') && strlen($digits) >= 12) {
            $digits = substr($digits, 2);
        }

        return $digits;
    }

    public static function formatPhoneForStorage(?string $value): string
    {
        $digits = self::normalizePhone($value);

        return '+55'.$digits;
    }

    public static function isValidCpf(string $cpf): bool
    {
        $cpf = self::normalizeCpf($cpf);

        if (strlen($cpf) !== 11) {
            return false;
        }

        if (preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        for ($t = 9; $t < 11; $t++) {
            $sum = 0;

            for ($i = 0; $i < $t; $i++) {
                $sum += (int) $cpf[$i] * (($t + 1) - $i);
            }

            $digit = ((10 * $sum) % 11) % 10;

            if ((int) $cpf[$t] !== $digit) {
                return false;
            }
        }

        return true;
    }

    public static function isValidCnpj(string $cnpj): bool
    {
        $cnpj = self::digitsOnly($cnpj);

        if (strlen($cnpj) !== 14) {
            return false;
        }

        if (preg_match('/^(\d)\1{13}$/', $cnpj)) {
            return false;
        }

        $weightsFirst = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        $weightsSecond = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        for ($t = 12; $t < 14; $t++) {
            $weights = $t === 12 ? $weightsFirst : $weightsSecond;
            $sum = 0;

            for ($i = 0; $i < $t; $i++) {
                $sum += (int) $cnpj[$i] * $weights[$i];
            }

            $digit = $sum % 11;
            $digit = $digit < 2 ? 0 : 11 - $digit;

            if ((int) $cnpj[$t] !== $digit) {
                return false;
            }
        }

        return true;
    }

    public static function isValidMobilePhone(string $phone): bool
    {
        $digits = self::normalizePhone($phone);

        if (strlen($digits) !== 11) {
            return false;
        }

        $ddd = (int) substr($digits, 0, 2);

        if ($ddd < 11 || $ddd > 99) {
            return false;
        }

        return $digits[2] === '9';
    }
}
