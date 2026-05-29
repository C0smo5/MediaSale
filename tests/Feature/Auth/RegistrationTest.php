<?php

use Illuminate\Support\Facades\Notification;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register and are redirected to verification', function () {
    Notification::fake();

    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@gmail.com',
        'phone' => '11987654321',
        'cpf' => '52998224725',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('register.verify', absolute: false));

    // email is not encrypted, verify directly in the DB.
    $this->assertDatabaseHas('users', ['email' => 'test@gmail.com']);

    // cpf and phone are encrypted at rest; verify through the model.
    $user = \App\Models\User::query()->where('email', 'test@gmail.com')->firstOrFail();
    expect($user->cpf)->toBe('52998224725');
    expect($user->phone)->toBe('+5511987654321');
    expect($user->email_verified_at)->toBeNull();
    expect($user->phone_verified_at)->toBeNull();
});
