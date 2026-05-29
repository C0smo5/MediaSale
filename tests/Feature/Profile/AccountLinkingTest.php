<?php

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

test('orin user can link google account with matching email', function () {
    $user = User::factory()->create([
        'email' => 'link.user@gmail.com',
        'google_id' => null,
        'verify_account' => true,
    ]);

    Socialite::fake('google', (new SocialiteUser)->map([
        'id' => 'google-link-1',
        'name' => 'Link User',
        'email' => 'link.user@gmail.com',
        'avatar' => 'https://example.com/avatar.png',
    ]));

    $this->actingAs($user)->get(route('auth.google.link'))->assertRedirect();

    $this->actingAs($user)
        ->get(route('auth.google.callback'))
        ->assertRedirect(route('profile.edit', ['section' => 'info']))
        ->assertSessionHas('status', 'google-linked');

    $user->refresh();

    expect($user->google_id)->toBe('google-link-1');
    expect($user->accountType())->toBe('linked');
    expect($user->accountTypeLabel())->toBe('Orin + Google');
});

test('user can relink google after unlinking', function () {
    $user = User::factory()->create([
        'email' => 'relink@gmail.com',
        'google_id' => 'google-relink',
        'verify_account' => true,
    ]);

    $this->actingAs($user)
        ->delete(route('profile.google.unlink'), [
            'password' => 'password',
        ])
        ->assertRedirect(route('profile.edit', ['section' => 'info']));

    $user->refresh();

    expect($user->google_id)->toBeNull();
    expect($user->canLinkGoogle())->toBeTrue();

    Socialite::fake('google', (new SocialiteUser)->map([
        'id' => 'google-relink',
        'name' => 'Relink User',
        'email' => 'relink@gmail.com',
    ]));

    $this->actingAs($user)->get(route('auth.google.link'))->assertRedirect();

    $this->actingAs($user)
        ->get(route('auth.google.callback'))
        ->assertRedirect(route('profile.edit', ['section' => 'info']))
        ->assertSessionHas('status', 'google-linked');

    $user->refresh();

    expect($user->google_id)->toBe('google-relink');
    expect($user->accountType())->toBe('linked');
});

test('google user can create orin password', function () {
    $user = User::factory()->create([
        'google_id' => 'google-only',
        'verify_account' => true,
    ]);
    $user->forceFill(['password' => null])->saveQuietly();

    $this->actingAs($user)
        ->post(route('profile.password.create'), [
            'password' => 'NovaSenha1!',
            'password_confirmation' => 'NovaSenha1!',
        ])
        ->assertRedirect(route('profile.edit', ['section' => 'info']))
        ->assertSessionHas('status', 'orin-password-created');

    $user->refresh();

    expect($user->hasOrinCredentials())->toBeTrue();
    expect($user->accountType())->toBe('linked');
});

test('google-only user cannot unlink google without orin password', function () {
    $user = User::factory()->create([
        'google_id' => 'google-only-unlink',
        'verify_account' => true,
    ]);
    $user->forceFill(['password' => null])->saveQuietly();

    expect($user->canUnlinkGoogle())->toBeFalse();

    $this->actingAs($user)
        ->delete(route('profile.google.unlink'), [
            'password' => 'any-password',
        ])
        ->assertSessionHasErrors('password');
});

test('linked user can unlink google with orin password', function () {
    $user = User::factory()->create([
        'email' => 'unlink@gmail.com',
        'google_id' => 'google-unlink',
        'password' => 'password',
        'verify_account' => true,
    ]);

    $this->actingAs($user)
        ->delete(route('profile.google.unlink'), [
            'password' => 'password',
        ])
        ->assertRedirect(route('profile.edit', ['section' => 'info']))
        ->assertSessionHas('status', 'google-unlinked');

    $user->refresh();

    expect($user->google_id)->toBeNull();
    expect($user->accountType())->toBe('orin');
});

test('cannot link google when email differs from orin account', function () {
    $user = User::factory()->create([
        'email' => 'orin.user@gmail.com',
        'google_id' => null,
        'verify_account' => true,
    ]);

    Socialite::fake('google', (new SocialiteUser)->map([
        'id' => 'google-other',
        'email' => 'other.user@gmail.com',
    ]));

    $this->actingAs($user)->get(route('auth.google.link'))->assertRedirect();

    $this->actingAs($user)
        ->get(route('auth.google.callback'))
        ->assertRedirect(route('profile.edit', ['section' => 'info']))
        ->assertSessionHasErrors('google');

    expect($user->fresh()->google_id)->toBeNull();
});

test('relink succeeds via login callback when link session is lost', function () {
    $user = User::factory()->create([
        'email' => 'fallback@gmail.com',
        'google_id' => null,
        'verify_account' => true,
    ]);

    Socialite::fake('google', (new SocialiteUser)->map([
        'id' => 'google-fallback',
        'email' => 'fallback@gmail.com',
    ]));

    $this->get(route('auth.google.callback'))
        ->assertRedirect(route('profile.edit', ['section' => 'info']))
        ->assertSessionHas('status', 'google-linked');

    $user->refresh();

    expect($user->google_id)->toBe('google-fallback');
    expect($user->accountType())->toBe('linked');
});
