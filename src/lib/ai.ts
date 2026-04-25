// AI Simulation Engine — mock analysis functions
import type { StyleProfile } from './db';

const FACE_SHAPES = ['Oval', 'Round', 'Square', 'Heart', 'Oblong', 'Diamond'];
const SKIN_TONES = ['Fair', 'Light', 'Medium', 'Olive', 'Tan', 'Brown', 'Dark'];
const BODY_TYPES = ['Ectomorph', 'Mesomorph', 'Endomorph', 'Athletic', 'Pear', 'Hourglass'];

const COLOR_PALETTES: Record<string, string[]> = {
    Fair: ['#2C3E50', '#8E44AD', '#2980B9', '#16A085', '#E74C3C', '#F39C12'],
    Light: ['#34495E', '#9B59B6', '#3498DB', '#1ABC9C', '#E67E22', '#C0392B'],
    Medium: ['#1A1A2E', '#7C3AED', '#2563EB', '#059669', '#D97706', '#DC2626'],
    Olive: ['#0F172A', '#6D28D9', '#1D4ED8', '#047857', '#B45309', '#B91C1C'],
    Tan: ['#1E293B', '#7E22CE', '#1E40AF', '#065F46', '#92400E', '#991B1B'],
    Brown: ['#F1F5F9', '#A78BFA', '#60A5FA', '#34D399', '#FBBF24', '#F87171'],
    Dark: ['#F8FAFC', '#C4B5FD', '#93C5FD', '#6EE7B7', '#FCD34D', '#FCA5A5'],
};

const STYLE_TYPES = ['Classic Elegant', 'Streetwear Edge', 'Minimalist Chic', 'Bohemian Free', 'Urban Professional', 'Avant-Garde Bold'];

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function analyzeFace(): { faceShape: string; skinTone: string } {
    return {
        faceShape: pickRandom(FACE_SHAPES),
        skinTone: pickRandom(SKIN_TONES),
    };
}

export function analyzeBody(): { bodyType: string } {
    return {
        bodyType: pickRandom(BODY_TYPES),
    };
}

export function generateStyleProfile(preferences: string[] = []): StyleProfile {
    const { faceShape, skinTone } = analyzeFace();
    const { bodyType } = analyzeBody();
    const score = Math.floor(Math.random() * 25) + 72; // 72-96
    const colors = COLOR_PALETTES[skinTone] || COLOR_PALETTES['Medium'];
    const dominantStyle = preferences.length > 0
        ? preferences[0].charAt(0).toUpperCase() + preferences[0].slice(1)
        : pickRandom(STYLE_TYPES);

    const summaries: Record<string, string> = {
        'Classic Elegant': `Your ${faceShape.toLowerCase()} face and ${skinTone.toLowerCase()} skin tone create a sophisticated canvas. You gravitate toward timeless silhouettes with refined details. Think structured blazers, clean lines, and quality fabrics.`,
        'Streetwear Edge': `With your ${bodyType.toLowerCase()} build and ${skinTone.toLowerCase()} complexion, you pull off bold streetwear effortlessly. Oversized fits, graphic elements, and statement sneakers are your playground.`,
        'Minimalist Chic': `Your ${faceShape.toLowerCase()} features pair beautifully with understated elegance. Less is more for you — neutral tones, clean cuts, and intentional accessories create a polished look.`,
        'Bohemian Free': `Your ${bodyType.toLowerCase()} frame carries flowing silhouettes beautifully. Earth tones, layered textures, and artisanal details reflect your free-spirited aesthetic.`,
        'Urban Professional': `Your ${skinTone.toLowerCase()} skin tone and ${bodyType.toLowerCase()} build command attention in tailored pieces. Smart casual is your sweet spot — refined yet approachable.`,
        'Avant-Garde Bold': `With your distinctive ${faceShape.toLowerCase()} face shape, you can pull off experimental fashion. Asymmetric cuts, unusual textures, and architectural details are your signature.`,
    };

    return {
        faceShape,
        skinTone,
        bodyType,
        styleScore: score,
        recommendedColors: colors,
        styleSummary: summaries[dominantStyle] || summaries['Classic Elegant'],
        dominantStyle,
    };
}

export function autoTagClothing(name: string): { category: string; color: string; occasion: string[]; tags: string[] } {
    const lower = name.toLowerCase();
    let category = 'Other';
    if (/shirt|tee|top|blouse|polo/.test(lower)) category = 'Tops';
    else if (/pant|jean|trouser|short|chino/.test(lower)) category = 'Bottoms';
    else if (/dress/.test(lower)) category = 'Dresses';
    else if (/jacket|coat|blazer|hoodie|sweater|cardigan/.test(lower)) category = 'Outerwear';
    else if (/shoe|sneaker|boot|heel|sandal|loafer/.test(lower)) category = 'Footwear';
    else if (/bag|watch|belt|hat|scarf|necklace|ring|bracelet|sunglasses/.test(lower)) category = 'Accessories';

    const colorKeywords: Record<string, string> = {
        black: 'Black', white: 'White', red: 'Red', blue: 'Blue', navy: 'Navy',
        green: 'Green', grey: 'Grey', gray: 'Grey', brown: 'Brown', pink: 'Pink',
        beige: 'Beige', cream: 'Cream', maroon: 'Maroon', purple: 'Purple',
        yellow: 'Yellow', orange: 'Orange', olive: 'Olive', charcoal: 'Charcoal',
    };
    let color = 'Multi';
    for (const [kw, val] of Object.entries(colorKeywords)) {
        if (lower.includes(kw)) { color = val; break; }
    }

    const occasions: string[] = [];
    if (/blazer|suit|formal|dress shirt|trouser|heel|loafer/.test(lower)) occasions.push('Formal');
    if (/tee|jean|sneaker|hoodie|short/.test(lower)) occasions.push('Casual');
    if (/workout|gym|sport|running|yoga/.test(lower)) occasions.push('Athletic');
    if (/party|cocktail|sequin|glitter/.test(lower)) occasions.push('Party');
    if (occasions.length === 0) occasions.push('Casual');

    const tags = [category.toLowerCase(), color.toLowerCase(), ...occasions.map(o => o.toLowerCase())];

    return { category, color, occasion: occasions, tags };
}

export function generateChatResponse(message: string, profile?: StyleProfile | null, wardrobeCount?: number): string {
    const lower = message.toLowerCase();

    if (/hi|hello|hey/.test(lower) && lower.length < 15) {
        return `Hey there! 👋 I'm your AI stylist. I've analyzed your style profile — you're rocking a ${profile?.dominantStyle || 'unique'} vibe with a style score of ${profile?.styleScore || 85}. What can I help you with today?`;
    }

    if (/date|dinner|romantic/.test(lower)) {
        return `For a date night look, I'd suggest:\n\n🔥 **The Power Move**: A well-fitted dark blazer over a clean ${profile?.skinTone === 'Fair' ? 'navy' : 'white'} tee, slim chinos, and leather loafers.\n\n✨ **The Vibe**: Add a subtle cologne and a minimalist watch. Confidence is your best accessory.\n\n💡 **Pro tip**: ${profile?.skinTone ? `With your ${profile.skinTone.toLowerCase()} skin tone, ${profile.recommendedColors?.[0] ? 'deep jewel tones' : 'earthy neutrals'} will make you stand out.` : 'Stick to darker, richer tones for evening dates.'}`;
    }

    if (/match|pair|combine|goes with/.test(lower)) {
        return `Great styling question! Here's my take:\n\n👔 **Color Matching**: ${profile?.recommendedColors ? `Based on your palette, try pairing complementary tones like warm and cool together.` : `Stick to the rule of 3 — no more than three colors in one outfit.`}\n\n🎯 **The Rule**: Match your shoe color to your belt, and keep metals consistent (all gold or all silver).\n\n${wardrobeCount && wardrobeCount > 3 ? `📦 I see you have ${wardrobeCount} items in your wardrobe. Want me to suggest specific combinations?` : `📦 Add more items to your wardrobe and I can create specific outfit recommendations!`}`;
    }

    if (/interview|work|office|professional/.test(lower)) {
        return `For a professional setting:\n\n👔 **Essential Combo**: Tailored blazer + crisp button-down + well-fitted trousers + oxford shoes.\n\n🎨 **Colors**: Navy, charcoal, or dark grey as your base. Add personality with a subtle pocket square or tie.\n\n💼 **${profile?.dominantStyle || 'Style'} tip**: ${profile?.bodyType === 'Athletic' ? 'Your athletic build looks great in structured pieces — go for slim-fit tailoring.' : 'Focus on fit above all — tailored pieces elevate any body type.'}`;
    }

    if (/casual|everyday|weekend/.test(lower)) {
        return `For effortless everyday style:\n\n👕 **The Formula**: Premium basics + one statement piece. Think quality white tee + well-fitted jeans + clean sneakers + a standout jacket.\n\n🌟 **Elevate it**: Roll your sleeves, add sunglasses, or throw on a minimal chain. Small details make casual look intentional.\n\n${profile?.dominantStyle === 'Streetwear Edge' ? '🔥 With your streetwear vibe, try layering oversized pieces with fitted bottoms for that perfect contrast.' : '✨ Keep proportions balanced — if your top is loose, go slim on the bottom.'}`;
    }

    if (/wardrobe|closet|have|own/.test(lower)) {
        return `Let me analyze your wardrobe situation:\n\n📊 **Current Status**: ${wardrobeCount ? `You have ${wardrobeCount} items.` : "You haven't added wardrobe items yet."}\n\n🎯 **Capsule Wardrobe Essentials**:\n- 3-4 quality tops (neutral + 1 color)\n- 2 pairs of well-fitted pants\n- 1 versatile jacket/blazer\n- 2 pairs of shoes (casual + dressy)\n- 3-5 accessories\n\nWant me to identify what's missing from your collection?`;
    }

    if (/score|rating|style score/.test(lower)) {
        return `Your current style score is **${profile?.styleScore || 85}/100** 🏆\n\nHere's the breakdown:\n- 🎨 Color harmony: ${Math.floor(Math.random() * 10) + 85}%\n- 👔 Fit awareness: ${Math.floor(Math.random() * 10) + 80}%\n- ✨ Trend alignment: ${Math.floor(Math.random() * 10) + 75}%\n- 🧩 Wardrobe versatility: ${Math.floor(Math.random() * 10) + 70}%\n\n**To improve**: Focus on building a cohesive color palette and investing in well-fitted basics.`;
    }

    return `Great question! Here's what I think:\n\n${profile ? `Based on your ${profile.dominantStyle} style profile (score: ${profile.styleScore}/100), ` : ''}I'd recommend focusing on building a versatile foundation. The key principles are:\n\n1. **Fit is everything** — Even budget pieces look premium when tailored\n2. **Color cohesion** — Stick to 3-4 base colors that work together\n3. **Quality basics** — Invest in pieces you'll wear 100+ times\n\nWant me to get more specific? Try asking about a particular occasion or outfit combination! 💫`;
}

export function generateTryOnConfidence(): number {
    return Math.floor(Math.random() * 15) + 82; // 82-96
}

export function generateWardrobeInsights(items: { category: string; color: string; occasion: string[] }[]) {
    const categories: Record<string, number> = {};
    const colors: Record<string, number> = {};
    const occasions: Record<string, number> = {};

    items.forEach(item => {
        categories[item.category] = (categories[item.category] || 0) + 1;
        colors[item.color] = (colors[item.color] || 0) + 1;
        item.occasion.forEach(o => {
            occasions[o] = (occasions[o] || 0) + 1;
        });
    });

    const missingCategories = ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories']
        .filter(c => !categories[c] || categories[c] < 2);

    const dominantColor = Object.entries(colors).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    return {
        totalItems: items.length,
        categories,
        colors,
        occasions,
        dominantColor,
        missingCategories,
        versatilityScore: Math.min(100, items.length * 8 + Object.keys(categories).length * 10),
        suggestions: missingCategories.length > 0
            ? `Your wardrobe is missing key items in: ${missingCategories.join(', ')}. Adding these would significantly boost your outfit combinations.`
            : 'Your wardrobe is well-balanced! Consider adding statement pieces to elevate your looks.',
    };
}
