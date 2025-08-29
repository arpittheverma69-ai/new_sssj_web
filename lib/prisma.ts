import { PrismaClient } from './generated/prisma';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const basePrisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma;

// Soft delete implementation using Prisma Client Extensions
const prisma = basePrisma.$extends({
    name: 'soft-delete',
    query: {
        // Apply to all models
        $allModels: {
            // Override delete to perform soft delete
            async delete({ args, model }: { args: any; model: string }) {
                // Use the base prisma client to perform update instead of delete
                return (basePrisma as any)[model].update({
                    where: args.where,
                    data: {
                        deletedAt: new Date(),
                    },
                });
            },

            // Override deleteMany to perform soft delete
            async deleteMany({ args, model }: { args: any; model: string }) {
                // Use the base prisma client to perform updateMany instead of deleteMany
                return (basePrisma as any)[model].updateMany({
                    where: args.where,
                    data: {
                        deletedAt: new Date(),
                    },
                });
            },

            // Override findMany to exclude soft deleted
            async findMany({ args, query, model }: { args: any; query: any; model: string }) {
                // Only apply soft delete filter to models that have deletedAt field
                const modelsWithSoftDelete = ['BusinessProfile', 'Customer', 'Invoice', 'LineItem', 'LineItemTax', 'TaxRate', 'User'];
                
                if (!modelsWithSoftDelete.includes(model)) {
                    return query(args);
                }
                
                // If deletedAt is explicitly specified in the query, respect it
                if (args.where?.deletedAt !== undefined) {
                    return query(args);
                }
                
                // Otherwise, exclude soft deleted records
                return query({
                    ...args,
                    where: {
                        ...args.where,
                        deletedAt: null,
                    },
                });
            },

            // Override findFirst to exclude soft deleted
            async findFirst({ args, query, model }: { args: any; query: any; model: string }) {
                // Only apply soft delete filter to models that have deletedAt field
                const modelsWithSoftDelete = ['BusinessProfile', 'Customer', 'Invoice', 'LineItem', 'LineItemTax', 'TaxRate', 'User'];
                
                if (!modelsWithSoftDelete.includes(model)) {
                    return query(args);
                }
                
                // If deletedAt is explicitly specified in the query, respect it
                if (args.where?.deletedAt !== undefined) {
                    return query(args);
                }
                
                // Otherwise, exclude soft deleted records
                return query({
                    ...args,
                    where: {
                        ...args.where,
                        deletedAt: null,
                    },
                });
            },

            // Override findUnique to exclude soft deleted
            async findUnique({ args, query, model }: { args: any; query: any; model: string }) {
                // Only apply soft delete filter to models that have deletedAt field
                const modelsWithSoftDelete = ['BusinessProfile', 'Customer', 'Invoice', 'LineItem', 'LineItemTax', 'TaxRate', 'User'];
                
                if (!modelsWithSoftDelete.includes(model)) {
                    return query(args);
                }
                
                // If deletedAt is explicitly specified in the query, respect it
                if (args.where?.deletedAt !== undefined) {
                    return query(args);
                }
                
                // Otherwise, exclude soft deleted records
                return query({
                    ...args,
                    where: {
                        ...args.where,
                        deletedAt: null,
                    },
                });
            },

            // Override count to exclude soft deleted
            async count({ args, query, model }: { args: any; query: any; model: string }) {
                // Only apply soft delete filter to models that have deletedAt field
                const modelsWithSoftDelete = ['BusinessProfile', 'Customer', 'Invoice', 'LineItem', 'LineItemTax', 'TaxRate', 'User'];
                
                if (!modelsWithSoftDelete.includes(model)) {
                    return query(args);
                }
                
                // If deletedAt is explicitly specified in the query, respect it
                if (args.where?.deletedAt !== undefined) {
                    return query(args);
                }
                
                // Otherwise, exclude soft deleted records
                return query({
                    ...args,
                    where: {
                        ...args.where,
                        deletedAt: null,
                    },
                });
            },
        },
    },
});

export default prisma;