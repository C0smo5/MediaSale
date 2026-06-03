<?php

namespace Tests\Support;

use PragmaRX\Google2FA\Google2FA;

/**
 * Generates valid TOTP codes for Fortify 2FA tests (Google2FA, not Fortify provider).
 */
final class TotpCodeGenerator
{
    public static function forSecret(string $secret): string
    {
        $google2fa = new Google2FA;

        return str_pad(
            (string) $google2fa->oathTotp($secret, $google2fa->getTimestamp()),
            6,
            '0',
            STR_PAD_LEFT,
        );
    }
}
