<?php

namespace App\Services\Registration;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class RegistrationAccountService
{
    public function touchActivity(User $user): void
    {
        if ($user->verify_account) {
            return;
        }

        $user->forceFill([
            'registration_last_activity_at' => now(),
        ])->saveQuietly();
    }

    public function markAccountVerified(User $user): void
    {
        if ($user->verify_account) {
            return;
        }

        if (! $user->hasCompletedRegistrationRequirements()) {
            return;
        }

        $user->forceFill([
            'verify_account' => true,
            'registration_last_activity_at' => null,
        ])->save();
    }

    /**
     * Opcao 1 e 2: exclusao imediata (cancelar cadastro ou logout).
     */
    public function deleteIncompleteRegistration(User $user): void
    {
        if ($user->hasVerifiedAccount()) {
            return;
        }

        if (Auth::id() === $user->id) {
            Auth::logout();
        }

        User::destroy($user->getKey());
    }

    /**
     * Opcao 3: exclusao por inatividade (cadastro abandonado sem cancelar/sair).
     */
    public function purgeAbandonedIncompleteRegistrations(?int $exceptUserId = null): int
    {
        $cutoff = now()->subMinutes($this->inactivityMinutes());

        $query = User::query()
            ->where('verify_account', false)
            ->where(function ($query) use ($cutoff): void {
                $query
                    ->where('registration_last_activity_at', '<', $cutoff)
                    ->orWhere(function ($query) use ($cutoff): void {
                        $query
                            ->whereNull('registration_last_activity_at')
                            ->where('created_at', '<', $cutoff);
                    });
            });

        if ($exceptUserId !== null) {
            $query->where('id', '!=', $exceptUserId);
        }

        $userIds = $query->orderBy('id', 'asc')->pluck('id');

        $deleted = 0;

        foreach ($userIds as $userId) {
            if (Auth::id() === $userId) {
                Auth::logout();
            }

            User::destroy($userId);
            $deleted++;
        }

        return $deleted;
    }

    public function maybePurgeAbandonedIncompleteRegistrations(?int $exceptUserId = null): int
    {
        $lockSeconds = max(30, min(60, $this->inactivityMinutes() * 30));

        if (! Cache::add('registration:purge-abandoned-lock', true, $lockSeconds)) {
            return 0;
        }

        return $this->purgeAbandonedIncompleteRegistrations($exceptUserId);
    }

    public function inactivityMinutes(): int
    {
        return max(1, (int) config('registration.inactivity_minutes', 1));
    }
}
