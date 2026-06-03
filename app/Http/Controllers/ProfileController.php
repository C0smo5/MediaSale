<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use App\Services\Auth\SessionManagementService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        private readonly SessionManagementService $sessions,
    ) {}

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $section = $request->query('section');
        $allowedSections = ['info', 'password', 'plans', 'danger', 'settings'];
        $initialSection = in_array($section, $allowedSections, true) ? $section : 'info';

        $settingsTab = $request->query('tab');
        $allowedSettingsTabs = [
            'general', 'notifications', 'chat', 'monitoring',
            'security', 'plan', 'privacy', 'roadmap',
        ];
        $initialSettingsTab = in_array($settingsTab, $allowedSettingsTabs, true) ? $settingsTab : 'general';

        $user = $request->user();
        $sessionId = $request->session()->getId();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'initialSection' => $initialSection,
            'initialSettingsTab' => $initialSettingsTab,
            'settings' => $user->settings ?? (object) [],
            'activeSessions' => $this->sessions->listActiveSessions($user, $sessionId),
            'twoFactorEnabled' => $user->hasEnabledTwoFactorAuthentication(),
            'linkedAccounts' => [
                'accountType' => $user->accountType(),
                'accountTypeLabel' => $user->accountTypeLabel(),
                'hasGoogle' => $user->hasLinkedGoogle(),
                'hasOrinPassword' => $user->hasOrinCredentials(),
                'canLinkGoogle' => $user->canLinkGoogle(),
                'canUnlinkGoogle' => $user->canUnlinkGoogle(),
                'canSetOrinPassword' => $user->canSetOrinPassword(),
                'googleAvatar' => $user->avatar,
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $this->authorize('update', $request->user());

        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $user = $request->user();
        $user->save();
        $user->refresh();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $this->authorize('delete', $request->user());

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        User::destroy($user->getKey());

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
