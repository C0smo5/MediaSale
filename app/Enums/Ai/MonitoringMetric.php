<?php

namespace App\Enums\Ai;

enum MonitoringMetric: string
{
    case MinPrice              = 'Preço Mínimo';
    case AveragePrice          = 'Preço Médio';
    case CompetitorSalesVolume = 'Volume de Vendas do Concorrente';
    case ShippingCost          = 'Custo de Frete';
    case AdStrategy            = 'Estratégia de Anúncio';
    case Unidentified          = 'Não identificado';
}
