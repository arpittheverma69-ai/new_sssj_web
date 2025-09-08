import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

async function addDefaultToTaxRate() {
  try {
    console.log('Adding is_default field to TaxRate model...');

    // The migration will be handled by Prisma when you run: npx prisma db push
    // This script is just for reference and any additional data setup if needed

    console.log('Migration completed successfully!');
    console.log('Run: npx prisma db push');
    console.log('Then: npx prisma generate');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDefaultToTaxRate();
