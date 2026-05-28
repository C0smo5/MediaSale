<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserPlanRequest extends FormRequest
{
    public const PLAN_KEYS = ['trial', 'starter', 'pro', 'business', 'elite'];

    public const BILLING_CYCLES = ['monthly', 'annual'];

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'plan_key' => ['required', 'string', Rule::in(self::PLAN_KEYS)],
            'plan_billing' => ['required', 'string', Rule::in(self::BILLING_CYCLES)],
        ];
    }
}
