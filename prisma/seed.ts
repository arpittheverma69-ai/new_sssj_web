import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // console.log('🌱 Starting database seeding...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@jvjewellers.com' },
    update: {},
    create: {
      email: 'admin@jvjewellers.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // console.log('✅ Admin user created:', adminUser.email);

  // Create Indian states
  const states = [
    { state_name: 'Andhra Pradesh', state_code: 'AP', state_numeric_code: 28 },
    { state_name: 'Arunachal Pradesh', state_code: 'AR', state_numeric_code: 12 },
    { state_name: 'Assam', state_code: 'AS', state_numeric_code: 18 },
    { state_name: 'Bihar', state_code: 'BR', state_numeric_code: 10 },
    { state_name: 'Chhattisgarh', state_code: 'CG', state_numeric_code: 22 },
    { state_name: 'Goa', state_code: 'GA', state_numeric_code: 30 },
    { state_name: 'Gujarat', state_code: 'GJ', state_numeric_code: 24 },
    { state_name: 'Haryana', state_code: 'HR', state_numeric_code: 6 },
    { state_name: 'Himachal Pradesh', state_code: 'HP', state_numeric_code: 2 },
    { state_name: 'Jharkhand', state_code: 'JH', state_numeric_code: 20 },
    { state_name: 'Karnataka', state_code: 'KA', state_numeric_code: 29 },
    { state_name: 'Kerala', state_code: 'KL', state_numeric_code: 32 },
    { state_name: 'Madhya Pradesh', state_code: 'MP', state_numeric_code: 23 },
    { state_name: 'Maharashtra', state_code: 'MH', state_numeric_code: 27 },
    { state_name: 'Manipur', state_code: 'MN', state_numeric_code: 14 },
    { state_name: 'Meghalaya', state_code: 'ML', state_numeric_code: 17 },
    { state_name: 'Mizoram', state_code: 'MZ', state_numeric_code: 15 },
    { state_name: 'Nagaland', state_code: 'NL', state_numeric_code: 13 },
    { state_name: 'Odisha', state_code: 'OD', state_numeric_code: 21 },
    { state_name: 'Punjab', state_code: 'PB', state_numeric_code: 3 },
    { state_name: 'Rajasthan', state_code: 'RJ', state_numeric_code: 8 },
    { state_name: 'Sikkim', state_code: 'SK', state_numeric_code: 11 },
    { state_name: 'Tamil Nadu', state_code: 'TN', state_numeric_code: 33 },
    { state_name: 'Telangana', state_code: 'TS', state_numeric_code: 36 },
    { state_name: 'Tripura', state_code: 'TR', state_numeric_code: 16 },
    { state_name: 'Uttar Pradesh', state_code: 'UP', state_numeric_code: 9 },
    { state_name: 'Uttarakhand', state_code: 'UK', state_numeric_code: 5 },
    { state_name: 'West Bengal', state_code: 'WB', state_numeric_code: 19 },
    { state_name: 'Delhi', state_code: 'DL', state_numeric_code: 7 },
  ];

  for (const state of states) {
    await prisma.states.upsert({
      where: { state_numeric_code: state.state_numeric_code },
      update: {},
      create: state,
    });
  }

  // console.log('✅ States created');

  // Create business profile
  const businessProfile = await prisma.businessProfile.upsert({
    where: { gstin: '27ABCDE1234F1Z5' },
    update: {},
    create: {
      business_name: 'J.V. Jewellers',
      gstin: '27ABCDE1234F1Z5',
      address: '123 Jewellery Street, Commercial Area',
      city: 'Mumbai',
      state_id: 27, // Maharashtra
      vat_tin: 'VAT123456789',
      pan_number: 'ABCDE1234F',
      bank_name: 'State Bank of India',
      account_number: '1234567890123456',
      branch_ifsc: 'SBIN0001234',
    },
  });

  // console.log('✅ Business profile created');

  // Create sample customers
  const customers = [
    {
      name: 'Rajesh Kumar',
      address: '456 Market Street, Business District',
      city: 'Mumbai',
      state_id: 27,
      pan_number: 'BCDEF2345G',
      pincode: '400001',
      gstin: '27BCDEF2345G1Z6',
      phone: '+91-9876543210',
      email: 'rajesh.kumar@email.com',
    },
    {
      name: 'Priya Sharma',
      address: '789 Residential Colony, Suburb',
      city: 'Delhi',
      state_id: 7,
      pan_number: 'CDEFG3456H',
      pincode: '110001',
      gstin: '07CDEFG3456H1Z7',
      phone: '+91-9876543211',
      email: 'priya.sharma@email.com',
    },
    {
      name: 'Amit Patel',
      address: '321 Trade Center, Commercial Hub',
      city: 'Ahmedabad',
      state_id: 24,
      pan_number: 'DEFGH4567I',
      pincode: '380001',
      gstin: '24DEFGH4567I1Z8',
      phone: '+91-9876543212',
      email: 'amit.patel@email.com',
    },
  ];

  for (const customer of customers) {
    await prisma.customer.create({
      data: customer,
    });
  }

  // console.log('✅ Sample customers created');

  // Create tax rates
  const taxRates = [
    {
      hsn_code: '7113',
      description: 'Gold Jewellery',
      cgst_rate: 1.5,
      sgst_rate: 1.5,
      igst_rate: 3.0,
      is_default: true,
    },
    {
      hsn_code: '7114',
      description: 'Silver Jewellery',
      cgst_rate: 1.5,
      sgst_rate: 1.5,
      igst_rate: 3.0,
      is_default: false,
    },
    {
      hsn_code: '7116',
      description: 'Precious Stone Jewellery',
      cgst_rate: 1.5,
      sgst_rate: 1.5,
      igst_rate: 3.0,
      is_default: false,
    },
  ];

  for (const taxRate of taxRates) {
    await prisma.taxRate.upsert({
      where: { hsn_code: taxRate.hsn_code },
      update: {},
      create: taxRate,
    });
  }

  // console.log('✅ Tax rates created');

  // Create invoice settings
  const invoiceSettings = await prisma.invoiceSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      invoice_prefix: 'JVJ/D/',
      default_transaction_type: 'retail',
      number_digits: 3,
      default_input_mode: 'component',
      starting_number: 1,
      generate_original: true,
      generate_duplicate: true,
      generate_triplicate: true,
    },
  });

  // console.log('✅ Invoice settings created');

  // console.log('🎉 Database seeding completed successfully!');
  // console.log('\n📋 Default Login Credentials:');
  // console.log('Email: admin@jvjewellers.com');
  // console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
