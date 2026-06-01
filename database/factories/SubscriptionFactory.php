<?php

namespace Database\Factories;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Subscription>
 */
class SubscriptionFactory extends Factory
{
    protected $model = Subscription::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'mp_preapproval_id' => null,
            'plan_key' => $this->faker->randomElement(['starter', 'pro', 'business', 'elite']),
            'billing' => $this->faker->randomElement(['monthly', 'annual']),
            'status' => Subscription::STATUS_AUTHORIZED,
            'amount_due' => $this->faker->randomFloat(2, 10, 300),
            'next_payment_date' => now()->addMonth(),
        ];
    }

    public function pending(): static
    {
        return $this->state(['status' => Subscription::STATUS_PENDING]);
    }

    public function cancelled(): static
    {
        return $this->state(['status' => Subscription::STATUS_CANCELLED]);
    }
}
