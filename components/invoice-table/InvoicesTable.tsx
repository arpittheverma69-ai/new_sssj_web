"use client";
import { FaRegPenToSquare, FaTrashCan, FaEye, FaDownload, FaFlag } from "react-icons/fa6";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TextField, Box, Chip, IconButton, Tooltip } from "@mui/material";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { downloadInvoicePDF } from "@/utils/pdfGenerator";
import { toast } from "react-toastify";

interface Invoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    buyer_name: string;
    transaction_type: string;
    total_invoice_value: number;
    buyer_address: string;
    buyer_gstin?: string;
    line_items: Array<{
        description: string;
        quantity: number;
        unit: string;
        rate: number;
        taxable_value: number;
        taxes: Array<{
            tax_name: string;
            tax_rate: number;
            tax_amount: number;
        }>;
    }>;
    flagged?: boolean;
}

export default function InvoiceTable() {
    const [search, setSearch] = React.useState("");
    const [invoices, setInvoices] = React.useState<Invoice[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null);
    const [viewModalOpen, setViewModalOpen] = React.useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [filteredRows, setFilteredRows] = React.useState<Invoice[]>([]);

    // Fetch invoices on component mount
    React.useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/invoices');
            const data = await response.json();
            setInvoices(data.invoices || []);
        } catch (error) {
            toast.error('Failed to fetch invoices');
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
        // Navigate to edit page or open edit modal
        window.location.href = `/create-invoice?edit=${invoice.id}`;
    };

    const handleDelete = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setDeleteModalOpen(true);
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

    const handleDownload = (invoice: Invoice) => {
        try {
            downloadInvoicePDF(invoice);
            toast.success('PDF downloaded successfully');
        } catch (error) {
            toast.error('Failed to download PDF');
            console.error('Error:', error);
        }
    };

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

    const columns: GridColDef[] = [
        { 
            field: "invoice_number", 
            headerName: "Invoice No.", 
            flex: 1,
            renderCell: (params) => (
                <div className="flex items-center gap-2">
                    {params.row.flagged && (
                        <FaFlag className="text-red-500" size={12} />
                    )}
                    {params.value}
                </div>
            )
        },
        { 
            field: "invoice_date", 
            headerName: "Date", 
            flex: 1,
            valueFormatter: (params: any) => new Date(params.value).toLocaleDateString()
        },
        { field: "buyer_name", headerName: "Customer", flex: 1 },
        { 
            field: "transaction_type", 
            headerName: "Type", 
            flex: 1,
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    size="small" 
                    color={params.value === 'retail' ? 'primary' : 'default'}
                />
            )
        },
        { 
            field: "total_invoice_value", 
            headerName: "Amount", 
            flex: 1,
            valueFormatter: (params: any) => `₹${Number(params.value).toFixed(2)}`
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1.5,
            sortable: false,
            renderCell: (params) => (
                <div className="flex gap-1 items-center h-full">
                    <Tooltip title="View">
                        <IconButton size="small" onClick={() => handleView(params.row)}>
                            <FaEye className="text-blue-500" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(params.row)}>
                            <FaRegPenToSquare className="text-green-500" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF">
                        <IconButton size="small" onClick={() => handleDownload(params.row)}>
                            <FaDownload className="text-purple-500" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.flagged ? "Unflag" : "Flag"}>
                        <IconButton size="small" onClick={() => toggleFlag(params.row)}>
                            <FaFlag className={params.row.flagged ? "text-red-500" : "text-gray-400"} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(params.row)}>
                            <FaTrashCan className="text-red-500" />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ];

    React.useEffect(() => {
        setFilteredRows(
            invoices.filter(
                (invoice) =>
                    invoice.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
                    invoice.buyer_name.toLowerCase().includes(search.toLowerCase()) ||
                    invoice.transaction_type.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, invoices]);

    return (
        <div
            className="bg-card p-6 md:p-8 rounded-[24px] shadow-lg shadow-black/5 border border-border"
            style={{ width: "100%", margin: "0 auto" }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-foreground">Recent Invoices</h3>
                <a href="#" className="text-primary text-sm md:text-base font-semibold hover:underline transition-colors duration-200">
                    View All
                </a>
            </div>

            {/* Search */}
            <Box mb={3}>
                <TextField
                    label="Search Invoices"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--primary)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--primary)',
                            },
                        },
                    }}
                />
            </Box>

            {/* DataGrid container */}
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    loading={loading}
                    pagination
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid var(--border)',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'var(--muted)',
                            borderBottom: '2px solid var(--border)',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: '1px solid var(--border)',
                        },
                    }}
                />
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
                                <p className="mt-1 text-sm text-gray-900">₹{selectedInvoice.total_invoice_value.toFixed(2)}</p>
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
                                                    ₹{item.rate.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ₹{item.taxable_value.toFixed(2)}
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
                            <Button onClick={() => handleDownload(selectedInvoice)}>
                                Download PDF
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
        </div>
    );
}
