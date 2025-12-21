'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { api } from '@/lib/api';

interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
    age?: number;
    gender?: string;
    height?: number;
    weight?: number; // Backend field name
    currentWeight?: number; // Display field
    targetWeight?: number;
    goal?: string;
    chest?: number;
    waist?: number;
    arms?: number;
    hips?: number;
    createdAt: string;
}



export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // Use api.call to leverage the base URL configuration
            const response = await api.call('/admin/users', { requiresAuth: true });
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) return;

        try {
            await api.call(`/admin/users/${id}`, { method: 'DELETE', requiresAuth: true });
            setUsers(users.filter(u => u.id !== id));
        } catch (error: any) {
            alert(error.message || 'Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-foreground">Loading users...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Users Management
                    </h1>
                    <p className="text-muted-foreground">
                        Total Users: {users.length}
                    </p>
                </div>

                {/* Search */}
                <GlassCard className="mb-6 p-4">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </GlassCard>

                {/* Content */}
                <GlassCard className="overflow-hidden">
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No users found</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-b border-border">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Gender</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Age</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Weight</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Target</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Goal</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-accent/50 transition-colors cursor-pointer"
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-foreground">{user.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-muted-foreground">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-xs text-muted-foreground font-mono truncate max-w-[100px]" title={user.password}>
                                                        {user.password ? `${user.password.substring(0, 10)}...` : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                        {user.gender || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                    {user.age || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                    {user.currentWeight ? `${user.currentWeight} kg` : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                                    {user.targetWeight ? `${user.targetWeight} kg` : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.goal === 'lose' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                        user.goal === 'gain' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                        } capitalize`}>
                                                        {user.goal || 'maintain'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(user.id, user.name);
                                                        }}
                                                        className="text-destructive hover:text-destructive/80 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards View */}
                            <div className="md:hidden space-y-4 p-4">
                                {filteredUsers.map((user) => (
                                    <div key={user.id} className="bg-card/50 rounded-lg p-4 border border-border space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-foreground text-lg">{user.name}</h3>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.goal === 'lose' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                user.goal === 'gain' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                } capitalize`}>
                                                {user.goal || 'maintain'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/50">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase">Weight</p>
                                                <p className="font-semibold text-foreground">{user.currentWeight ? `${user.currentWeight} kg` : '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase">Target</p>
                                                <p className="font-semibold text-foreground">{user.targetWeight ? `${user.targetWeight} kg` : '-'}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="flex-1 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id, user.name)}
                                                className="flex-1 py-2 rounded-lg bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </GlassCard>

                {/* User Details Modal */}
                {selectedUser && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                        onClick={() => setSelectedUser(null)}
                    >
                        <GlassCard
                            className="max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-foreground">User Details</h2>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="text-muted-foreground hover:text-foreground p-1"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="text-lg font-semibold text-foreground">{selectedUser.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="text-lg font-semibold text-foreground">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Password</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-mono text-foreground break-all truncate max-w-[150px]">
                                            {selectedUser.password || '••••••••'}
                                        </p>
                                        <button
                                            onClick={async () => {
                                                const newPassword = prompt('Enter new temporary password for this user:');
                                                if (!newPassword) return;

                                                try {
                                                    const res = await api.resetUserPassword(selectedUser.id, newPassword);
                                                    alert(res.message || 'Password reset successfully');
                                                    fetchUsers(); // Refresh list
                                                } catch (err: any) {
                                                    alert('Failed to reset password: ' + err.message);
                                                }
                                            }}
                                            className="ml-2 text-xs bg-primary/20 hover:bg-primary/30 text-primary px-2 py-1 rounded transition"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Encrypted (bcrypt)</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Gender</p>
                                    <p className="text-lg font-semibold text-foreground capitalize">{selectedUser.gender || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Age</p>
                                    <p className="text-lg font-semibold text-foreground">{selectedUser.age || 'N/A'} years</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Height</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {selectedUser.height ? `${selectedUser.height} cm` : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Current Weight</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {selectedUser.currentWeight ? `${selectedUser.currentWeight} kg` : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Target Weight</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {selectedUser.targetWeight ? `${selectedUser.targetWeight} kg` : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Goal</p>
                                    <p className="text-lg font-semibold text-foreground capitalize">
                                        {selectedUser.goal || 'maintain'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Joined</p>
                                    <p className="text-lg font-semibold text-foreground">
                                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Measurements Section */}
                                <div className="md:col-span-2 mt-4 pt-4 border-t border-border">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Latest Measurements</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Chest</p>
                                            <p className="text-lg font-semibold text-foreground">{selectedUser.chest ? `${selectedUser.chest}"` : '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Waist</p>
                                            <p className="text-lg font-semibold text-foreground">{selectedUser.waist ? `${selectedUser.waist}"` : '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Arms</p>
                                            <p className="text-lg font-semibold text-foreground">{selectedUser.arms ? `${selectedUser.arms}"` : '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Hips</p>
                                            <p className="text-lg font-semibold text-foreground">{selectedUser.hips ? `${selectedUser.hips}"` : '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => handleDelete(selectedUser.id, selectedUser.name)}
                                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    Delete User
                                </button>
                            </div>
                        </GlassCard>
                    </div>
                )}
            </div>
        </div>
    );
}
