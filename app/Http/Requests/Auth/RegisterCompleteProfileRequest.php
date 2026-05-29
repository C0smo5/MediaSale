<?php

namespace App\Http\Requests\Auth;

use App\Rules\BrazilianMobilePhone;
use App\Rules\ValidCpf;
use App\Support\BrazilianIdentifiers;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterCompleteProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $userId = $this->user()?->id;

        return [
            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('users', 'phone')->ignore($userId),
                new BrazilianMobilePhone,
            ],
            'cpf' => [
                'required',
                'string',
                'size:11',
                Rule::unique('users', 'cpf')->ignore($userId),
                new ValidCpf,
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'cpf' => BrazilianIdentifiers::normalizeCpf($this->input('cpf')),
            'phone' => BrazilianIdentifiers::formatPhoneForStorage($this->input('phone')),
        ]);
    }
}
