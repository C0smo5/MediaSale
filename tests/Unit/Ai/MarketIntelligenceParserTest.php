<?php

use App\DTOs\Ai\MarketIntelligence;
use App\Enums\Ai\AnalysisIntent;
use App\Enums\Ai\MarketCategory;
use App\Enums\Ai\MonitoringMetric;
use App\Support\Ai\MarketIntelligenceParser;

$parser = new MarketIntelligenceParser;

test('parses a complete well-formed output', function () use ($parser): void {
    $raw = <<<'TEXT'
PRODUTO_ALVO: Smartphone Samsung Galaxy S24 Ultra
CATEGORIA_MERCADO: Eletrônicos
TERMO_CONCORRENTE: Mercado Livre
INTENCAO_ANALISE: Comparação de Preços
METRICA_MONITORAMENTO: Preço Médio
FAIXA_PRECO_ALVO: 5000-6000
TEXT;

    $result = $parser->parse($raw);

    expect($result)->toBeInstanceOf(MarketIntelligence::class)
        ->and($result->produtoAlvo)->toBe('Smartphone Samsung Galaxy S24 Ultra')
        ->and($result->categoriaMercado)->toBe(MarketCategory::Electronics)
        ->and($result->termoConcorrente)->toBe('Mercado Livre')
        ->and($result->intencaoAnalise)->toBe(AnalysisIntent::PriceComparison)
        ->and($result->metricaMonitoramento)->toBe(MonitoringMetric::AveragePrice)
        ->and($result->faixaPrecoAlvo)->toBe('5000-6000');
});

test('falls back to Não identificado for missing fields', function () use ($parser): void {
    $result = $parser->parse('');

    expect($result->produtoAlvo)->toBe('Não identificado')
        ->and($result->categoriaMercado)->toBe(MarketCategory::Unidentified)
        ->and($result->intencaoAnalise)->toBe(AnalysisIntent::Unidentified)
        ->and($result->metricaMonitoramento)->toBe(MonitoringMetric::Unidentified);
});

test('falls back to Unidentified enum for unknown category', function () use ($parser): void {
    $raw = 'CATEGORIA_MERCADO: Categoria Inventada';

    $result = $parser->parse($raw);

    expect($result->categoriaMercado)->toBe(MarketCategory::Unidentified);
});

test('falls back to Unidentified enum for unknown intent', function () use ($parser): void {
    $raw = 'INTENCAO_ANALISE: Intenção Inventada';

    $result = $parser->parse($raw);

    expect($result->intencaoAnalise)->toBe(AnalysisIntent::Unidentified);
});

test('falls back to Unidentified enum for unknown metric', function () use ($parser): void {
    $raw = 'METRICA_MONITORAMENTO: Métrica Inventada';

    $result = $parser->parse($raw);

    expect($result->metricaMonitoramento)->toBe(MonitoringMetric::Unidentified);
});

test('ignores blank lines and extra whitespace', function () use ($parser): void {
    $raw = <<<'TEXT'

  PRODUTO_ALVO:   Tênis Nike Air Max   

TEXT;

    $result = $parser->parse($raw);

    expect($result->produtoAlvo)->toBe('Tênis Nike Air Max');
});

test('toArray returns string values from enums', function () use ($parser): void {
    $raw = <<<'TEXT'
PRODUTO_ALVO: Fone JBL Bluetooth
CATEGORIA_MERCADO: Eletrônicos
TERMO_CONCORRENTE: Shopee
INTENCAO_ANALISE: Análise de Concorrência
METRICA_MONITORAMENTO: Preço Mínimo
FAIXA_PRECO_ALVO: 150-200
TEXT;

    $array = $parser->parse($raw)->toArray();

    expect($array['categoria_mercado'])->toBe('Eletrônicos')
        ->and($array['intencao_analise'])->toBe('Análise de Concorrência')
        ->and($array['metrica_monitoramento'])->toBe('Preço Mínimo');
});
