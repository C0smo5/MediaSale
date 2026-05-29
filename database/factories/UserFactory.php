<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->userName().'@gmail.com',
            'phone' => '+5511'.fake()->numerify('9########'),
            'cpf' => fake()->numerify('###########'),
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
            'plan_key' => 'pro',
            'plan_billing' => 'monthly',
            'payment_completed' => true,
            'verify_account' => true,
            'registration_last_activity_at' => null,
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
            'phone_verified_at' => null,
        ]);
    }

    /**
     * Indicate that registration verification is incomplete.
     */
    public function registrationIncomplete(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
            'phone_verified_at' => null,
            'plan_key' => null,
            'plan_billing' => null,
            'verify_account' => false,
            'registration_last_activity_at' => now(),
        ]);
    }

    /**
     * User selected a plan but has not finished verification.
     */
    public function awaitingVerification(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
            'phone_verified_at' => null,
            'plan_key' => 'starter',
            'plan_billing' => 'monthly',
            'verify_account' => false,
            'registration_last_activity_at' => now(),
        ]);
    }

    /**
     * User finished verification but has not selected a plan yet.
     */
    public function verifiedAwaitingPlan(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
            'plan_key' => null,
            'plan_billing' => null,
            'verify_account' => false,
            'registration_last_activity_at' => now(),
        ]);
    }

    /**
     * User completed verification and selected a paid plan (payment step pending).
     */
    public function awaitingPayment(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => now(),
            'phone_verified_at' => now(),
            'plan_key' => 'starter',
            'plan_billing' => 'monthly',
            'payment_completed' => false,
            'verify_account' => false,
            'registration_last_activity_at' => now(),
        ]);
    }
}
