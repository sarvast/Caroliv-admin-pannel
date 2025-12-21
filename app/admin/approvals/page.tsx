"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

type Tab = 'foods' | 'exercises';

export default function ApprovalsPage() {
    const [activeTab, setActiveTab] = useState<Tab>('foods');
    const [foodSubmissions, setFoodSubmissions] = useState<any[]>([]);
    const [exerciseSubmissions, setExerciseSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [foods, exercises] = await Promise.all([
                api.getFoodSubmissions(),
                api.getExerciseSubmissions()
            ]);

            if (foods.success) setFoodSubmissions(foods.data);
            if (exercises.success) setExerciseSubmissions(exercises.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveFood = async (id: string) => {
        if (!confirm("Approve this food?")) return;
        await api.approveFoodSubmission(id);
        loadData();
    };

    const handleRejectFood = async (id: string) => {
        if (!confirm("Reject this food?")) return;
        await api.rejectFoodSubmission(id);
        loadData();
    };

    const handleApproveExercise = async (id: string) => {
        if (!confirm("Approve this exercise?")) return;
        await api.approveExerciseSubmission(id);
        loadData();
    };

    const handleRejectExercise = async (id: string) => {
        if (!confirm("Reject this exercise?")) return;
        await api.rejectExerciseSubmission(id);
        loadData();
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Approvals</h1>
            <p className="text-gray-400 mb-8">
                Review user submissions before adding them to the global database.
            </p>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('foods')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'foods'
                            ? 'text-emerald-400'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Foods
                    {foodSubmissions.length > 0 && (
                        <span className="ml-2 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-xs">
                            {foodSubmissions.length}
                        </span>
                    )}
                    {activeTab === 'foods' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400" />
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('exercises')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'exercises'
                            ? 'text-blue-400'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Exercises
                    {exerciseSubmissions.length > 0 && (
                        <span className="ml-2 bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">
                            {exerciseSubmissions.length}
                        </span>
                    )}
                    {activeTab === 'exercises' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                    )}
                </button>
            </div>

            {activeTab === 'foods' ? (
                // FOODS LIST
                foodSubmissions.length === 0 ? (
                    <div className="text-gray-500 italic">No pending food submissions.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {foodSubmissions.map((item) => (
                            <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                                        <p className="text-sm text-cyan-400">{item.brand || "User Submitted"}</p>
                                    </div>
                                    <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2 py-1 rounded">Pending</span>
                                </div>

                                <div className="space-y-2 mb-6 text-sm text-gray-300">
                                    <div className="flex justify-between"><span>Calories</span> <span>{item.calories}</span></div>
                                    <div className="flex justify-between"><span>Protein</span> <span>{item.protein}g</span></div>
                                    <div className="flex justify-between"><span>Carbs</span> <span>{item.carbs}g</span></div>
                                    <div className="flex justify-between"><span>Fat</span> <span>{item.fat}g</span></div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => handleRejectFood(item.id)} className="flex-1 bg-red-500/10 text-red-500 py-2 rounded hover:bg-red-500/20 transition">Reject</button>
                                    <button onClick={() => handleApproveFood(item.id)} className="flex-1 bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">Approve</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                // EXERCISES LIST
                exerciseSubmissions.length === 0 ? (
                    <div className="text-gray-500 italic">No pending exercise submissions.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exerciseSubmissions.map((item) => (
                            <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                                        <p className="text-sm text-blue-400">{item.category}</p>
                                    </div>
                                    <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded">Pending</span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex gap-2 flex-wrap">
                                        <span className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">{item.difficulty}</span>
                                        <span className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">{item.equipment}</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        <div className="mb-1 text-gray-500 text-xs uppercase font-bold">Target Muscles</div>
                                        <div className="flex flex-wrap gap-1">
                                            {item.targetMuscles?.map((m: string) => (
                                                <span key={m} className="bg-slate-700/50 px-2 py-0.5 rounded text-xs">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => handleRejectExercise(item.id)} className="flex-1 bg-red-500/10 text-red-500 py-2 rounded hover:bg-red-500/20 transition">Reject</button>
                                    <button onClick={() => handleApproveExercise(item.id)} className="flex-1 bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700 transition">Approve</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
