"use client";
import { FaRegPenToSquare, FaTrashCan } from "react-icons/fa6";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Box } from "@mui/material";

export default function InvoiceTable() {
    const [search, setSearch] = React.useState("");

    type InvoiceRow = {
        id: number;
        invoiceNo: string;
        date: string;
        customer: string;
        type: string;
        amount: string;
    };

    const rows: InvoiceRow[] = [
        { id: 1, invoiceNo: "INV001", date: "2025-08-10", customer: "John Doe", type: "Service", amount: "$250" },
        { id: 2, invoiceNo: "INV002", date: "2025-08-11", customer: "Jane Smith", type: "Product", amount: "$500" },
        { id: 3, invoiceNo: "INV003", date: "2025-08-12", customer: "David Wilson", type: "Service", amount: "$150" },
    ];

    const [filteredRows, setFilteredRows] = React.useState<InvoiceRow[]>(rows);

    const columns = [
        { field: "invoiceNo", headerName: "Invoice No.", flex: 1 },
        { field: "date", headerName: "Date", flex: 1 },
        { field: "customer", headerName: "Customer", flex: 1 },
        { field: "type", headerName: "Type", flex: 1 },
        { field: "amount", headerName: "Amount", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: () => (
                <div className="w-full flex justify-around items-center h-full">
                    <button className="p-2 rounded-[16px] hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors duration-200">
                        <FaRegPenToSquare className="text-xl text-blue-500 hover:text-blue-600 cursor-pointer" />
                    </button>
                    <button className="p-2 rounded-[16px] hover:bg-red-50 dark:hover:bg-red-950 transition-colors duration-200">
                        <FaTrashCan className="text-xl text-red-500 hover:text-red-600 cursor-pointer" />
                    </button>
                </div>
            ),
        },
    ];

    React.useEffect(() => {
        setFilteredRows(
            rows.filter(
                (row) =>
                    row.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
                    row.customer.toLowerCase().includes(search.toLowerCase()) ||
                    row.type.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search]);

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
            <div style={{ height: 350, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pagination
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5]}
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
        </div>
    );
}
