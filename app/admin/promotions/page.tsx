'use client';

import { useState, useEffect } from 'react';
import { api, Promotion } from '@/lib/api';
import GlassCard from '@/components/GlassCard';
import Modal from '@/components/Modal';

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<Partial<Promotion> | null>(null);

    useEffect(() => {
        loadPromotions();
    }, []);

    const loadPromotions = async () => {
        try {
            setLoading(true);
            const result = await api.getPromotions();
            setPromotions(result.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load promotions');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPromo?.id) {
                await api.updatePromotion(editingPromo.id, editingPromo);
            } else {
                await api.createPromotion(editingPromo || {});
            }
            setModalOpen(false);
            loadPromotions();
        } catch (err: any) {
            alert(err.message || 'Save failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this promotion?')) return;
        try {
            // Add delete method to API later if needed, for now just deactivate
            await api.updatePromotion(id, { isActive: false });
            loadPromotions();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Promotions (Ads)</h1>
                        <p className="text-muted-foreground">Manage in-app banners and links</p>
                    </div>
                    <button
                        onClick={() => { setEditingPromo({ imageUrl: '', externalLink: '', delayDays: 2, isActive: true }); setModalOpen(true); }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
                    >
                        + New Promo
                    </button>
                </div>

                {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-muted-foreground">Loading...</p>
                    ) : promotions.map(promo => (
                        <GlassCard key={promo.id} className="p-4 overflow-hidden">
                            <img src={promo.imageUrl} className="w-full h-40 object-cover rounded-lg mb-4" alt={promo.title || 'Promo'} />
                            <h3 className="text-lg font-bold text-foreground mb-1">{promo.title || 'Unnamed Promo'}</h3>
                            <p className="text-sm text-muted-foreground truncate mb-4">{promo.externalLink}</p>

                            <div className="flex justify-between items-center">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${promo.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {promo.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                                <div className="space-x-2">
                                    <button onClick={() => { setEditingPromo(promo); setModalOpen(true); }} className="text-blue-400 hover:text-blue-300">Edit</button>
                                    <button onClick={() => handleDelete(promo.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPromo?.id ? 'Edit Promotion' : 'New Promotion'}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title (Internal Only)</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                            value={editingPromo?.title || ''}
                            onChange={e => setEditingPromo({ ...editingPromo, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Banner Image URL *</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                            value={editingPromo?.imageUrl || ''}
                            onChange={e => setEditingPromo({ ...editingPromo, imageUrl: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Redirect Link *</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                            value={editingPromo?.externalLink || ''}
                            onChange={e => setEditingPromo({ ...editingPromo, externalLink: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Delay (Days after install)</label>
                        <input
                            type="number"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white"
                            value={editingPromo?.delayDays || 0}
                            onChange={e => setEditingPromo({ ...editingPromo, delayDays: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={editingPromo?.isActive}
                            onChange={e => setEditingPromo({ ...editingPromo, isActive: e.target.checked })}
                        />
                        <span className="text-sm text-gray-300">Is Active</span>
                    </div>
                    <button type="submit" className="w-full bg-primary py-3 rounded-lg font-bold text-white mt-4">Save Promotion</button>
                </form>
            </Modal>
        </div>
    );
}
