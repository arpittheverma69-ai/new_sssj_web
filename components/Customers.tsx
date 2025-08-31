"use client"
import React, { useEffect, useState } from 'react'
import AddCustomer from './forms/AddCustomer'
import { Plus, Search, Users, Star, MoreVertical } from 'lucide-react'
import { Customer } from '@/types/invoiceTypes';
import { CustomerCard } from './small-components/CustomerCard';
import { CustomerListItem } from './small-components/CustomerListItem';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { toast } from 'react-toastify';


// Customer status and category configurations
// const customerCategories = ['all', 'premium', 'standard'];
// const customerTags = ['jewellery', 'silver', 'diamond', 'luxury', 'traditional', 'modern', 'platinum', 'regular', 'occasional'];

const Customers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'name'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Modal states
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const customersResponse = await fetch('/api/customers');
            if (!customersResponse.ok) {
                throw new Error('Failed to fetch customers');
            }
            const data = await customersResponse.json();
            setCustomers(data.customers || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    // Handle view customer
    const handleView = (customer: Customer) => {
        setSelectedCustomer(customer);
        setViewModalOpen(true);
    };

    // Handle edit customer
    const handleEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    // Handle delete customer
    const handleDelete = (customer: Customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedCustomer) return;
        try {
            const response = await fetch(`/api/customers/${selectedCustomer.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                toast.success('Customer deleted successfully');
                fetchCustomers();
                setDeleteModalOpen(false);
                setSelectedCustomer(null);
            } else {
                toast.error('Failed to delete customer');
            }
        } catch (error) {
            toast.error('Error deleting customer');
            console.error('Error:', error);
        }
    };

    // Filter and search customers
    const filteredCustomers = customers
        .filter(customer => {
            const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                customer.phone.includes(searchTerm) ||
                (customer.gstin && customer.gstin.includes(searchTerm)) ||
                customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (customer.city && customer.city.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = selectedCategory === 'all'; // Remove category filter as it doesn't exist in schema

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

    // Calculate statistics based on actual data
    const totalCustomers = customers.length;
    // Remove revenue calculation as it requires invoice data which isn't in the customer model

    if (loading) {
        return <div className='ml-5'>Loading customers...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='w-full flex flex-col mx-auto flex-1 p-6 md:p-8'>
            <AddCustomer
                setOpen={setOpen}
                open={open}
                onCustomerSaved={() => {
                    fetchCustomers();
                    setOpen(false);
                }}
            />

            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Customers</h2>
                    <p className="text-muted-foreground text-base md:text-lg">Manage your customer database for invoicing.</p>
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-[20px] hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    Add New Customer
                </button>
            </header>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card p-6 rounded-[24px] border border-border hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-[20px] flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{totalCustomers}</div>
                            <div className="text-sm text-muted-foreground">Total Customers</div>
                        </div>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-[24px] border border-border hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-[20px] flex items-center justify-center">
                            <Star className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{customers.filter(c => c.flagged).length}</div>
                            <div className="text-sm text-muted-foreground">Flagged Customers</div>
                        </div>
                    </div>
                </div>

                {/* <div className="bg-card p-6 rounded-[24px] border border-border hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-[20px] flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">₹{(totalRevenue / 100000).toFixed(1)}L</div>
                            <div className="text-sm text-muted-foreground">Total Revenue</div>
                        </div>
                    </div>
                </div> */}

                {/* <div className="bg-card p-6 rounded-[24px] border border-border hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-[20px] flex items-center justify-center">
                            <FileText className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">₹{avgOrderValue.toFixed(0)}</div>
                            <div className="text-sm text-muted-foreground">Avg Order Value</div>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Filters and Search */}
            <div className="bg-card p-6 rounded-[24px] border border-border mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        {/* Category Filter */}
                        {/* <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-border rounded-[16px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                        >
                            {customerCategories.map(category => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)} Category
                                </option>
                            ))}
                        </select> */}

                        {/* Sort */}
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field as any);
                                setSortOrder(order as any);
                            }}
                            className="px-4 py-2 border border-border rounded-[16px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                        >
                            <option value="name-asc">Name A-Z</option>
                            <option value="name-desc">Name Z-A</option>
                        </select>
                    </div>
                </div>

                {/* Tag Filters */}
                {/* <div className="mt-4">
                    <div className="text-sm font-medium text-foreground mb-2">Filter by Tags:</div>
                    <div className="flex flex-wrap gap-2">
                        {customerTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => {
                                    if (selectedTags.includes(tag)) {
                                        setSelectedTags(selectedTags.filter(t => t !== tag));
                                    } else {
                                        setSelectedTags([...selectedTags, tag]);
                                    }
                                }}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${selectedTags.includes(tag)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div> */}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-muted-foreground">
                    Showing {filteredCustomers.length} of {totalCustomers} customers
                </div>
                <div className="flex items-center bg-muted rounded-[16px] p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-[12px] transition-all duration-200 ${viewMode === 'grid' ? 'bg-background text-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-[12px] transition-all duration-200 ${viewMode === 'list' ? 'bg-background text-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Customer Display */}
            {filteredCustomers.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="text-muted-foreground font-medium mb-2">No customers found</div>
                    <div className="text-sm text-muted-foreground">Try adjusting your search or filters</div>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCustomers.map(customer => (
                        <CustomerCard
                            key={customer.id}
                            customer={customer}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {/* List Header */}
                    <div className="bg-muted/50 p-4 rounded-[20px] border border-border">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm font-semibold text-foreground">
                            <div>Customer</div>
                            <div>Phone</div>
                            <div>State</div>
                            <div>Invoices</div>
                            <div>Revenue</div>
                            <div>Status</div>
                        </div>
                    </div>

                    {/* List Items */}
                    {filteredCustomers.map(customer => (
                        <CustomerListItem
                            key={customer.id}
                            customer={customer}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* View Customer Modal */}
            <Modal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                title="Customer Details"
                size="lg"
            >
                {selectedCustomer && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Name</label>
                                <p className="font-medium">{selectedCustomer.name}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Phone</label>
                                <p className="font-medium">{selectedCustomer.phone}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Email</label>
                                <p className="font-medium">{selectedCustomer.email || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">GSTIN</label>
                                <p className="font-medium">{selectedCustomer.gstin || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">PAN</label>
                                <p className="font-medium">{selectedCustomer.pan_number || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Pincode</label>
                                <p className="font-medium">{selectedCustomer.pincode || '-'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-muted-foreground">Address</label>
                                <p className="font-medium">{selectedCustomer.address}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">City</label>
                                <p className="font-medium">{selectedCustomer.city || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">State</label>
                                <p className="font-medium">{selectedCustomer.state?.state_name || '-'}</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add/Edit Modal */}
            {(open || editModalOpen) && (
                <AddCustomer
                    open={open || editModalOpen}
                    setOpen={(isOpen) => {
                        if (!isOpen) {
                            setOpen(false);
                            setEditModalOpen(false);
                            setSelectedCustomer(null);
                        }
                    }}
                    customerToEdit={selectedCustomer}
                    onCustomerSaved={() => {
                        fetchCustomers();
                        setOpen(false);
                        setEditModalOpen(false);
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Delete"
                size="sm"
            >
                {selectedCustomer && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete customer <strong>{selectedCustomer.name}</strong>?
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
        </div>
    )
}

export default Customers