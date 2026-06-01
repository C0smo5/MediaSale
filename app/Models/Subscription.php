<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    /** @use HasFactory<\Database\Factories\SubscriptionFactory> */
    use HasFactory;
    public const STATUS_PENDING = 'pending';

    public const STATUS_AUTHORIZED = 'authorized';

    public const STATUS_PAUSED = 'paused';

    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'user_id',
        'mp_preapproval_id',
        'plan_key',
        'billing',
        'status',
        'amount_due',
        'next_payment_date',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount_due' => 'float',
            'next_payment_date' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @param  Builder<Subscription>  $query
     * @return Builder<Subscription>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_AUTHORIZED);
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_AUTHORIZED;
    }
}
