<?php

namespace App\Console\Commands;

use App\Services\Registration\RegistrationAccountService;
use Illuminate\Console\Command;

class PurgeInactiveRegistrationsCommand extends Command
{
    protected $signature = 'registration:purge-inactive';

    protected $description = 'Remove cadastros incompletos abandonados (opcao 3: inatividade)';

    public function handle(RegistrationAccountService $registrationAccounts): int
    {
        $deleted = $registrationAccounts->purgeAbandonedIncompleteRegistrations();

        if ($deleted > 0) {
            $this->info("Removidas {$deleted} conta(s) com cadastro incompleto.");
        }

        return self::SUCCESS;
    }
}
