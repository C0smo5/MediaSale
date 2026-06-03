<?php

use App\Models\User;

test('login redirect allows safe internal paths', function (string $url): void {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
        'redirect' => $url,
    ])->assertRedirect($url);
})->with([
    '/dashboard',
    '/profile',
    '/profile/edit',
    '/settings',
    '/chat',
]);

test('login redirect for /plans goes to profile plans section', function (): void {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
        'redirect' => '/plans',
    ])->assertRedirect(route('profile.edit', ['section' => 'plans']));
});

test('login redirect blocks protocol-relative URLs', function (): void {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
        'redirect' => '//evil.com',
    ])->assertRedirect(route('dashboard', absolute: false));
});

test('login redirect blocks absolute external URLs', function (): void {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
        'redirect' => 'https://evil.com/steal',
    ])->assertRedirect(route('dashboard', absolute: false));
});

test('login redirect blocks unknown internal paths', function (): void {
    $user = User::factory()->create();

    $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
        'redirect' => '/some/unknown/path',
    ])->assertRedirect(route('dashboard', absolute: false));
});
