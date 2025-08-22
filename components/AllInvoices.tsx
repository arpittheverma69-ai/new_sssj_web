"use client"
import React, { useState } from 'react'
import { Plus, Search, Download, Eye, Edit, Flag, DollarSign, FileText, Package } from 'lucide-react'

// Mock invoice data - replace with actual data from your database
const mockInvoices = [
    {
        id: 'INV-001',
        customerName: 'John Doe',
        customerEmail: 'john.doe@email.com',
        customerPhone: '+91 98765 43210',
        customerAddress: '123 Main Street, New Delhi, Delhi 110001',
        invoiceDate: '2024-01-15',
        dueDate: '2024-02-15',
        amount: 25000,
        taxAmount: 4500,
        totalAmount: 29500,
        status: 'paid',
        paymentMethod: 'Online Transfer',
        items: 5,
        category: 'jewellery',
        isFlagged: false,
        notes: 'Gold necklace and earrings set'
    },
    {
        id: 'INV-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@email.com',
        customerPhone: '+91 87654 32109',
        address: '456 Park Avenue, Mumbai, Maharashtra 400001',
        invoiceDate: '2024-01-10',
        dueDate: '2024-02-10',
        amount: 18000,
        taxAmount: 3240,
        totalAmount: 21240,
        status: 'pending',
        paymentMethod: 'Pending',
        items: 3,
        category: 'silver',
        isFlagged: true,
        notes: 'Silver bangles and rings'
    },
    {
        id: 'INV-003',
        customerName: 'Rajesh Kumar',
        customerEmail: 'rajesh.kumar@email.com',
        customerPhone: '+91 76543 21098',
        address: '789 Lake Road, Bangalore, Karnataka 560001',
        invoiceDate: '2024-01-12',
        dueDate: '2024-02-12',
        amount: 45000,
        taxAmount: 8100,
        totalAmount: 53100,
        status: 'overdue',
        paymentMethod: 'Pending',
        items: 8,
        category: 'diamond',
        isFlagged: false,
        notes: 'Diamond necklace and bracelet set'
    },
    {
        id: 'INV-004',
        customerName: 'Priya Sharma',
        customerEmail: 'priya.sharma@email.com',
        customerPhone: '+91 65432 10987',
        address: '321 Garden Street, Chennai, Tamil Nadu 600001',
        invoiceDate: '2024-01-08',
        dueDate: '2024-02-08',
        amount: 32000,
        taxAmount: 5760,
        totalAmount: 37760,
        status: 'paid',
        paymentMethod: 'Cash',
        items: 6,
        category: 'traditional',
        isFlagged: false,
        notes: 'Traditional gold ornaments'
    },
    {
        id: 'INV-005',
        customerName: 'Amit Patel',
        customerEmail: 'amit.patel@email.com',
        customerPhone: '+91 54321 09876',
        address: '654 River View, Ahmedabad, Gujarat 380001',
        invoiceDate: '2024-01-14',
        dueDate: '2024-02-14',
        amount: 28000,
        taxAmount: 5040,
        totalAmount: 33040,
        status: 'pending',
        paymentMethod: 'Pending',
        items: 4,
        category: 'platinum',
        isFlagged: true,
        notes: 'Platinum wedding ring set'
    },
    {
        id: 'INV-006',
        customerName: 'Sneha Reddy',
        customerEmail: 'sneha.reddy@email.com',
        customerPhone: '+91 43210 98765',
        address: '987 Hill Street, Hyderabad, Telangana 500001',
        invoiceDate: '2024-01-05',
        dueDate: '2024-02-05',
        amount: 15000,
        taxAmount: 2700,
        totalAmount: 17700,
        status: 'paid',
        paymentMethod: 'Credit Card',
        items: 2,
        category: 'jewellery',
        isFlagged: false,
        notes: 'Gold chain and pendant'
    }
];

// Invoice status and category configurations
const invoiceCategories = ['all', 'jewellery', 'silver', 'diamond', 'traditional', 'platinum', 'gold'];

const AllInvoices = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDateRange, setSelectedDateRange] = useState('all');
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'customer'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [flaggedOnly, setFlaggedOnly] = useState(false);

    // Filter and search invoices
    const filteredInvoices = mockInvoices
        .filter(invoice => {
            const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === 'all' || invoice.category === selectedCategory;
            const matchesFlagged = !flaggedOnly || invoice.isFlagged;
            
            return matchesSearch && matchesCategory && matchesFlagged;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;
            
            switch (sortBy) {
                case 'date':
                    aValue = new Date(a.invoiceDate).getTime();
                    bValue = new Date(b.invoiceDate).getTime();
                    break;
                case 'amount':
                    aValue = a.totalAmount;
                    bValue = b.totalAmount;
                    break;
                case 'customer':
                    aValue = a.customerName.toLowerCase();
                    bValue = b.customerName.toLowerCase();
                    break;
                default:
                    aValue = a.invoiceDate;
                    bValue = b.invoiceDate;
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    // Calculate statistics
    const totalInvoices = mockInvoices.length;
    const totalRevenue = mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const flaggedInvoices = mockInvoices.filter(inv => inv.isFlagged).length;

    // Format currency in Indian Rupees
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Toggle flag status
    const toggleFlag = (invoiceId: string) => {
        // In a real app, this would update the database
        console.log(`Toggling flag for invoice: ${invoiceId}`);
    };

    return (
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {/* Header */}
            <header className="flex flex-col gap-4 mb-6 md:mb-8">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">All Invoices</h2>
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground">View, filter, and manage your invoices</p>
                </div>

                <div className="flex justify-center md:justify-end">
                    <button 
                        id="createInvoiceBtn" 
                        className="w-full md:w-auto bg-primary text-primary-foreground px-4 md:px-6 py-3 rounded-[20px] hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                    >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm md:text-base">Create New Invoice</span>
                </button>
                </div>
            </header>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-card p-3 md:p-4 rounded-[16px] md:rounded-[20px] border border-border hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/10 rounded-[12px] md:rounded-[16px] flex items-center justify-center">
                            <FileText className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-base md:text-lg font-bold text-foreground">{totalInvoices}</div>
                            <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-card p-3 md:p-4 rounded-[16px] md:rounded-[20px] border border-border hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500/10 rounded-[12px] md:rounded-[16px] flex items-center justify-center">
                            <Flag className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                        </div>
                        <div>
                            <div className="text-base md:text-lg font-bold text-foreground">{flaggedInvoices}</div>
                            <div className="text-xs text-muted-foreground">Flagged</div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-card p-3 md:p-4 rounded-[16px] md:rounded-[20px] border border-border hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500/10 rounded-[12px] md:rounded-[16px] flex items-center justify-center">
                            <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                        </div>
                        <div>
                            <div className="text-sm md:text-base font-bold text-foreground">₹{(totalRevenue / 100000).toFixed(1)}L</div>
                            <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-card p-3 md:p-4 rounded-[16px] md:rounded-[20px] border border-border hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500/10 rounded-[12px] md:rounded-[16px] flex items-center justify-center">
                            <Package className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                        </div>
                        <div>
                            <div className="text-base md:text-lg font-bold text-foreground">{mockInvoices.reduce((sum, inv) => sum + inv.items, 0)}</div>
                            <div className="text-xs text-muted-foreground">Total Items</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-card p-4 md:p-6 rounded-[20px] md:rounded-[24px] border border-border mb-6 md:mb-8">
                <div className="flex flex-col gap-4">
                    {/* Search */}
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-[16px] md:rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full sm:w-auto px-3 md:px-4 py-2 md:py-2 border border-border rounded-[12px] md:rounded-[16px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50 text-sm md:text-base"
                        >
                            {invoiceCategories.map(category => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field as any);
                                setSortOrder(order as any);
                            }}
                            className="w-full sm:w-auto px-3 md:px-4 py-2 md:py-2 border border-border rounded-[12px] md:rounded-[16px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50 text-sm md:text-base"
                        >
                            <option value="date-desc">Latest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Highest Amount</option>
                            <option value="amount-asc">Lowest Amount</option>
                            <option value="customer-asc">Customer A-Z</option>
                        </select>

                        {/* Flagged Only Toggle */}
                        <button
                            onClick={() => setFlaggedOnly(!flaggedOnly)}
                            className={`w-full sm:w-auto px-3 md:px-4 py-2 md:py-2 rounded-[12px] md:rounded-[16px] font-medium transition-all duration-200 text-sm md:text-base ${
                                flaggedOnly
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                        >
                            <Flag className={`w-4 h-4 inline mr-2 ${flaggedOnly ? 'text-white' : ''}`} />
                            Flagged Only
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="text-xs md:text-sm text-muted-foreground">
                    Showing {filteredInvoices.length} of {totalInvoices} invoices
                </div>
            </div>

            {/* Mobile Invoice Cards */}
            <div className="block md:hidden">
                {filteredInvoices.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="text-muted-foreground font-medium mb-2">No invoices found</div>
                        <div className="text-sm text-muted-foreground">Try adjusting your search or filters</div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredInvoices.map((invoice) => (
                            <div key={invoice.id} className="bg-card p-4 rounded-[20px] border border-border hover:shadow-lg transition-all duration-200">
                                {/* Header Row */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleFlag(invoice.id)}
                                            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                                                invoice.isFlagged
                                                    ? 'text-red-500 hover:text-red-600'
                                                    : 'text-muted-foreground hover:text-red-500'
                                            }`}
                                        >
                                            <Flag className={`w-4 h-4 ${invoice.isFlagged ? 'fill-current' : ''}`} />
                                        </button>
                                        <div>
                                            <div className="font-semibold text-foreground text-sm">{invoice.id}</div>
                                            <div className="text-xs text-muted-foreground">{invoice.category}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-foreground text-sm">{formatCurrency(invoice.totalAmount)}</div>
                                        <div className="text-xs text-muted-foreground">Tax: {formatCurrency(invoice.taxAmount)}</div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="mb-3">
                                    <div className="font-medium text-foreground text-sm">{invoice.customerName}</div>
                                    <div className="text-xs text-muted-foreground">{invoice.customerEmail}</div>
                                </div>

                                {/* Details Row */}
                                <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                                    <div>
                                        <div className="text-muted-foreground">Date</div>
                                        <div className="text-foreground">{new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Due</div>
                                        <div className="text-foreground">{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Items</div>
                                        <div className="text-foreground">{invoice.items}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200" title="View">
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                    <button className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200" title="Edit">
                                        <Edit className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                    <button className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200" title="Download">
                                        <Download className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Invoice Table */}
            <div className="hidden md:block bg-card rounded-[24px] border border-border overflow-hidden">
                {/* Table Header */}
                <div className="bg-muted/50 border-b border-border">
                    <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-foreground">
                        <div className="col-span-1">Flag</div>
                        <div className="col-span-2">Invoice</div>
                        <div className="col-span-2">Customer</div>
                        <div className="col-span-1">Date</div>
                        <div className="col-span-1">Due</div>
                        <div className="col-span-1">Items</div>
                        <div className="col-span-2">Amount</div>
                        <div className="col-span-2">Actions</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border">
                    {filteredInvoices.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div className="text-muted-foreground font-medium mb-2">No invoices found</div>
                            <div className="text-sm text-muted-foreground">Try adjusting your search or filters</div>
                        </div>
                    ) : (
                        filteredInvoices.map((invoice) => {
                            return (
                                <div key={invoice.id} className="hover:bg-muted/30 transition-colors duration-200">
                                    <div className="grid grid-cols-12 gap-4 p-4 items-center">
                                        {/* Flag Column */}
                                        <div className="col-span-1">
                                            <button
                                                onClick={() => toggleFlag(invoice.id)}
                                                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                                                    invoice.isFlagged
                                                        ? 'text-red-500 hover:text-red-600'
                                                        : 'text-muted-foreground hover:text-red-500'
                                                }`}
                                            >
                                                <Flag className={`w-4 h-4 ${invoice.isFlagged ? 'fill-current' : ''}`} />
                                            </button>
                                        </div>

                                        {/* Invoice ID */}
                                        <div className="col-span-2">
                                            <div className="font-semibold text-foreground">{invoice.id}</div>
                                            <div className="text-xs text-muted-foreground">{invoice.category}</div>
                                        </div>

                                        {/* Customer */}
                                        <div className="col-span-2">
                                            <div className="font-medium text-foreground">{invoice.customerName}</div>
                                            <div className="text-xs text-muted-foreground">{invoice.customerEmail}</div>
                                        </div>

                                        {/* Invoice Date */}
                                        <div className="col-span-1">
                                            <div className="text-sm text-foreground">
                                                {new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}
                                            </div>
                                        </div>

                                        {/* Due Date */}
                                        <div className="col-span-1">
                                            <div className="text-sm text-foreground">
                                                {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="col-span-1">
                                            <div className="text-sm text-foreground">{invoice.items}</div>
                                        </div>

                                        {/* Amount */}
                                        <div className="col-span-2">
                                            <div className="font-semibold text-foreground">{formatCurrency(invoice.totalAmount)}</div>
                                            <div className="text-xs text-muted-foreground">
                                                Tax: {formatCurrency(invoice.taxAmount)}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-2 flex items-center justify-center gap-2">
                                            <button className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200" title="View">
                                                <Eye className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                            <button className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200" title="Edit">
                                                <Edit className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                            <button className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200" title="Download">
                                                <Download className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </main>
    )
}

export default AllInvoices