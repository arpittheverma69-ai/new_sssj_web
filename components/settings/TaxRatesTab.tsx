"use client"
import { useEffect, useState } from 'react';
import { GridRowId } from '@mui/x-data-grid';
import { TaxRateRow } from '@/types/invoiceTypes';
import { showToast, apiToast } from '@/utils/toast';
import dynamic from "next/dynamic";

const DataTable = dynamic(() => import("../invoice-table/DataTable"), {
    ssr: false,
    loading: () => <div>Loading table...</div>
});

interface TaxRateForm {
    hsnCode: string;
    description: string;
}

const TaxRatesTab = () => {
    const [tableData, setTableData] = useState<TaxRateRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    const [newTaxRate, setNewTaxRate] = useState<TaxRateForm>({
        hsnCode: '',
        description: '',
    });

    const fetchTaxRates = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/setting/taxrates", {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tax rates');
            }

            const data = await response.json();
            const formattedData = data.map((rate: any) => ({
                id: rate.id,
                hsn_code: rate.hsn_code,
                description: rate.description,
            }));

            setTableData(formattedData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            showToast.error('Failed to load tax rates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaxRates();
    }, []);

    const handleEdit = (id: GridRowId) => {
        const taxRate = tableData.find(rate => rate.id === id);
        if (taxRate) {
            setNewTaxRate({
                hsnCode: taxRate.hsn_code,
                description: taxRate.description,
            });
            setCurrentId(Number(id));
            setEditMode(true);
        }
    };

    const handleNewTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setNewTaxRate(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setNewTaxRate({
            hsnCode: '',
            description: '',
        });
        setEditMode(false);
        setCurrentId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await apiToast.call(
                async () => {
                    const taxRateData = {
                        hsn_code: newTaxRate.hsnCode,
                        description: newTaxRate.description,
                    };

                    const url = editMode && currentId
                        ? `/api/setting/taxrates/${currentId}`
                        : '/api/setting/taxrates';
                    const method = editMode ? 'PUT' : 'POST';

                    const response = await fetch(url, {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(taxRateData),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to ${editMode ? 'update' : 'create'} tax rate`);
                    }

                    await fetchTaxRates();
                    resetForm();
                    return response.json();
                },
                {
                    loading: `${editMode ? 'Updating' : 'Adding'} tax rate...`,
                    success: `Tax rate ${editMode ? 'updated' : 'added'} successfully!`,
                    error: `Failed to ${editMode ? 'update' : 'create'} tax rate`
                }
            );
        } catch (error) {
            console.error('Error submitting tax rate:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this tax rate?')) {
            return;
        }

        try {
            await apiToast.call(
                async () => {
                    const response = await fetch(`/api/setting/taxrates?id=${id}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok) {
                        throw new Error('Failed to delete tax rate');
                    }

                    await fetchTaxRates();
                    return response.json();
                },
                {
                    loading: 'Deleting tax rate...',
                    success: 'Tax rate deleted successfully!',
                    error: 'Failed to delete tax rate'
                }
            );
        } catch (error) {
            console.error('Error deleting tax rate:', error);
        }
    };

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6 overflow-x-auto">
                <h2 className="text-lg md:text-xl font-semibold mb-2">Tax Rates</h2>
                <p className="text-xs md:text-sm text-gray-600 mb-4">
                    Manage GST rates for different product categories
                </p>

                <DataTable
                    tableData={tableData}
                    loading={loading}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </div>

            <div className="bg-gray-50 rounded shadow p-4 md:p-6 w-full">
                <h2 className="text-lg font-semibold mb-4">
                    {editMode ? 'Edit Tax Rate' : 'Add New Tax Rate'}
                </h2>
                <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">HSN/SAC Code</label>
                        <input
                            type="text"
                            name="hsnCode"
                            value={newTaxRate.hsnCode}
                            onChange={handleNewTaxRateChange}
                            placeholder="Enter HSN/SAC Code"
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                            required
                            pattern="\d{4,8}"
                            title="HSN/SAC Code must be 4-8 digits"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={newTaxRate.description}
                            onChange={handleNewTaxRateChange}
                            placeholder="Enter product/service description"
                            className="w-full px-3 py-2 border rounded text-sm md:text-base"
                            required
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded text-sm md:text-base"
                        >
                            {editMode ? 'Update' : 'Add'} Tax Rate
                        </button>
                        {editMode && (
                            <button
                                type="button"
                                className="bg-gray-500 text-white px-4 py-2 rounded text-sm md:text-base"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaxRatesTab;