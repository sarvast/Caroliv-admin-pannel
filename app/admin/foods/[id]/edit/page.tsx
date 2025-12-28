'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api, Food } from '@/lib/api';
import FoodForm from '@/components/FoodForm';
import { GlassCard } from '@/components/GlassCard';

export default function EditFoodPage() {
    const router = useRouter();
    const params = useParams();
    const [food, setFood] = useState<Food | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadFood();
    }, [params.id]);

    const loadFood = async () => {
        try {
            setLoading(true);
            const result = await api.getFoods();
            const found = result.data.find((f: Food) => f.id === params.id);
            if (found) {
                setFood(found);
            } else {
                setError('Food not found');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load food');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: any) => {
        await api.updateFood(params.id as string, data);
        router.push('/admin/foods');
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-gray-300">Loading food...</p>
                </div>
            </div>
        );
    }

    if (error || !food) {
        return (
            <div className="p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                        {error || 'Food not found'}
                    </div>
                    <button
                        onClick={() => router.push('/admin/foods')}
                        className="mt-4 text-blue-400 hover:text-blue-300"
                    >
                        ← Back to Foods
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Edit Food</h1>
                    <p className="text-gray-300">Update food item details</p>
                </div>

                <GlassCard className="p-6">
                    <FoodForm
                        food={food}
                        onSubmit={handleSubmit}
                        onCancel={() => router.push('/admin/foods')}
                    />
                </GlassCard>
            </div>
        </div>
    );
}
