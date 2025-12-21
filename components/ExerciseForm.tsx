'use client';

import { useState, FormEvent } from 'react';
import { Exercise } from '@/lib/api';

interface ExerciseFormProps {
    exercise?: Exercise;
    onSubmit: (data: Partial<Exercise>) => Promise<void>;
    onCancel: () => void;
}

const CATEGORIES = ['chest', 'back', 'shoulders', 'legs', 'arms', 'core', 'cardio', 'flexibility', 'other'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export default function ExerciseForm({ exercise, onSubmit, onCancel }: ExerciseFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<Partial<Exercise>>({
        name: exercise?.name || '',
        category: exercise?.category || 'chest',
        difficulty: exercise?.difficulty || 'beginner',
        gifUrl: exercise?.gifUrl || '',
        defaultSets: exercise?.defaultSets || '',
        description: exercise?.description || '',
        instructions: exercise?.instructions || '',
        isActive: exercise?.isActive !== false,
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || 'Failed to save exercise');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof Exercise, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                    Exercise Name *
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Push-Ups"
                    required
                />
            </div>

            {/* Category & Difficulty */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Category *
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Difficulty *
                    </label>
                    <select
                        value={formData.difficulty}
                        onChange={(e) => handleChange('difficulty', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    >
                        {DIFFICULTIES.map(diff => (
                            <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* GIF URL */}
            <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                    GIF URL
                </label>
                <input
                    type="url"
                    value={formData.gifUrl}
                    onChange={(e) => handleChange('gifUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/exercise.gif"
                />
                {formData.gifUrl && (
                    <div className="mt-3">
                        <img
                            src={formData.gifUrl}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-white/20"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Default Sets */}
            <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                    Default Sets
                </label>
                <input
                    type="text"
                    value={formData.defaultSets}
                    onChange={(e) => handleChange('defaultSets', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 3 x 12 or 3 sets to failure"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Brief description of the exercise"
                    rows={3}
                />
            </div>

            {/* Instructions */}
            <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                    Instructions
                </label>
                <textarea
                    value={formData.instructions}
                    onChange={(e) => handleChange('instructions', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Step-by-step instructions"
                    rows={4}
                />
            </div>

            {/* Active Status */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-200">
                    Active (visible in mobile app)
                </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                    {loading ? 'Saving...' : exercise ? 'Update Exercise' : 'Create Exercise'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
