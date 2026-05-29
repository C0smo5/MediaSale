<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegisterCancellationController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedAccount()) {
            abort(403);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
