<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SessionManagementService
{
    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function listActiveSessions(User $user, string $currentSessionId): Collection
    {
        return DB::table('sessions')
            ->where('user_id', $user->id)
            ->orderByDesc('last_activity')
            ->get()
            ->map(fn (object $row) => [
                'id' => $row->id,
                'ip_address' => $row->ip_address,
                'user_agent' => $row->user_agent,
                'last_activity' => $row->last_activity,
                'last_activity_human' => $this->humanizeTimestamp((int) $row->last_activity),
                'is_current' => $row->id === $currentSessionId,
                'device' => $this->parseDevice($row->user_agent ?? ''),
            ]);
    }

    public function revokeSession(User $user, string $sessionId): void
    {
        DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', $sessionId)
            ->delete();
    }

    public function revokeOtherSessions(User $user, string $exceptSessionId): int
    {
        return DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', '!=', $exceptSessionId)
            ->delete();
    }

    public function rotateSession(Request $request): void
    {
        $request->session()->regenerate();
        $request->session()->regenerateToken();
    }

    private function humanizeTimestamp(int $timestamp): string
    {
        $diff = time() - $timestamp;

        if ($diff < 60) {
            return 'agora mesmo';
        }
        if ($diff < 3600) {
            $m = (int) ($diff / 60);

            return "{$m} min atrás";
        }
        if ($diff < 86400) {
            $h = (int) ($diff / 3600);

            return "{$h}h atrás";
        }
        $d = (int) ($diff / 86400);

        return "{$d}d atrás";
    }

    private function parseDevice(string $userAgent): string
    {
        if (str_contains($userAgent, 'Mobile') || str_contains($userAgent, 'Android')) {
            return 'Mobile';
        }
        if (str_contains($userAgent, 'Tablet') || str_contains($userAgent, 'iPad')) {
            return 'Tablet';
        }

        return 'Desktop';
    }
}
