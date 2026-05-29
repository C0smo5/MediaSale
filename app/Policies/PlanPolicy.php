<?php

namespace App\Policies;

use App\Models\User;

class PlanPolicy
{
    public function upgrade(User $user): bool
    {
        return $user->hasVerifiedAccount();
    }

    public function cancel(User $user): bool
    {
        return $user->hasVerifiedAccount() && $user->planRequiresPayment();
    }
}
