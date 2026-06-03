<?php

use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\FortifyAuthenticatedSessionController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\RegisterCancellationController;
use App\Http\Controllers\Auth\RegisterCompleteProfileController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\RegisterPaymentController;
use App\Http\Controllers\Auth\RegisterPlanController;
use App\Http\Controllers\Auth\RegisterVerificationController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Middleware\EnsureRegistrationSessionActive;
use Illuminate\Support\Facades\Route;

// Fortify registers POST /login as login.store; fallback if package routes did not load.
if (! Route::has('login.store')) {
    Route::post('login', [FortifyAuthenticatedSessionController::class, 'store'])
        ->middleware(array_filter([
            'guest:web',
            config('fortify.limiters.login') ? 'throttle:'.config('fortify.limiters.login') : null,
        ]))
        ->name('login.store');
}

Route::get('auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->name('auth.google.callback');

Route::middleware('guest')->group(function () {
    Route::get('auth/google', [GoogleAuthController::class, 'redirect'])
        ->name('auth.google');

    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);
});

Route::middleware(['auth', EnsureRegistrationSessionActive::class])->group(function () {
    Route::post('register/cancel', [RegisterCancellationController::class, 'store'])
        ->name('register.cancel');

    Route::get('register/plan', [RegisterPlanController::class, 'show'])
        ->name('register.plan');

    Route::post('register/plan', [RegisterPlanController::class, 'store'])
        ->name('register.plan.store');

    Route::get('register/payment', [RegisterPaymentController::class, 'show'])
        ->name('register.payment');

    Route::post('register/payment/skip', [RegisterPaymentController::class, 'skipForTesting'])
        ->name('register.payment.skip');

    Route::post('register/payment/complete', [RegisterPaymentController::class, 'complete'])
        ->name('register.payment.complete');

    Route::post('register/payment/subscribe', [RegisterPaymentController::class, 'subscribe'])
        ->name('register.payment.subscribe');

    Route::get('register/payment/pending', [RegisterPaymentController::class, 'pending'])
        ->name('register.payment.pending');

    Route::get('register/complete-profile', [RegisterCompleteProfileController::class, 'show'])
        ->name('register.complete-profile');

    Route::post('register/complete-profile', [RegisterCompleteProfileController::class, 'store'])
        ->name('register.complete-profile.store');

    Route::get('register/verify', [RegisterVerificationController::class, 'show'])
        ->name('register.verify');

    Route::post('register/verify/email', [RegisterVerificationController::class, 'verifyEmail'])
        ->name('register.verify.email');

    Route::post('register/verify/phone', [RegisterVerificationController::class, 'verifyPhone'])
        ->name('register.verify.phone');

    Route::post('register/verify/resend/email', [RegisterVerificationController::class, 'resendEmail'])
        ->name('register.verify.resend.email');

    Route::post('register/verify/resend/phone', [RegisterVerificationController::class, 'resendPhone'])
        ->name('register.verify.resend.phone');

    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::put('password', [PasswordController::class, 'update'])->name('profile.password.update');

    Route::post('profile/password/create', [PasswordController::class, 'store'])
        ->name('profile.password.create');

    Route::get('auth/google/link', [GoogleAuthController::class, 'linkRedirect'])
        ->name('auth.google.link');

    Route::delete('profile/google', [GoogleAuthController::class, 'unlink'])
        ->name('profile.google.unlink');
});
