<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

test('google callback creates user and redirects to complete profile', function () {
    Socialite::fake('google', (new SocialiteUser)->map([
        'id' => 'google-123',
        'name' => 'Usuario Google',
        'email' => 'google.user@gmail.com',
        'avatar' => 'https://example.com/avatar.jpg',
    ]));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('register.complete-profile'));

    $user = User::query()->where('email', 'google.user@gmail.com')->first();

    expect($user)->not->toBeNull();
    expect($user->google_id)->toBe('google-123');
    expect($user->email_verified_at)->not->toBeNull();
    expect($user->phone)->toBeNull();
    $this->assertAuthenticatedAs($user);
});

test('google callback links existing user by email', function () {
    $existing = createUser([
        'email' => 'existing@gmail.com',
        'phone' => null,
        'cpf' => null,
    ]);

    Socialite::fake('google', (new SocialiteUser)->map([
        'id' => 'google-456',
        'name' => 'Usuario Google',
        'email' => 'existing@gmail.com',
        'avatar' => null,
    ]));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('register.complete-profile'));

    $existing->refresh();

    expect($existing->google_id)->toBe('google-456');
});
