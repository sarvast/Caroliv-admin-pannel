'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface AppConfig {
    requiredVersion: string;
    forceUpdate: boolean;
    updateMessage: string;
    updateUrl: string;
}

export default function AppUpdatesPage() {
    const [config, setConfig] = useState<AppConfig>({
        requiredVersion: '1.0.0',
        forceUpdate: false,
        updateMessage: 'A new version of Caloriv is available! Update now for the best experience.',
        updateUrl: 'https://caloriv-web.vercel.app/'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const result = await api.getAppConfig();
            if (result.success && result.data) {
                setConfig(result.data);
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to load config' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setMessage(null);

            const result = await api.updateAppConfig(config);

            if (result.success) {
                setMessage({ type: 'success', text: '✅ App config updated successfully! Changes will apply on next app launch.' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update config' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-white text-center">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">🚀 App Updates</h1>
                    <p className="text-gray-300">Manage app version requirements and force update settings</p>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-500/20 border border-green-500 text-green-200'
                            : 'bg-red-500/20 border border-red-500 text-red-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                    <div className="space-y-6">
                        {/* Required Version */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Required Version
                            </label>
                            <input
                                type="text"
                                value={config.requiredVersion}
                                onChange={(e) => setConfig({ ...config, requiredVersion: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="1.0.0"
                            />
                            <p className="mt-2 text-sm text-gray-400">
                                Format: X.Y.Z (e.g., 1.0.0, 1.2.3)
                            </p>
                        </div>

                        {/* Force Update Toggle */}
                        <div>
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <span className="text-sm font-medium text-gray-200">Force Update</span>
                                    <p className="text-sm text-gray-400 mt-1">
                                        When enabled, ALL users will be forced to update regardless of version
                                    </p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={config.forceUpdate}
                                        onChange={(e) => setConfig({ ...config, forceUpdate: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-14 h-8 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                                </div>
                            </label>
                        </div>

                        {/* Update Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Update Message
                            </label>
                            <textarea
                                value={config.updateMessage}
                                onChange={(e) => setConfig({ ...config, updateMessage: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="A new version of Caloriv is available!"
                            />
                            <p className="mt-2 text-sm text-gray-400">
                                This message will be shown to users on the update screen
                            </p>
                        </div>

                        {/* Update URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Update URL
                            </label>
                            <input
                                type="url"
                                value={config.updateUrl}
                                onChange={(e) => setConfig({ ...config, updateUrl: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="https://caloriv-web.vercel.app/"
                            />
                            <p className="mt-2 text-sm text-gray-400">
                                Users will be redirected to this URL to download the latest version
                            </p>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-6 bg-blue-500/10 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
                    <h3 className="text-lg font-semibold text-blue-200 mb-3">ℹ️ How it works</h3>
                    <ul className="space-y-2 text-sm text-blue-100">
                        <li>• <strong>Required Version:</strong> Users with older versions will be prompted to update</li>
                        <li>• <strong>Force Update:</strong> When enabled, ALL users see the update screen (even if they have the required version)</li>
                        <li>• <strong>Update Check:</strong> Happens automatically on every app launch</li>
                        <li>• <strong>Blocking:</strong> Users cannot access the app until they update</li>
                        <li>• <strong>Redirect:</strong> "Update Now" button opens the download page in browser</li>
                    </ul>
                </div>

                {/* Current Status */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                        <div className="text-sm text-gray-400 mb-1">Current Required Version</div>
                        <div className="text-2xl font-bold text-white">{config.requiredVersion}</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                        <div className="text-sm text-gray-400 mb-1">Force Update Status</div>
                        <div className={`text-2xl font-bold ${config.forceUpdate ? 'text-red-400' : 'text-green-400'}`}>
                            {config.forceUpdate ? 'ENABLED' : 'DISABLED'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
