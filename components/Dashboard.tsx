"use client"
import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import RecentInvoicesTable from './invoice-table/InvoicesTable';
import SalesInvoice from './small-components/SalesInvoice';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Types
type TimeRange = 'This Month' | 'Last Month' | 'This Year';
type SalesTab = 'Daily' | 'Weekly' | 'Monthly';

// Interfaces for chart data
interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderRadius: number;
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
    scales: {
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

// SalesChart Component
const SalesChart = ({ data, options }: { data: ChartData; options: ChartOptions }) => {
    return (
        <div className="h-64 md:h-80">
            <Bar data={data} options={options} />
        </div>
    );
};

// Main Dashboard Component
export default function Dashboard() {
    const [timeRange, setTimeRange] = useState<TimeRange>('This Month');
    const [activeSalesTab, setActiveSalesTab] = useState<SalesTab>('Daily');

    // Chart data with all three datasets
    const salesChartData: ChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Retail Sales',
                data: [12000, 19000, 15000, 18000, 21000, 19000, 23000],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderRadius: 4,
            },
            {
                label: 'Inter-city Sales',
                data: [8000, 11000, 9000, 12000, 15000, 13000, 17000],
                backgroundColor: 'rgba(124, 58, 237, 0.7)',
                borderRadius: 4,
            },
            {
                label: 'Purchases',
                data: [7000, 9000, 8000, 10000, 12000, 11000, 13000],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderRadius: 4,
            },
        ],
    };

    const salesChartOptions: ChartOptions = {
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

    return (
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {/* Header */}
            <header className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h2>
                    <p className="text-slate-500 text-sm md:text-base">Overview of your sales and invoices</p>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-slate-300 rounded-md py-2 pl-3 pr-8 text-sm md:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        >
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <button className="bg-blue-500 text-white text-sm md:text-base font-semibold py-2 px-3 md:px-4 rounded-md flex items-center gap-2 hover:bg-blue-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden md:inline">Refresh</span>
                    </button>
                </div>
            </header>

            {/* Stat Cards */}
            <SalesInvoice />


            {/* Sales Overview */}
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6 md:mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
                    <h3 className="text-lg md:text-xl font-bold text-slate-800">Sales Overview</h3>
                    <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs md:text-sm">
                        {(['Daily', 'Weekly', 'Monthly'] as SalesTab[]).map((tab) => (
                            <button
                                key={tab}
                                className={`px-3 py-1 md:px-4 md:py-1.5 rounded-md ${activeSalesTab === tab ? 'bg-white shadow-sm' : ''}`}
                                onClick={() => setActiveSalesTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <SalesChart data={salesChartData} options={salesChartOptions} />
            </div>

            {/* Recent Invoices */}
            <RecentInvoicesTable />
        </main>
    );
}