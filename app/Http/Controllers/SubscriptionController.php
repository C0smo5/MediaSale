<?php

namespace App\Http\Controllers;

use App\Services\Plan\PlanChangeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function __construct(
        private readonly PlanChangeService $planChangeService,
    ) {}

    public function cancel(Request $request): RedirectResponse
    {
        $this->authorize('plan.cancel');

        $this->planChangeService->clearPendingChange($request);
        $this->planChangeService->cancelSubscription($request->user());

        return redirect()
            ->route('profile.edit', ['section' => 'plans'])
            ->with('status', 'subscription-cancelled');
    }
}
