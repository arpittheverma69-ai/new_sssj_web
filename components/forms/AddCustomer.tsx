"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { showToast, apiToast } from "@/utils/toast";
import { State } from "@/types/invoiceTypes";

import { Customer } from "@/types/invoiceTypes";

interface AddCustomerProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
    customerToEdit?: Customer | null;
    onCustomerSaved: () => void;
}

export default function AddCustomer({ setOpen, open, customerToEdit, onCustomerSaved }: AddCustomerProps) {
    const [states, setStates] = useState<State[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        gstin: "",
        state_id: "",
        address: "",
        city: "",
        pincode: "",
        phone: "",
        pan_number: "",
        email: "",
    });

    useEffect(() => {
        if (customerToEdit) {
            setFormData({
                name: customerToEdit.name || "",
                gstin: customerToEdit.gstin || "",
                state_id: customerToEdit.state_id?.toString() || "",
                address: customerToEdit.address || "",
                city: customerToEdit.city || "",
                pincode: customerToEdit.pincode || "",
                phone: customerToEdit.phone || "",
                pan_number: customerToEdit.pan_number || "",
                email: customerToEdit.email || "",
            });
        } else {
            setFormData({
                name: "",
                gstin: "",
                state_id: "",
                address: "",
                city: "",
                pincode: "",
                phone: "",
                pan_number: "",
                email: "",
            });
        }
    }, [customerToEdit]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                setLoading(true);
                const statesResponse = await fetch('/api/states');
                if (!statesResponse.ok) {
                    throw new Error('Failed to fetch states');
                }
                const statesData: State[] = await statesResponse.json();
                setStates(statesData);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                showToast.error('Failed to load states: ' + errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchStates();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name || !formData.address || !formData.city || !formData.phone) {
            setError('Name, address, city, and phone are required fields');
            showToast.error('Please fill in all required fields');
            return;
        }

        try {
            await apiToast.call(
                async () => {
                    // Prepare data for submission
                    const submissionData = {
                        ...formData,
                        state_id: formData.state_id ? parseInt(formData.state_id) : null
                    };

                    const url = customerToEdit ? `/api/customer/${customerToEdit.id}` : '/api/customer';
                    const method = customerToEdit ? 'PUT' : 'POST';

                    const response = await fetch(url, {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(submissionData),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to save customer');
                    }

                    const result = await response.json();

                    // Close modal, reset form, and refresh customer list on success
                    onCustomerSaved();
                    setOpen(false);
                    setFormData({
                        name: "",
                        gstin: "",
                        state_id: "",
                        address: "",
                        city: "",
                        pincode: "",
                        phone: "",
                        email: "",
                        pan_number: ""
                    });
                    setError(null);

                    return result;
                },
                {
                    loading: customerToEdit ? 'Updating customer...' : 'Adding customer...',
                    success: customerToEdit ? 'Customer updated successfully!' : 'Customer added successfully!',
                    error: customerToEdit ? 'Failed to update customer' : 'Failed to add customer'
                }
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    };

    return (
        <div className="flex flex-col items-center">
            {open && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 overflow-hidden"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="bg-card w-full max-w-[650px] max-h-screen overflow-hidden rounded-[24px] shadow-2xl shadow-black/20 border border-border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full h-screen overflow-y-scroll">
                            {/* Header */}
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-foreground">{customerToEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-2 rounded-[16px] hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="p-4 bg-destructive/10 text-destructive mx-6 mt-4 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-foreground">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-border rounded-[20px] px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                                            placeholder="Enter customer name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-foreground">
                                            PAN Card *
                                        </label>
                                        <input
                                            type="text"
                                            name="pan_number"
                                            value={formData.pan_number}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-border rounded-[20px] px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                                            placeholder="Enter customer name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-foreground">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-border rounded-[20px] px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-foreground">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full border border-border rounded-[20px] px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-foreground">
                                        Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        className="w-full border border-border rounded-[20px] px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 resize-none"
                                        placeholder="Enter customer address"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-foreground">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-border rounded-[20px] px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                                            placeholder="Enter city"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-foreground">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            className="w-full border border-border rounded-[20px] px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                                            placeholder="Enter pincode"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-foreground">
                                            State
                                        </label>
                                        <select
                                            name="state_id"
                                            value={formData.state_id}
                                            onChange={handleChange}
                                            className="w-full border border-border rounded-[20px] px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                                        >
                                            <option value="">Select State</option>
                                            {states.map((state) => (
                                                <option key={state.id} value={state.id}>
                                                    {state.state_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-foreground">
                                            GSTIN
                                        </label>
                                        <input
                                            type="text"
                                            name="gstin"
                                            value={formData.gstin}
                                            onChange={handleChange}
                                            className="w-full border border-border rounded-[20px] px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-200"
                                            placeholder="Enter GSTIN (optional)"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        className="px-6 py-3 border border-border rounded-[20px] text-foreground hover:bg-muted transition-all duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-primary text-primary-foreground rounded-[20px] hover:bg-primary/90 transition-all duration-200 font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                                    >
                                        {customerToEdit ? 'Update Customer' : 'Save Customer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}