export interface DemoResult {
    name: string;
    price: string;
    originalPrice: string | null;
    rating: number;
    store: string;
    match: number;
    isBest: boolean;
    image: string;
    imageAlt: string;
}

export interface DemoQuestion {
    id: number;
    text: string;
    stores: string[];
    totalProducts: number;
    results: DemoResult[];
}

export interface PricingPlan {
    name: string;
    monthlyPrice: string;
    annualPrice: string;
    description: string;
    features: string[];
    limitations: string[];
    highlighted: boolean;
    badge: string | null;
    accentColor: string;
    borderColor: string;
    iconBg: string;
}
