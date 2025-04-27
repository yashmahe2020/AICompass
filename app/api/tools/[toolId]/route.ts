import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/firebase-db';

export async function GET(
  request: Request,
  { params }: { params: { toolId: string } }
) {
  try {
    const product = await getProduct(params.toolId);
    if (!product) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching tool:', error);
    return NextResponse.json({ error: 'Failed to fetch tool' }, { status: 500 });
  }
} 