import type { DemoQuestion } from '../Types';

export const demoQuestions: DemoQuestion[] = [
  {
    id: 1,
    text: "Melhor notebook até R$3.000?",
    stores: ["Amazon", "Mercado Livre", "Magazine Luiza", "Americanas"],
    totalProducts: 847,
    results: [
      { name: "Acer Aspire 5 — Ryzen 5, 8GB, 256GB SSD", price: "R$ 2.799", originalPrice: "R$ 3.299", rating: 4.5, store: "Amazon", match: 96, isBest: true },
      { name: "Lenovo IdeaPad 3 — i5, 8GB, 512GB SSD", price: "R$ 2.899", originalPrice: null, rating: 4.3, store: "Mercado Livre", match: 89, isBest: false },
      { name: "Dell Inspiron 15 — i5, 4GB, 256GB SSD", price: "R$ 2.599", originalPrice: null, rating: 4.0, store: "Magazine Luiza", match: 78, isBest: false },
      { name: "HP 15s — Ryzen 3, 4GB, 256GB SSD", price: "R$ 2.199", originalPrice: "R$ 2.599", rating: 3.8, store: "Americanas", match: 65, isBest: false },
    ]
  },
  {
    id: 2,
    text: "Smartphone com boa câmera e bateria?",
    stores: ["Amazon", "Mercado Livre", "Casas Bahia", "Magazine Luiza"],
    totalProducts: 1203,
    results: [
      { name: "Samsung Galaxy A54 128GB", price: "R$ 1.899", originalPrice: "R$ 2.199", rating: 4.6, store: "Amazon", match: 94, isBest: true },
      { name: "Xiaomi Redmi Note 12 Pro 128GB", price: "R$ 1.499", originalPrice: null, rating: 4.4, store: "Mercado Livre", match: 88, isBest: false },
      { name: "Motorola Edge 30 128GB", price: "R$ 1.699", originalPrice: "R$ 1.999", rating: 4.2, store: "Casas Bahia", match: 82, isBest: false },
    ]
  },
  {
    id: 3,
    text: "Fone Bluetooth com bom custo-benefício?",
    stores: ["Amazon", "Mercado Livre", "Magazine Luiza"],
    totalProducts: 534,
    results: [
      { name: "Sony WH-CH720N — Cancelamento de Ruído", price: "R$ 549", originalPrice: "R$ 699", rating: 4.7, store: "Amazon", match: 97, isBest: true },
      { name: "JBL Tune 510BT", price: "R$ 299", originalPrice: null, rating: 4.3, store: "Mercado Livre", match: 85, isBest: false },
      { name: "Samsung Galaxy Buds FE", price: "R$ 399", originalPrice: "R$ 499", rating: 4.1, store: "Magazine Luiza", match: 79, isBest: false },
    ]
  }
];

export const storeColors: Record<string, string> = {
  'Amazon': 'bg-orange-soft text-orange-brand',
  'Mercado Livre': 'bg-yellow-50 text-yellow-700',
  'Magazine Luiza': 'bg-red-50 text-red-600',
  'Americanas': 'bg-blue-50 text-blue-600',
  'Casas Bahia': 'bg-blue-50 text-blue-700',
};