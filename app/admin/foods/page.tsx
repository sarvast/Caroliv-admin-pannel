'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, Food } from '@/lib/api';
import { GlassCard } from '@/components/GlassCard';
import { BulkUploadModal } from '@/components/BulkUploadModal';

const CATEGORIES = ['Grains', 'Protein', 'Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Beverages', 'Sweets', 'Other'];

export default function FoodsPage() {
    const router = useRouter();
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({ category: '', search: '' });
    const [showBulkModal, setShowBulkModal] = useState(false);

    useEffect(() => {
        loadFoods();
    }, [filter.category]);

    const loadFoods = async () => {
        try {
            setLoading(true);
            setError('');
            const result = await api.getFoods(filter.category);
            setFoods(result.data || []);
        } catch (err: any) {
            console.error('Failed to load foods:', err);
            setError(err.message || 'Failed to load foods');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await api.deleteFood(id);
            loadFoods();
        } catch (error: any) {
            alert(error.message || 'Failed to delete food');
        }
    };

    // Filter foods by search locally
    const filteredFoods = foods.filter(food => {
        if (!filter.search) return true;
        const searchLower = filter.search.toLowerCase();
        return (
            food.name?.toLowerCase().includes(searchLower) ||
            food.nameHindi?.toLowerCase().includes(searchLower) ||
            food.category?.toLowerCase().includes(searchLower) ||
            food.searchTerms?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Foods</h1>
                        <p className="text-muted-foreground">Manage food items database</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowBulkModal(true)}
                            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 px-6 py-3 rounded-lg font-semibold transition-colors border border-purple-500/30"
                        >
                            📦 Bulk Upload
                        </button>
                        <button
                            onClick={() => router.push('/admin/foods/new')}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                        >
                            + Add Food
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <GlassCard className="p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                value={filter.search}
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                placeholder="Search by name, Hindi name, or keywords..."
                                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Category
                            </label>
                            <select
                                value={filter.category}
                                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => setFilter({ category: '', search: '' })}
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
                            <p className="mt-4">Loading foods...</p>
                        </div>
                    ) : filteredFoods.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <p className="text-lg">No foods found</p>
                            {(filter.search || filter.category) && (
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
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Hindi Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Calories</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Macros (P/C/F)</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredFoods.map((food) => (
                                            <tr key={food.id} className="hover:bg-accent/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    {food.imageUrl ? (
                                                        <img
                                                            src={food.imageUrl}
                                                            alt={food.name}
                                                            className="w-12 h-12 rounded-lg object-cover border border-border"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                const parent = (e.target as HTMLImageElement).parentElement;
                                                                if (parent && food.emoji) {
                                                                    parent.innerHTML = `<div class="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">${food.emoji}</div>`;
                                                                }
                                                            }}
                                                        />
                                                    ) : food.emoji ? (
                                                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                                                            {food.emoji}
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xs">
                                                            🍽️
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-foreground font-medium">{food.name}</div>
                                                    {food.servingSize && (
                                                        <div className="text-muted-foreground text-sm mt-1">{food.servingSize}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">{food.nameHindi}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-600 dark:text-blue-300 capitalize">
                                                        {food.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-foreground font-medium">{food.calories}</div>
                                                    <div className="text-muted-foreground text-xs">kcal</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {(food.protein || food.carbs || food.fat) ? (
                                                        <div className="text-sm text-muted-foreground">
                                                            <span className="text-green-600 dark:text-green-300">{food.protein || 0}g</span>
                                                            {' / '}
                                                            <span className="text-yellow-600 dark:text-yellow-300">{food.carbs || 0}g</span>
                                                            {' / '}
                                                            <span className="text-orange-600 dark:text-orange-300">{food.fat || 0}g</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${food.isActive !== false ? 'bg-green-500/20 text-green-600 dark:text-green-300' : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {food.isActive !== false ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => router.push(`/admin/foods/${food.id}/edit`)}
                                                        className="text-blue-600 dark:text-blue-400 hover:opacity-80 font-medium transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(food.id, food.name)}
                                                        className="text-red-600 dark:text-red-400 hover:opacity-80 font-medium transition-colors"
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
                                {filteredFoods.map((food) => (
                                    <div key={food.id} className="bg-card/50 rounded-lg p-4 border border-border space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                {food.imageUrl ? (
                                                    <img
                                                        src={food.imageUrl}
                                                        alt={food.name}
                                                        className="w-16 h-16 rounded-lg object-cover border border-border"
                                                    />
                                                ) : food.emoji ? (
                                                    <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-3xl">
                                                        {food.emoji}
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xl">
                                                        🍽️
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-foreground text-lg">{food.name}</h3>
                                                    {food.nameHindi && <p className="text-muted-foreground text-sm font-hindi">{food.nameHindi}</p>}
                                                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 capitalize">
                                                        {food.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${food.isActive !== false ? 'bg-green-500/20 text-green-600 dark:text-green-300' : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {food.isActive !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/50">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase">Calories</p>
                                                <p className="font-semibold text-foreground">{food.calories} kcal</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase">Serving</p>
                                                <p className="font-semibold text-foreground">{food.servingSize || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {(food.protein || food.carbs || food.fat) ? (
                                                <div className="text-sm font-medium space-x-2">
                                                    <span className="text-green-600 dark:text-green-400">P: {food.protein || 0}</span>
                                                    <span className="text-yellow-600 dark:text-yellow-400">C: {food.carbs || 0}</span>
                                                    <span className="text-orange-600 dark:text-orange-400">F: {food.fat || 0}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No macros</span>
                                            )}
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => router.push(`/admin/foods/${food.id}/edit`)}
                                                className="flex-1 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(food.id, food.name)}
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
                {!loading && filteredFoods.length > 0 && (
                    <div className="mt-6 text-center text-gray-400 text-sm">
                        Showing {filteredFoods.length} of {foods.length} foods
                    </div>
                )}
            </div>

            {showBulkModal && (
                <BulkUploadModal
                    onClose={() => setShowBulkModal(false)}
                    onComplete={() => {
                        setShowBulkModal(false);
                        loadFoods();
                    }}
                />
            )}
        </div >
    );
}
