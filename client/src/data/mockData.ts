export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    type: "cleanser" | "toner" | "serum" | "moisturizer" | "sunscreen" | "treatment";
    image: string;
    matchScore: number;
    description: string;
    ingredients: string[];
    pros: string[];
    cons: string[];
}

export const RECOMMENDED_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Gentle Hydrating Cleanser",
        brand: "CeraVe",
        price: 1850, // BDT
        type: "cleanser",
        image: "https://images.unsplash.com/photo-1556228552-523d0c42289c?auto=format&fit=crop&q=80&w=200",
        matchScore: 98,
        description: "A gentle, non-foaming cleanser that removes impurities without stripping the skin's natural moisture barrier.",
        ingredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
        pros: ["Fragrance-free", "Non-comedogenic", "Great for sensitive skin"],
        cons: ["May not remove heavy makeup", "No lather (some dislike this)"]
    },
    {
        id: "2",
        name: "Niacinamide 10% + Zinc 1%",
        brand: "The Ordinary",
        price: 950, // BDT
        type: "serum",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200",
        matchScore: 95,
        description: "A high-strength vitamin and mineral blemish formula to reduce the appearance of skin blemishes and congestion.",
        ingredients: ["Niacinamide", "Zinc PCA", "Pentylene Glycol"],
        pros: ["Controls oil", "Reduces pore size", "Affordable"],
        cons: ["Can cause purging", "Not for dry skin"]
    },
    {
        id: "3",
        name: "Daily Moisturizing Lotion",
        brand: "Cetaphil",
        price: 1600, // BDT
        type: "moisturizer",
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=200",
        matchScore: 92,
        description: "Lightweight hydration that soothes dry, sensitive skin and restores the moisture barrier.",
        ingredients: ["Panthenol", "Glycerin", "Avocado Oil"],
        pros: ["Lightweight", "Fast absorbing", "Fragrance-free"],
        cons: ["Basic formula", "May be too light for very dry skin"]
    },
    {
        id: "4",
        name: "UV Clear SPF 46",
        brand: "EltaMD",
        price: 4200, // BDT
        type: "sunscreen",
        image: "https://images.unsplash.com/photo-1556228720-19876c123d61?auto=format&fit=crop&q=80&w=200",
        matchScore: 99,
        description: "Oil-free sunscreen that protects sensitive skin types prone to breakouts, rosacea, and discoloration.",
        ingredients: ["Zinc Oxide", "Niacinamide", "Sodium Hyaluronate"],
        pros: ["No white cast", "Contains niacinamide", "Non-greasy"],
        cons: ["Expensive", "Hard to find in stock"]
    },
    {
        id: "5",
        name: "BHA Blackhead Power Liquid",
        brand: "COSRX",
        price: 1450, // BDT
        type: "toner",
        image: "https://images.unsplash.com/photo-1571781348782-95c4a191640e?auto=format&fit=crop&q=80&w=200",
        matchScore: 88,
        description: "A chemical exfoliant liquid that clears pores and reduces blackheads.",
        ingredients: ["Betaine Salicylate", "Willow Bark Water", "Niacinamide"],
        pros: ["Gentle exfoliation", "Prevents breakouts", "Hydrating texture"],
        cons: ["Can be sticky", "Requires sunscreen use"]
    }
];

export const SKIN_TYPES = [
    { id: "oily", label: "Oily", description: "Shiny, enlarged pores" },
    { id: "dry", label: "Dry", description: "Flaky, tight feeling" },
    { id: "combination", label: "Combination", description: "Oily T-zone, dry cheeks" },
    { id: "normal", label: "Normal", description: "Balanced, few issues" },
    { id: "sensitive", label: "Sensitive", description: "Easily irritated, redness" },
    { id: "unsure", label: "Not Sure", description: "Help me figure it out" }
];

export const CONCERNS = [
    "Acne & Breakouts", "Dark Spots", "Fine Lines", "Large Pores", "Dullness",
    "Redness", "Uneven Texture", "Dark Circles", "Dryness", "Oiliness",
    "Blackheads", "Sun Damage"
];

export const BUDGETS = [
    { id: "budget", label: "Budget-Friendly", range: "Under ৳2000/month" },
    { id: "mid", label: "Mid-Range", range: "৳2000-৳5000/month" },
    { id: "premium", label: "Premium", range: "৳5000+/month" },
    { id: "flexible", label: "Flexible", range: "Show me all options" }
];
