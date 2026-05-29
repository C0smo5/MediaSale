<?php

use App\Models\User;
use App\Services\Registration\RegistrationAccountService;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Notification;

test('incomplete registration account is purged after inactivity', function () {
    $user = User::factory()->registrationIncomplete()->create([
        'email' => 'inactive@gmail.com',
        'registration_last_activity_at' => now()->subMinutes(2),
    ]);

    Artisan::call('registration:purge-inactive');

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('verified account is not purged by inactivity job', function () {
    $user = createUser([
        'email' => 'verified@gmail.com',
        'verify_account' => true,
        'registration_last_activity_at' => now()->subMinutes(10),
    ]);

    Artisan::call('registration:purge-inactive');

    $this->assertDatabaseHas('users', ['id' => $user->id]);
});

test('trial registration marks verify_account after plan selection', function () {
    Notification::fake();

    $user = User::factory()->registrationIncomplete()->create([
        'email' => 'trial@gmail.com',
        'phone' => '+5511987654321',
        'cpf' => '52998224725',
        'email_verified_at' => now(),
        'phone_verified_at' => now(),
        'registration_last_activity_at' => now(),
    ]);

    $this->actingAs($user)
        ->post(route('register.plan.store'), [
            'plan_key' => 'trial',
            'plan_billing' => 'monthly',
        ])
        ->assertRedirect(route('dashboard'));

    $user->refresh();

    expect($user->verify_account)->toBeTrue();
    expect($user->registration_last_activity_at)->toBeNull();
});

test('touch activity resets inactivity window', function () {
    $user = User::factory()->registrationIncomplete()->create([
        'registration_last_activity_at' => now()->subSeconds(50),
    ]);

    app(RegistrationAccountService::class)->touchActivity($user);

    $user->refresh();

    expect($user->registration_last_activity_at?->greaterThan(now()->subSeconds(5)))->toBeTrue();

    Artisan::call('registration:purge-inactive');

    $this->assertDatabaseHas('users', ['id' => $user->id]);
});
