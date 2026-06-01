<?php

use App\Models\User;

test('auth.user does not expose cpf', function (): void {
    $user = createUser();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page->missing('auth.user.cpf'));
});

test('auth.user does not expose phone', function (): void {
    $user = createUser();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page->missing('auth.user.phone'));
});

test('auth.user does not expose two_factor_secret', function (): void {
    $user = createUser();
    $user->forceFill(['two_factor_secret' => 'JBSWY3DPEHPK3PXP'])->save();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page->missing('auth.user.two_factor_secret'));
});

test('auth.user does not expose two_factor_recovery_codes', function (): void {
    $user = createUser();
    $user->forceFill(['two_factor_recovery_codes' => ['ABCDE12345']])->save();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page->missing('auth.user.two_factor_recovery_codes'));
});

test('auth.user does not expose settings', function (): void {
    $user = createUser();
    $user->forceFill(['settings' => ['privacy' => ['marketing_consent' => true]]])->save();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page->missing('auth.user.settings'));
});

test('auth.user does not expose google_id', function (): void {
    $user = createUser();
    $user->forceFill(['google_id' => '123456789'])->save();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page->missing('auth.user.google_id'));
});

test('auth.user contains expected safe fields', function (): void {
    $user = createUser();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertInertia(fn ($page) => $page
        ->has('auth.user.id')
        ->has('auth.user.name')
        ->has('auth.user.email')
        ->has('auth.user.plan_key')
        ->has('auth.user.plan_billing')
        ->has('auth.user.account_type')
        ->has('auth.user.account_type_label')
    );
});
