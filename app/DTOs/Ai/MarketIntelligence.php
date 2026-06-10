<?php

namespace App\DTOs\Ai;

use App\Enums\Ai\AnalysisIntent;
use App\Enums\Ai\MarketCategory;
use App\Enums\Ai\MonitoringMetric;

final readonly class MarketIntelligence
{
    public function __construct(
        public string $produtoAlvo,
        public MarketCategory $categoriaMercado,
        public string $termoConcorrente,
        public AnalysisIntent $intencaoAnalise,
        public MonitoringMetric $metricaMonitoramento,
        public string $faixaPrecoAlvo,
    ) {}

    public function toArray(): array
    {
        return [
            'produto_alvo'          => $this->produtoAlvo,
            'categoria_mercado'     => $this->categoriaMercado->value,
            'termo_concorrente'     => $this->termoConcorrente,
            'intencao_analise'      => $this->intencaoAnalise->value,
            'metrica_monitoramento' => $this->metricaMonitoramento->value,
            'faixa_preco_alvo'      => $this->faixaPrecoAlvo,
        ];
    }
}
