"use client";
import { FaRegPenToSquare, FaTrashCan } from "react-icons/fa6";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { TextField, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { TaxRateRow } from "@/types/invoiceTypes";

type DataTableProps = {
    tableData: TaxRateRow[];
    loading: boolean;
    handleEdit: (id: GridRowId) => void;
    handleDelete: (id: number) => void;
};

export default function DataTable({
    tableData,
    loading,
    handleEdit,
    handleDelete
}: DataTableProps) {
    const [search, setSearch] = useState("");
    const [filteredRows, setFilteredRows] = useState<TaxRateRow[]>([]);

    useEffect(() => {
        if (!tableData) return;

        setFilteredRows(
            tableData.filter(
                (row) =>
                    row.hsn_code?.toLowerCase().includes(search.toLowerCase()) ||
                    row.description?.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, tableData]);

    const columns: GridColDef[] = [
        { field: "hsn_code", headerName: "HSN/SAC Code", flex: 1 },
        { field: "description", headerName: "Description", flex: 2 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <div className="w-full flex justify-around items-center h-full">
                    <button onClick={() => handleEdit(params.id)}>
                        <FaRegPenToSquare className="text-xl text-blue-500 hover:text-blue-800 cursor-pointer" />
                    </button>
                    <button onClick={() => handleDelete(params.row.id)}>
                        <FaTrashCan className="text-xl text-red-500 hover:text-red-800 cursor-pointer" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm min-w-[700px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold text-slate-800">Tax Rates</h3>
            </div>

            <Box mb={2}>
                <TextField
                    label="Search Tax Rates"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    size="small"
                />
            </Box>

            <div style={{ height: 350, width: "100%" }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    pagination
                    loading={loading}
                    getRowId={(row) => row.id}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                />
            </div>
        </div>
    );
}