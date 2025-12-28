'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const { user, token, logout } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        fetchStats();
    }, [token]);

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

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
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Caloriv Admin</h1>
                        <p className="text-purple-200">Welcome back, {user?.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-6 py-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg text-white hover:bg-red-500/30 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon="👥"
                    color="from-blue-500 to-cyan-500"
                />
                <StatCard
                    title="Total Foods"
                    value={stats?.totalFoods || 0}
                    icon="🍽️"
                    color="from-green-500 to-emerald-500"
                />
                <StatCard
                    title="Total Exercises"
                    value={stats?.totalExercises || 0}
                    icon="💪"
                    color="from-orange-500 to-red-500"
                />
                <StatCard
                    title="Pending Submissions"
                    value={(stats?.pendingFoodSubmissions || 0) + (stats?.pendingExerciseSubmissions || 0)}
                    icon="⏳"
                    color="from-purple-500 to-pink-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ActionCard
                        title="Manage Users"
                        description="View and manage all registered users"
                        icon="👥"
                        href="/users"
                    />
                    <ActionCard
                        title="Manage Foods"
                        description="Add, edit, or remove food items"
                        icon="🍽️"
                        href="/foods"
                    />
                    <ActionCard
                        title="Manage Exercises"
                        description="Add, edit, or remove exercises"
                        icon="💪"
                        href="/exercises"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r ${color} opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity"></div>
            <div className="relative glass rounded-2xl p-6 hover:bg-white/15 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{icon}</span>
                    <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-full opacity-20`}></div>
                </div>
                <h3 className="text-white/70 text-sm font-medium mb-1">{title}</h3>
                <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
            </div>
        </div>
    );
}

function ActionCard({ title, description, icon, href }: any) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push(href)}
            className="relative group text-left"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity"></div>
            <div className="relative glass rounded-2xl p-6 hover:bg-white/15 hover:border-white/30 transition-all">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/70 text-sm">{description}</p>
            </div>
        </button>
    );
}
