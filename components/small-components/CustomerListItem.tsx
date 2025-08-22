import { Customer } from "@/types/shop-profile";
import { MoreVertical } from "lucide-react";

// Customer List Item Component
export const CustomerListItem = ({ customer }: { customer: Customer }) => (
    <div className="bg-card rounded-[20px] border border-border hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10">
        <div className="p-4">
            <div className="flex items-center gap-4">
                {/* <div className={`w-12 h-12 ${customer.category === 'premium' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-blue-400 to-purple-500'} rounded-[20px] flex items-center justify-center text-white font-bold text-lg`}> */}
                <div className={`w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-[20px] flex items-center justify-center text-white font-bold text-lg`}>
                    {customer.name.charAt(0)}
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                    <div>
                        <div className="font-semibold text-foreground">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{customer.phone}</div>
                    <div className="text-sm text-muted-foreground">{customer.state?.state_name}</div>
                    {/* <div className="text-sm text-foreground font-medium">{customer.totalInvoices}</div>
                    <div className="text-sm text-foreground font-medium">₹{(customer.totalAmount / 1000).toFixed(0)}K</div> */}
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-[12px] transition-colors duration-200">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);