'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, Exercise } from '@/lib/api';
import { GlassCard } from '@/components/GlassCard';

const CATEGORIES = ['chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'cardio', 'flexibility', 'other'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export default function ExercisesPage() {
    const router = useRouter();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({ category: '', difficulty: '', search: '' });

    useEffect(() => {
        loadExercises();
    }, [filter.category, filter.difficulty]);

    const loadExercises = async () => {
        try {
            setLoading(true);
            setError('');
            const result = await api.getExercises(filter.category, filter.difficulty, filter.search);
            setExercises(result.data || []);
        } catch (err: any) {
            console.error('Failed to load exercises:', err);
            setError(err.message || 'Failed to load exercises');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await api.deleteExercise(id);
            loadExercises();
        } catch (error: any) {
            alert(error.message || 'Failed to delete exercise');
        }
    };

    const filteredExercises = exercises.filter(exercise => {
        if (!filter.search) return true;
        const searchLower = filter.search.toLowerCase();
        return (
            exercise.name.toLowerCase().includes(searchLower) ||
            exercise.category.toLowerCase().includes(searchLower) ||
            exercise.difficulty.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Exercises</h1>
                        <p className="text-muted-foreground">Manage workout exercises library</p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/exercises/new')}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
                    >
                        + Add Exercise
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <GlassCard className="p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                value={filter.search}
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                placeholder="Search exercises..."
                                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Category
                            </label>
                            <select
                                value={filter.category}
                                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Difficulty
                            </label>
                            <select
                                value={filter.difficulty}
                                onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            >
                                <option value="">All Levels</option>
                                {DIFFICULTIES.map(diff => (
                                    <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => setFilter({ category: '', difficulty: '', search: '' })}
                                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-secondary-foreground hover:bg-accent transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </GlassCard>

                {/* Table */}
                <GlassCard className="overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="mt-4">Loading exercises...</p>
                        </div>
                    ) : filteredExercises.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <p className="text-lg">No exercises found</p>
                            {(filter.search || filter.category || filter.difficulty) && (
                                <p className="text-sm mt-2">Try adjusting your filters</p>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">GIF</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Difficulty</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Sets</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredExercises.map((exercise) => (
                                            <tr key={exercise.id} className="hover:bg-accent/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    {exercise.gifUrl ? (
                                                        <img
                                                            src={exercise.gifUrl}
                                                            alt={exercise.name}
                                                            className="w-16 h-16 rounded-lg object-cover border border-border"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23374151" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239CA3AF" font-size="12"%3ENo GIF%3C/text%3E%3C/svg%3E';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                                            No GIF
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-foreground font-medium">{exercise.name}</div>
                                                    {exercise.defaultSets && (
                                                        <div className="text-muted-foreground text-sm mt-1">{exercise.defaultSets}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary capitalize">
                                                        {exercise.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${exercise.difficulty === 'beginner' ? 'bg-success/20 text-success' :
                                                        exercise.difficulty === 'intermediate' ? 'bg-warning/20 text-warning' :
                                                            'bg-destructive/20 text-destructive'
                                                        } capitalize`}>
                                                        {exercise.difficulty}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground text-sm">
                                                    {exercise.defaultSets || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${exercise.isActive !== false ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {exercise.isActive !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => router.push(`/admin/exercises/${exercise.id}/edit`)}
                                                        className="text-primary hover:opacity-80 font-medium transition-all"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(exercise.id, exercise.name)}
                                                        className="text-destructive hover:opacity-80 font-medium transition-all"
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
                                {filteredExercises.map((exercise) => (
                                    <div key={exercise.id} className="bg-card/50 rounded-lg p-4 border border-border space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                {exercise.gifUrl ? (
                                                    <img
                                                        src={exercise.gifUrl}
                                                        alt={exercise.name}
                                                        className="w-16 h-16 rounded-lg object-cover border border-border"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23374151" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239CA3AF" font-size="12"%3ENo GIF%3C/text%3E%3C/svg%3E';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                                        No GIF
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-foreground text-lg">{exercise.name}</h3>
                                                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">
                                                        {exercise.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${exercise.isActive !== false ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {exercise.isActive !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/50">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase">Difficulty</p>
                                                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold ${exercise.difficulty === 'beginner' ? 'bg-success/20 text-success' :
                                                    exercise.difficulty === 'intermediate' ? 'bg-warning/20 text-warning' :
                                                        'bg-destructive/20 text-destructive'
                                                    } capitalize`}>
                                                    {exercise.difficulty}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase">Sets</p>
                                                <p className="font-semibold text-foreground">{exercise.defaultSets || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => router.push(`/admin/exercises/${exercise.id}/edit`)}
                                                className="flex-1 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exercise.id, exercise.name)}
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

                {/* Stats */}
                {!loading && filteredExercises.length > 0 && (
                    <div className="mt-6 text-center text-muted-foreground text-sm">
                        Showing {filteredExercises.length} of {exercises.length} exercises
                    </div>
                )}
            </div>
        </div>
    );
}
