<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\Auth\AccountLinkingService;
use App\Services\Registration\RegistrationAccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Contracts\User as SocialiteUserContract;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\AbstractProvider;
use Throwable;

class GoogleAuthController extends Controller
{
    public function __construct(
        private readonly RegistrationAccountService $registrationAccounts,
        private readonly AccountLinkingService $accountLinking,
    ) {}

    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function linkRedirect(Request $request): RedirectResponse
    {
        if (! $request->user()->canLinkGoogle()) {
            return redirect()
                ->route('profile.edit', ['section' => 'info'])
                ->withErrors(['google' => 'Sua conta ja esta conectada ao Google.']);
        }

        session([
            'google_oauth_intent' => 'link',
            'google_oauth_user_id' => $request->user()->id,
        ]);

        $provider = Socialite::driver('google');
        assert($provider instanceof AbstractProvider);

        return $provider
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        $linkingAccount = $this->isLinkingIntent($request);

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (Throwable) {
            $this->clearLinkIntent();

            return $this->oauthFailureRedirect($request, 'Nao foi possivel entrar com o Google. Tente novamente.', $linkingAccount);
        }

        if ($linkingAccount) {
            $this->clearLinkIntent();

            return $this->handleAccountLink($request, $googleUser);
        }

        $this->clearLinkIntent();

        return $this->handleLogin($googleUser);
    }

    public function unlink(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $this->accountLinking->unlinkGoogle($request->user());

        return redirect()
            ->route('profile.edit', ['section' => 'info'])
            ->with('status', 'google-unlinked');
    }

    private function handleAccountLink(Request $request, SocialiteUserContract $googleUser): RedirectResponse
    {
        $user = $request->user();

        if ($user === null) {
            return redirect()
                ->route('login')
                ->withErrors(['google' => 'Faca login para conectar sua conta Google.']);
        }

        try {
            $this->accountLinking->linkGoogle($user, $googleUser);
        } catch (ValidationException $e) {
            return redirect()
                ->route('profile.edit', ['section' => 'info'])
                ->withErrors($e->errors());
        }

        return redirect()
            ->route('profile.edit', ['section' => 'info'])
            ->with('status', 'google-linked');
    }

    private function handleLogin(SocialiteUserContract $googleUser): RedirectResponse
    {
        $email = $googleUser->getEmail();

        if ($email === null) {
            return redirect()
                ->route('login')
                ->withErrors(['google' => 'Sua conta Google nao possui e-mail disponivel.']);
        }

        $user = User::query()
            ->where('google_id', $googleUser->getId())
            ->orWhere('email', $email)
            ->first();

        if ($user) {
            $relinkingCompletedOrinAccount = $user->canLinkGoogle()
                && $user->hasOrinCredentials()
                && $user->hasVerifiedAccount();

            $user->forceFill($this->googleProfileAttributes($googleUser, $user))->save();
        } else {
            $relinkingCompletedOrinAccount = false;
            $user = User::create([
                'name' => $googleUser->getName() ?? 'Usuario',
                'email' => $email,
                ...$this->googleProfileAttributes($googleUser),
                'password' => null,
            ]);
        }

        Auth::login($user, true);

        if ($relinkingCompletedOrinAccount ?? false) {
            return redirect()
                ->route('profile.edit', ['section' => 'info'])
                ->with('status', 'google-linked');
        }

        if (! $user->hasVerifiedAccount()) {
            $this->registrationAccounts->touchActivity($user);
        }

        $nextRoute = $user->fresh()->nextRegistrationStep();

        return redirect()->intended($nextRoute ? route($nextRoute) : route('dashboard'));
    }

    private function oauthFailureRedirect(Request $request, string $message, bool $linkingAccount = false): RedirectResponse
    {
        if ($linkingAccount || $request->user() !== null) {
            return redirect()
                ->route('profile.edit', ['section' => 'info'])
                ->withErrors(['google' => $message]);
        }

        return redirect()
            ->route('login')
            ->withErrors(['google' => $message]);
    }

    private function isLinkingIntent(Request $request): bool
    {
        if (session('google_oauth_intent') !== 'link') {
            return false;
        }

        $user = $request->user();

        return $user !== null
            && (int) $user->id === (int) session('google_oauth_user_id');
    }

    private function clearLinkIntent(): void
    {
        session()->forget(['google_oauth_intent', 'google_oauth_user_id']);
    }

    /**
     * @return array{google_id: string, avatar: string|null, email_verified_at: Carbon}
     */
    private function googleProfileAttributes(SocialiteUserContract $googleUser, ?User $existingUser = null): array
    {
        return [
            'google_id' => (string) $googleUser->getId(),
            'avatar' => $googleUser->getAvatar(),
            'email_verified_at' => $existingUser?->email_verified_at ?? Carbon::now(),
        ];
    }
}
