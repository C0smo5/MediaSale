<?php

namespace App\Support\Ai;

use App\DTOs\Ai\MarketIntelligence;
use App\Enums\Ai\AnalysisIntent;
use App\Enums\Ai\MarketCategory;
use App\Enums\Ai\MonitoringMetric;

class MarketIntelligenceParser
{
    private const UNIDENTIFIED = 'Não identificado';

    /**
     * Parse the raw "KEY: value\n..." output produced by the AI engine
     * and return a fully typed MarketIntelligence DTO.
     */
    public function parse(string $rawOutput): MarketIntelligence
    {
        $fields = $this->extractFields($rawOutput);

        return new MarketIntelligence(
            produtoAlvo:          $this->get($fields, 'PRODUTO_ALVO'),
            categoriaMercado:     $this->resolveCategory($this->get($fields, 'CATEGORIA_MERCADO')),
            termoConcorrente:     $this->get($fields, 'TERMO_CONCORRENTE'),
            intencaoAnalise:      $this->resolveIntent($this->get($fields, 'INTENCAO_ANALISE')),
            metricaMonitoramento: $this->resolveMetric($this->get($fields, 'METRICA_MONITORAMENTO')),
            faixaPrecoAlvo:       $this->get($fields, 'FAIXA_PRECO_ALVO'),
        );
    }

    /**
     * @return array<string, string>
     */
    private function extractFields(string $rawOutput): array
    {
        $fields = [];

        foreach (explode("\n", $rawOutput) as $line) {
            $line = trim($line);

            if ($line === '') {
                continue;
            }

            $colonPos = strpos($line, ':');

            if ($colonPos === false) {
                continue;
            }

            $key   = trim(strtoupper(substr($line, 0, $colonPos)));
            $value = trim(substr($line, $colonPos + 1));

            if ($key !== '' && $value !== '') {
                $fields[$key] = $value;
            }
        }

        return $fields;
    }

    /**
     * @param  array<string, string>  $fields
     */
    private function get(array $fields, string $key): string
    {
        $value = $fields[$key] ?? self::UNIDENTIFIED;

        return ($value === '' || $value === 'null') ? self::UNIDENTIFIED : $value;
    }

    private function resolveCategory(string $value): MarketCategory
    {
        return MarketCategory::tryFrom($value) ?? MarketCategory::Unidentified;
    }

    private function resolveIntent(string $value): AnalysisIntent
    {
        return AnalysisIntent::tryFrom($value) ?? AnalysisIntent::Unidentified;
    }

    private function resolveMetric(string $value): MonitoringMetric
    {
        return MonitoringMetric::tryFrom($value) ?? MonitoringMetric::Unidentified;
    }
}
