<?php

use App\Models\User;

test('PATCH /profile cannot change verify_account via mass assignment', function (): void {
    $user = createUser(['verify_account' => true]);

    $this->actingAs($user)->patch('/profile', [
        'name' => 'New Name',
        'email' => $user->email,
        'verify_account' => false,
    ]);

    expect($user->fresh()->verify_account)->toBeTrue();
});

test('PATCH /profile cannot change plan_key via mass assignment', function (): void {
    $user = createUser(['plan_key' => 'trial']);

    $this->actingAs($user)->patch('/profile', [
        'name' => 'New Name',
        'email' => $user->email,
        'plan_key' => 'elite',
    ]);

    expect($user->fresh()->plan_key)->toBe('trial');
});

test('PATCH /profile cannot change payment_completed via mass assignment', function (): void {
    $user = createUser(['payment_completed' => false]);

    $this->actingAs($user)->patch('/profile', [
        'name' => 'New Name',
        'email' => $user->email,
        'payment_completed' => true,
    ]);

    expect($user->fresh()->payment_completed)->toBeFalse();
});

test('POST /register cannot set verify_account via mass assignment', function (): void {
    \Illuminate\Support\Facades\Notification::fake();

    $this->post('/register', [
        'name' => 'Hacker',
        'email' => 'hacker@gmail.com',
        'phone' => '11988887777',
        'cpf' => '52998224725',
        'password' => 'password',
        'password_confirmation' => 'password',
        'verify_account' => true,
    ]);

    $user = User::query()->where('email', 'hacker@gmail.com')->first();

    expect($user)->not->toBeNull();
    expect($user->verify_account)->toBeFalse();
});

test('POST /register cannot set plan_key via mass assignment', function (): void {
    \Illuminate\Support\Facades\Notification::fake();

    $this->post('/register', [
        'name' => 'Hacker',
        'email' => 'hacker2@gmail.com',
        'phone' => '11988886666',
        'cpf' => '52998224725',
        'password' => 'password',
        'password_confirmation' => 'password',
        'plan_key' => 'elite',
    ]);

    $user = User::query()->where('email', 'hacker2@gmail.com')->first();

    expect($user)->not->toBeNull();
    expect($user->plan_key)->toBeNull();
});
