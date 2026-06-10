<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

pest()->extend(TestCase::class)
    ->in('Unit/Rules');

pest()->extend(TestCase::class)
    ->in('Unit/Ai');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * @param  array<string, mixed>  $attributes
 */
function createUser(array $attributes = []): User
{
    return User::factory()->createOne($attributes);
}

/**
 * Enable and confirm Fortify 2FA for a user; returns the decrypted TOTP secret for OTP generation.
 *
 * @return non-empty-string Base32 secret for {@see \Tests\Support\TotpCodeGenerator} (not Fortify provider).
 */
function enableTwoFactorForUser(User $user): string
{
    $enable = app(\Laravel\Fortify\Actions\EnableTwoFactorAuthentication::class);
    $enable($user, true);
    $user->refresh();

    $secret = \Laravel\Fortify\Fortify::currentEncrypter()->decrypt($user->two_factor_secret);

    if (\Laravel\Fortify\Fortify::confirmsTwoFactorAuthentication()) {
        $user->forceFill(['two_factor_confirmed_at' => now()])->save();
    }

    $user->refresh();

    return $secret;
}

/**
 * Valid 6-digit TOTP for Fortify two-factor challenge (uses Google2FA, not Fortify provider).
 */
function totpCodeForSecret(string $secret): string
{
    return \Tests\Support\TotpCodeGenerator::forSecret($secret);
}
