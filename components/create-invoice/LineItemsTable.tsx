import { LineItem } from '@/types/invoiceTypes';
import React from 'react';
import { Trash2, Package, Hash, FileText, Scale, DollarSign, Calculator, Minus } from 'lucide-react';

interface LineItemsTableProps {
    lineItems: LineItem[];
    onRemoveItem: (id: number) => void;
    onUpdateItem?: (id: number, updates: Partial<LineItem>) => void;
}

const LineItemsTable: React.FC<LineItemsTableProps> = ({ lineItems, onRemoveItem, onUpdateItem }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        }).format(amount);
    };

    const formatQuantityForDisplay = (quantity: number, unit: string) => {
        return `${quantity.toFixed(3)} ${unit}`;
    };

    return (
        <div className="bg-background rounded-[20px] border border-border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            <th scope="col" className="px-6 py-4 text-left">
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Hash className="w-4 h-4 text-muted-foreground" />
                                    HSN/SAC
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-4 text-left">
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    Description
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-4 text-left">
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Scale className="w-4 h-4 text-muted-foreground" />
                                    Quantity
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-4 text-left">
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                    Rate
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-4 text-left">
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Calculator className="w-4 h-4 text-muted-foreground" />
                                    Taxable Value
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-4 text-center">
                                <span className="text-sm font-semibold text-foreground">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {lineItems.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16 px-6">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                            <Package className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <div className="text-muted-foreground font-medium">No line items added yet</div>
                                        <div className="text-sm text-muted-foreground">Start by adding your first product or service above</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            lineItems.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-muted/30 transition-colors duration-200 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/5'
                                        }`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-blue-500/10 rounded-[12px] flex items-center justify-center">
                                                <Hash className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground">{item.hsn_sac_code}</div>
                                                <div className="text-xs text-muted-foreground">HSN Code</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs">
                                            <div className="font-medium text-foreground">{item.description}</div>
                                            <div className="text-xs text-muted-foreground">Product/Service</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-green-500/10 rounded-[12px] flex items-center justify-center">
                                                <Scale className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground">
                                                    {formatQuantityForDisplay(item.quantity, item.unit)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Quantity</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-purple-500/10 rounded-[12px] flex items-center justify-center">
                                                <DollarSign className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground">
                                                    {formatCurrency(item.rate)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Per {item.unit}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-orange-500/10 rounded-[12px] flex items-center justify-center">
                                                <Calculator className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-foreground text-lg">
                                                    {formatCurrency(item.taxableValue)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Taxable Value</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => onRemoveItem(item.id)}
                                            className="w-10 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700 rounded-[16px] flex items-center justify-center transition-all duration-200 hover:scale-110"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary Row */}
            {lineItems.length > 0 && (
                <div className="bg-primary/5 border-t border-primary/20 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                            Total Items: <span className="font-semibold text-foreground">{lineItems.length}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground">Total Taxable Value:</div>
                            <div className="text-xl font-bold text-primary">
                                {formatCurrency(lineItems.reduce((sum, item) => sum + item.taxableValue, 0))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LineItemsTable;