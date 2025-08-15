"use client";
import { FaRegPenToSquare, FaTrashCan } from "react-icons/fa6";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Box } from "@mui/material";

export default function RecentInvoices() {
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
                    <button>
                        <FaRegPenToSquare className="text-xl text-blue-500 hover:text-blue-800 cursor-pointer" />
                    </button>
                    <button>
                        <FaTrashCan className="text-xl text-red-500 hover:text-red-800 cursor-pointer" />
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
            className="bg-white p-4 md:p-6 rounded-lg shadow-sm"
            style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }} // ensures fixed width
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-slate-800">Recent Invoices</h3>
                <a href="#" className="text-blue-500 text-sm md:text-base font-semibold hover:underline">
                    View All
                </a>
            </div>

            {/* Search */}
            <Box mb={2}>
                <TextField
                    label="Search Invoices"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    size="small"
                />
            </Box>

            {/* DataGrid container */}
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pagination
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5]}
                    disableRowSelectionOnClick
                />
            </div>
        </div>
    );
}
