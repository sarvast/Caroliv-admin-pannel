'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/GlassCard';
import Modal from '@/components/Modal';

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [newAnno, setNewAnno] = useState({ title: '', message: '', type: 'info', expiresAt: '' });

    useEffect(() => { loadAnnouncements(); }, []);

    const loadAnnouncements = async () => {
        try {
            setLoading(true);
            const res = await api.getAnnouncements();
            setAnnouncements(res.data || []);
        } catch (err) { } finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createAnnouncement(newAnno);
            setModalOpen(false);
            setNewAnno({ title: '', message: '', type: 'info', expiresAt: '' });
            loadAnnouncements();
        } catch (err) { alert('Failed to post'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this announcement?')) return;
        try {
            await api.deleteAnnouncement(id);
            loadAnnouncements();
        } catch (err) { alert('Failed to delete'); }
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Announcements</h1>
                        <p className="text-muted-foreground">Broadcast messages to all users</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
                    >
                        + Post Announcement
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {loading ? <p>Loading...</p> : announcements.map(anno => (
                        <GlassCard key={anno.id} className="p-4 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-3 h-3 rounded-full ${anno.type === 'warning' ? 'bg-orange-500' : anno.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                    <h3 className="font-bold text-lg">{anno.title}</h3>
                                </div>
                                <p className="text-muted-foreground">{anno.message}</p>
                                <p className="text-xs text-muted-foreground mt-2">Posted: {new Date(anno.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => handleDelete(anno.id)} className="text-red-400 hover:text-red-500 p-2">Delete</button>
                        </GlassCard>
                    ))}
                </div>
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Announcement">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" value={newAnno.title} onChange={e => setNewAnno({ ...newAnno, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Message</label>
                        <textarea required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white h-32" value={newAnno.message} onChange={e => setNewAnno({ ...newAnno, message: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Type</label>
                        <select className="w-full bg-white/10 border border-white/10 rounded-lg p-3 text-white" value={newAnno.type} onChange={e => setNewAnno({ ...newAnno, type: e.target.value })}>
                            <option value="info" className="bg-gray-900 text-white">Information (Blue)</option>
                            <option value="warning" className="bg-gray-900 text-white">Warning (Orange)</option>
                            <option value="success" className="bg-gray-900 text-white">Success (Green)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Expires At (Optional)</label>
                        <input type="date" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white" value={newAnno.expiresAt} onChange={e => setNewAnno({ ...newAnno, expiresAt: e.target.value })} />
                    </div>
                    <button type="submit" className="w-full bg-primary py-3 rounded-lg font-bold text-white mt-4">Post Broadcast</button>
                </form>
            </Modal>
        </div>
    );
}
