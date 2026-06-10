<?php

namespace App\Enums\Ai;

enum AnalysisIntent: string
{
    case PriceComparison     = 'Comparação de Preços';
    case CompetitorAnalysis  = 'Análise de Concorrência';
    case MarketTrend         = 'Tendência de Mercado';
    case ContentIdea         = 'Ideia de Conteúdo';
    case Unidentified        = 'Não identificado';
}
