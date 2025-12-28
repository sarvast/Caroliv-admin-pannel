'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import FoodForm from '@/components/FoodForm';
import { GlassCard } from '@/components/GlassCard';

export default function NewFoodPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        await api.createFood(data);
        router.push('/admin/foods');
    };

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Add New Food</h1>
                    <p className="text-gray-300">Create a new food item for the Caroliv database</p>
                </div>

                <GlassCard className="p-6">
                    <FoodForm
                        onSubmit={handleSubmit}
                        onCancel={() => router.push('/admin/foods')}
                    />
                </GlassCard>
            </div>
        </div>
    );
}
