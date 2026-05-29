<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

test('cpf is stored encrypted in the database', function (): void {
    $user = createUser(['cpf' => '52998224725']);

    $raw = DB::table('users')->where('id', $user->id)->value('cpf');

    // Raw value must not be the plaintext CPF.
    expect($raw)->not->toBe('52998224725');
    // Encrypted values from Laravel start with "eyJ" (base64 of {"iv":...}).
    expect(str_starts_with((string) $raw, 'eyJ'))->toBeTrue();
    // But the model attribute must decrypt transparently.
    expect($user->fresh()->cpf)->toBe('52998224725');
});

test('phone is stored encrypted in the database', function (): void {
    $user = createUser(['phone' => '11987654321']);

    $raw = DB::table('users')->where('id', $user->id)->value('phone');

    expect($raw)->not->toBe('11987654321');
    expect(str_starts_with((string) $raw, 'eyJ'))->toBeTrue();
    expect($user->fresh()->phone)->toBe('11987654321');
});

test('two_factor_secret is stored encrypted', function (): void {
    $secret = 'JBSWY3DPEHPK3PXP';
    $user = createUser();
    $user->forceFill(['two_factor_secret' => $secret])->save();

    $raw = DB::table('users')->where('id', $user->id)->value('two_factor_secret');

    expect($raw)->not->toBe($secret);
    expect($user->fresh()->two_factor_secret)->toBe($secret);
});
