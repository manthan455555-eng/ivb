import { NextRequest, NextResponse } from 'next/server';
import { products, getProductById, searchProducts, getRecommendedProducts } from '@/data/products';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const id = searchParams.get('id');
    const recommended = searchParams.get('recommended');

    if (id) {
        const product = getProductById(id);
        return product
            ? NextResponse.json({ product })
            : NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (recommended === 'true') {
        return NextResponse.json({ products: getRecommendedProducts() });
    }

    let result = query ? searchProducts(query) : [...products];
    if (category && category !== 'All') {
        result = result.filter(p => p.category === category);
    }

    return NextResponse.json({ products: result });
}
