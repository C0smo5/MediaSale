<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Contracts\User as SocialiteUser;

class AccountLinkingService
{
    public function linkGoogle(User $user, SocialiteUser $googleUser): void
    {
        if (! $user->canLinkGoogle()) {
            throw ValidationException::withMessages([
                'google' => 'Sua conta ja esta conectada ao Google.',
            ]);
        }

        $googleId = $googleUser->getId();
        $email = $googleUser->getEmail();

        if ($email === null) {
            throw ValidationException::withMessages([
                'google' => 'Sua conta Google nao possui e-mail disponivel.',
            ]);
        }

        if (strcasecmp($email, $user->email) !== 0) {
            throw ValidationException::withMessages([
                'google' => 'Use a mesma conta Google do e-mail cadastrado no Orin.',
            ]);
        }

        $googleIdTaken = User::query()
            ->where('google_id', $googleId)
            ->whereKeyNot($user->id)
            ->exists();

        if ($googleIdTaken) {
            throw ValidationException::withMessages([
                'google' => 'Esta conta Google ja esta vinculada a outro usuario Orin.',
            ]);
        }

        $user->forceFill([
            'google_id' => $googleId,
            'avatar' => $googleUser->getAvatar() ?? $user->avatar,
            'email_verified_at' => $user->email_verified_at ?? Carbon::now(),
        ])->save();
    }

    public function unlinkGoogle(User $user): void
    {
        if (! $user->canUnlinkGoogle()) {
            throw ValidationException::withMessages([
                'google' => 'Cadastre uma senha Orin antes de desconectar o Google.',
            ]);
        }

        $user->forceFill([
            'google_id' => null,
            'avatar' => null,
        ])->save();
    }

    public function setOrinPassword(User $user, string $password): void
    {
        if (! $user->canSetOrinPassword()) {
            throw ValidationException::withMessages([
                'password' => 'Sua conta Orin ja possui senha de acesso.',
            ]);
        }

        $user->forceFill([
            'password' => Hash::make($password),
        ])->save();
    }
}
