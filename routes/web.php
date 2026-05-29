<?php

use App\Http\Controllers\ActiveSessionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\SubscriptionPaymentController;
use App\Http\Controllers\UserPlanController;
use App\Http\Controllers\Auth\TwoFactorController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    /** @var User|null $user */
    $user = Auth::user();

    if ($user) {
        $nextStep = $user->nextRegistrationStep();

        if ($nextStep !== null) {
            return redirect()->route($nextStep);
        }

        return redirect()->route('dashboard');
    }

    return Inertia::render('LandingPage');
})->name('home');

Route::get('/plans', function () {
    if (Auth::user() !== null) {
        return redirect()->route('profile.edit', ['section' => 'plans']);
    }

    $validPlanKeys = ['trial', 'starter', 'pro', 'business', 'elite'];
    $initialPlan = request()->query('plan', 'pro');
    $initialBilling = request()->query('billing', 'monthly');

    if (! in_array($initialPlan, $validPlanKeys, true)) {
        $initialPlan = 'pro';
    }

    if (! in_array($initialBilling, ['monthly', 'annual'], true)) {
        $initialBilling = 'monthly';
    }

    return Inertia::render('Plans/Index', [
        'mode' => 'public',
        'initialPlan' => $initialPlan,
        'initialBilling' => $initialBilling,
    ]);
})->name('plans');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'registration.complete', 'two_factor.verified'])->name('dashboard');

Route::get('/chat', function () {
    return Inertia::render('Chat');
})->middleware(['auth', 'registration.complete', 'two_factor.verified'])->name('chat');

// 2FA challenge (guest — user is not fully logged in yet)
Route::get('/two-factor/challenge', [TwoFactorController::class, 'challengeView'])
    ->middleware('guest')
    ->name('two-factor.challenge');
Route::post('/two-factor/challenge', [TwoFactorController::class, 'challengeVerify'])
    ->middleware('guest')
    ->name('two-factor.verify');
Route::post('/two-factor/challenge/sms', [TwoFactorController::class, 'challengeSendSms'])
    ->middleware('guest')
    ->name('two-factor.challenge.sms');

Route::middleware('auth')->group(function () {
    Route::post('/plans/select', [UserPlanController::class, 'store'])->name('plans.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Settings
    Route::get('/settings', [SettingsController::class, 'show'])->name('settings');
    Route::patch('/settings', [SettingsController::class, 'update'])->name('settings.update');

    // Active sessions
    Route::delete('/sessions/{sessionId}', [ActiveSessionController::class, 'destroy'])
        ->middleware('password.confirm')
        ->name('sessions.destroy');
    Route::delete('/sessions', [ActiveSessionController::class, 'destroyOthers'])
        ->middleware('password.confirm')
        ->name('sessions.destroy-others');

    // 2FA management (in settings)
    Route::post('/two-factor/setup', [TwoFactorController::class, 'setup'])
        ->name('two-factor.setup');
    Route::post('/two-factor/confirm', [TwoFactorController::class, 'confirm'])
        ->middleware('password.confirm')
        ->name('two-factor.confirm');
    Route::delete('/two-factor', [TwoFactorController::class, 'disable'])
        ->middleware('password.confirm')
        ->name('two-factor.disable');
    Route::get('/two-factor/recovery-codes', [TwoFactorController::class, 'recoveryCodes'])
        ->name('two-factor.recovery-codes');
    Route::post('/two-factor/sms-fallback', [TwoFactorController::class, 'toggleSmsFallback'])
        ->middleware('password.confirm')
        ->name('two-factor.sms-fallback');
});

Route::middleware(['auth', 'registration.complete'])->group(function () {
    Route::get('/subscription/payment', [SubscriptionPaymentController::class, 'show'])
        ->name('subscription.payment');

    Route::post('/subscription/payment/complete', [SubscriptionPaymentController::class, 'complete'])
        ->name('subscription.payment.complete');

    Route::post('/subscription/payment/cancel', [SubscriptionPaymentController::class, 'cancelPending'])
        ->name('subscription.payment.cancel');

    Route::post('/subscription/cancel', [SubscriptionController::class, 'cancel'])
        ->name('subscription.cancel');
});

require __DIR__.'/auth.php';
