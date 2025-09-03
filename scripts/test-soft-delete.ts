import prisma from "@/lib/prisma";
import { softDeleteUtils } from "@/lib/softDelete";

async function testSoftDelete() {
    // console.log("🧪 Starting Soft Delete Tests...\n");

    try {
        // Test 1: Create a test customer
        // console.log("1️⃣ Creating test customer...");
        const testCustomer = await prisma.customer.create({
            data: {
                name: "Test Customer for Soft Delete",
                address: "123 Test Street",
                city: "Test City",
                phone: "1234567890",
                email: "test@example.com",
            },
        });
        // console.log(`✅ Created customer with ID: ${testCustomer.id}\n`);

        // Test 2: Verify customer appears in normal queries
        // console.log("2️⃣ Verifying customer appears in normal queries...");
        const foundCustomer = await prisma.customer.findUnique({
            where: { id: testCustomer.id },
        });
        // console.log(`✅ Customer found: ${foundCustomer ? 'Yes' : 'No'}\n`);

        // Test 3: Soft delete the customer
        // console.log("3️⃣ Soft deleting customer...");
        await prisma.customer.delete({
            where: { id: testCustomer.id },
        });
        // console.log("✅ Customer soft deleted\n");

        // Test 4: Verify customer doesn't appear in normal queries
        // console.log("4️⃣ Verifying customer doesn't appear in normal queries...");
        const notFoundCustomer = await prisma.customer.findUnique({
            where: { id: testCustomer.id },
        });
        // console.log(`✅ Customer found after soft delete: ${notFoundCustomer ? 'Yes' : 'No'}\n`);

        // Test 5: Verify customer appears in deleted records query
        // console.log("5️⃣ Verifying customer appears in deleted records...");
        const deletedCustomers = await softDeleteUtils.findDeleted(prisma.customer, {
            where: { id: testCustomer.id },
        });
        // console.log(`✅ Customer found in deleted records: ${deletedCustomers.length > 0 ? 'Yes' : 'No'}\n`);

        // Test 6: Restore the customer
        // console.log("6️⃣ Restoring customer...");
        const restoredCustomer = await softDeleteUtils.restore(prisma.customer, {
            id: testCustomer.id,
        });
        // console.log(`✅ Customer restored with ID: ${restoredCustomer.id}\n`);

        // Test 7: Verify customer appears in normal queries again
        // console.log("7️⃣ Verifying customer appears in normal queries after restore...");
        const restoredFoundCustomer = await prisma.customer.findUnique({
            where: { id: testCustomer.id },
        });
        // console.log(`✅ Customer found after restore: ${restoredFoundCustomer ? 'Yes' : 'No'}\n`);

        // Test 8: Test with invoice and related records
        // console.log("8️⃣ Testing with invoice and related records...");
        const testInvoice = await prisma.invoice.create({
            data: {
                invoice_number: "TEST-SOFT-001",
                invoice_date: new Date(),
                transaction_type: "retail",
                input_mode: "component",
                buyer_id: testCustomer.id,
                buyer_name: testCustomer.name,
                buyer_address: testCustomer.address,
                tax_type: "CGST+SGST",
                total_invoice_value: 1000.00,
                line_items: {
                    create: [
                        {
                            hsn_sac_code: "1234",
                            description: "Test Item",
                            quantity: 1,
                            unit: "PCS",
                            rate: 900.00,
                            taxable_value: 900.00,
                            taxes: {
                                create: [
                                    {
                                        tax_name: "CGST",
                                        tax_rate: 9.00,
                                        tax_amount: 81.00,
                                    },
                                    {
                                        tax_name: "SGST",
                                        tax_rate: 9.00,
                                        tax_amount: 81.00,
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            include: {
                line_items: {
                    include: {
                        taxes: true,
                    },
                },
            },
        });
        // console.log(`✅ Created test invoice with ID: ${testInvoice.id}\n`);

        // Test 9: Soft delete invoice (should cascade to line items and taxes)
        // console.log("9️⃣ Soft deleting invoice and related records...");
        await prisma.invoice.delete({
            where: { id: testInvoice.id },
        });
        // console.log("✅ Invoice soft deleted\n");

        // Test 10: Verify invoice and related records are soft deleted
        // console.log("🔟 Verifying invoice and related records are soft deleted...");
        const deletedInvoice = await prisma.invoice.findUnique({
            where: { id: testInvoice.id },
        });
        const deletedLineItems = await prisma.lineItem.findMany({
            where: { invoice_id: testInvoice.id },
        });
        // console.log(`✅ Invoice found after delete: ${deletedInvoice ? 'Yes' : 'No'}`);
        // console.log(`✅ Line items found after delete: ${deletedLineItems.length}\n`);

        // Test 11: Clean up - hard delete test records
        // console.log("🧹 Cleaning up test records...");
        await softDeleteUtils.hardDelete(prisma.customer, { id: testCustomer.id });
        // console.log("✅ Test records cleaned up\n");

        // console.log("🎉 All soft delete tests completed successfully!");

    } catch (error) {
        console.error("❌ Test failed:", error);
        throw error;
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    testSoftDelete()
        .then(() => {
            // console.log("✅ Tests completed successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("❌ Tests failed:", error);
            process.exit(1);
        });
}

export { testSoftDelete };
