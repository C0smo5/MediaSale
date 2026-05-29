<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => fn () => $this->authPayload($request),
        ];
    }

    /**
     * @return array{user: array<string, mixed>|null}
     */
    private function authPayload(Request $request): array
    {
        $user = $request->user();

        if ($user === null) {
            return ['user' => null];
        }

        return [
            'user' => [
                ...$user->toArray(),
                'account_type' => $user->accountType(),
                'account_type_label' => $user->accountTypeLabel(),
            ],
        ];
    }
}
