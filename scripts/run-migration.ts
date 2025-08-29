import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMigration() {
    console.log("🚀 Starting Prisma migration for soft delete...\n");

    try {
        // Step 1: Generate migration
        console.log("1️⃣ Generating migration...");
        const { stdout: migrateOutput, stderr: migrateError } = await execAsync(
            'npx prisma migrate dev --name add_soft_delete',
            { cwd: process.cwd() }
        );

        if (migrateError) {
            console.error("Migration stderr:", migrateError);
        }
        console.log("Migration output:", migrateOutput);
        console.log("✅ Migration generated successfully\n");

        // Step 2: Generate Prisma client
        console.log("2️⃣ Generating Prisma client...");
        const { stdout: generateOutput, stderr: generateError } = await execAsync(
            'npx prisma generate',
            { cwd: process.cwd() }
        );

        if (generateError) {
            console.error("Generate stderr:", generateError);
        }
        console.log("Generate output:", generateOutput);
        console.log("✅ Prisma client generated successfully\n");

        console.log("🎉 Migration completed successfully!");
        console.log("📝 Next steps:");
        console.log("   - Test the soft delete functionality");
        console.log("   - Run: npx ts-node scripts/test-soft-delete.ts");

    } catch (error) {
        console.error("❌ Migration failed:", error);
        console.log("\n🔧 Troubleshooting:");
        console.log("   - Ensure your database is accessible");
        console.log("   - Check your DATABASE_URL in .env file");
        console.log("   - You may need to run 'npx prisma migrate reset' if there are conflicts");
        throw error;
    }
}

// Run migration if this script is executed directly
if (require.main === module) {
    runMigration()
        .then(() => {
            console.log("✅ Migration script completed successfully");
            process.exit(0);
        })
        .catch((error) => {
            console.error("❌ Migration script failed:", error);
            process.exit(1);
        });
}

export { runMigration };
