"use client"
import { useState } from 'react';

interface ShopProfileData {
    shopName: string;
    gstin: string;
    address: string;
    city: string;
    state: string;
    stateCode: string;
    vatTin: string;
    panNumber: string;
    bankName: string;
    branchIfsc: string;
}

const ShopProfileTab = () => {
    const [formData, setFormData] = useState<ShopProfileData>({
        shopName: 'J.V. JEWELLERS',
        gstin: '09ADCPV2673H1Z7',
        address: 'SHOP NO. -2, KRISHNA HEIGHT, JAY SINGH PURA',
        city: 'MATHURA',
        state: 'Uttar Pradesh',
        stateCode: '09 (UP)',
        vatTin: '09627100742',
        panNumber: 'ADCPV2673H',
        bankName: 'ICICI BANK C/A NO. 027405001417 (JVM)',
        branchIfsc: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Shop Profile</h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-600 text-sm md:text-base">Shop Name</label>
                        <input
                            type="text"
                            name="shopName"
                            value={formData.shopName}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm md:text-base">GSTIN</label>
                        <input
                            type="text"
                            name="gstin"
                            value={formData.gstin}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-600 text-sm md:text-base">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm md:text-base">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm md:text-base">State</label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base"
                        >
                            <option>Uttar Pradesh</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm md:text-base">State Code</label>
                        <select
                            name="stateCode"
                            value={formData.stateCode}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base"
                        >
                            <option>09 (UP)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm md:text-base">VAT TIN</label>
                        <input
                            type="text"
                            name="vatTin"
                            value={formData.vatTin}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm md:text-base">PAN Number</label>
                        <input
                            type="text"
                            name="panNumber"
                            value={formData.panNumber}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-gray-600 text-sm md:text-base">Bank Name</label>
                        <input
                            type="text"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-600 text-sm md:text-base">Branch & IFSC Code</label>
                        <input
                            type="text"
                            name="branchIfsc"
                            value={formData.branchIfsc}
                            onChange={handleChange}
                            placeholder="Enter Branch & IFSC Code"
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 text-sm md:text-base"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ShopProfileTab; 