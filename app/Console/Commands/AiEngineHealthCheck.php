<?php

namespace App\Console\Commands;

use App\Contracts\Ai\AiEngineClient;
use Illuminate\Console\Command;

class AiEngineHealthCheck extends Command
{
    protected $signature = 'ai:health';

    protected $description = 'Check whether the AI engine microservice is reachable and healthy.';

    public function handle(AiEngineClient $client): int
    {
        $this->info('Checking AI engine health...');

        if ($client->healthy()) {
            $this->info('AI engine is healthy.');

            return self::SUCCESS;
        }

        $this->error('AI engine is NOT reachable. Check AI_ENGINE_URL and that the container is running.');

        return self::FAILURE;
    }
}
