'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    age: number;
    gender: string;
    height: number;
    currentWeight: number;
    targetWeight: number;
    goal: string;
    createdAt: string;
}

export default function UsersPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                alert('User deleted successfully');
                fetchUsers(); // Refresh list
            } else {
                alert('Failed to delete user: ' + data.error);
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Error deleting user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="mb-4 px-4 py-2 glass-morphism rounded-lg text-white hover:bg-white/20 transition-all"
                >
                    ← Back to Dashboard
                </button>

                <h1 className="text-4xl font-bold text-white mb-4">User Management</h1>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search users by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md px-4 py-3 glass-morphism rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                />
            </div>

            {/* Users Table */}
            <div className="max-w-7xl mx-auto">
                <div className="glass-morphism rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Age</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Gender</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Current Weight</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Target Weight</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Goal</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Joined</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 text-sm text-white">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-white">{user.name || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-white">{user.age || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-white capitalize">{user.gender || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-white">{user.currentWeight ? `${user.currentWeight} kg` : '-'}</td>
                                        <td className="px-6 py-4 text-sm text-white">{user.targetWeight ? `${user.targetWeight} kg` : '-'}</td>
                                        <td className="px-6 py-4 text-sm text-white capitalize">{user.goal || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-white">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white">
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Are you sure you want to delete user ${user.email}?`)) {
                                                        handleDeleteUser(user.id);
                                                    }
                                                }}
                                                className="px-3 py-1 bg-red-500/20 border border-red-500/40 rounded text-red-300 hover:bg-red-500/40 transition-all text-xs"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-white/70">
                            No users found
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-6 text-white/70 text-sm">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            </div>
        </div>
    );
}
