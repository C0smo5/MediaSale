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

    $this->assertDatabaseHas('users', [
        'email' => 'test@gmail.com',
        'cpf' => '52998224725',
        'phone' => '+5511987654321',
        'email_verified_at' => null,
        'phone_verified_at' => null,
    ]);
});
