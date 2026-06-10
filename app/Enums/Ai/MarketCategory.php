<?php

namespace App\Enums\Ai;

enum MarketCategory: string
{
    case Electronics        = 'Eletrônicos';
    case ClothingAccessories = 'Vestuário e Acessórios';
    case HomeDecor          = 'Casa e Decoração';
    case BeautyHealth       = 'Beleza e Saúde';
    case Automotive         = 'Automotivo';
    case ToysGames          = 'Brinquedos e Games';
    case Other              = 'Outros';
    case Unidentified       = 'Não identificado';
}
