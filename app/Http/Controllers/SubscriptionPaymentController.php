<?php

namespace App\Http\Controllers;

use App\Services\Plan\PlanChangeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionPaymentController extends Controller
{
    public function __construct(
        private readonly PlanChangeService $planChangeService,
    ) {}

    public function show(Request $request): Response|RedirectResponse
    {
        $pending = $this->planChangeService->getPendingChange($request);

        if ($pending === null) {
            return redirect()
                ->route('profile.edit', ['section' => 'plans'])
                ->with('status', 'no-pending-plan-change');
        }

        return Inertia::render('Subscription/Payment', [
            'pending' => $pending,
            'canSkipPayment' => config('registration.allow_payment_skip'),
        ]);
    }

    public function complete(Request $request): RedirectResponse
    {
        abort_unless(config('registration.allow_payment_skip'), 404);

        $pending = $this->planChangeService->getPendingChange($request);

        if ($pending === null) {
            return redirect()->route('profile.edit', ['section' => 'plans']);
        }

        $this->planChangeService->applyPendingChange($request, $request->user());

        return redirect()
            ->route('profile.edit', ['section' => 'plans'])
            ->with('status', 'plan-updated');
    }

    public function cancelPending(Request $request): RedirectResponse
    {
        $this->planChangeService->clearPendingChange($request);

        return redirect()
            ->route('profile.edit', ['section' => 'plans'])
            ->with('status', 'plan-change-cancelled');
    }
}
