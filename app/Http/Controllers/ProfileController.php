<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $section = $request->query('section');
        $allowedSections = ['info', 'password', 'plans', 'danger'];
        $initialSection = in_array($section, $allowedSections, true) ? $section : 'info';

        $user = $request->user();

        // #region agent log
        $debugPayload = json_encode([
            'sessionId' => '9f1182',
            'runId' => 'profile-plans',
            'hypothesisId' => 'F',
            'location' => 'ProfileController.php:edit',
            'message' => 'render profile edit',
            'data' => [
                'section' => $section,
                'initial_section' => $initialSection,
                'user_id' => $user->id,
                'has_name' => filled($user->name),
                'plan_key' => $user->plan_key,
            ],
            'timestamp' => (int) round(microtime(true) * 1000),
        ]);
        @file_put_contents(base_path('.cursor/debug-9f1182.log'), $debugPayload.PHP_EOL, FILE_APPEND | LOCK_EX);
        // #endregion

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'initialSection' => $initialSection,
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

        $request->user()->save();

        return Redirect::route('profile.edit');
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
