<?php

use App\Exceptions\SmsRateLimitExceeded;
use App\Http\Middleware\EnsureRegistrationComplete;
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
        $exceptions->render(function (SmsRateLimitExceeded $e, Request $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Limite de envio de SMS atingido. Tente novamente em alguns minutos.',
                ], 429);
            }

            return back()->with('status', 'twilio-sms-rate-limit');
        });
    })->create();
