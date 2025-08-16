"use client"
import { useEffect, useState } from 'react';
import { GridRowId } from '@mui/x-data-grid';
import DataTable from '../invoice-table/DataTable';
import { TaxRateRow } from '@/types/invoiceTypes';

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
    const [tableData, setTableData] = useState<TaxRateRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    useEffect(() => {
        fetchTaxRates();
    }, []);

    const fetchTaxRates = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/setting/taxrates");
            if (!response.ok) {
                throw new Error('Failed to fetch tax rates');
            }
            const data = await response.json();
            setTableData(data.map((rate: any) => ({
                id: rate.id,
                hsnCode: rate.hsn_code,
                description: rate.description,
                cgstRate: `${rate.cgst_rate}%`,
                sgstRate: `${rate.sgst_rate}%`,
                igstRate: `${rate.igst_rate}%`,
                isDefault: rate.is_default,
            })));
        } catch (error) {
            console.error("Failed to fetch data:", error);
            alert('Failed to load tax rates');
        } finally {
            setLoading(false);
        }
    };

    const [newTaxRate, setNewTaxRate] = useState<Omit<TaxRate, 'id'>>({
        hsnCode: '',
        description: '',
        cgstRate: '1.5%',
        sgstRate: '1.5%',
        igstRate: '3%',
        isDefault: false,
    });

    const handleEdit = (id: GridRowId) => {
        const taxRate = tableData.find(rate => rate.id === id);
        if (taxRate) {
            setNewTaxRate({
                hsnCode: taxRate.hsn_code,
                description: taxRate.description,
                cgstRate: taxRate.cgst_rate,
                sgstRate: taxRate.sgst_rate,
                igstRate: taxRate.igst_rate,
                isDefault: taxRate.is_default,
            });
            setCurrentId(Number(id));
            setEditMode(true);
        }
    };

    const handleNewTaxRateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setNewTaxRate((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const taxRateData = {
                hsn_code: newTaxRate.hsnCode,
                description: newTaxRate.description,
                cgst_rate: parseFloat(newTaxRate.cgstRate.replace('%', '')),
                sgst_rate: parseFloat(newTaxRate.sgstRate.replace('%', '')),
                igst_rate: parseFloat(newTaxRate.igstRate.replace('%', '')),
                is_default: newTaxRate.isDefault,
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

            const result = await response.json();

            // Reset form and fetch updated data
            setNewTaxRate({
                hsnCode: '',
                description: '',
                cgstRate: '1.5%',
                sgstRate: '1.5%',
                igstRate: '3%',
                isDefault: false,
            });
            setEditMode(false);
            setCurrentId(null);
            fetchTaxRates();

            alert(`Tax rate ${editMode ? 'updated' : 'added'} successfully!`);
        } catch (error) {
            console.error('Error submitting tax rate:', error);
            alert(`Failed to ${editMode ? 'update' : 'create'} tax rate`);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this tax rate?')) {
            return;
        }

        try {
            const response = await fetch(`/api/setting/taxrates/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete tax rate');
            }

            fetchTaxRates();
            alert('Tax rate deleted successfully!');
        } catch (error) {
            console.error('Error deleting tax rate:', error);
            alert('Failed to delete tax rate');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const taxratedata = await fetch("/api/setting/taxrates");
                const data = await taxratedata.json();
                setTableData(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6  overflow-x-scroll">
                <h2 className="text-lg md:text-xl font-semibold mb-2">Tax Rates</h2>
                <p className="text-xs md:text-sm text-gray-600 mb-4">
                    Manage GST rates for different product categories
                </p>

                <DataTable tableData={tableData} loading={loading} />
            </div>

            {/* Add Tax Rate */}<div className="bg-gray-50 rounded shadow p-4 md:p-6 w-full">
                <h2 className="text-lg font-semibold mb-4">
                    {editMode ? 'Edit Tax Rate' : 'Add New Tax Rate'}
                </h2>
                <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
                    <small>HSN Code</small>
                    <input
                        type="text"
                        name="hsnCode"
                        value={newTaxRate.hsnCode}
                        onChange={handleNewTaxRateChange}
                        placeholder="HSN Code"
                        className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        required
                        pattern="\d{4,8}"
                        title="HSN Code must be 4-8 digits"
                    />
                    <small>Description</small>
                    <input
                        type="text"
                        name="description"
                        value={newTaxRate.description}
                        onChange={handleNewTaxRateChange}
                        placeholder="Description"
                        className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        required
                    />
                    <small>CGST Rate (%)</small>
                    <select
                        name="cgstRate"
                        value={newTaxRate.cgstRate}
                        onChange={handleNewTaxRateChange}
                        className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        required
                    >
                        <option value="1.5%">1.5%</option>
                        <option value="3%">3%</option>
                        <option value="5%">5%</option>
                        <option value="12%">12%</option>
                        <option value="18%">18%</option>
                        <option value="28%">28%</option>
                    </select>
                    <small>SGST Rate (%)</small>
                    <select
                        name="sgstRate"
                        value={newTaxRate.sgstRate}
                        onChange={handleNewTaxRateChange}
                        className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        required
                    >
                        <option value="1.5%">1.5%</option>
                        <option value="3%">3%</option>
                        <option value="5%">5%</option>
                        <option value="12%">12%</option>
                        <option value="18%">18%</option>
                        <option value="28%">28%</option>
                    </select>
                    <small>IGST Rate (%)</small>
                    <select
                        name="igstRate"
                        value={newTaxRate.igstRate}
                        onChange={handleNewTaxRateChange}
                        className="w-full px-3 py-2 border rounded text-sm md:text-base"
                        required
                    >
                        <option value="3%">3%</option>
                        <option value="6%">6%</option>
                        <option value="10%">10%</option>
                        <option value="12%">12%</option>
                        <option value="18%">18%</option>
                        <option value="28%">28%</option>
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
                                onClick={() => {
                                    setNewTaxRate({
                                        hsnCode: '',
                                        description: '',
                                        cgstRate: '1.5%',
                                        sgstRate: '1.5%',
                                        igstRate: '3%',
                                        isDefault: false,
                                    });
                                    setEditMode(false);
                                    setCurrentId(null);
                                }}
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