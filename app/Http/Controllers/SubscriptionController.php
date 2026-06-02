<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Services\Payment\MercadoPagoService;
use App\Services\Plan\PlanChangeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function __construct(
        private readonly PlanChangeService $planChangeService,
        private readonly MercadoPagoService $mercadoPago,
    ) {}

    public function cancel(Request $request): RedirectResponse
    {
        $this->authorize('plan.cancel');

        $user = $request->user();

        // Cancel the active MP subscription before downgrading locally
        $activeSubscription = Subscription::query()
            ->where('user_id', $user->id)
            ->active()
            ->first();

        if ($activeSubscription?->mp_preapproval_id) {
            $this->mercadoPago->cancelPreApproval($activeSubscription->mp_preapproval_id);
            $activeSubscription->update(['status' => Subscription::STATUS_CANCELLED]);
        }

        $this->planChangeService->clearPendingChange($request);
        $this->planChangeService->cancelSubscription($user);
        $user->refresh();

        return redirect()
            ->route('profile.edit', ['section' => 'plans'])
            ->with('status', 'subscription-cancelled');
    }
}
