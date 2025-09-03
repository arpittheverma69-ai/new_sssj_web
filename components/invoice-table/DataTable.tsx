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
        <div className="p-4 md:p-6 rounded-lg shadow-sm min-w-[700px]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold">Tax Rates</h3>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Tax Rates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 border border-border rounded-[20px] bg-background text-foreground placeholder:text-muted-foreground hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                    />
                </div>
            </div>

            <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
                                <th className="text-left p-4 text-sm font-semibold text-foreground">HSN/SAC Code</th>
                                <th className="text-left p-4 text-sm font-semibold text-foreground">Description</th>
                                <th className="text-left p-4 text-sm font-semibold text-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-muted-foreground">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRows.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-muted-foreground">
                                        No tax rates found
                                    </td>
                                </tr>
                            ) : (
                                filteredRows.map((row) => (
                                    <tr key={row.id} className="hover:bg-muted/50 transition-colors duration-200">
                                        <td className="p-4">
                                            <div className="font-medium text-foreground">{row.hsn_code}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-foreground">{row.description}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(row.id)}
                                                    className="p-2 rounded-[12px] bg-blue-500/10 hover:bg-blue-500/20 transition-colors duration-200"
                                                >
                                                    <FaRegPenToSquare className="w-4 h-4 text-blue-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(row.id)}
                                                    className="p-2 rounded-[12px] bg-red-500/10 hover:bg-red-500/20 transition-colors duration-200"
                                                >
                                                    <FaTrashCan className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}