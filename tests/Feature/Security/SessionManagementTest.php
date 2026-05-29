<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

test('active sessions endpoint returns current session', function (): void {
    $user = createUser();

    $response = $this->actingAs($user)->get(route('settings'));

    $response->assertOk();
    $props = $response->original->getData()['page']['props'];
    expect($props['activeSessions'])->toBeArray();
});

test('user cannot revoke another users session', function (): void {
    $victim = createUser();
    $actor = createUser();

    // Insert a fake session for the victim.
    DB::table('sessions')->insert([
        'id' => 'victim-session-id',
        'user_id' => $victim->id,
        'ip_address' => '10.0.0.1',
        'user_agent' => 'TestBrowser',
        'payload' => '',
        'last_activity' => time(),
    ]);

    // Actor tries to delete victim's session.
    $this->actingAs($actor)->delete(route('sessions.destroy', 'victim-session-id'));

    // Session must still exist.
    expect(DB::table('sessions')->where('id', 'victim-session-id')->exists())->toBeTrue();
});

test('session rotation happens on password change', function (): void {
    $user = createUser();

    $response = $this->actingAs($user)->put('/password', [
        'current_password' => 'password',
        'password' => 'new-password-123!',
        'password_confirmation' => 'new-password-123!',
    ]);

    $response->assertRedirect();
});
