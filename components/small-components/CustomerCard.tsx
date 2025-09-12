import { Customer } from "@/types/invoiceTypes";
import { Edit, Eye, Mail, MapPin, MoreVertical, Phone, Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';

interface CustomerCardProps {
    customer: Customer;
    onView?: (customer: Customer) => void;
    onEdit?: (customer: Customer) => void;
    onDelete?: (customer: Customer) => void;
}

// Customer Card Component
export const CustomerCard = ({ customer, onView, onEdit, onDelete }: CustomerCardProps) => {
    const router = useRouter();
    return (
    <div className="bg-card rounded-[24px] border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
        <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* <div className={`w-12 h-12 ${customer.category === 'premium' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-400 to-purple-500'} rounded-[20px] flex items-center justify-center text-white font-bold text-lg`}> */}
                    <div className={`w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-[20px] flex items-center justify-center text-white font-bold text-lg`}>
                        {customer.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-lg">{customer.name}</h3>
                        <div className="flex items-center gap-2">
                            {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.category === 'premium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {customer.category}
                                </span> */}
                        </div>
                    </div>
                </div>
                            </div>

            {/* Contact Info */}
            <button onClick={() => router.push(`/dashboard/customers/${customer.id}`)} className="w-full text-left">
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span className="line-clamp-2">{customer.address}</span>
                </div>
            </div>
            </button>

            {/* Tags */}
            {/* <div className="flex flex-wrap gap-1 mb-4">
                    {customer.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-[8px]">
                            {tag}
                        </span>
                    ))}
                </div> */}

            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                        <div className="text-lg font-bold text-foreground">{customer.totalInvoices}</div>
                        <div className="text-xs text-muted-foreground">Invoices</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-foreground">₹{(customer.totalAmount / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-foreground">₹{(customer.totalAmount / customer.totalInvoices).toFixed(0)}</div>
                        <div className="text-xs text-muted-foreground">Avg</div>
                    </div>
                </div> */}

            {/* Actions */}
            <div className="flex gap-2">
                <button 
                    onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                    className="flex-1 bg-primary text-primary-foreground py-2 px-3 rounded-[12px] text-sm font-medium hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    View
                </button>
                <button 
                    onClick={() => onEdit?.(customer)}
                    className="flex-1 bg-secondary text-secondary-foreground py-2 px-3 rounded-[12px] text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <Edit className="w-4 h-4" />
                    Edit
                </button>
                <button 
                    onClick={() => onDelete?.(customer)}
                    className="bg-destructive/10 text-destructive py-2 px-3 rounded-[12px] text-sm font-medium hover:bg-destructive/20 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);
}