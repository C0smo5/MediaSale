<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\AccountProvider;
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
        'google_id',
        'avatar',
        'phone',
        'cpf',
        'password',
        'email_verified_at',
        'phone_verified_at',
        'plan_key',
        'plan_billing',
        'payment_completed',
        'verify_account',
        'registration_last_activity_at',
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
            'verify_account' => 'boolean',
            'registration_last_activity_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (User $user): void {
            if (! $user->verify_account && $user->registration_last_activity_at === null) {
                $user->registration_last_activity_at = now();
            }
        });
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

    public function hasVerifiedAccount(): bool
    {
        return (bool) $this->verify_account;
    }

    public function isRegistrationComplete(): bool
    {
        return $this->hasVerifiedAccount();
    }

    /**
     * Requisitos de cadastro concluidos (antes de marcar verify_account).
     */
    public function hasCompletedRegistrationRequirements(): bool
    {
        if ($this->needsProfileCompletion()) {
            return false;
        }

        if (! $this->isFullyVerified()) {
            return false;
        }

        if (! $this->hasSelectedPlan()) {
            return false;
        }

        if ($this->planRequiresPayment() && ! $this->hasCompletedPayment()) {
            return false;
        }

        return true;
    }

    public function hasLinkedGoogle(): bool
    {
        return $this->google_id !== null;
    }

    public function usesGoogleAuth(): bool
    {
        return $this->hasLinkedGoogle();
    }

    public function hasOrinCredentials(): bool
    {
        return filled($this->getRawOriginal('password'));
    }

    public function canLinkGoogle(): bool
    {
        return ! $this->hasLinkedGoogle();
    }

    public function canUnlinkGoogle(): bool
    {
        return $this->hasLinkedGoogle() && $this->hasOrinCredentials();
    }

    public function canSetOrinPassword(): bool
    {
        return ! $this->hasOrinCredentials();
    }

    public function accountProvider(): AccountProvider
    {
        if ($this->hasLinkedGoogle() && $this->hasOrinCredentials()) {
            return AccountProvider::Linked;
        }

        if ($this->hasLinkedGoogle()) {
            return AccountProvider::Google;
        }

        return AccountProvider::Orin;
    }

    public function accountType(): string
    {
        return $this->accountProvider()->value;
    }

    public function accountTypeLabel(): string
    {
        return $this->accountProvider()->label();
    }

    public function needsProfileCompletion(): bool
    {
        return blank($this->phone) || blank($this->cpf);
    }

    /**
     * Próxima etapa do cadastro ou null se já concluído.
     */
    public function nextRegistrationStep(): ?string
    {
        if ($this->hasVerifiedAccount()) {
            return null;
        }

        if ($this->usesGoogleAuth()) {
            return $this->nextGoogleRegistrationStep();
        }

        return $this->nextOrinRegistrationStep();
    }

    private function nextOrinRegistrationStep(): ?string
    {
        if ($this->needsProfileCompletion()) {
            return 'register.complete-profile';
        }

        if (! $this->isFullyVerified()) {
            return 'register.verify';
        }

        if (! $this->hasSelectedPlan()) {
            return 'register.plan';
        }

        if ($this->planRequiresPayment() && ! $this->hasCompletedPayment()) {
            return 'register.payment';
        }

        return null;
    }

    private function nextGoogleRegistrationStep(): ?string
    {
        if (! $this->hasSelectedPlan()) {
            return 'register.plan';
        }

        if ($this->needsProfileCompletion()) {
            return 'register.complete-profile';
        }

        if (! $this->isFullyVerified()) {
            return 'register.verify';
        }

        if ($this->planRequiresPayment() && ! $this->hasCompletedPayment()) {
            return 'register.payment';
        }

        return null;
    }
}
