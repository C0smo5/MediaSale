<?php

use App\Rules\AllowedPublicEmailDomain;
use App\Rules\BrazilianMobilePhone;
use App\Rules\ValidCnpj;
use App\Rules\ValidCpf;
use App\Support\BrazilianIdentifiers;
use Illuminate\Support\Facades\Validator;

test('valid cpf passes validation', function () {
    expect(BrazilianIdentifiers::isValidCpf('529.982.247-25'))->toBeTrue();

    $validator = Validator::make(['cpf' => '529.982.247-25'], [
        'cpf' => [new ValidCpf],
    ]);

    expect($validator->passes())->toBeTrue();
});

test('invalid cpf fails validation', function (string $cpf) {
    expect(BrazilianIdentifiers::isValidCpf($cpf))->toBeFalse();

    $validator = Validator::make(['cpf' => $cpf], [
        'cpf' => [new ValidCpf],
    ]);

    expect($validator->fails())->toBeTrue();
})->with([
    'all same digits' => ['111.111.111-11'],
    'wrong check digits' => ['123.456.789-00'],
    'too short' => ['1234567890'],
]);

test('valid cnpj passes validation', function () {
    expect(BrazilianIdentifiers::isValidCnpj('11.444.777/0001-61'))->toBeTrue();

    $validator = Validator::make(['cnpj' => '11.444.777/0001-61'], [
        'cnpj' => [new ValidCnpj],
    ]);

    expect($validator->passes())->toBeTrue();
});

test('invalid cnpj fails validation', function (string $cnpj) {
    expect(BrazilianIdentifiers::isValidCnpj($cnpj))->toBeFalse();

    $validator = Validator::make(['cnpj' => $cnpj], [
        'cnpj' => [new ValidCnpj],
    ]);

    expect($validator->fails())->toBeTrue();
})->with([
    'all same digits' => ['11.111.111/1111-11'],
    'wrong check digits' => ['12.345.678/0001-99'],
]);

test('brazilian mobile phone accepts common formats', function (string $phone) {
    expect(BrazilianIdentifiers::isValidMobilePhone($phone))->toBeTrue();

    $validator = Validator::make(['phone' => $phone], [
        'phone' => [new BrazilianMobilePhone],
    ]);

    expect($validator->passes())->toBeTrue();
})->with([
    'plain digits' => ['11987654321'],
    'formatted' => ['(11) 98765-4321'],
    'with country code' => ['+55 11 98765-4321'],
]);

test('brazilian mobile phone rejects invalid numbers', function (string $phone) {
    expect(BrazilianIdentifiers::isValidMobilePhone($phone))->toBeFalse();
})->with([
    'landline' => ['1132654321'],
    'invalid ddd' => ['00987654321'],
    'missing ninth digit' => ['1187654321'],
]);

test('allowed public email domain accepts known providers', function (string $email) {
    $validator = Validator::make(['email' => $email], [
        'email' => [new AllowedPublicEmailDomain],
    ]);

    expect($validator->passes())->toBeTrue();
})->with([
    'gmail' => ['user@gmail.com'],
    'outlook' => ['user@outlook.com'],
    'yahoo br' => ['user@yahoo.com.br'],
]);

test('allowed public email domain rejects unknown domains', function () {
    $validator = Validator::make(['email' => 'user@empresa.com.br'], [
        'email' => [new AllowedPublicEmailDomain],
    ]);

    expect($validator->fails())->toBeTrue();
});

test('brazilian identifiers normalize phone for storage', function () {
    expect(BrazilianIdentifiers::formatPhoneForStorage('(11) 98765-4321'))
        ->toBe('+5511987654321');
});

test('brazilian identifiers normalize cpf to digits', function () {
    expect(BrazilianIdentifiers::normalizeCpf('529.982.247-25'))
        ->toBe('52998224725');
});
