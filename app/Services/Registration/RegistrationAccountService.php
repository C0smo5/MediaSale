<?php

namespace App\Services\Registration;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

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

    public function purgeInactiveAccounts(): int
    {
        $cutoff = now()->subMinutes($this->inactivityMinutes());

        $deleted = 0;

        $users = User::query()
            ->where('verify_account', false)
            ->where(function ($query) use ($cutoff): void {
                $query
                    ->where('registration_last_activity_at', '<', $cutoff)
                    ->orWhere(function ($query) use ($cutoff): void {
                        $query
                            ->whereNull('registration_last_activity_at')
                            ->where('created_at', '<', $cutoff);
                    });
            })
            ->orderBy('id', 'asc')
            ->get();

        foreach ($users as $user) {
            if (Auth::id() === $user->id) {
                Auth::logout();
            }

            User::destroy($user->id);
            $deleted++;
        }

        return $deleted;
    }

    public function inactivityMinutes(): int
    {
        return max(1, (int) config('registration.inactivity_minutes', 1));
    }
}
