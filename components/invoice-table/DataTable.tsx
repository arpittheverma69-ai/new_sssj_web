"use client";
import { FaRegPenToSquare, FaTrashCan } from "react-icons/fa6";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { TaxRateRow } from "@/types/invoiceTypes";

export default function DataTable({ tableData, loading }: { tableData: TaxRateRow[], loading: boolean }) {
    const [search, setSearch] = useState("");

    const rows: TaxRateRow[] = tableData;
    console.log("Fetched rows:", rows);

    const [filteredRows, setFilteredRows] = useState<TaxRateRow[]>([]);

    // 🔥 Now runs whenever `rows` or `search` changes
    useEffect(() => {
        setFilteredRows(
            rows.filter(
                (row) =>
                    row.hsn_code.toLowerCase().includes(search.toLowerCase()) ||
                    row.description.toLowerCase().includes(search.toLowerCase()) ||
                    row.cgst_rate.toLowerCase().includes(search.toLowerCase()) ||
                    row.sgst_rate.toLowerCase().includes(search.toLowerCase()) ||
                    row.igst_rate.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, rows]);

    const columns = [
        { field: "hsn_code", headerName: "HSN Code", flex: 1 },
        { field: "description", headerName: "Description", flex: 1 },
        { field: "cgst_rate", headerName: "CGST Rate", flex: 1 },
        { field: "sgst_rate", headerName: "SGST Rate", flex: 1 },
        { field: "igst_rate", headerName: "IGST Rate", flex: 1 },
        {
            field: "is_default",
            headerName: "Default",
            flex: 1,
            renderCell: (params: any) => (params.value ? "Yes" : "No"), // ✅ show string
        },
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

    return (
        <div
            className="bg-white p-4 md:p-6 rounded-lg shadow-sm min-w-[700px]"
            style={{ width: "100%", margin: "0 auto" }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-slate-800">Recent Invoices</h3>
                <a
                    href="#"
                    className="text-blue-500 text-sm md:text-base font-semibold hover:underline"
                >
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

            {/* DataGrid */}
            <div style={{ height: 350, width: "100%" }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pagination
                    loading={loading}
                    getRowId={(row) => row.id} // ✅ important
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
