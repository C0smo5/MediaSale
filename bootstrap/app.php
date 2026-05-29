<?php

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
        $middleware->alias([
            'registration.complete' => EnsureRegistrationComplete::class,
        ]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            TouchRegistrationActivity::class,
        ]);

        $middleware->redirectGuestsTo(fn (Request $request) => route('login'));
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
        //
    })->create();
