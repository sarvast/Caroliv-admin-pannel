'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ExerciseForm from '@/components/ExerciseForm';
import GlassCard from '@/components/GlassCard';

export default function NewExercisePage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        await api.createExercise(data);
        router.push('/admin/exercises');
    };

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Add New Exercise</h1>
                    <p className="text-gray-300">Create a new exercise for the Caroliv library</p>
                </div>

                <GlassCard className="p-6">
                    <ExerciseForm
                        onSubmit={handleSubmit}
                        onCancel={() => router.push('/admin/exercises')}
                    />
                </GlassCard>
            </div>
        </div>
    );
}
