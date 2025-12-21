'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api, Exercise } from '@/lib/api';
import ExerciseForm from '@/components/ExerciseForm';
import GlassCard from '@/components/GlassCard';

export default function EditExercisePage() {
    const router = useRouter();
    const params = useParams();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadExercise();
    }, [params.id]);

    const loadExercise = async () => {
        try {
            setLoading(true);
            const result = await api.getExercises();
            const found = result.data.find((ex: Exercise) => ex.id === params.id);
            if (found) {
                setExercise(found);
            } else {
                setError('Exercise not found');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load exercise');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: any) => {
        await api.updateExercise(params.id as string, data);
        router.push('/admin/exercises');
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-gray-300">Loading exercise...</p>
                </div>
            </div>
        );
    }

    if (error || !exercise) {
        return (
            <div className="p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                        {error || 'Exercise not found'}
                    </div>
                    <button
                        onClick={() => router.push('/admin/exercises')}
                        className="mt-4 text-blue-400 hover:text-blue-300"
                    >
                        ← Back to Exercises
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Edit Exercise</h1>
                    <p className="text-gray-300">Update exercise details</p>
                </div>

                <GlassCard className="p-6">
                    <ExerciseForm
                        exercise={exercise}
                        onSubmit={handleSubmit}
                        onCancel={() => router.push('/admin/exercises')}
                    />
                </GlassCard>
            </div>
        </div>
    );
}
