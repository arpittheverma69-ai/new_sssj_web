"use client"
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import SalesInvoice from './small-components/SalesInvoice';
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Clock, Calendar, ArrowUpRight, Plus, FileText, BarChart3, PieChart, Activity, Search, Eye, Download, Edit, ArrowRight } from 'lucide-react';
import { Invoice } from '@/types/invoiceTypes';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/requiredFunction';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

// Types
type TimeRange = 'This Month' | 'Last Month' | 'This Year';
type SalesTab = 'Daily' | 'Weekly' | 'Monthly';
type ChartType = 'Bar' | 'Line' | 'Doughnut';

// Interfaces for chart data
interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string | string[];
        borderRadius: number;
        borderColor?: string;
        fill?: boolean;
    }[];
}

interface ChartOptions {
    responsive: boolean;
    maintainAspectRatio: boolean;
    plugins: {
        legend: {
            position: 'top' | 'bottom' | 'left' | 'right';
            labels: {
                usePointStyle: boolean;
                boxWidth: number;
                padding: number;
            };
        };
        tooltip: {
            callbacks: {
                label: (context: any) => string;
            };
        };
    };
    scales?: {
        y: {
            beginAtZero: boolean;
            grid: {
                drawBorder: boolean;
                color: string;
            };
            ticks: {
                callback: (value: any) => string;
            };
        };
        x: {
            grid: {
                display: boolean;
                color: string;
            };
        };
    };
}

// Enhanced SalesChart Component
const SalesChart = ({ data, options, chartType = 'Bar' }: { data: ChartData; options: ChartOptions; chartType?: ChartType }) => {
    const renderChart = () => {
        switch (chartType) {
            case 'Line':
                return <Line data={data} options={options} />;
            case 'Doughnut':
                return <Doughnut data={data} options={options} />;
            default:
                return <Bar data={data} options={options} />;
        }
    };

    return (
        <div className="h-64 md:h-80">
            {renderChart()}
        </div>
    );
};

// Quick Actions Component
const QuickActions = () => {
    const actions = [
        { icon: Plus, label: 'Create Invoice', description: 'Generate new invoice', color: 'bg-blue-500', href: '/dashboard/create-invoice' },
        { icon: Users, label: 'Add Customer', description: 'Register new customer', color: 'bg-green-500', href: '/dashboard/customers' },
        { icon: FileText, label: 'View Reports', description: 'Analytics & insights', color: 'bg-purple-500', href: '/dashboard/reports' },
        { icon: Package, label: 'Manage Items', description: 'Product catalog', color: 'bg-orange-500', href: '/dashboard/setting' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                    <a
                        key={index}
                        href={action.href}
                        className="group bg-card p-4 sm:p-6 rounded-[16px] sm:rounded-[20px] border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-[12px] sm:rounded-[16px] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 text-sm sm:text-base">
                                    {action.label}
                                </h4>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{action.description}</p>
                            </div>
                            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200 hidden sm:block" />
                        </div>
                    </a>
                );
            })}
        </div>
    );
};


// Performance Metrics Component
const PerformanceMetrics = () => {
    const [metrics, setMetrics] = useState([
        { label: 'Conversion Rate', value: '0.0%', trend: 'No data', icon: TrendingUp, color: 'text-green-500' },
        { label: 'Avg. Order Value', value: '₹0', trend: 'No data', icon: DollarSign, color: 'text-blue-500' },
        { label: 'Customer Retention', value: '0.0%', trend: 'No data', icon: Users, color: 'text-purple-500' }
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/invoices');
                const data = await response.json();
                const invoices = data.invoices || [];

                if (invoices.length > 0) {
                    // Calculate conversion rate based on actual data
                    const uniqueCustomers = new Set(invoices.map((inv: any) => inv.buyer_name)).size;
                    const conversionRate = uniqueCustomers > 0 ? ((invoices.length / uniqueCustomers) * 100).toFixed(1) : '0.0';

                    // Calculate average order value with proper number conversion
                    const totalValue = invoices.reduce((sum: number, inv: any) => {
                        const value = parseFloat((inv.total_invoice_value || 0).toString()) || 0;
                        return sum + value;
                    }, 0);
                    const avgOrderValue = invoices.length > 0 ? Math.round(totalValue / invoices.length) : 0;

                    // Calculate customer retention (unique customers with multiple orders)
                    const customerOrders = invoices.reduce((acc: any, inv: any) => {
                        acc[inv.buyer_name] = (acc[inv.buyer_name] || 0) + 1;
                        return acc;
                    }, {});
                    const repeatCustomers = Object.values(customerOrders).filter((count: any) => count > 1).length;
                    const totalCustomers = Object.keys(customerOrders).length;
                    const retentionRate = totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(1) : '0.0';

                    setMetrics([
                        { label: 'Conversion Rate', value: `${conversionRate}%`, trend: `${uniqueCustomers} customers`, icon: TrendingUp, color: 'text-green-500' },
                        { label: 'Avg. Order Value', value: `₹${avgOrderValue.toLocaleString('en-IN')}`, trend: `Per invoice`, icon: DollarSign, color: 'text-blue-500' },
                        { label: 'Customer Retention', value: `${retentionRate}%`, trend: `${repeatCustomers}/${totalCustomers} repeat`, icon: Users, color: 'text-purple-500' }
                    ]);
                }
            } catch (error) {
                console.error('Error fetching metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[1, 2, 3].map((index) => (
                    <div key={index} className="bg-card p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] border border-border animate-pulse">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-[12px] sm:rounded-[16px]"></div>
                            <div className="w-12 h-4 bg-muted rounded"></div>
                        </div>
                        <div className="w-20 h-6 bg-muted rounded mb-1"></div>
                        <div className="w-24 h-4 bg-muted rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {metrics.map((metric, index) => (
                <div key={index} className="bg-card p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] border border-border hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${metric.color.replace('text-', 'bg-')}/10 rounded-[12px] sm:rounded-[16px] flex items-center justify-center`}>
                            <metric.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${metric.color}`} />
                        </div>
                        <div className={`text-xs sm:text-sm font-medium ${metric.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {metric.trend}
                        </div>
                    </div>
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1 truncate">{metric.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{metric.label}</div>
                </div>
            ))}
        </div>
    );
};

// Recent Invoices Component
const RecentInvoices = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch recent invoices from API
    useEffect(() => {
        const fetchRecentInvoices = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/invoices');
                const data = await response.json();
                // Get only the 5 most recent invoices
                const recentInvoices = (data.invoices || []).slice(0, 5);
                setInvoices(recentInvoices);
            } catch (error) {
                toast.error('Failed to fetch recent invoices', { closeOnClick: true });
                console.error('Error fetching invoices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentInvoices();
    }, []);

    // Filter invoices based on search
    const filteredInvoices = invoices.filter(invoice =>
        invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.transaction_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-card rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] shadow-lg shadow-black/5 border border-border overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border">
                <div className="flex flex-col gap-4">
                    <div className="text-center sm:text-left">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2">Recent Invoices</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">Latest invoice activities</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {/* Search */}
                        <div className="relative w-full sm:flex-1 sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-[12px] sm:rounded-[16px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50 text-sm"
                            />
                        </div>
                        {/* View All Button */}
                        <button
                            onClick={() => router.push('/dashboard/all-invoice')}
                            className="w-full sm:w-auto bg-primary text-primary-foreground px-4 py-2 rounded-[12px] sm:rounded-[16px] hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                        >
                            View All
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                        <div className="text-muted-foreground font-medium mb-2">Loading recent invoices...</div>
                    </div>
                ) : (
                    <div className="block sm:hidden">
                        {/* Mobile Card View */}
                        <div className="divide-y divide-border">
                            {filteredInvoices.map((invoice) => (
                                <div key={invoice.id} className="p-4 hover:bg-muted/20 transition-colors duration-200">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="font-semibold text-foreground text-sm">{invoice.invoice_number}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {new Date(invoice.invoice_date).toLocaleDateString('en-IN')}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-foreground text-sm">{formatCurrency((invoice.total_invoice_value))}</div>
                                            <div className="text-xs text-muted-foreground mt-1 capitalize">{invoice.transaction_type.replace('_', ' ')}</div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="font-medium text-foreground text-sm">{invoice.buyer_name}</div>
                                    </div>
                                    {/* <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => router.push(`/dashboard/all-invoice?view=${invoice.id}`)}
                                                className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                            <button
                                                onClick={() => router.push(`/dashboard/create-invoice?edit=${invoice.id}`)}
                                                className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                            <button className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200" title="Download">
                                                <Download className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        </div> */}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Desktop Table View */}
                <div className="hidden sm:block">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border">
                                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold text-foreground">Invoice No.</th>
                                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold text-foreground">Date</th>
                                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold text-foreground">Customer</th>
                                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold text-foreground hidden lg:table-cell">Type</th>
                                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold text-foreground">Amount</th>
                                {/* <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold text-foreground">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                                        {invoices.length === 0 ? 'No invoices found' : 'No matching invoices'}
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-muted/20 transition-colors duration-200">
                                        <td className="p-3 sm:p-4">
                                            <div className="font-semibold text-foreground text-xs sm:text-sm">{invoice.invoice_number}</div>
                                        </td>
                                        <td className="p-3 sm:p-4">
                                            <div className="text-xs sm:text-sm text-foreground">
                                                {new Date(invoice.invoice_date).toLocaleDateString('en-IN')}
                                            </div>
                                        </td>
                                        <td className="p-3 sm:p-4">
                                            <div className="font-medium text-foreground text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{invoice.buyer_name}</div>
                                        </td>
                                        <td className="p-3 sm:p-4 hidden lg:table-cell">
                                            <div className="text-sm text-foreground capitalize">{invoice.transaction_type.replace('_', ' ')}</div>
                                        </td>
                                        <td className="p-3 sm:p-4">
                                            <div className="font-semibold text-foreground text-xs sm:text-sm">{formatCurrency(invoice.total_invoice_value)}</div>
                                        </td>
                                        {/* <td className="p-3 sm:p-4">
                                            <div className="flex items-center gap-1 sm:gap-2">
                                                <button
                                                    onClick={() => router.push(`/dashboard/all-invoice?view=${invoice.id}`)}
                                                    className="p-1.5 sm:p-2 hover:bg-muted rounded-[6px] sm:rounded-[8px] transition-colors duration-200"
                                                    title="View"
                                                >
                                                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/dashboard/create-invoice?edit=${invoice.id}`)}
                                                    className="p-1.5 sm:p-2 hover:bg-muted rounded-[6px] sm:rounded-[8px] transition-colors duration-200"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                                                </button>
                                                <button className="p-1.5 sm:p-2 hover:bg-muted rounded-[6px] sm:rounded-[8px] transition-colors duration-200" title="Download">
                                                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                                                </button>
                                            </div>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            {!loading && (
                <div className="p-3 sm:p-4 border-t border-border bg-muted/20">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-muted-foreground">
                        <div className="text-center sm:text-left">Showing {filteredInvoices.length} of {invoices.length} recent invoices</div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push('/dashboard/all-invoice')}
                                className="px-3 py-1 hover:bg-background rounded-[6px] sm:rounded-[8px] transition-colors duration-200 text-primary hover:text-primary/80 text-xs sm:text-sm"
                            >
                                View All Invoices
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Types for sales categories
type SalesCategory = 'All Categories' | 'Retail Sales' | 'Inter-state Sales' | 'Outer-state Sales';

// Main Dashboard Component
export default function Dashboard() {
    const [timeRange, setTimeRange] = useState<TimeRange>('This Month');
    const [activeSalesTab, setActiveSalesTab] = useState<SalesTab>('Daily');
    const [chartType, setChartType] = useState<ChartType>('Bar');
    const [selectedSalesCategory, setSelectedSalesCategory] = useState<SalesCategory>('All Categories');
    const [salesChartData, setSalesChartData] = useState<ChartData>({
        labels: [],
        datasets: []
    });
    const [loading, setLoading] = useState(true);

    // Fetch real data for sales chart based on selected category
    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/invoices');
                const data = await response.json();
                const invoices = data.invoices || [];

                if (invoices.length > 0) {
                    // Group invoices by month and categorize by sales type
                    const monthlyData = invoices.reduce((acc: any, invoice: any) => {
                        const date = new Date(invoice.created_at || invoice.invoice_date);
                        const monthKey = date.toLocaleString('default', { month: 'short' });

                        if (!acc[monthKey]) {
                            acc[monthKey] = {
                                retailSales: 0,
                                interstateSales: 0,
                                outerstateSales: 0,
                                totalSales: 0
                            };
                        }

                        const amount = parseFloat(invoice.total_invoice_value?.toString() || '0') || 0;
                        acc[monthKey].totalSales += amount;

                        // Categorize based on transaction_type field from database
                        const transactionType = invoice.transaction_type?.toLowerCase() || 'retail';

                        switch (transactionType) {
                            case 'retail':
                                acc[monthKey].retailSales += amount;
                                break;
                            case 'inter_state':
                                acc[monthKey].interstateSales += amount;
                                break;
                            case 'outer_state':
                                acc[monthKey].outerstateSales += amount;
                                break;
                            default:
                                acc[monthKey].retailSales += amount;
                                break;
                        }

                        return acc;
                    }, {});

                    const months = Object.keys(monthlyData).slice(-6); // Last 6 months

                    // Create datasets showing all three categories together
                    const datasets = [
                        {
                            label: 'Retail Sales',
                            data: months.map(month => monthlyData[month].retailSales),
                            backgroundColor: 'rgba(59, 130, 246, 0.7)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderRadius: 12,
                            fill: false,
                        },
                        {
                            label: 'Inter-state Sales',
                            data: months.map(month => monthlyData[month].interstateSales),
                            backgroundColor: 'rgba(124, 58, 237, 0.7)',
                            borderColor: 'rgba(124, 58, 237, 1)',
                            borderRadius: 12,
                            fill: false,
                        },
                        {
                            label: 'Outer-state Sales',
                            data: months.map(month => monthlyData[month].outerstateSales),
                            backgroundColor: 'rgba(16, 185, 129, 0.7)',
                            borderColor: 'rgba(16, 185, 129, 1)',
                            borderRadius: 12,
                            fill: false,
                        }
                    ];

                    // Filter datasets based on selected category if needed
                    let filteredDatasets = datasets;
                    if (selectedSalesCategory !== 'All Categories') {
                        filteredDatasets = datasets.filter(dataset =>
                            dataset.label === selectedSalesCategory
                        );
                    }

                    setSalesChartData({
                        labels: months,
                        datasets: filteredDatasets
                    });
                } else {
                    // Fallback data when no invoices exist
                    setSalesChartData({
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [
                            {
                                label: 'Retail Sales',
                                data: [0, 0, 0, 0, 0, 0],
                                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                                borderColor: 'rgba(59, 130, 246, 1)',
                                borderRadius: 12,
                                fill: false,
                            },
                            {
                                label: 'Inter-state Sales',
                                data: [0, 0, 0, 0, 0, 0],
                                backgroundColor: 'rgba(124, 58, 237, 0.7)',
                                borderColor: 'rgba(124, 58, 237, 1)',
                                borderRadius: 12,
                                fill: false,
                            },
                            {
                                label: 'Outer-state Sales',
                                data: [0, 0, 0, 0, 0, 0],
                                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                                borderColor: 'rgba(16, 185, 129, 1)',
                                borderRadius: 12,
                                fill: false,
                            }
                        ],
                    });
                }
            } catch (error) {
                console.error('Error fetching sales data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, [timeRange, activeSalesTab, selectedSalesCategory]);

    // Generate line chart data from sales data
    const getLineChartData = (): ChartData => {
        return {
            labels: salesChartData.labels,
            datasets: [
                {
                    label: `${selectedSalesCategory} Trend`,
                    data: salesChartData.datasets[0]?.data || [],
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderRadius: 0,
                    fill: true,
                },
            ],
        };
    };

    // Generate doughnut chart data from sales data
    const getDoughnutChartData = (): ChartData => {
        const currentData = salesChartData.datasets[0]?.data || [];
        const total = currentData.reduce((sum: number, val: number) => sum + val, 0);

        return {
            labels: [selectedSalesCategory, 'Other Categories'],
            datasets: [
                {
                    label: 'Sales Distribution',
                    data: [total, total * 0.3], // Approximate other categories
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(124, 58, 237, 0.8)',
                    ],
                    borderRadius: 0,
                },
            ],
        };
    };

    const chartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 20,
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: ₹${context.raw.toLocaleString()}`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                    color: 'rgba(0,0,0,0.05)',
                },
                ticks: {
                    callback: (value) => `₹${value}`,
                },
            },
            x: {
                grid: {
                    display: false,
                    color: 'rgba(0,0,0,0.05)',
                },
            },
        },
    };

    const getChartData = () => {
        switch (chartType) {
            case 'Line':
                return getLineChartData();
            case 'Doughnut':
                return getDoughnutChartData();
            default:
                return salesChartData;
        }
    };

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-sm:mt-18">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 sm:mb-8 gap-4 lg:gap-6 max-md:pt-6">
                <div className="text-center lg:text-left">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">Dashboard</h2>
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">Overview of your sales and invoices</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                    <div className="relative w-full sm:w-auto">
                        <select
                            className="w-full sm:w-auto appearance-none bg-card border border-border rounded-[16px] sm:rounded-[20px] py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        >
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 sm:px-3 text-muted-foreground">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <button className="w-full sm:w-auto bg-primary text-primary-foreground text-sm font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-[16px] sm:rounded-[20px] flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                </div>
            </header>

            {/* Quick Actions */}
            <QuickActions />

            {/* Stat Cards */}
            <SalesInvoice />

            {/* Performance Metrics */}
            <PerformanceMetrics />

            {/* Sales Overview */}
            <div className="bg-card p-4 sm:p-6 lg:p-8 rounded-[20px] sm:rounded-[24px] shadow-lg shadow-black/5 border border-border mb-6 sm:mb-8">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 sm:mb-6 gap-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground text-center lg:text-left">Sales Overview</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                        {/* Chart Type Selector */}
                        <div className="flex items-center bg-muted rounded-[16px] sm:rounded-[20px] p-1 text-xs sm:text-sm w-full sm:w-auto">
                            {(['Bar', 'Line', 'Doughnut'] as ChartType[]).map((type) => (
                                <button
                                    key={type}
                                    className={`flex-1 sm:flex-none px-2 sm:px-4 py-1.5 sm:py-2 rounded-[12px] sm:rounded-[16px] transition-all duration-200 ${chartType === type
                                        ? 'bg-background text-foreground shadow-md shadow-black/10'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    onClick={() => setChartType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Sales Category Selector */}
                        <div className="flex items-center bg-muted rounded-[16px] sm:rounded-[20px] p-1 text-xs sm:text-sm w-full sm:w-auto">
                            {(['All Categories', 'Retail Sales', 'Inter-state Sales', 'Outer-state Sales'] as SalesCategory[]).map((category) => (
                                <button
                                    key={category}
                                    className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 rounded-[12px] sm:rounded-[16px] transition-all duration-200 ${selectedSalesCategory === category
                                        ? 'bg-background text-foreground shadow-md shadow-black/10'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    onClick={() => setSelectedSalesCategory(category)}
                                >
                                    {category.replace(' Sales', '')}
                                </button>
                            ))}
                        </div>

                        {/* Time Range Selector */}
                        <div className="flex items-center bg-muted rounded-[16px] sm:rounded-[20px] p-1 text-xs sm:text-sm w-full sm:w-auto">
                            {(['Daily', 'Weekly', 'Monthly'] as SalesTab[]).map((tab) => (
                                <button
                                    key={tab}
                                    className={`flex-1 sm:flex-none px-2 sm:px-4 py-1.5 sm:py-2 rounded-[12px] sm:rounded-[16px] transition-all duration-200 ${activeSalesTab === tab
                                        ? 'bg-background text-foreground shadow-md shadow-black/10'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    onClick={() => setActiveSalesTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="h-64 sm:h-80 lg:h-96">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <SalesChart data={getChartData()} options={chartOptions} chartType={chartType} />
                    )}
                </div>
            </div>

            {/* Recent Invoices */}
            <div className="mb-6 sm:mb-8">
                <RecentInvoices />
            </div>
        </main>
    );
}