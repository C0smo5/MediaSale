<?php

use App\Models\User;
use App\Services\Registration\RegistrationAccountService;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;

test('recent incomplete account is not purged by inactivity command', function () {
    $user = User::factory()->registrationIncomplete()->create([
        'email' => 'recent@gmail.com',
        'registration_last_activity_at' => now(),
    ]);

    Artisan::call('registration:purge-inactive');

    $this->assertDatabaseHas('users', ['id' => $user->id]);
});

test('abandoned incomplete account is purged after inactivity', function () {
    $user = User::factory()->registrationIncomplete()->create([
        'email' => 'abandoned@gmail.com',
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

test('touch activity resets inactivity window for option 3', function () {
    $user = User::factory()->registrationIncomplete()->create([
        'registration_last_activity_at' => now()->subSeconds(50),
    ]);

    app(RegistrationAccountService::class)->touchActivity($user);

    $user->refresh();

    expect($user->registration_last_activity_at?->greaterThan(now()->subSeconds(5)))->toBeTrue();

    Artisan::call('registration:purge-inactive');

    $this->assertDatabaseHas('users', ['id' => $user->id]);
});

test('abandoned incomplete account is purged on web request after inactivity', function () {
    Cache::flush();

    $stale = User::factory()->registrationIncomplete()->create([
        'email' => 'stale@gmail.com',
        'registration_last_activity_at' => now()->subMinutes(5),
    ]);

    $active = User::factory()->registrationIncomplete()->create([
        'email' => 'active@gmail.com',
        'registration_last_activity_at' => now()->subMinutes(5),
    ]);

    $this->actingAs($active)->get(route('register.verify'));

    $this->assertDatabaseMissing('users', ['id' => $stale->id]);
    $this->assertDatabaseHas('users', ['id' => $active->id]);
});

test('recent incomplete accounts are not purged on web request', function () {
    Cache::flush();

    $other = User::factory()->registrationIncomplete()->create([
        'email' => 'other@gmail.com',
        'registration_last_activity_at' => now(),
    ]);

    $active = User::factory()->registrationIncomplete()->create([
        'email' => 'active@gmail.com',
        'registration_last_activity_at' => now(),
    ]);

    $this->actingAs($active)->get(route('register.verify'));

    $this->assertDatabaseHas('users', ['id' => $other->id]);
    $this->assertDatabaseHas('users', ['id' => $active->id]);
});

test('logout deletes incomplete registration account immediately', function () {
    $user = User::factory()->registrationIncomplete()->create([
        'email' => 'logout@gmail.com',
    ]);

    $this->actingAs($user)->post(route('logout'));

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('cancel registration deletes account immediately', function () {
    $user = User::factory()->registrationIncomplete()->create([
        'email' => 'cancel@gmail.com',
    ]);

    $this->actingAs($user)->post(route('register.cancel'));

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});
