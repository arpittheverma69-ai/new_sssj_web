# Soft Delete Implementation Guide

This guide explains the soft delete mechanism implemented in your Next.js application with Prisma ORM.

## Overview

Soft delete allows you to mark records as deleted without permanently removing them from the database. This provides data recovery options and maintains referential integrity.

## Implementation Details

### 1. Schema Changes

Added `deletedAt DateTime?` field to the following models:
- `BusinessProfile`
- `Customer`
- `Invoice`
- `LineItem`
- `LineItemTax`
- `TaxRate`
- `User`

### 2. Middleware

The `softDeleteMiddleware` automatically:
- Excludes soft-deleted records from `findUnique`, `findFirst`, `findMany`, and `count` operations
- Converts `delete` and `deleteMany` operations to `update` operations that set `deletedAt`
- Maintains existing `where` conditions while adding `deletedAt: null` filter

### 3. Utility Functions

The `softDeleteUtils` provides:
- `softDelete()` - Mark a record as deleted
- `restore()` - Restore a soft-deleted record
- `findDeleted()` - Find only deleted records
- `findWithDeleted()` - Find all records including deleted ones
- `hardDelete()` - Permanently delete a record

## Usage Examples

### Basic Operations

```typescript
import prisma from "@/lib/prisma";
import { softDeleteUtils } from "@/lib/softDelete";

// Normal queries automatically exclude deleted records
const activeCustomers = await prisma.customer.findMany();

// Soft delete a customer
await prisma.customer.delete({ where: { id: 1 } });

// Find deleted customers
const deletedCustomers = await softDeleteUtils.findDeleted(prisma.customer);

// Restore a customer
await softDeleteUtils.restore(prisma.customer, { id: 1 });

// Hard delete (permanent)
await softDeleteUtils.hardDelete(prisma.customer, { id: 1 });
```

### API Endpoints

#### Existing Endpoints
- `DELETE /api/customers/[id]` - Soft deletes customer
- `DELETE /api/invoices/[id]` - Soft deletes invoice and related records

#### New Endpoints
- `POST /api/customers/[id]/restore` - Restore deleted customer
- `POST /api/invoices/[id]/restore` - Restore deleted invoice
- `GET /api/admin/deleted-records?model=customer` - List deleted records
- `DELETE /api/admin/hard-delete?model=customer&id=1` - Permanently delete

## Migration Instructions

### 1. Run Migration
```bash
# When database is accessible, run:
npx prisma migrate dev --name add_soft_delete
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Test Implementation
```bash
# Run the test script
npx ts-node scripts/test-soft-delete.ts
```

## Important Considerations

### Data Integrity
- Soft deleted records maintain foreign key relationships
- Child records are automatically soft deleted when parent is deleted
- Restore operations should restore related records as well

### Performance
- Queries automatically filter out deleted records
- Consider adding database indexes on `deletedAt` columns for better performance
- Use `findWithDeleted()` sparingly as it bypasses the automatic filtering

### Security
- Hard delete operations should be restricted to admin users
- Consider implementing audit logs for delete/restore operations
- Validate permissions before allowing restore operations

## Best Practices

1. **Always use the middleware**: Don't bypass it unless absolutely necessary
2. **Handle cascading deletes**: When deleting parent records, ensure child records are also soft deleted
3. **Provide restore functionality**: Give users the ability to recover accidentally deleted data
4. **Monitor deleted data**: Regularly review and clean up old soft-deleted records
5. **Test thoroughly**: Ensure all queries work correctly with the soft delete filtering

## Troubleshooting

### Common Issues

1. **Records not appearing**: Check if they've been soft deleted
2. **Foreign key errors**: Ensure related records are also soft deleted
3. **Performance issues**: Add indexes on `deletedAt` columns
4. **Middleware not working**: Verify it's properly registered in `lib/prisma.ts`

### Debugging

```typescript
// To see all records including deleted ones
const allRecords = await softDeleteUtils.findWithDeleted(prisma.customer);

// To see only deleted records
const deletedOnly = await softDeleteUtils.findDeleted(prisma.customer);
```

## Testing

The implementation includes comprehensive tests in `scripts/test-soft-delete.ts` that verify:
- Records are created successfully
- Soft delete hides records from normal queries
- Deleted records appear in deleted-only queries
- Restore functionality works correctly
- Related records are handled properly
