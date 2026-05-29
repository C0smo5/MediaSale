<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\Registration\RegistrationAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegisterCancellationController extends Controller
{
    public function __construct(
        private readonly RegistrationAccountService $registrationAccounts,
    ) {}

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedAccount()) {
            abort(403);
        }

        $this->registrationAccounts->deleteIncompleteRegistration($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
