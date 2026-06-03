<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSettingsRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show(Request $request): RedirectResponse
    {
        $this->authorize('viewSettings', $request->user());

        $tab = $request->query('tab');

        return redirect()->route('profile.edit', array_filter([
            'section' => 'settings',
            'tab' => is_string($tab) ? $tab : null,
        ]));
    }

    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        $this->authorize('updateSettings', $request->user());

        $user = $request->user();
        $current = is_array($user->settings) ? $user->settings : [];
        $merged = array_replace_recursive($current, $request->validated());

        $user->forceFill(['settings' => $merged])->save();

        return redirect()
            ->route('profile.edit', ['section' => 'settings'])
            ->with('status', 'settings-saved');
    }
}
