<?php

use App\Models\User;
use Illuminate\Support\Facades\Notification;

test('cancel registration deletes user and redirects home', function () {
    Notification::fake();

    $this->post('/register', [
        'name' => 'Cancel User',
        'email' => 'cancel@gmail.com',
        'phone' => '11987654321',
        'cpf' => '52998224725',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::query()->where('email', 'cancel@gmail.com')->firstOrFail();

    $this->actingAs($user)
        ->post(route('register.cancel'))
        ->assertRedirect(route('home', absolute: false));

    $this->assertGuest();
    $this->assertDatabaseMissing('users', ['email' => 'cancel@gmail.com']);
});

test('completed registration cannot cancel via register cancel route', function () {
    $user = User::factory()->create([
        'plan_key' => 'trial',
        'plan_billing' => 'monthly',
        'verify_account' => true,
    ]);

    $this->actingAs($user)
        ->post(route('register.cancel'))
        ->assertForbidden();

    $this->assertDatabaseHas('users', ['id' => $user->id]);
});
