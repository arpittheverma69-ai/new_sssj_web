import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addIsDefaultColumn() {
  try {
    console.log('Adding is_default column to TaxRate table...');
    
    // Add the is_default column with default value false
    await prisma.$executeRaw`
      ALTER TABLE "TaxRate" 
      ADD COLUMN IF NOT EXISTS "is_default" BOOLEAN DEFAULT false;
    `;
    
    console.log('Successfully added is_default column to TaxRate table');
    
    // Optional: Set the first tax rate as default if no default exists
    const existingDefault = await prisma.taxRate.findFirst({
      where: { is_default: true }
    });
    
    if (!existingDefault) {
      const firstTaxRate = await prisma.taxRate.findFirst({
        where: { deletedAt: null }
      });
      
      if (firstTaxRate) {
        await prisma.taxRate.update({
          where: { id: firstTaxRate.id },
          data: { is_default: true }
        });
        console.log(`Set tax rate ID ${firstTaxRate.id} as default`);
      }
    }
    
  } catch (error) {
    console.error('Error adding is_default column:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
addIsDefaultColumn()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
