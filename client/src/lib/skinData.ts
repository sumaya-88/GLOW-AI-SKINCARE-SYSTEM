

export interface Product {
    id: string;
    name: string;
    brand: string;
    type: "Cleanser" | "Toner" | "Serum" | "Moisturizer" | "Sunscreen" | "Treatment";
    price: number; // in USD
    description: string;
    imageUrl: string;
    suitableFor: string[]; // skin types
    concerns: string[];
    timeOfDay: "Day" | "Night" | "Both";
    benefits: string[];
    ingredients: string[];
}

// Product Data with Local Images
export const PRODUCTS: Product[] = [
    // cleansers
    {
        id: "c1",
        name: "Low pH Good Morning Gel Cleanser",
        brand: "COSRX",
        type: "Cleanser",
        price: 14,
        description: "Gentle gel cleanser specifically for morning washing without stripping natural oils.",
        imageUrl: "/assets/products/cleanser.png",
        suitableFor: ["oily", "combination", "sensitive", "normal"],
        concerns: ["acne", "oiliness"],
        timeOfDay: "Day",
        benefits: ["Maintains optimal pH balance", "Soothes irritated skin", "Removes impurities without stripping"],
        ingredients: ["Tea Tree Leaf Oil", "Betaine Salicylate (BHA)", "Japanese Snowbell Extract"]
    },
    {
        id: "c2",
        name: "Hydrating Facial Cleanser",
        brand: "CeraVe",
        type: "Cleanser",
        price: 16,
        description: "Standard for dry skin. Restores the protective skin barrier with ceramides.",
        imageUrl: "/assets/products/cerave_hydrating_cleanser.jpg",
        suitableFor: ["dry", "normal", "sensitive"],
        concerns: ["dryness", "sensitivity"],
        timeOfDay: "Both",
        benefits: ["Restores skin barrier", "Non-comedogenic", "Retains moisture"],
        ingredients: ["Ceramides 1, 3, 6-II", "Hyaluronic Acid", "Glycerin"]
    },
    {
        id: "c3",
        name: "Squalane Cleanser",
        brand: "The Ordinary",
        type: "Cleanser",
        price: 8,
        description: "A gentle cleansing product formulated to target makeup removal whilst leaving the skin smooth and moisturized.",
        imageUrl: "/assets/products/cleanser.png",
        suitableFor: ["all"],
        concerns: ["dryness", "makeup removal"],
        timeOfDay: "Night",
        benefits: ["Soap-free", "Non-comedogenic", "Moisturizing"],
        ingredients: ["Squalane", "Glycerin"]
    },

    // Toners
    {
        id: "t1",
        name: "Glycolic Acid 7% Toning Solution",
        brand: "The Ordinary",
        type: "Toner",
        price: 13,
        description: "Exfoliates for improved skin radiance and visible clarity.",
        imageUrl: "/assets/products/toner.png",
        suitableFor: ["oily", "combination", "normal"],
        concerns: ["dullness", "uneven texture", "dark spots"],
        timeOfDay: "Night",
        benefits: ["Exfoliates dead skin cells", "Improves skin texture", "Brightens complexion"],
        ingredients: ["Glycolic Acid (7%)", "Tasmanian Pepperberry", "Aloe Vera", "Ginseng Root"]
    },
    {
        id: "t2",
        name: "Witch Hazel Pore Perfecting Toner",
        brand: "Dickinson's",
        type: "Toner",
        price: 5,
        description: "100% natural distilled witch hazel that cleanses and refines pores.",
        imageUrl: "/assets/products/toner.png",
        suitableFor: ["oily", "acne-prone", "combination"],
        concerns: ["oiliness", "large pores"],
        timeOfDay: "Both",
        benefits: ["Refines pores", "Balances oil", "Soothing"],
        ingredients: ["Natural Witch Hazel", "Alcohol (Natural Grain)"]
    },

    // Serums
    {
        id: "s1",
        name: "Niacinamide 10% + Zinc 1%",
        brand: "The Ordinary",
        type: "Serum",
        price: 6,
        description: "High-strength vitamin and mineral blemish formula.",
        imageUrl: "/assets/products/serum.png",
        suitableFor: ["oily", "combination", "acne-prone"],
        concerns: ["oiliness", "large pores", "acne"],
        timeOfDay: "Both",
        benefits: ["Regulates sebum production", "Minimizes pores", "Reduces blemishes"],
        ingredients: ["Niacinamide (10%)", "Zinc PCA (1%)", "Tamarindus Indica Seed Gum"]
    },
    {
        id: "s2",
        name: "Hyaluronic Acid 2% + B5",
        brand: "The Ordinary",
        type: "Serum",
        price: 9,
        description: "A hydration support formula for ultra-pure, vegan hyaluronic acid.",
        imageUrl: "/assets/products/serum.png",
        suitableFor: ["dry", "dehydrated", "normal"],
        concerns: ["dryness", "fine lines"],
        timeOfDay: "Both",
        benefits: ["Intense hydration", "Plumps skin", "Smoothes fine lines"],
        ingredients: ["Sodium Hyaluronate", "Vitamin B5 (Panthenol)", "Ahnfeltia Concinna Extract"]
    },
    {
        id: "s3",
        name: "Discoloration Correcting Serum",
        brand: "Good Molecules",
        type: "Serum",
        price: 12,
        description: "Target hyperpigmentation and uneven skin tone.",
        imageUrl: "/assets/products/serum.png",
        suitableFor: ["all"],
        concerns: ["dark spots", "pigmentation", "acne scars"],
        timeOfDay: "Both",
        benefits: ["Brightens skin", "Fades dark spots", "Even tone"],
        ingredients: ["Tranexamic Acid", "Niacinamide"]
    },

    // Moisturizers
    {
        id: "m1",
        name: "Natural Moisturizing Factors + HA",
        brand: "The Ordinary",
        type: "Moisturizer",
        price: 7,
        description: "Offers non-greasy surface hydration making it perfect for oily skin.",
        imageUrl: "/assets/products/moisturizer.png",
        suitableFor: ["oily", "combination"],
        concerns: ["oiliness", "dehydration"],
        timeOfDay: "Both",
        benefits: ["Immediate hydration", "Non-greasy finish", "Protects outer layer"],
        ingredients: ["Amino Acids", "Fatty Acids", "Ceramides", "Hyaluronic Acid"]
    },
    {
        id: "m2",
        name: "PM Facial Moisturizing Lotion",
        brand: "CeraVe",
        type: "Moisturizer",
        price: 16,
        description: "Ultra-lightweight night cream with niacinamide and ceramides.",
        imageUrl: "/assets/products/moisturizer.png",
        suitableFor: ["all"],
        concerns: ["sensitivity", "dryness", "redness"],
        timeOfDay: "Night",
        benefits: ["Restores barrier", "Calms redness", "Oil-free"],
        ingredients: ["Niacinamide", "Ceramides", "Hyaluronic Acid"]
    },
    {
        id: "m3",
        name: "Holy Hydration! Face Cream",
        brand: "e.l.f.",
        type: "Moisturizer",
        price: 13,
        description: "Ingredient-driven moisturizer that brightens and evens out skin tone.",
        imageUrl: "/assets/products/moisturizer.png",
        suitableFor: ["dry", "normal", "combination"],
        concerns: ["dryness", "dullness"],
        timeOfDay: "Both",
        benefits: ["Plumps skin", "Brightens", "Fast absorption"],
        ingredients: ["Hyaluronic Acid", "Niacinamide", "Peptides"]
    },

    // Sunscreens
    {
        id: "su1",
        name: "Clear Face Breakout Free SPF 55",
        brand: "Neutrogena",
        type: "Sunscreen",
        price: 14,
        description: "Surpassed sun protection that won't cause breakouts.",
        imageUrl: "/assets/products/sunscreen.png",
        suitableFor: ["oily", "acne-prone"],
        concerns: ["sun damage", "acne"],
        timeOfDay: "Day",
        benefits: ["Oil-free", "Fragrance-free", "Broad spectrum"],
        ingredients: ["Avobenzone", "Homosalate", "Octisalate"]
    },
    {
        id: "su2",
        name: "Anthelios Melt-in Milk Sunscreen SPF 60",
        brand: "La Roche-Posay",
        type: "Sunscreen",
        price: 26,
        description: "Velvety texture, broad spectrum protection suitable for face and body.",
        imageUrl: "/assets/products/sunscreen.png",
        suitableFor: ["sensitive", "dry", "normal"],
        concerns: ["sun damage", "sensitivity"],
        timeOfDay: "Day",
        benefits: ["Fast absorbing", "Velvet finish", "Antioxidant protection"],
        ingredients: ["Cell-Ox Shield", "Thermal Spring Water"]
    },
    // Budget Friendly International Options (Sub $<10)
    {
        id: "bc1",
        name: "Gentle Skin Cleanser",
        brand: "Vanicream",
        type: "Cleanser",
        price: 9,
        description: "Dermatologist recommended for sensitive skin.",
        imageUrl: "/assets/products/cleanser.png",
        suitableFor: ["sensitive", "dry", "all"],
        concerns: ["sensitivity", "eczema"],
        timeOfDay: "Both",
        benefits: ["Free of dyes/fragrance", "Non-comedogenic", "Oil-free"],
        ingredients: ["Purified Water", "Glycerin", "Coco-Glucoside"]
    },
    {
        id: "bc2",
        name: "Daily Facial Cleanser",
        brand: "Cetaphil",
        type: "Cleanser",
        price: 11,
        description: "Gentle foaming cleanser for normal to oily skin.",
        imageUrl: "/assets/products/cleanser.png",
        suitableFor: ["normal", "oily", "combination"],
        concerns: ["oiliness"],
        timeOfDay: "Both",
        benefits: ["Deep clean", "Minimizes pores", "Non-irritating"],
        ingredients: ["Glycerin", "Niacinamide", "Panthenol"]
    },
    {
        id: "bc3",
        name: "Hydro Boost Hydrating Gel",
        brand: "Neutrogena",
        type: "Cleanser",
        price: 10,
        description: "Boosts hydration for soft, supple skin.",
        imageUrl: "/assets/products/cleanser.png",
        suitableFor: ["dry", "dehydrated"],
        concerns: ["dryness"],
        timeOfDay: "Both",
        benefits: ["Boosts hydration", "Lightweight", "Removes makeup"],
        ingredients: ["Hyaluronic Acid", "Glycerin"]
    },
    {
        id: "bt1",
        name: "Witch Hazel Toner",
        brand: "Thayers",
        type: "Toner",
        price: 11,
        description: "Alcohol-free toner with aloe vera formula.",
        imageUrl: "/assets/products/toner.png",
        suitableFor: ["all"],
        concerns: ["sensitivity", "redness"],
        timeOfDay: "Both",
        benefits: ["Alcohol-free", "Soothing", "Organic Aloe"],
        ingredients: ["Rose Petal Water", "Witch Hazel", "Aloe Vera"]
    },
    {
        id: "bs1",
        name: "Retinol Serum 0.5% in Squalane",
        brand: "The Ordinary",
        type: "Serum",
        price: 8,
        description: "Water-free solution for anti-aging.",
        imageUrl: "/assets/products/serum.png",
        suitableFor: ["normal", "dry", "combination"],
        concerns: ["aging", "fine lines"],
        timeOfDay: "Night",
        benefits: ["Reduces fine lines", "Improves texture", "Anti-aging"],
        ingredients: ["Retinol", "Squalane", "Jojoba Oil"]
    },
    {
        id: "bm1",
        name: "Daily Hydration Moisturizer",
        brand: "e.l.f.",
        type: "Moisturizer",
        price: 8,
        description: "Ultra hydrating, lightweight daily lotion.",
        imageUrl: "/assets/products/moisturizer.png",
        suitableFor: ["all"],
        concerns: ["dryness"],
        timeOfDay: "Day",
        benefits: ["Lightweight", "Fast absorbing", "Vegan"],
        ingredients: ["Aloe", "Jojoba Oil", "Shea Butter"]
    },
    {
        id: "bm2",
        name: "Moisturizing Cream",
        brand: "CeraVe",
        type: "Moisturizer",
        price: 16,
        description: "Rich cream for dry to very dry skin.",
        imageUrl: "/assets/products/moisturizer.png",
        suitableFor: ["dry", "very dry", "sensitive"],
        concerns: ["dryness", "eczema"],
        timeOfDay: "Both",
        benefits: ["24h hydration", "Restores barrier", "Rich texture"],
        ingredients: ["Ceramides", "Hyaluronic Acid"]
    },
    {
        id: "bsu1",
        name: "Original SPF 50 Sunscreen Lotion",
        brand: "Sun Bum",
        type: "Sunscreen",
        price: 17,
        description: "Moisturizing sunscreen formula that protects from UVA/UVB rays.",
        imageUrl: "/assets/products/sunscreen.png",
        suitableFor: ["all"],
        concerns: ["sun damage"],
        timeOfDay: "Day",
        benefits: ["Water resistant (80 mins)", "Gluten free", "Parsol 1789"],
        ingredients: ["Avobenzone", "Vitamin E"]
    },
    {
        id: "p_c1",
        name: "The Rice Wash",
        brand: "Tatcha",
        type: "Cleanser",
        price: 38,
        description: "Creamy rice powder cleanser that washes away impurities without stripping skin.",
        imageUrl: "/assets/products/tatcha_rice_wash.jpg",
        suitableFor: ["dry", "normal", "sensitive"],
        concerns: ["dryness", "dullness"],
        timeOfDay: "Both",
        benefits: ["Softens skin", "Boosts luminosity", "Gentle"],
        ingredients: ["Japanese Rice Powder", "Hyaluronic Acid", "Okinawa Algae"]
    },
    {
        id: "p_t1",
        name: "Facial Treatment Essence",
        brand: "SK-II",
        type: "Toner",
        price: 99,
        description: "Powerful treatment to soften texture, reduce dark spots, and reduce fine lines.",
        imageUrl: "/assets/products/toner.png",
        suitableFor: ["all"],
        concerns: ["aging", "dullness", "uneven texture"],
        timeOfDay: "Both",
        benefits: ["Crystal clear skin", "Anti-aging", "Texture refining"],
        ingredients: ["Pitera", "Galactomyces Ferment Filtrate"]
    },
    {
        id: "p_s1",
        name: "Advanced Night Repair",
        brand: "Estée Lauder",
        type: "Serum",
        price: 85,
        description: "Deeply penetrating serum that reduces the look of multiple signs of aging.",
        imageUrl: "/assets/products/serum.png",
        suitableFor: ["all"],
        concerns: ["aging", "dryness", "dullness"],
        timeOfDay: "Night",
        benefits: ["Line reduction", "Firming", "Hydration"],
        ingredients: ["Hyaluronic Acid", "Peptides", "Bifida Ferment"]
    },
    {
        id: "p_s2",
        name: "T.L.C. Framboos Glycolic Night Serum",
        brand: "Drunk Elephant",
        type: "Serum",
        price: 90,
        description: "High-tech AHA/BHA gel that resurfaces dull, congested skin.",
        imageUrl: "/assets/products/serum.png",
        suitableFor: ["oily", "combination"],
        concerns: ["acne", "texture", "large pores"],
        timeOfDay: "Night",
        benefits: ["Exfoliates", "Clarifies", "Smoothes texture"],
        ingredients: ["Glycolic Acid", "Salicylic Acid", "Raspberry Extract"]
    },
    {
        id: "p_m1",
        name: "The Water Cream",
        brand: "Tatcha",
        type: "Moisturizer",
        price: 72,
        description: "Oil-free anti-aging water cream that releases a burst of skin-improving nutrients.",
        imageUrl: "/assets/products/moisturizer.png",
        suitableFor: ["oily", "combination", "normal"],
        concerns: ["oiliness", "pores", "anti-aging"],
        timeOfDay: "Both",
        benefits: ["Refines pores", "Balances oil", "Lightweight hydration"],
        ingredients: ["Japanese Wild Rose", "Leopard Lily"]
    },
    {
        id: "p_m2",
        name: "Lala Retro Whipped Cream",
        brand: "Drunk Elephant",
        type: "Moisturizer",
        price: 62,
        description: "Retro-style moisturizer that rescues dry, dull skin.",
        imageUrl: "/assets/products/moisturizer.png",
        suitableFor: ["dry", "sensitive", "normal"],
        concerns: ["dryness", "aging"],
        timeOfDay: "Both",
        benefits: ["Barrier support", "Deep moisture", "Soothing"],
        ingredients: ["Ceramides", "African Oils", "Phytosphingosine"]
    },
    {
        id: "p_su1",
        name: "Unseen Sunscreen SPF 40",
        brand: "Supergoop!",
        type: "Sunscreen",
        price: 38,
        description: "The original invisible, weightless, scentless sunscreen.",
        imageUrl: "/assets/products/sunscreen.png",
        suitableFor: ["all"],
        concerns: ["sun damage"],
        timeOfDay: "Day",
        benefits: ["Invisible", "Makeup primer", "Oil-free"],
        ingredients: ["Red Algae", "Meadowfoam Seed"]
    }
];

export function getRecommendations(skinType: string, concerns: string[], budget: string = "balanced") {
    const normalize = (s: string) => (s || "").toLowerCase().trim().replace("-", " ");
    let type = normalize(skinType);

    // Handle "Not Sure" variants as "normal" to ensure something is always returned
    if (type === "not sure" || !type) {
        type = "normal";
    }

    // Filter products that match skin type OR are generic
    let compatible = PRODUCTS.filter(p =>
        (p.suitableFor || []).some(s => normalize(s) === type) ||
        (p.suitableFor || []).some(s => normalize(s) === "all")
    );

    // Score products based on concerns
    const scored = compatible.map(p => {
        let score = 0;
        p.concerns.forEach(c => {
            if (concerns.some(userConcern => normalize(userConcern).includes(normalize(c)))) {
                score += 5;
            }
        });
        if (p.suitableFor.includes(type)) score += 3;
        return { ...p, score };
    });

    const BUDGET_LIMITS: Record<string, number> = {
        "value": 50,
        "balanced": 120,
        "premium": 300
    };

    let maxTotal = 120;
    // Determine budget: Custom Number OR Preset
    if (budget && !isNaN(parseFloat(budget))) {
        maxTotal = parseFloat(budget);
    } else if (BUDGET_LIMITS[budget]) {
        maxTotal = BUDGET_LIMITS[budget];
    }

    // Sort strategy:
    // If Premium ($120+): Prioritize HIGH price (luxury)
    // If Balanced: Mix
    // If Value: Prioritize LOW price
    const isPremium = maxTotal >= 120;
    const isTightBudget = maxTotal <= 50;

    scored.sort((a, b) => {
        if (isTightBudget) {
            // Provide cheapest first if budget is tight
            const priceDiff = a.price - b.price;
            if (Math.abs(priceDiff) > 5) return priceDiff;
        } else if (isPremium) {
            // Prioritize higher price/luxury
            if (b.score !== a.score) return b.score - a.score;
            return b.price - a.price; // EXPENSIVE tie-breaker
        }

        if (b.score !== a.score) return b.score - a.score;
        return a.price - b.price; // standard cheaper tie-breaker
    });


    const categories = ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen"] as const;
    const selectedProducts: Product[] = [];
    let currentTotal = 0;

    for (const cat of categories) {
        // Calculate remaining budget for this step
        // We MUST reserve space for future steps. 
        // Min estimated cost per remaining step is ~$5 for ultra budget
        const remainingCatsCount = categories.length - (selectedProducts.length + 1);
        const minFutureCost = remainingCatsCount * (isPremium ? 20 : 5); // Reserve more for premium steps
        const maxSpendForThis = (maxTotal - currentTotal) - minFutureCost;

        // Find candidate
        let candidate = scored.find(p =>
            p.type === cat &&
            p.price <= maxSpendForThis &&
            !selectedProducts.find(s => s.id === p.id)
        );

        // If no candidate fits the strict budget, just pick the one that fits best (cheapest if tight, or just top score)
        if (!candidate) {
            candidate = scored
                .filter(p => p.type === cat && !selectedProducts.find(s => s.id === p.id))
                .sort((a, b) => isTightBudget ? a.price - b.price : b.price - a.price)[0];
        }

        if (candidate) {
            // If we are significantly under budget in premium mode, try to upgrade this slot
            if (isPremium && candidate.price < 30) {
                const upgrade = scored.find(p =>
                    p.type === cat &&
                    p.price > candidate!.price &&
                    p.price <= maxSpendForThis &&
                    !selectedProducts.find(s => s.id === p.id)
                );
                if (upgrade) candidate = upgrade;
            }

            selectedProducts.push(candidate);
            currentTotal += candidate.price;
        }
    }

    const dayRoutine = selectedProducts.filter(p => p.timeOfDay === "Day" || p.timeOfDay === "Both");
    const nightRoutine = selectedProducts.filter(p => p.timeOfDay === "Night" || p.timeOfDay === "Both");

    return { dayRoutine, nightRoutine };
}

export function getSimilarProducts(product: Product, budget: string = "balanced", limit: number = 3): Product[] {
    const normalize = (s: string) => (s || "").toLowerCase().trim();

    const budgetLimits = { "value": 50, "balanced": 120, "premium": 300 };
    const maxTotal = budgetLimits[budget as keyof typeof budgetLimits] || 120;

    // We assume a product is "affordable" for a tier if its price is within a reasonable percentage of the total budget divided by 5 steps
    const maxItemPrice = (maxTotal / 5) * 1.8;

    return PRODUCTS
        .filter(p => p.id !== product.id && p.type === product.type) // Same category
        .map(p => {
            let score = 0;
            // Match ingredients
            const commonIngredients = p.ingredients.filter(ing =>
                product.ingredients.some(targetIng => normalize(targetIng).includes(normalize(ing)) || normalize(ing).includes(normalize(targetIng)))
            );
            score += commonIngredients.length * 10;

            // Match concerns
            const commonConcerns = p.concerns.filter(c => product.concerns.includes(c));
            score += commonConcerns.length * 5;

            // Budget fit (prefer things that fit the budget tier)
            if (p.price <= maxItemPrice) score += 20;

            return { ...p, similarityScore: score };
        })
        .filter(p => p.similarityScore > 0)
        .sort((a, b) => (b as any).similarityScore - (a as any).similarityScore)
        .slice(0, limit);
}

export function getLifestyleTips(skinType: string, concerns: string[]) {
    const tips = [
        {
            category: "Hydration",
            icon: "Droplets",
            title: "Water Intake",
            description: skinType.toLowerCase().includes("dry")
                ? "Your skin needs extra internal hydration. Aim for 3-4 liters of water daily and include water-rich foods like cucumber and watermelon."
                : "Aim for at least 8 glasses (2.5 liters) of water daily to flush out toxins and maintain skin elasticity."
        },
        {
            category: "Diet",
            icon: "Utensils",
            title: "Nutritional Focus",
            description: concerns.some(c => c.toLowerCase().includes("acne"))
                ? "Limit sugar and dairy intake which can trigger breakouts. Focus on zinc-rich foods and omega-3 fatty acids."
                : "Include antioxidant-rich foods like berries and leafy greens to protect against environmental damage and aging."
        },
        {
            category: "Wellness",
            icon: "Moon",
            title: "Sleep & Stress",
            description: "Aim for 7-9 hours of quality sleep. High cortisol from stress can increase oil production, so try 5 minutes of daily meditation."
        },
        {
            category: "Habits",
            icon: "Sun",
            title: "Daily Protection",
            description: "Change your pillowcase every 3-4 days to prevent bacteria buildup. Always apply sunscreen 20 minutes before stepping out."
        }
    ];

    return tips;
}

export const PRODUCTS_MAP = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
if (typeof window !== 'undefined') {
    (window as any).PRODUCTS_MAP = PRODUCTS_MAP;
}
