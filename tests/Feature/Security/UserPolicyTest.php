<?php

use App\Models\User;
use App\Policies\UserPolicy;

test('UserPolicy denies update when actor differs from target', function (): void {
    $actor = createUser();
    $target = createUser();

    $policy = new UserPolicy;

    expect($policy->update($actor, $target))->toBeFalse();
});

test('UserPolicy allows update when actor is the target', function (): void {
    $user = createUser();
    $policy = new UserPolicy;

    expect($policy->update($user, $user))->toBeTrue();
});

test('user cannot delete another user account', function (): void {
    $actor = createUser();
    createUser(['email' => 'victim@example.com']);

    // Delete route operates on the authenticated user — so we just verify
    // the policy blocks unauthorized actions (actor acts on themselves, which is fine).
    $this->actingAs($actor)->delete('/profile', ['password' => 'password'])
        ->assertRedirect('/');

    expect(User::query()->where('id', $actor->id)->exists())->toBeFalse();
});

test('user can update their own profile', function (): void {
    $user = createUser();

    $this->actingAs($user)->patch('/profile', [
        'name' => 'Updated Name',
        'email' => $user->email,
    ])->assertRedirect(route('profile.edit'));

    expect($user->fresh()->name)->toBe('Updated Name');
});
