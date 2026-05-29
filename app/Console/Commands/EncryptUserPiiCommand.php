<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;

class EncryptUserPiiCommand extends Command
{
    protected $signature = 'users:encrypt-pii {--dry-run : Show what would be migrated without saving}';

    protected $description = 'Encrypt plaintext cpf/phone values to Laravel Encrypted cast format.';

    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        $migrated = 0;
        $skipped = 0;

        User::query()->orderBy('id', 'asc')->chunk(200, function ($users, int $page) use ($dryRun, &$migrated, &$skipped): void {
            foreach ($users as $user) {
                $needsMigration = false;
                $updates = [];

                foreach (['cpf', 'phone'] as $field) {
                    $raw = $user->getRawOriginal($field);

                    if ($raw === null) {
                        continue;
                    }

                    // Already encrypted values start with "eyJ" (base64 of {"iv":...})
                    if (str_starts_with((string) $raw, 'eyJ')) {
                        $skipped++;

                        continue;
                    }

                    $needsMigration = true;
                    $updates[$field] = Crypt::encryptString($raw);
                }

                if ($needsMigration) {
                    $this->line("  User {$user->id}: migrating PII fields");

                    if (! $dryRun) {
                        // Write encrypted values directly to DB, bypassing Eloquent casts
                        // (the cast would encrypt again if we saved through the model).
                        \Illuminate\Support\Facades\DB::table('users')
                            ->where('id', $user->id)
                            ->update($updates);
                    }

                    $migrated++;
                }
            }
        });

        $this->info("Done. Migrated: {$migrated}, already encrypted: {$skipped}.");

        return self::SUCCESS;
    }
}
