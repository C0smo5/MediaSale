<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * @method static UserFactory factory($count = null, $state = [])
 */
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'cpf',
        'password',
        'email_verified_at',
        'phone_verified_at',
        'plan_key',
        'plan_billing',
        'payment_completed',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'payment_completed' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function verificationCodes(): HasMany
    {
        return $this->hasMany(VerificationCode::class);
    }

    public function hasVerifiedEmail(): bool
    {
        return $this->email_verified_at !== null;
    }

    public function hasVerifiedPhone(): bool
    {
        return $this->phone_verified_at !== null;
    }

    public function isFullyVerified(): bool
    {
        return $this->hasVerifiedEmail() && $this->hasVerifiedPhone();
    }

    public function hasSelectedPlan(): bool
    {
        return $this->plan_key !== null && $this->plan_billing !== null;
    }

    public function planRequiresPaymentForKey(?string $planKey): bool
    {
        if ($planKey === null) {
            return false;
        }

        return ! in_array($planKey, config('plans.free_plan_keys', ['trial']), true);
    }

    public function planRequiresPayment(): bool
    {
        if (! $this->hasSelectedPlan()) {
            return false;
        }

        return $this->planRequiresPaymentForKey($this->plan_key);
    }

    public function hasCompletedPayment(): bool
    {
        return (bool) $this->payment_completed;
    }

    public function isRegistrationComplete(): bool
    {
        if (! $this->isFullyVerified() || ! $this->hasSelectedPlan()) {
            return false;
        }

        if ($this->planRequiresPayment() && ! $this->hasCompletedPayment()) {
            return false;
        }

        return true;
    }
}
