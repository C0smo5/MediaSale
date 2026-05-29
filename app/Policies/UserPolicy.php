<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function update(User $actor, User $target): bool
    {
        return $actor->id === $target->id;
    }

    public function delete(User $actor, User $target): bool
    {
        return $actor->id === $target->id;
    }

    public function linkGoogle(User $actor, User $target): bool
    {
        return $actor->id === $target->id && $actor->canLinkGoogle();
    }

    public function unlinkGoogle(User $actor, User $target): bool
    {
        return $actor->id === $target->id && $actor->canUnlinkGoogle();
    }

    public function viewSettings(User $actor, User $target): bool
    {
        return $actor->id === $target->id;
    }

    public function updateSettings(User $actor, User $target): bool
    {
        return $actor->id === $target->id;
    }
}
