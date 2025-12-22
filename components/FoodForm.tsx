'use client';

import { useState, FormEvent } from 'react';
import { Food } from '@/lib/api';

interface FoodFormProps {
    food?: Food;
    onSubmit: (data: Partial<Food>) => Promise<void>;
    onCancel: () => void;
}

const CATEGORIES = ['Grains', 'Protein', 'Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Beverages', 'Sweets', 'Other'];

export default function FoodForm({ food, onSubmit, onCancel }: FoodFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<Partial<Food>>({
        name: food?.name || '',
        nameHindi: food?.nameHindi || '',
        category: food?.category || 'Grains',
        calories: food?.calories,
        protein: food?.protein,
        carbs: food?.carbs,
        fat: food?.fat,
        fiber: food?.fiber,
        emoji: food?.emoji || '',
        imageUrl: food?.imageUrl || '',
        searchTerms: food?.searchTerms || '',
        pairingTags: food?.pairingTags || '',
        isActive: food?.isActive !== false,
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || 'Failed to save food');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof Food, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Name & Hindi Name */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Food Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Brown Rice"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Hindi Name *
                    </label>
                    <input
                        type="text"
                        value={formData.nameHindi}
                        onChange={(e) => handleChange('nameHindi', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., ब्राउन चावल"
                        required
                    />
                </div>
            </div>

            {/* Category & Serving Size */}
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
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Serving Size
                    </label>
                    <input
                        type="text"
                        value={formData.servingSize}
                        onChange={(e) => handleChange('servingSize', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 100g, 1 cup, 1 piece"
                    />
                </div>
            </div>

            {/* Calories */}
            <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                    Calories (kcal) *
                </label>
                <input
                    type="number"
                    value={formData.calories ?? ''}
                    onChange={(e) => handleChange('calories', e.target.value === '' ? undefined : parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 130"
                    required
                    min="0"
                />
            </div>

            {/* Macros */}
            <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                    Macronutrients (optional)
                </label>
                <div className="grid grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs text-gray-300 mb-1">Protein (g)</label>
                        <input
                            type="number"
                            value={formData.protein ?? ''}
                            onChange={(e) => handleChange('protein', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0"
                            min="0"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-300 mb-1">Carbs (g)</label>
                        <input
                            type="number"
                            value={formData.carbs ?? ''}
                            onChange={(e) => handleChange('carbs', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0"
                            min="0"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-300 mb-1">Fat (g)</label>
                        <input
                            type="number"
                            value={formData.fat ?? ''}
                            onChange={(e) => handleChange('fat', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0"
                            min="0"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-300 mb-1">Fiber (g)</label>
                        <input
                            type="number"
                            value={formData.fiber ?? ''}
                            onChange={(e) => handleChange('fiber', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0"
                            min="0"
                            step="0.1"
                        />
                    </div>
                </div>
            </div>

            {/* Emoji & Image URL */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Emoji
                    </label>
                    <input
                        type="text"
                        value={formData.emoji}
                        onChange={(e) => handleChange('emoji', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 🍚"
                        maxLength={2}
                    />
                    {formData.emoji && (
                        <div className="mt-2 text-4xl">{formData.emoji}</div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                        Image URL
                    </label>
                    <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => handleChange('imageUrl', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://example.com/food.jpg"
                    />
                    {formData.imageUrl && (
                        <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="mt-2 w-20 h-20 object-cover rounded-lg border border-white/20"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Search Terms */}
            <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                    Search Terms
                </label>
                <input
                    type="text"
                    value={formData.searchTerms}
                    onChange={(e) => handleChange('searchTerms', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., chawal rice bhat"
                />
                <p className="text-xs text-gray-400 mt-1">Space-separated keywords for better search</p>
            </div>

            {/* Smart Pairing Tags */}
            <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                    Smart Pairing Tags
                </label>
                <input
                    type="text"
                    value={formData.pairingTags}
                    onChange={(e) => handleChange('pairingTags', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Green Chutney, Tamarind Chutney"
                />
                <p className="text-xs text-gray-400 mt-1">Comma-separated food names that pair well with this item.</p>
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
                    {loading ? 'Saving...' : food ? 'Update Food' : 'Create Food'}
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
