<?php

namespace App\Support\Auth;

class InternalRedirectValidator
{
    public static function isValid(?string $url): bool
    {
        if ($url === null || $url === '') {
            return false;
        }

        if (! str_starts_with($url, '/') || str_starts_with($url, '//')) {
            $appUrl = rtrim((string) config('app.url'), '/');

            return $appUrl !== '' && str_starts_with($url, $appUrl);
        }

        $allowedPrefixes = ['/dashboard', '/profile', '/plans', '/settings', '/chat'];

        foreach ($allowedPrefixes as $prefix) {
            if ($url === $prefix || str_starts_with($url, $prefix.'/') || str_starts_with($url, $prefix.'?')) {
                return true;
            }
        }

        return false;
    }

    public static function resolveRedirect(string $url): string
    {
        if (str_contains($url, '/plans')) {
            return route('profile.edit', ['section' => 'plans']);
        }

        return $url;
    }
}
