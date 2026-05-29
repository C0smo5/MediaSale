<?php

namespace App\Http\Controllers;

use App\Services\Auth\SessionManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ActiveSessionController extends Controller
{
    public function __construct(
        private readonly SessionManagementService $sessions,
    ) {}

    public function destroy(Request $request, string $sessionId): RedirectResponse
    {
        $this->sessions->revokeSession($request->user(), $sessionId);

        return back()->with('status', 'session-revoked');
    }

    public function destroyOthers(Request $request): RedirectResponse
    {
        $this->sessions->revokeOtherSessions($request->user(), $request->session()->getId());

        return back()->with('status', 'other-sessions-revoked');
    }
}
