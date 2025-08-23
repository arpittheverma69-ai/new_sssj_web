# J.V. Jewellers - Invoice Management System

A complete invoice management system built with Next.js 15, TypeScript, PostgreSQL, and Prisma for jewellery businesses.

## Features

✅ **Authentication System**
- Secure login/logout with NextAuth.js
- User profile management
- Password change functionality

✅ **Invoice Management**
- Create, edit, view, and delete invoices
- PDF generation and download
- Flag system for important invoices
- Search and filter functionality

✅ **Customer Management**
- Complete CRUD operations for customers
- Customer flagging system
- Invoice history tracking

✅ **Dashboard & Analytics**
- Interactive charts with Chart.js
- Sales overview and performance metrics
- Recent activity feed
- Quick action buttons

✅ **Modern UI/UX**
- Responsive design with Tailwind CSS
- Material-UI components
- Dark/light theme support
- Professional jewellery business styling

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (NeonDB recommended)
- npm or yarn package manager

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database - Replace with your NeonDB connection string
DATABASE_URL="postgresql://username:password@ep-example.us-east-1.aws.neon.tech/invoice_jewellers?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secure-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Application
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Push database schema
npm run db:push

# Seed database with initial data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## Default Login Credentials

After seeding the database, use these credentials to login:

- **Email**: `admin@jvjewellers.com`
- **Password**: `admin123`

⚠️ **Important**: Change the default password immediately after first login.

## Database Schema

The system includes the following main entities:

- **Users**: Authentication and user management
- **Customers**: Customer information and GSTIN details
- **Invoices**: Invoice data with line items and taxes
- **States**: Indian states for address management
- **BusinessProfile**: Company information
- **TaxRates**: HSN code-based tax configurations
- **InvoiceSettings**: System-wide invoice preferences

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
```

## Key Features Usage

### Creating Invoices
1. Navigate to "Create Invoice" from dashboard
2. Select customer or add new customer
3. Add line items with HSN codes
4. System automatically calculates taxes
5. Generate and download PDF

### Managing Customers
1. Go to "Customers" section
2. Add/edit customer information
3. Track invoice history per customer
4. Flag important customers

### Dashboard Analytics
- View sales trends with interactive charts
- Monitor key performance metrics
- Track recent activities
- Quick access to common actions

### User Management
1. Go to "System Profile"
2. Update personal information
3. Change login credentials
4. View account statistics

## Production Deployment

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

### Build and Deploy

```bash
npm run build
npm run start
```

## Customization

### Business Information
Update business details in the database `BusinessProfile` table or through the admin interface.

### Tax Rates
Modify GST rates in the `TaxRate` table based on current regulations.

### Invoice Templates
Customize PDF generation in `utils/pdfGenerator.ts`.

### Styling
Modify Tailwind CSS classes and theme in `app/globals.css` and components.

## Support

For technical support or customization requests, refer to the codebase documentation or contact the development team.

## Security Notes

- Always use HTTPS in production
- Regularly update dependencies
- Use strong passwords and secrets
- Backup database regularly
- Monitor user access logs

---

**J.V. Jewellers Invoice Management System** - Professional, Secure, and Feature-Rich
