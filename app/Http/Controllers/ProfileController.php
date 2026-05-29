<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
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
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
