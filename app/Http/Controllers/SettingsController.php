<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSettingsRequest;
use App\Services\Auth\SessionManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function __construct(
        private readonly SessionManagementService $sessions,
    ) {}

    public function show(Request $request): Response
    {
        $this->authorize('viewSettings', $request->user());

        $user = $request->user();
        $sessionId = $request->session()->getId();

        return Inertia::render('Settings/Index', [
            'settings' => $user->settings ?? (object) [],
            'activeSessions' => $this->sessions->listActiveSessions($user, $sessionId),
            'twoFactorEnabled' => $user->two_factor_confirmed_at !== null,
            'twoFactorSmsFallback' => (bool) ($user->two_factor_sms_fallback ?? false),
        ]);
    }

    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        $this->authorize('updateSettings', $request->user());

        $user = $request->user();
        $current = is_array($user->settings) ? $user->settings : [];
        $merged = array_replace_recursive($current, $request->validated());

        $user->forceFill(['settings' => $merged])->save();

        return back()->with('status', 'settings-saved');
    }
}
