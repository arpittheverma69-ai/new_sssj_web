"use client"
import { useState } from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import RecentInvoices from '../invoice-table/RecentInvoicesTable';

interface TaxRate {
    id: number;
    hsnCode: string;
    description: string;
    cgstRate: string;
    sgstRate: string;
    igstRate: string;
    isDefault: boolean;
}

const TaxRatesTab = () => {
    const [taxRates, setTaxRates] = useState<TaxRate[]>([
        {
            id: 1,
            hsnCode: '7113',
            description: 'Jewellery',
            cgstRate: '1.5%',
            sgstRate: '1.5%',
            igstRate: '3%',
            isDefault: true,
        },
        {
            id: 2,
            hsnCode: '7106',
            description: 'Silver',
            cgstRate: '1.5%',
            sgstRate: '1.5%',
            igstRate: '3%',
            isDefault: false,
        },
        {
            id: 3,
            hsnCode: '7108',
            description: 'Gold',
            cgstRate: '1.5%',
            sgstRate: '1.5%',
            igstRate: '3%',
            isDefault: false,
        },
    ]);

    const [newTaxRate, setNewTaxRate] = useState<Omit<TaxRate, 'id'>>({
        hsnCode: '',
        description: '',
        cgstRate: '1.5%',
        sgstRate: '1.5%',
        igstRate: '3%',
        isDefault: false,
    });

    const columns: GridColDef[] = [
        { field: 'hsnCode', headerName: 'HSN Code', width: 100 },
        { field: 'description', headerName: 'Description', width: 150 },
        { field: 'cgstRate', headerName: 'CGST Rate', width: 100 },
        { field: 'sgstRate', headerName: 'SGST Rate', width: 100 },
        { field: 'igstRate', headerName: 'IGST Rate', width: 100 },
        {
            field: 'isDefault',
            headerName: 'Default',
            width: 100,
            renderCell: (params) => (params.value ? 'Yes' : 'No'),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(params.id)}
                >
                    Edit
                </button>
            ),
        },
    ];

    const handleEdit = (id: GridRowId) => {
        // Handle edit action
        console.log('Edit tax rate with id:', id);
    };

    const handleAddTaxRate = (e: React.FormEvent) => {
        e.preventDefault();
        const newId = Math.max(...taxRates.map((rate) => rate.id), 0) + 1;
        setTaxRates([...taxRates, { ...newTaxRate, id: newId }]);
        setNewTaxRate({
            hsnCode: '',
            description: '',
            cgstRate: '1.5%',
            sgstRate: '1.5%',
            igstRate: '3%',
            isDefault: false,
        });
    };

    const handleNewTaxRateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setNewTaxRate((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-2">Tax Rates</h2>
                <p className="text-xs md:text-sm text-gray-600 mb-4">
                    Manage GST rates for different product categories
                </p>

                <RecentInvoices />
            </div>

            {/* Add Tax Rate */}
            <div className="bg-gray-50 rounded shadow p-4 md:p-6 w-full">
                <h2 className="text-lg font-semibold mb-4">Add New Tax Rate</h2>
                <form className="space-y-3 md:space-y-4" onSubmit={handleAddTaxRate}>
                    <input
                        type="text"
                        name="hsnCode"
                        value={newTaxRate.hsnCode}
                        onChange={handleNewTaxRateChange}
                        placeholder="HSN Code"
                        className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        value={newTaxRate.description}
                        onChange={handleNewTaxRateChange}
                        placeholder="Description"
                        className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        required
                    />
                    <select
                        name="cgstRate"
                        value={newTaxRate.cgstRate}
                        onChange={handleNewTaxRateChange}
                        className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    >
                        <option>1.5%</option>
                        <option>3%</option>
                        <option>5%</option>
                    </select>
                    <select
                        name="sgstRate"
                        value={newTaxRate.sgstRate}
                        onChange={handleNewTaxRateChange}
                        className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    >
                        <option>1.5%</option>
                        <option>3%</option>
                        <option>5%</option>
                    </select>
                    <select
                        name="igstRate"
                        value={newTaxRate.igstRate}
                        onChange={handleNewTaxRateChange}
                        className="w-full px-3 py-2 border rounded text-sm md:text-base"
                    >
                        <option>3%</option>
                        <option>6%</option>
                        <option>10%</option>
                    </select>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={newTaxRate.isDefault}
                            onChange={handleNewTaxRateChange}
                            className="mr-2"
                            id="defaultCheckbox"
                        />
                        <label htmlFor="defaultCheckbox" className="text-sm">
                            Set as default
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded text-sm md:text-base"
                    >
                        Add Tax Rate
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaxRatesTab;