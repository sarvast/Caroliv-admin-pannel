import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { api } from '@/lib/api';

interface BulkUploadModalProps {
    onClose: () => void;
    onComplete: () => void;
}

export const BulkUploadModal = ({ onClose, onComplete }: BulkUploadModalProps) => {
    const [jsonInput, setJsonInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleUpload = async () => {
        setLoading(true);
        setStatus(null);

        try {
            let data;
            try {
                data = JSON.parse(jsonInput);
                if (!Array.isArray(data)) throw new Error('Input must be a JSON Array [...]');
            } catch (e) {
                setStatus({ type: 'error', message: 'Invalid JSON format. Please check syntax.' });
                setLoading(false);
                return;
            }

            const res = await api.call('/admin/foods/bulk', {
                method: 'POST',
                body: data, // api.call handles stringifying
                requiresAuth: true
            });

            if (res.success) {
                setStatus({ type: 'success', message: res.message || 'Upload successful!' });
                setTimeout(() => {
                    onComplete();
                }, 1500);
            } else {
                setStatus({ type: 'error', message: res.error || 'Upload failed' });
            }

        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Network Error' });
        } finally {
            setLoading(false);
        }
    };

    const sampleFormat = `[
  {
    "name": "Apple",
    "calories": 52,
    "protein": 0.3,
    "carbs": 14,
    "fat": 0.2,
    "category": "Fruits",
    "emoji": "🍎",
    "servingSize": "1 medium"
  }
]`;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={onClose}>
            <GlassCard className="w-full max-w-2xl p-6" onClick={(e: any) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Bulk Upload Foods</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                        <p className="text-yellow-200 text-sm">
                            <strong>Note:</strong> Paste a JSON Array of food items below.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            JSON Data
                        </label>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder={sampleFormat}
                            className="w-full h-64 bg-black/30 border border-white/10 rounded-lg p-4 text-sm font-mono text-gray-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />
                    </div>

                    {status && (
                        <div className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {status.message}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={loading || !jsonInput.trim()}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Uploading...' : 'Upload Data'}
                        </button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
