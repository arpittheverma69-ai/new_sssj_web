import { PrismaClient, LineItem, LineItemTax, Invoice, Customer, User, TaxRate } from './generated/prisma';

// Create a raw Prisma client without extensions for hard deletes
const rawPrisma = new PrismaClient();

type ModelDelegate = {
  findMany: Function;
  findFirst: Function;
  findUnique: Function;
  update: Function;
  updateMany: Function;
  delete: Function;
  deleteMany: Function;
};

type WhereInput = {
  [key: string]: any;
};

type FindOptions = {
  where?: WhereInput;
  include?: any;
  select?: any;
  orderBy?: any;
  take?: number;
  skip?: number;
};

export const softDeleteUtils = {
  /**
   * Find only soft-deleted records
   */
  async findDeleted<T>(
    model: ModelDelegate,
    options: FindOptions = {}
  ): Promise<T[]> {
    const whereClause = {
      ...options.where,
      deletedAt: { not: null }
    };

    return await model.findMany({
      ...options,
      where: whereClause
    });
  },

  /**
   * Find all records including soft-deleted ones
   */
  async findWithDeleted<T>(
    model: ModelDelegate,
    options: FindOptions = {}
  ): Promise<T[]> {
    return await model.findMany(options);
  },

  /**
   * Restore a soft-deleted record
   */
  async restore<T = any>(
    model: ModelDelegate,
    where: WhereInput
  ): Promise<T> {
    return await model.update({
      where,
      data: {
        deletedAt: null
      }
    }) as T;
  },

  /**
   * Soft delete a record (set deletedAt timestamp)
   */
  async softDelete<T>(
    model: ModelDelegate,
    where: WhereInput
  ): Promise<T> {
    return await model.update({
      where,
      data: {
        deletedAt: new Date()
      }
    });
  },

  /**
   * Permanently delete a record from the database
   * Uses raw Prisma client to bypass soft delete middleware
   */
  async hardDelete(
    model: ModelDelegate,
    where: WhereInput
  ): Promise<void> {
    // Determine which raw model to use based on the extended model
    const modelName = (model as any)._name || (model as any).name;
    
    switch (modelName) {
      case 'Customer':
        await rawPrisma.customer.deleteMany({ where });
        break;
      case 'Invoice':
        await rawPrisma.invoice.deleteMany({ where });
        break;
      case 'User':
        await rawPrisma.user.deleteMany({ where });
        break;
      case 'TaxRate':
        await rawPrisma.taxRate.deleteMany({ where });
        break;
      case 'LineItem':
        await rawPrisma.lineItem.deleteMany({ where });
        break;
      case 'LineItemTax':
        await rawPrisma.lineItemTax.deleteMany({ where });
        break;
      default:
        throw new Error(`Hard delete not implemented for model: ${modelName}`);
    }
  },

  /**
   * Count soft-deleted records
   */
  async countDeleted(
    model: ModelDelegate,
    where: WhereInput = {}
  ): Promise<number> {
    const records = await this.findDeleted(model, { where });
    return records.length;
  },

  /**
   * Check if a record is soft-deleted
   */
  async isDeleted(
    model: ModelDelegate,
    where: WhereInput
  ): Promise<boolean> {
    const record = await model.findFirst({
      where: {
        ...where,
        deletedAt: { not: null }
      }
    });
    return !!record;
  }
};