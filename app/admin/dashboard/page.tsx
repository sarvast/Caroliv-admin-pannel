'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { api } from '@/lib/api';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.getStats();
                if (res.success) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error('Failed to load stats', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-400 font-mono animate-pulse">Initializing Neural Link...</div>;
    }

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            <header className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Caloriv Command Center
                </h1>
                <p className="text-sm md:text-base text-gray-400 mt-2">v69.0.1 • Neural Net Online</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <GlassCard className="p-4 md:p-6 flex flex-col items-center justify-center border-t-4 border-t-blue-500">
                    <span className="text-3xl md:text-4xl font-bold text-white mb-2">{stats?.users || 0}</span>
                    <span className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-widest text-center">Active Users</span>
                </GlassCard>

                <GlassCard className="p-4 md:p-6 flex flex-col items-center justify-center border-t-4 border-t-green-500">
                    <span className="text-3xl md:text-4xl font-bold text-white mb-2">{stats?.foods || 0}</span>
                    <span className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-widest text-center">Database Foods</span>
                </GlassCard>

                <GlassCard className="p-4 md:p-6 flex flex-col items-center justify-center border-t-4 border-t-purple-500">
                    <span className="text-3xl md:text-4xl font-bold text-white mb-2">{stats?.exercises || 0}</span>
                    <span className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-widest text-center">Workout Library</span>
                </GlassCard>

                <GlassCard className="p-4 md:p-6 flex flex-col items-center justify-center border-t-4 border-t-orange-500">
                    <span className="text-3xl md:text-4xl font-bold text-white mb-2">{stats?.pending || 0}</span>
                    <span className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-widest text-center">Pending Approvals</span>
                </GlassCard>
            </div>

        </div>
    );
}
