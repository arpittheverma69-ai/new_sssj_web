-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('retail', 'inter_state', 'purchase');

-- CreateEnum
CREATE TYPE "public"."InputMode" AS ENUM ('component', 'direct', 'reverse');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE "public"."BusinessProfile" (
    "id" SERIAL NOT NULL,
    "business_name" VARCHAR(255) NOT NULL,
    "gstin" VARCHAR(15) NOT NULL,
    "address" TEXT NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "vat_tin" VARCHAR(20),
    "state_id" INTEGER,
    "pan_number" VARCHAR(10),
    "bank_name" VARCHAR(100),
    "account_number" VARCHAR(20),
    "branch_ifsc" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."States" (
    "id" SERIAL NOT NULL,
    "state_name" VARCHAR(50) NOT NULL,
    "state_code" VARCHAR(2) NOT NULL,
    "state_numeric_code" INTEGER NOT NULL,

    CONSTRAINT "States_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "pincode" VARCHAR(10),
    "gstin" VARCHAR(15),
    "phone" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state_id" INTEGER,
    "pan_number" VARCHAR(10),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "id" SERIAL NOT NULL,
    "invoice_number" VARCHAR(50) NOT NULL,
    "invoice_date" TIMESTAMP(3) NOT NULL,
    "transaction_type" VARCHAR(20) NOT NULL,
    "input_mode" VARCHAR(20) NOT NULL,
    "eway_bill" VARCHAR(50),
    "buyer_id" INTEGER,
    "buyer_name" VARCHAR(255) NOT NULL,
    "buyer_address" TEXT NOT NULL,
    "buyer_gstin" VARCHAR(15),
    "buyer_state_code" INTEGER,
    "tax_type" VARCHAR(20) NOT NULL,
    "total_invoice_value" DECIMAL(12,3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "roundoff" DECIMAL(12,3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LineItem" (
    "id" SERIAL NOT NULL,
    "invoice_id" INTEGER NOT NULL,
    "hsn_sac_code" VARCHAR(10) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unit" VARCHAR(10) NOT NULL,
    "rate" DECIMAL(12,3) NOT NULL,
    "taxable_value" DECIMAL(12,3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roundoff" DECIMAL(12,3) NOT NULL DEFAULT 0.00,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LineItemTax" (
    "id" SERIAL NOT NULL,
    "line_item_id" INTEGER NOT NULL,
    "tax_name" VARCHAR(20) NOT NULL,
    "tax_rate" DECIMAL(5,3) NOT NULL,
    "tax_amount" DECIMAL(12,3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LineItemTax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvoiceSetting" (
    "id" SERIAL NOT NULL,
    "invoice_prefix" VARCHAR(20) NOT NULL DEFAULT 'JVJ/D/',
    "default_transaction_type" "public"."TransactionType" NOT NULL DEFAULT 'retail',
    "number_digits" INTEGER NOT NULL DEFAULT 3,
    "default_input_mode" "public"."InputMode" NOT NULL DEFAULT 'component',
    "starting_number" INTEGER NOT NULL DEFAULT 1,
    "generate_original" BOOLEAN NOT NULL DEFAULT true,
    "generate_duplicate" BOOLEAN NOT NULL DEFAULT true,
    "generate_triplicate" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prefix_inter_city" VARCHAR(20) NOT NULL DEFAULT 'JVJ/D/',
    "prefix_outer_state" VARCHAR(20) NOT NULL DEFAULT 'JVJ/S/',
    "prefix_retail" VARCHAR(20) NOT NULL DEFAULT 'JVJ/D/',

    CONSTRAINT "InvoiceSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaxRate" (
    "id" SERIAL NOT NULL,
    "hsn_code" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TaxRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'admin',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessProfile_gstin_key" ON "public"."BusinessProfile"("gstin");

-- CreateIndex
CREATE UNIQUE INDEX "States_state_numeric_code_key" ON "public"."States"("state_numeric_code");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_gstin_key" ON "public"."Customer"("gstin");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoice_number_key" ON "public"."Invoice"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."BusinessProfile" ADD CONSTRAINT "BusinessProfile_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."States"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."States"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LineItem" ADD CONSTRAINT "LineItem_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LineItemTax" ADD CONSTRAINT "LineItemTax_line_item_id_fkey" FOREIGN KEY ("line_item_id") REFERENCES "public"."LineItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
