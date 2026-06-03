<?php

use App\Models\User;

test('legacy settings url redirects to profile settings section', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('settings'))
        ->assertRedirect(route('profile.edit', ['section' => 'settings']));
});
