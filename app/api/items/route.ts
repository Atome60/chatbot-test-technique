import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'items.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Convertir le contenu CSV en JSON
  const items = fileContent
    .split('\n')
    .slice(1) // Ignorer l'en-tête
    .filter(line => line.trim() !== '')
    .map((line, index) => {
      const [name, category] = line.split(',');
      return { id: `item-${index}`, name, category }; // Ajouter un champ id unique
    });

  return NextResponse.json(items);
}