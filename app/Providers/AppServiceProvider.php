<?php

namespace App\Providers;

use App\Contracts\Verification\SmsGateway;
use App\Models\User;
use App\Policies\PlanPolicy;
use App\Policies\UserPolicy;
use App\Services\Verification\LogSmsGateway;
use App\Services\Verification\TwilioSmsGateway;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use InvalidArgumentException;
use Twilio\Rest\Client;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(\PragmaRX\Google2FA\Google2FA::class);

        $this->app->bind(SmsGateway::class, function ($app) {
            return match (config('registration.sms.driver')) {
                'log' => $app->make(LogSmsGateway::class),
                'twilio' => $app->make(TwilioSmsGateway::class),
                default => throw new InvalidArgumentException(
                    'Unsupported SMS driver: '.config('registration.sms.driver')
                ),
            };
        });

        $this->app->singleton(TwilioSmsGateway::class, function () {
            $config = config('registration.sms.twilio');

            return new TwilioSmsGateway(
                new Client($config['account_sid'], $config['auth_token']),
                $config['from'],
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::policy(User::class, UserPolicy::class);
        Gate::define('plan.upgrade', [PlanPolicy::class, 'upgrade']);
        Gate::define('plan.cancel', [PlanPolicy::class, 'cancel']);
    }
}
