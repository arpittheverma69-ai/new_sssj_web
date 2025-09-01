"use client"
import { useState, useEffect } from 'react';
import { User, Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface UserFormData {
    username: string;
    email: string;
    password: string;
    role: string;
}

const UserManagementTab = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingUser, setEditingUser] = useState<number | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });

    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to fetch users');
            }
        } catch (error) {
            toast.error('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.email || (!editingUser && !formData.password)) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const url = editingUser ? `/api/admin/users/${editingUser}` : '/api/admin/users';
            const method = editingUser ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(editingUser ? 'User updated successfully' : 'User created successfully');
                resetForm();
                fetchUsers();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Operation failed');
            }
        } catch (error) {
            toast.error('Error saving user');
        }
    };

    // Handle delete user
    const handleDelete = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('User deleted successfully');
                fetchUsers();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to delete user');
            }
        } catch (error) {
            toast.error('Error deleting user');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            role: 'user'
        });
        setShowAddForm(false);
        setEditingUser(null);
        setShowPassword(false);
    };

    // Start editing user
    const startEdit = (user: UserData) => {
        setFormData({
            username: user.name,
            email: user.email,
            password: '',
            role: user.role
        });
        setEditingUser(user.id);
        setShowAddForm(true);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">User Management</h3>
                    <p className="text-muted-foreground">Manage user accounts and permissions</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {/* Add/Edit User Form */}
            {showAddForm && (
                <div className="bg-muted/30 rounded-lg p-6 mb-6 border border-border">
                    <h4 className="text-lg font-medium mb-4">
                        {editingUser ? 'Edit User' : 'Add New User'}
                    </h4>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Username *</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Password {!editingUser && '*'}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 pr-10 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                                    required={!editingUser}
                                    placeholder={editingUser ? 'Leave blank to keep current password' : ''}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex gap-3">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                {editingUser ? 'Update User' : 'Create User'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-background rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="text-left p-4 font-medium text-foreground">User</th>
                                <th className="text-left p-4 font-medium text-foreground">Email</th>
                                <th className="text-left p-4 font-medium text-foreground">Role</th>
                                <th className="text-left p-4 font-medium text-foreground">Created</th>
                                <th className="text-right p-4 font-medium text-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-muted-foreground">
                                        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="border-t border-border hover:bg-muted/20">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="font-medium text-foreground">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => startEdit(user)}
                                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    title="Edit user"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagementTab;
