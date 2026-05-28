<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserPlanRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegisterPlanController extends Controller
{
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user->isFullyVerified()) {
            return redirect()->route('register.verify');
        }

        if ($user->hasSelectedPlan()) {
            if ($user->planRequiresPayment() && ! $user->hasCompletedPayment()) {
                return redirect()->route('register.payment');
            }

            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/RegisterPlan', [
            'initialPlan' => $request->query('plan', 'pro'),
            'initialBilling' => $request->query('billing', 'monthly'),
        ]);
    }

    public function store(UpdateUserPlanRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = $request->user();
        $user->fill([
            'plan_key' => $validated['plan_key'],
            'plan_billing' => $validated['plan_billing'],
        ]);
        $user->save();

        if ($user->planRequiresPayment()) {
            return redirect()->route('register.payment');
        }

        return redirect()->route('dashboard');
    }
}
