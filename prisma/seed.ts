import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  // Importer les options
  const optionsPath = path.join(__dirname, '../data/options.csv');
  const optionsData = fs.readFileSync(optionsPath, 'utf-8')
    .split('\n')
    .slice(1) // Ignorer l'en-tête
    .filter(line => line.trim() !== '')
    .map(line => {
      const [id, name, description] = line.split(',');
      return { id, name, description };
    });

  await prisma.option.createMany({ data: optionsData });

  // Importer les lieux
  const locationsPath = path.join(__dirname, '../data/locations.csv');
  const locationsData = fs.readFileSync(locationsPath, 'utf-8')
    .split('\n')
    .slice(1) // Ignorer l'en-tête
    .filter(line => line.trim() !== '')
    .map(line => {
      const [id, name, type] = line.split(',');
      return { id, name, type };
    });

  await prisma.location.createMany({ data: locationsData });

  // Importer les items
  const itemsPath = path.join(__dirname, '../data/items.csv');
  const itemsData = fs.readFileSync(itemsPath, 'utf-8')
    .split('\n')
    .slice(1) // Ignorer l'en-tête
    .filter(line => line.trim() !== '')
    .map(line => {
      const [id, name, category] = line.split(',');
      return { id, name, category };
    });

  await prisma.item.createMany({ data: itemsData });

  console.log('Données importées avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });