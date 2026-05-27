<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Rules\AllowedPublicEmailDomain;
use App\Rules\BrazilianMobilePhone;
use App\Rules\ValidCpf;
use App\Support\BrazilianIdentifiers;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterStepOneRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class),
                new AllowedPublicEmailDomain,
            ],
            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique(User::class, 'phone'),
                new BrazilianMobilePhone,
            ],
            'cpf' => [
                'required',
                'string',
                'size:11',
                Rule::unique(User::class, 'cpf'),
                new ValidCpf,
            ],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'cpf.size' => 'Informe o CPF apenas com numeros (11 digitos).',
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
