<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
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
            'notifications' => ['sometimes', 'array'],
            'notifications.price_drop' => ['sometimes', 'boolean'],
            'notifications.analysis_done' => ['sometimes', 'boolean'],
            'notifications.plan_limit' => ['sometimes', 'boolean'],
            'notifications.channel_email' => ['sometimes', 'boolean'],
            'notifications.channel_sms' => ['sometimes', 'boolean'],
            'chat' => ['sometimes', 'array'],
            'chat.default_stores' => ['sometimes', 'array'],
            'chat.default_stores.*' => ['string', 'max:64'],
            'chat.analysis_depth' => ['sometimes', 'string', 'in:basic,detailed'],
            'monitoring' => ['sometimes', 'array'],
            'monitoring.tracked_stores' => ['sometimes', 'array'],
            'monitoring.tracked_stores.*' => ['string', 'max:64'],
            'privacy' => ['sometimes', 'array'],
            'privacy.marketing_consent' => ['sometimes', 'boolean'],
            'privacy.analytics_consent' => ['sometimes', 'boolean'],
        ];
    }
}
