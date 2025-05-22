import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Charger les options depuis la base de données
    const options = await prisma.option.findMany();
    return NextResponse.json(options);
  } catch (error) {
    console.error('Erreur lors du chargement des options:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des options' }, { status: 500 });
  }
}