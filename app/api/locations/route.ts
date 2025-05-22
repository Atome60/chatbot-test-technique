import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'locations.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Convertir le contenu CSV en JSON
  const locations = fileContent
    .split('\n')
    .slice(1) // Ignorer l'en-tête
    .filter(line => line.trim() !== '')
    .map((line, index) => {
      const [name, type] = line.split(',');
      return { id: `location-${index}`, name, type }; // Ajouter un champ id unique
    });

  return NextResponse.json(locations);
}