"use client"
import { useState, useEffect } from 'react';

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
        shopName: '',
        gstin: '',
        address: '',
        city: '',
        state: '',
        stateCode: '',
        vatTin: '',
        panNumber: '',
        bankName: '',
        branchIfsc: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [states, setStates] = useState<Array<{ state: string, statecode: string }>>([]);

    // Fetch shop profile data and states on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch states first
                const statesResponse = await fetch('/api/states');
                if (!statesResponse.ok) {
                    throw new Error('Failed to fetch states');
                }
                const statesData = await statesResponse.json();
                setStates(statesData);

                // Then fetch shop profile
                const profileResponse = await fetch('/api/setting/shopprofile');
                if (!profileResponse.ok) {
                    throw new Error('Failed to fetch shop profile');
                }
                const profileData = await profileResponse.json();
                setFormData(profileData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedState = states.find(s => s.state === e.target.value);
        if (selectedState) {
            setFormData(prev => ({
                ...prev,
                state: selectedState.state,
                stateCode: `${selectedState.statecode} (${selectedState.state.slice(0, 2).toUpperCase()})`
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/setting/shopprofile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to save shop profile');
            }

            const result = await response.json();
            setFormData(result.data);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.shopName) {
        return <div className="p-4 md:p-6">Loading shop profile...</div>;
    }

    if (error) {
        return <div className="p-4 md:p-6 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Shop Profile</h2>

            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    Shop profile saved successfully!
                </div>
            )}

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
                            required
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
                            required
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
                            required
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
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm md:text-base">State</label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleStateChange}
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base"
                            required
                        >
                            <option value="">Select State</option>
                            {states.map((state) => (
                                <option key={state.statecode} value={state.state}>
                                    {state.state}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm md:text-base">State Code</label>
                        <input
                            type="text"
                            name="stateCode"
                            value={formData.stateCode}
                            readOnly
                            className="w-full border rounded px-3 py-2 mt-1 text-sm md:text-base bg-gray-100"
                            required
                        />
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
                        disabled={loading}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 text-sm md:text-base disabled:bg-blue-300"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ShopProfileTab;