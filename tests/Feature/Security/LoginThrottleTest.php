<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;

beforeEach(function (): void {
    RateLimiter::clear('test@example.com|127.0.0.1');
});

test('login is throttled after 5 failed attempts', function (): void {
    createUser(['email' => 'test@example.com', 'password' => 'correct-password']);

    for ($i = 0; $i < 5; $i++) {
        $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);
    }

    $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'correct-password',
    ])->assertSessionHasErrors('email');

    $error = session('errors')?->first('email') ?? '';
    expect($error)->toContain('Too many login attempts');
});

test('login succeeds after clearing rate limiter', function (): void {
    $user = createUser(['email' => 'test@example.com']);

    RateLimiter::clear('test@example.com|127.0.0.1');

    $this->post('/login', [
        'email' => 'test@example.com',
        'password' => 'password',
    ])->assertRedirect();

    expect(session()->has('errors'))->toBeFalsy();
});
