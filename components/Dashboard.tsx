"use client"
import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import SalesInvoice from './small-components/SalesInvoice';
import { TrendingUp, TrendingDown, DollarSign, Users, Package, Clock, Calendar, ArrowUpRight, Plus, FileText, BarChart3, PieChart, Activity, Search, Eye, Download, Edit, ArrowRight } from 'lucide-react';

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
        { icon: Plus, label: 'Create Invoice', description: 'Generate new invoice', color: 'bg-blue-500', href: '/create-invoice' },
        { icon: Users, label: 'Add Customer', description: 'Register new customer', color: 'bg-green-500', href: '/customers' },
        { icon: FileText, label: 'View Reports', description: 'Analytics & insights', color: 'bg-purple-500', href: '/reports' },
        { icon: Package, label: 'Manage Items', description: 'Product catalog', color: 'bg-orange-500', href: '/setting' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                    <a
                        key={index}
                        href={action.href}
                        className="group bg-card p-6 rounded-[20px] border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${action.color} rounded-[16px] flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                                    {action.label}
                                </h4>
                                <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200" />
                        </div>
                    </a>
                );
            })}
        </div>
    );
};

// Activity Feed Component
const ActivityFeed = () => {
    const activities = [
        { type: 'invoice', message: 'Invoice #INV-001 created for John Doe', time: '2 minutes ago', status: 'success' },
        { type: 'customer', message: 'New customer Jane Smith registered', time: '15 minutes ago', status: 'info' },
        { type: 'payment', message: 'Payment received for Invoice #INV-001', time: '1 hour ago', status: 'success' },
        { type: 'reminder', message: 'Payment reminder sent for Invoice #INV-002', time: '2 hours ago', status: 'warning' },
        { type: 'report', message: 'Monthly sales report generated', time: '1 day ago', status: 'info' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-blue-500';
        }
    };

    const getStatusIcon = (type: string) => {
        switch (type) {
            case 'invoice': return FileText;
            case 'customer': return Users;
            case 'payment': return DollarSign;
            case 'reminder': return Clock;
            case 'report': return BarChart3;
            default: return Activity;
        }
    };

    return (
        <div className="bg-card p-6 rounded-[24px] shadow-lg shadow-black/5 border border-border">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/10 rounded-[20px] flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
                    <p className="text-muted-foreground">Latest updates and notifications</p>
                </div>
            </div>
            
            <div className="space-y-4">
                {activities.map((activity, index) => {
                    const Icon = getStatusIcon(activity.type);
                    return (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-[16px] hover:bg-muted/30 transition-colors duration-200">
                            <div className={`w-2 h-2 ${getStatusColor(activity.status)} rounded-full mt-2 flex-shrink-0`}></div>
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-foreground">{activity.message}</p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Performance Metrics Component
const PerformanceMetrics = () => {
    const metrics = [
        { label: 'Conversion Rate', value: '12.5%', trend: '+2.1%', icon: TrendingUp, color: 'text-green-500' },
        { label: 'Avg. Order Value', value: '₹2,450', trend: '+8.3%', icon: DollarSign, color: 'text-blue-500' },
        { label: 'Customer Retention', value: '87.2%', trend: '+1.8%', icon: Users, color: 'text-purple-500' },
        { label: 'Response Time', value: '2.3h', trend: '-0.5h', icon: Clock, color: 'text-orange-500' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, index) => (
                <div key={index} className="bg-card p-4 rounded-[20px] border border-border hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 ${metric.color.replace('text-', 'bg-')}/10 rounded-[16px] flex items-center justify-center`}>
                            <metric.icon className={`w-5 h-5 ${metric.color}`} />
                        </div>
                        <div className={`text-sm font-medium ${metric.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {metric.trend}
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
            ))}
        </div>
    );
};

// Recent Invoices Component
const RecentInvoices = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Mock recent invoices data
    const recentInvoices = [
        {
            id: 'INV001',
            date: '2025-08-10',
            customer: 'John Doe',
            type: 'Service',
            amount: 250
        },
        {
            id: 'INV002',
            date: '2025-08-11',
            customer: 'Jane Smith',
            type: 'Product',
            amount: 500
        },
        {
            id: 'INV003',
            date: '2025-08-12',
            customer: 'David Wilson',
            type: 'Service',
            amount: 150
        },
        {
            id: 'INV004',
            date: '2025-08-13',
            customer: 'Sarah Johnson',
            type: 'Product',
            amount: 750
        },
        {
            id: 'INV005',
            date: '2025-08-14',
            customer: 'Mike Brown',
            type: 'Service',
            amount: 300
        }
    ];

    // Filter invoices based on search
    const filteredInvoices = recentInvoices.filter(invoice =>
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="bg-card rounded-[24px] shadow-lg shadow-black/5 border border-border">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">Recent Invoices</h3>
                        <p className="text-muted-foreground text-sm">Latest invoice activities</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-border rounded-[16px] bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50 text-sm"
                            />
                        </div>
                        {/* View All Button */}
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-[16px] hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                            View All
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-muted/30 border-b border-border">
                            <th className="text-left p-4 text-sm font-semibold text-foreground">Invoice No.</th>
                            <th className="text-left p-4 text-sm font-semibold text-foreground">Date</th>
                            <th className="text-left p-4 text-sm font-semibold text-foreground">Customer</th>
                            <th className="text-left p-4 text-sm font-semibold text-foreground">Type</th>
                            <th className="text-left p-4 text-sm font-semibold text-foreground">Amount</th>
                            <th className="text-left p-4 text-sm font-semibold text-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredInvoices.map((invoice, index) => (
                            <tr key={invoice.id} className="hover:bg-muted/20 transition-colors duration-200">
                                <td className="p-4">
                                    <div className="font-semibold text-foreground text-sm">{invoice.id}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-foreground">
                                        {new Date(invoice.date).toLocaleDateString('en-IN')}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-foreground text-sm">{invoice.customer}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-foreground">{invoice.type}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-semibold text-foreground text-sm">{formatCurrency(invoice.amount)}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200" title="View">
                                            <Eye className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                        <button className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200" title="Edit">
                                            <Edit className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                        <button className="p-2 hover:bg-muted rounded-[8px] transition-colors duration-200" title="Download">
                                            <Download className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>1–{filteredInvoices.length} of {recentInvoices.length}</div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 hover:bg-background rounded-[8px] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Previous
                        </button>
                        <button className="px-3 py-1 hover:bg-background rounded-[8px] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Dashboard Component
export default function Dashboard() {
    const [timeRange, setTimeRange] = useState<TimeRange>('This Month');
    const [activeSalesTab, setActiveSalesTab] = useState<SalesTab>('Daily');
    const [chartType, setChartType] = useState<ChartType>('Bar');

    // Enhanced chart data with more realistic values
    const salesChartData: ChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Retail Sales',
                data: [12000, 19000, 15000, 18000, 21000, 19000, 23000],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderRadius: 12,
                fill: false,
            },
            {
                label: 'Inter-state Sales',
                data: [8000, 11000, 9000, 12000, 15000, 13000, 17000],
                backgroundColor: 'rgba(124, 58, 237, 0.7)',
                borderColor: 'rgba(124, 58, 237, 1)',
                borderRadius: 12,
                fill: false,
            },
            {
                label: 'Purchases',
                data: [7000, 9000, 8000, 10000, 12000, 11000, 13000],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderRadius: 12,
                fill: false,
            },
        ],
    };

    // Line chart data for trend analysis
    const lineChartData: ChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Revenue Trend',
                data: [20000, 30000, 24000, 30000, 36000, 32000, 40000],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderRadius: 0,
                fill: true,
            },
        ],
    };

    // Doughnut chart data for category breakdown
    const doughnutChartData: ChartData = {
        labels: ['Retail Sales', 'Inter-state Sales', 'Purchases', 'Services'],
        datasets: [
            {
                label: 'Revenue Distribution',
                data: [45, 25, 20, 10],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(124, 58, 237, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                ],
                borderRadius: 0,
            },
        ],
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
                return lineChartData;
            case 'Doughnut':
                return doughnutChartData;
            default:
                return salesChartData;
        }
    };

    return (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-6">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Dashboard</h2>
                    <p className="text-muted-foreground text-base md:text-lg">Overview of your sales and invoices</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            className="appearance-none bg-card border border-border rounded-[20px] py-3 pl-4 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:border-primary/50"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        >
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <button className="bg-primary text-primary-foreground text-sm font-semibold py-3 px-6 rounded-[20px] flex items-center gap-2 hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden md:inline">Refresh</span>
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
            <div className="bg-card p-6 md:p-8 rounded-[24px] shadow-lg shadow-black/5 border border-border mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">Sales Overview</h3>
                    <div className="flex items-center gap-4">
                        {/* Chart Type Selector */}
                        <div className="flex items-center bg-muted rounded-[20px] p-1 text-sm">
                            {(['Bar', 'Line', 'Doughnut'] as ChartType[]).map((type) => (
                                <button
                                    key={type}
                                    className={`px-4 py-2 rounded-[16px] transition-all duration-200 ${
                                        chartType === type 
                                            ? 'bg-background text-foreground shadow-md shadow-black/10' 
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                    onClick={() => setChartType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        
                        {/* Time Range Selector */}
                        <div className="flex items-center bg-muted rounded-[20px] p-1 text-sm">
                        {(['Daily', 'Weekly', 'Monthly'] as SalesTab[]).map((tab) => (
                            <button
                                key={tab}
                                    className={`px-4 py-2 rounded-[16px] transition-all duration-200 ${
                                        activeSalesTab === tab 
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
                <SalesChart data={getChartData()} options={chartOptions} chartType={chartType} />
            </div>

            {/* Activity Feed and Recent Invoices Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Activity Feed */}
                <div className="lg:col-span-1">
                    <ActivityFeed />
            </div>

            {/* Recent Invoices */}
                <div className="lg:col-span-2">
                    <RecentInvoices />
                </div>
            </div>
        </main>
    );
}