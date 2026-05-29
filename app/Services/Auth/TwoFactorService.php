<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Models\VerificationCode;
use App\Services\Verification\VerificationCodeService;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorService
{
    public function __construct(
        private readonly Google2FA $google2fa,
        private readonly VerificationCodeService $verificationCodes,
    ) {}

    /**
     * Generate a new TOTP secret and return QR code SVG + secret.
     *
     * @return array{secret: string, qr_code_svg: string, qr_code_url: string}
     */
    public function generateSetup(User $user): array
    {
        $secret = $this->google2fa->generateSecretKey();
        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            config('app.name', 'Orin'),
            $user->email,
            $secret,
        );

        $qrCodeSvg = $this->generateQrSvg($qrCodeUrl);

        return [
            'secret' => $secret,
            'qr_code_svg' => $qrCodeSvg,
            'qr_code_url' => $qrCodeUrl,
        ];
    }

    /**
     * Confirm 2FA setup: store secret and generate recovery codes.
     */
    public function confirmSetup(User $user, string $secret, string $code): bool
    {
        if (! $this->google2fa->verifyKey($secret, $code)) {
            return false;
        }

        $recoveryCodes = $this->generateRecoveryCodes();

        $user->forceFill([
            'two_factor_secret' => $secret,
            'two_factor_confirmed_at' => now(),
            'two_factor_recovery_codes' => $recoveryCodes,
        ])->save();

        return true;
    }

    public function disable(User $user): void
    {
        $user->forceFill([
            'two_factor_secret' => null,
            'two_factor_confirmed_at' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_sms_fallback' => false,
        ])->save();
    }

    public function isEnabled(User $user): bool
    {
        return $user->two_factor_confirmed_at !== null;
    }

    /**
     * Verify a TOTP code during login challenge.
     */
    public function verifyTotp(User $user, string $code): bool
    {
        if ($user->two_factor_secret === null) {
            return false;
        }

        return (bool) $this->google2fa->verifyKey($user->two_factor_secret, $code);
    }

    /**
     * Consume a recovery code. Returns false if not found or already used.
     */
    public function verifyRecoveryCode(User $user, string $code): bool
    {
        $codes = $user->two_factor_recovery_codes ?? [];
        $normalised = trim($code);
        $index = array_search($normalised, $codes, true);

        if ($index === false) {
            return false;
        }

        // Remove consumed code so it can't be reused.
        array_splice($codes, (int) $index, 1);
        $user->forceFill(['two_factor_recovery_codes' => $codes])->save();

        return true;
    }

    public function sendSmsFallback(User $user): void
    {
        $this->verificationCodes->sendTwoFactorSmsCode($user);
    }

    public function verifySmsFallback(User $user, string $code): bool
    {
        return $this->verificationCodes->verifyTwoFactorSmsCode($user, $code);
    }

    public function enableSmsFallback(User $user): void
    {
        $user->forceFill(['two_factor_sms_fallback' => true])->save();
    }

    public function disableSmsFallback(User $user): void
    {
        $user->forceFill(['two_factor_sms_fallback' => false])->save();
    }

    /** @return list<string> */
    private function generateRecoveryCodes(): array
    {
        return Collection::times(8, fn () => strtoupper(Str::random(10)))->all();
    }

    private function generateQrSvg(string $url): string
    {
        $renderer = new \BaconQrCode\Renderer\ImageRenderer(
            new \BaconQrCode\Renderer\RendererStyle\RendererStyle(200),
            new \BaconQrCode\Renderer\Image\SvgImageBackEnd(),
        );

        return (new \BaconQrCode\Writer($renderer))->writeString($url);
    }
}
