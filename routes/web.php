<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\SubscriptionPaymentController;
use App\Http\Controllers\UserPlanController;
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
})->middleware(['auth', 'registration.complete'])->name('dashboard');

Route::get('/chat', function () {
    return Inertia::render('Chat');
})->middleware(['auth', 'registration.complete'])->name('chat');

Route::get('/settings', function () {
    return Inertia::render('Settings/Index');
})->middleware(['auth', 'registration.complete'])->name('settings');

Route::middleware('auth')->group(function () {
    Route::post('/plans/select', [UserPlanController::class, 'store'])->name('plans.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
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
