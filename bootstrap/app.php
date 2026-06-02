<?php

use App\Http\Middleware\EnsureRegistrationComplete;
use App\Http\Middleware\EnsureTwoFactorVerified;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\TouchRegistrationActivity;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
        $middleware->validateCsrfTokens(except: [
            'webhooks/mercadopago',
        ]);

        $middleware->alias([
            'registration.complete' => EnsureRegistrationComplete::class,
            'two_factor.verified' => EnsureTwoFactorVerified::class,
            'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            TouchRegistrationActivity::class,
        ]);

        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('register/payment*') || $request->routeIs('register.payment*')) {
                if ($request->hasSession()) {
                    $request->session()->flash('status', 'registration-expired');
                }

                return route('register');
            }

            return route('login');
        });
        $middleware->redirectUsersTo(function (Request $request) {
            $user = $request->user();

            if (! $user) {
                return route('dashboard');
            }

            $nextStep = $user->nextRegistrationStep();

            if ($nextStep !== null) {
                return route($nextStep);
            }

            return route('dashboard');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // #region agent log
        $exceptions->report(function (\Throwable $e) {
            error_log('[debug-acf904] EXCEPTION '.get_class($e).': '.substr($e->getMessage(), 0, 200).' @ '.$e->getFile().':'.$e->getLine());
        });
        // #endregion
    })->create();
