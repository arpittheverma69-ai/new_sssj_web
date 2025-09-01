"use client"
import React, { useState } from 'react'
import { Plus, Search, Download, Trash2, Flag, DollarSign, FileText, Package } from 'lucide-react'
import { FaRegPenToSquare, FaEye } from "react-icons/fa6";
import { IconButton, Tooltip } from "@mui/material";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Invoice } from '@/types/invoiceTypes';
import { DownloadPDFModal } from './DownloadPDFModal';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
const invoiceCategories = ['all', 'retail', 'inter_state', 'outer_state'];

const AllInvoices = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<'date' | 'amount' | 'customer'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [flaggedOnly, setFlaggedOnly] = useState(false);
    const [loading, setLoading] = React.useState(true);
    const [invoices, setInvoices] = React.useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
    const [viewModalOpen, setViewModalOpen] = React.useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [downloadModalOpen, setDownloadModalOpen] = useState(false)
    const [downloadInvoice, setDownloadInvoice] = useState<Invoice | null>(null);

    // Fetch invoices on component mount
    React.useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/invoices');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch invoices');
            }
            const data = await response.json();
            setInvoices(data.invoices || []);
        } catch (error: any) {
            toast.error(error.message);
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setViewModalOpen(true);
    };
    const handleEdit = (invoice: Invoice) => {
        // Navigate to the edit page under dashboard
        router.push(`/dashboard/create-invoice?edit=${invoice.id}`);
    };

    const handleDelete = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setDeleteModalOpen(true);
    };

    const handleDownload = (invoice: Invoice) => {
        setDownloadInvoice(invoice);
        setDownloadModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedInvoice) return;

        try {
            const response = await fetch(`/api/invoices/${selectedInvoice.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Invoice deleted successfully');
                fetchInvoices();
                setDeleteModalOpen(false);
                setSelectedInvoice(null);
            } else {
                toast.error('Failed to delete invoice');
            }
        } catch (error) {
            toast.error('Error deleting invoice');
            console.error('Error:', error);
        }
    };

    // Filter and search invoices
    const filteredInvoices = invoices
        .filter(invoice => {
            const matchesSearch = invoice.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (invoice.buyer_gstin || '').toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === 'all' || invoice.transaction_type === selectedCategory;
            const matchesFlagged = !flaggedOnly || invoice.flagged;

            return matchesSearch && matchesCategory && matchesFlagged;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'date':
                    aValue = new Date(a.invoice_date).getTime();
                    bValue = new Date(b.invoice_date).getTime();
                    break;
                case 'amount':
                    aValue = a.total_invoice_value;
                    bValue = b.total_invoice_value;
                    break;
                case 'customer':
                    aValue = a.buyer_name.toLowerCase();
                    bValue = b.buyer_name.toLowerCase();
                    break;
                default:
                    aValue = a.invoice_date;
                    bValue = b.invoice_date;
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    // Calculate statistics
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total_invoice_value, 0);
    const flaggedInvoices = invoices.filter(inv => inv.flagged).length;

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
    const toggleFlag = async (invoice: Invoice) => {
        try {
            const response = await fetch(`/api/invoices/${invoice.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ flagged: !invoice.flagged }),
            });

            if (response.ok) {
                fetchInvoices();
                toast.success(`Invoice ${invoice.flagged ? 'unflagged' : 'flagged'}`);
            }
        } catch (error) {
            toast.error('Failed to update flag');
        }
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
                        onClick={() => router.push('/dashboard/create-invoice')}
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
                            <div className="text-base md:text-lg font-bold text-foreground">{invoices.reduce((sum, inv) => sum + inv.line_items.length, 0)}</div>
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
                            className={`w-full sm:w-auto px-3 md:px-4 py-2 md:py-2 rounded-[12px] md:rounded-[16px] font-medium transition-all duration-200 text-sm md:text-base ${flaggedOnly
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
                    {loading ? 'Loading...' : `Showing ${filteredInvoices.length} of ${totalInvoices} invoices`}
                </div>
            </div>

            {/* Mobile Invoice Cards */}
            <div className="block md:hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                        <div className="text-muted-foreground font-medium mb-2">Loading invoices...</div>
                    </div>
                ) : filteredInvoices.length === 0 ? (
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
                                            onClick={() => toggleFlag(invoice)}
                                            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${invoice.flagged
                                                ? 'text-red-500 hover:text-red-600'
                                                : 'text-muted-foreground hover:text-red-500'
                                                }`}
                                        >
                                            <Flag className={`w-4 h-4 ${invoice.flagged ? 'fill-current' : ''}`} />
                                        </button>
                                        <div>
                                            <div className="font-semibold text-foreground text-sm">INV-{invoice.id}</div>
                                            <div className="text-xs text-muted-foreground">{invoice.transaction_type}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-foreground text-sm">{formatCurrency(invoice.total_invoice_value)}</div>
                                        <div className="text-xs text-muted-foreground">Total Value</div>
                                    </div>
                                </div>

                                {/* Customer Info */}
                                <div className="mb-3">
                                    <div className="font-medium text-foreground text-sm">{invoice.buyer_name}</div>
                                    <div className="text-xs text-muted-foreground">{invoice.buyer_gstin || 'No GSTIN'}</div>
                                </div>

                                {/* Details Row */}
                                <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                                    <div>
                                        <div className="text-muted-foreground">Date</div>
                                        <div className="text-foreground">{new Date(invoice.invoice_date).toLocaleDateString('en-IN')}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Type</div>
                                        <div className="text-foreground">{invoice.transaction_type}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Items</div>
                                        <div className="text-foreground">{invoice.line_items.length}</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-2">
                                    <Tooltip title="View">
                                        <IconButton size="small" onClick={() => handleView(invoice)}>
                                            <FaEye className="text-blue-500" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <IconButton size="small" onClick={() => handleEdit(invoice)}>
                                            <FaRegPenToSquare className="text-green-500" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Download PDF">
                                        <button
                                            onClick={() => handleDownload(invoice)}
                                            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                                        >
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <button
                                            onClick={() => handleDelete(invoice)}
                                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </Tooltip>
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
                        <div className="col-span-1">Type</div>
                        <div className="col-span-1">Items</div>
                        <div className="col-span-2">Amount</div>
                        <div className="col-span-2">Actions</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border">
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                            <div className="text-muted-foreground font-medium mb-2">Loading invoices...</div>
                        </div>
                    ) : filteredInvoices.length === 0 ? (
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
                                                onClick={() => toggleFlag(invoice)}
                                                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${invoice.flagged
                                                    ? 'text-red-500 hover:text-red-600'
                                                    : 'text-muted-foreground hover:text-red-500'
                                                    }`}
                                            >
                                                <Flag className={`w-4 h-4 ${invoice.flagged ? 'fill-current' : ''}`} />
                                            </button>
                                        </div>

                                        {/* Invoice ID */}
                                        <div className="col-span-2">
                                            <div className="font-semibold text-foreground">INV-{invoice.id}</div>
                                            <div className="text-xs text-muted-foreground">{invoice.transaction_type}</div>
                                        </div>

                                        {/* Customer */}
                                        <div className="col-span-2">
                                            <div className="font-medium text-foreground">{invoice.buyer_name}</div>
                                            <div className="text-xs text-muted-foreground">{invoice.buyer_gstin || 'No GSTIN'}</div>
                                        </div>

                                        {/* Invoice Date */}
                                        <div className="col-span-1">
                                            <div className="text-sm text-foreground">
                                                {new Date(invoice.invoice_date).toLocaleDateString('en-IN')}
                                            </div>
                                        </div>

                                        {/* Transaction Type */}
                                        <div className="col-span-1">
                                            <div className="text-sm text-foreground">
                                                {invoice.transaction_type}
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="col-span-1">
                                            <div className="text-sm text-foreground">{invoice.line_items.length}</div>
                                        </div>

                                        {/* Amount */}
                                        <div className="col-span-2">
                                            <div className="font-semibold text-foreground">{formatCurrency(invoice.total_invoice_value)}</div>
                                            <div className="text-xs text-muted-foreground">
                                                Total Invoice Value
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-2 flex items-center justify-center gap-2">
                                            <Tooltip title="View">
                                                <IconButton size="small" onClick={() => handleView(invoice)}>
                                                    <FaEye className="text-blue-500" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => handleEdit(invoice)}>
                                                    <FaRegPenToSquare className="text-green-500" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Download PDF">
                                                <button
                                                    onClick={() => handleDownload(invoice)}
                                                    className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <button
                                                    onClick={() => handleDelete(invoice)}
                                                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            {/* View Modal */}
            <Modal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                title="Invoice Details"
                size="lg"
            >
                {selectedInvoice && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedInvoice.invoice_number}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {new Date(selectedInvoice.invoice_date).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Customer</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedInvoice.buyer_name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                                <p className="mt-1 text-sm text-gray-900">₹{selectedInvoice.total_invoice_value ? Number(selectedInvoice.total_invoice_value).toFixed(2) : '0.00'}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Line Items</label>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Qty
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rate
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {selectedInvoice.line_items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.description}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {item.quantity} {item.unit}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ₹{Number(item.rate).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ₹{Number(item.taxable_value).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Delete"
                size="sm"
            >
                {selectedInvoice && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete invoice <strong>{selectedInvoice.invoice_number}</strong>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={confirmDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Download PDF Modal */}
            <Modal
                isOpen={downloadModalOpen}
                onClose={() => setDownloadModalOpen(false)}
                title="Download Invoice PDF"
                size="lg"
            >
                {downloadInvoice && (
                    <DownloadPDFModal
                        invoice={downloadInvoice}
                        onClose={() => setDownloadModalOpen(false)}
                    />
                )}
            </Modal>
        </main>
    )
}

export default AllInvoices