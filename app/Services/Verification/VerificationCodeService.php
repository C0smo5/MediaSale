<?php

namespace App\Services\Verification;

use App\Contracts\Verification\SmsGateway;
use App\Models\User;
use App\Models\VerificationCode;
use App\Notifications\RegistrationOtpNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class VerificationCodeService
{
    public function __construct(
        private readonly SmsGateway $smsGateway,
    ) {}

    public function sendEmailCode(User $user): string
    {
        $code = $this->createCode($user, VerificationCode::CHANNEL_EMAIL);

        $user->notify(new RegistrationOtpNotification($code));

        return $code;
    }

    public function sendPhoneCode(User $user): string
    {
        $code = $this->createCode($user, VerificationCode::CHANNEL_PHONE);

        $this->smsGateway->send(
            $user->phone,
            'Seu codigo Orin: '.$code
        );

        return $code;
    }

    public function sendAll(User $user): void
    {
        $this->sendEmailCode($user);
        $this->sendPhoneCode($user);
    }

    public function sendTwoFactorSmsCode(User $user): string
    {
        $code = $this->createCode($user, VerificationCode::CHANNEL_TWO_FACTOR_SMS);

        $this->smsGateway->send(
            $user->phone,
            'Seu código de verificação Orin: '.$code
        );

        return $code;
    }

    public function verifyTwoFactorSmsCode(User $user, string $code): bool
    {
        try {
            return $this->verify($user, VerificationCode::CHANNEL_TWO_FACTOR_SMS, $code);
        } catch (\Exception) {
            return false;
        }
    }

    public function verify(User $user, string $channel, string $code): bool
    {
        $validChannels = [
            VerificationCode::CHANNEL_EMAIL,
            VerificationCode::CHANNEL_PHONE,
            VerificationCode::CHANNEL_TWO_FACTOR_SMS,
        ];

        if (! in_array($channel, $validChannels, true)) {
            throw new InvalidArgumentException('Canal de verificacao invalido.');
        }

        $verificationCode = $user->verificationCodes()
            ->where('channel', $channel)
            ->whereNull('consumed_at')
            ->latest()
            ->first();

        if (! $verificationCode) {
            throw ValidationException::withMessages([
                'code' => 'Nenhum codigo ativo encontrado. Solicite um novo envio.',
            ]);
        }

        if ($verificationCode->isExpired()) {
            throw ValidationException::withMessages([
                'code' => 'O codigo expirou. Solicite um novo envio.',
            ]);
        }

        $maxAttempts = (int) config('registration.otp.max_attempts', 5);

        if ($verificationCode->attempts >= $maxAttempts) {
            throw ValidationException::withMessages([
                'code' => 'Numero maximo de tentativas atingido. Solicite um novo codigo.',
            ]);
        }

        $verificationCode->increment('attempts');

        if (! Hash::check($code, $verificationCode->code_hash)) {
            throw ValidationException::withMessages([
                'code' => 'Codigo invalido.',
            ]);
        }

        $verificationCode->update(['consumed_at' => now()]);

        if ($channel === VerificationCode::CHANNEL_EMAIL) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        if ($channel === VerificationCode::CHANNEL_PHONE) {
            $user->forceFill(['phone_verified_at' => now()])->save();
        }

        return true;
    }

    public function canResend(User $user, string $channel): bool
    {
        $latestCode = $user->verificationCodes()
            ->where('channel', $channel)
            ->latest()
            ->first();

        if (! $latestCode) {
            return true;
        }

        $cooldown = (int) config('registration.otp.resend_cooldown_seconds', 60);

        return $latestCode->created_at->addSeconds($cooldown)->isPast();
    }

    public function resendCooldownRemaining(User $user, string $channel): int
    {
        $latestCode = $user->verificationCodes()
            ->where('channel', $channel)
            ->latest()
            ->first();

        if (! $latestCode) {
            return 0;
        }

        $cooldown = (int) config('registration.otp.resend_cooldown_seconds', 60);
        $availableAt = $latestCode->created_at->addSeconds($cooldown);

        if ($availableAt->isPast()) {
            return 0;
        }

        return (int) now()->diffInSeconds($availableAt);
    }

    private function createCode(User $user, string $channel): string
    {
        $mockCode = config('registration.sms.mock_code');

        if ($channel === VerificationCode::CHANNEL_PHONE && ! empty($mockCode)) {
            $code = (string) $mockCode;
        } else {
            $length = (int) config('registration.otp.length', 6);
            $max = (10 ** $length) - 1;
            $code = str_pad((string) random_int(0, $max), $length, '0', STR_PAD_LEFT);
        }

        $user->verificationCodes()
            ->where('channel', $channel)
            ->whereNull('consumed_at')
            ->update(['consumed_at' => now()]);

        $user->verificationCodes()->create([
            'channel' => $channel,
            'code_hash' => Hash::make($code),
            'expires_at' => now()->addMinutes((int) config('registration.otp.expires_minutes', 10)),
        ]);

        return $code;
    }
}
