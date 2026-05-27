<?php

use App\Models\User;

test('incomplete registration cannot access dashboard', function () {
    $user = User::factory()->registrationIncomplete()->create([
        'email' => 'pending@gmail.com',
        'phone' => '+5511987654321',
        'cpf' => '52998224725',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('register.verify', absolute: false));
});

test('incomplete registration cannot access chat', function () {
    $user = User::factory()->registrationIncomplete()->create([
        'email' => 'pending@gmail.com',
        'phone' => '+5511987654321',
        'cpf' => '52998224725',
    ]);

    $this->actingAs($user)
        ->get(route('chat'))
        ->assertRedirect(route('register.verify', absolute: false));
});

test('fully verified user can access dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk();
});
