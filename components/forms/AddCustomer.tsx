"use client";
import React, { useState } from "react";

interface AddCustomerProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
}

export default function AddCustomer({ setOpen, open }: AddCustomerProps) {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: ""
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        setOpen(false);
    };

    return (
        <div className="flex flex-col items-center">
            {open && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-40 z-50"
                    onClick={() => setOpen(false)} // click outside closes popup
                >
                    <div
                        className="bg-white w-full max-w-lg mx-4 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside form
                    >
                        {/* Header */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-semibold">Add New Customer</h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-500 hover:text-gray-800"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Address *
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 border rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
