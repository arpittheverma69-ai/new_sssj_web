# Invoice Management System for Jewellers

A comprehensive invoice management system built with Next.js, designed specifically for jewellery businesses. This application provides a complete solution for creating, managing, and generating professional invoices with advanced features like HSN/SAC code management, customer management, and user administration.

## 🚀 Features

### Invoice Management

- **Create Professional Invoices**: Multi-step invoice creation with detailed line items
- **HSN/SAC Code Integration**: Dynamic HSN/SAC code management with auto-populated descriptions
- **Per-Item Roundoff**: Granular control over taxable values with per-item roundoff adjustments
- **Tax Calculations**: Automatic CGST/SGST/IGST calculations based on taxable values
- **PDF Generation**: Generate customizable PDF invoices with selective copy types (Original, Duplicate, Triplicate)
- **Float Precision**: Support for quantities with 3 decimal places for accurate calculations

### Customer Management

- **Customer Database**: Comprehensive customer information management
- **Customer Profiles**: Store and manage customer details for quick invoice creation
- **Customer History**: Track invoice history per customer

### Tax & Compliance

- **Tax Rate Management**: Simplified HSN/SAC code and description management
- **Compliance Ready**: GST-compliant invoice generation
- **Soft Delete**: Safe data management with soft delete functionality

### User Management & Security

- **Role-Based Access**: Admin and User roles with appropriate permissions
- **User Administration**: Admin-only user management through settings panel
- **Secure Authentication**: Session-based authentication with NextAuth.js
- **Password Security**: Bcrypt password hashing and validation

### Dashboard & Analytics

- **Invoice Dashboard**: Overview of all invoices with filtering and search
- **Analytics**: Business insights and reporting capabilities
- **Settings Management**: Comprehensive settings for business configuration

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Material-UI (MUI)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **PDF Generation**: jsPDF with AutoTable
- **Icons**: Lucide React, Tabler Icons, React Icons
- **Forms**: React Hook Form with Zod validation
- **Charts**: Chart.js with React Chart.js 2
- **Animations**: Lottie React, Motion

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd invoice_jewellers
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/invoice_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Add other environment variables as needed
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed initial data (optional)
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
invoice_jewellers/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── admin/         # Admin-only endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   └── customer/      # Customer management
│   ├── dashboard/         # Dashboard pages
│   └── signup/            # User registration (disabled)
├── components/            # Reusable React components
│   ├── create-invoice/    # Invoice creation components
│   ├── customers/         # Customer management components
│   └── forms/             # Form components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and configurations
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── docs/                 # Documentation
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

## 📖 Key Features Documentation

### Invoice Creation Flow

1. **Invoice Details**: Basic invoice information and customer selection
2. **Line Items**: Add products with HSN/SAC codes, quantities, rates, and per-item roundoff
3. **Review & Generate**: Review totals and generate PDF with selected copy types

### HSN/SAC Management

- Manage HSN/SAC codes through Settings → Tax Rates
- Codes are dynamically loaded in invoice creation
- Auto-populate descriptions when codes are selected

### User Management (Admin Only)

- Access through Settings → User Management
- Create, edit, and delete user accounts
- Assign roles (Admin/User)
- Secure password management

### PDF Generation Options

- **Original for Recipient**: Customer copy
- **Duplicate for Transporter**: Transport copy
- **Triplicate for Supplier**: Supplier copy
- Select multiple copies as needed

## 🔒 Security Features

- Role-based access control
- Secure password hashing with bcrypt
- Session-based authentication
- Admin-only user management
- Input validation with Zod schemas
- SQL injection protection with Prisma

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please contact the system administrator or create an issue in the repository.

---

Built with ❤️ for jewellery businesses
