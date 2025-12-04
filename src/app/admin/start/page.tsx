"use client";

import { useState } from "react";
import { useSocket } from "@/providers/SocketProvider";
import { useRacers, Racer } from "@/hooks/useRacers";
import { cn } from "@/lib/utils";
import { Play, RotateCcw, Edit2, Check, X, UserPlus, List, Timer, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminStart() {
    const socket = useSocket();
    const racers = useRacers();
    const router = useRouter();

    const [formData, setFormData] = useState({ name: "", email: "", phone: "", category: "Men" });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState({ name: "", email: "", phone: "", category: "" });

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (socket && formData.name && formData.email) {
            socket.emit("register_racer", formData);
            setFormData({ name: "", email: "", phone: "", category: "Men" });
        }
    };

    const handleStart = (id: string) => {
        if (socket) {
            socket.emit("start_race", id);
        }
    };

    const handleResetStart = (id: string) => {
        if (confirm("Başlangıç zamanını sıfırlamak istediğinize emin misiniz? Bu işlem yarışçıyı kayıtlı durumuna geri döndürür.") && socket) {
            socket.emit("reset_start", id);
        }
    };

    const startEditing = (racer: Racer) => {
        setEditingId(racer.id);
        setEditData({ name: racer.name, email: racer.email, phone: racer.phone, category: racer.category });
    };

    const saveEdit = () => {
        if (socket && editingId) {
            socket.emit("update_racer_info", { id: editingId, ...editData });
            setEditingId(null);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    // Filter racers: Registered (waiting to start) and Running (can be reset)
    const registeredRacers = racers.filter(r => r.status === 'registered');
    const runningRacers = racers.filter(r => r.status === 'running');

    return (
        <div className="min-h-screen bg-redbull-navy text-white p-8 font-sans">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-redbull-yellow">Başlangıç Noktası Yönetimi</h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-redbull-silver">
                        Toplam Kayıt: <span className="text-white font-bold">{racers.length}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                    >
                        <LogOut size={18} /> Çıkış
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Registration Form */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <UserPlus className="text-redbull-yellow" />
                        Yeni Yarışçı Kaydı
                    </h2>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-redbull-silver mb-1">Ad Soyad</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/10 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-redbull-yellow transition-colors"
                                placeholder="Yarışçı Adı"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-redbull-silver mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-redbull-yellow transition-colors"
                                    placeholder="ornek@email.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-redbull-silver mb-1">Telefon</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-white/10 border border-white/20 rounded p-3 text-white focus:outline-none focus:border-redbull-yellow transition-colors"
                                    placeholder="555 123 45 67"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-redbull-silver mb-1">Kategori</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['Men', 'Women'].map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat })}
                                        className={`p-3 rounded border transition-all font-bold ${formData.category === cat
                                            ? 'bg-redbull-yellow text-redbull-navy border-redbull-yellow'
                                            : 'bg-transparent border-white/20 text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {cat === 'Men' ? 'Erkek' : 'Kadın'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-redbull-red text-white font-bold py-4 rounded hover:bg-red-600 transition-colors uppercase tracking-wider mt-4"
                        >
                            Kayıt Et
                        </button>
                    </form>
                </div>

                {/* Registered Racers List */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col h-[600px]">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <List className="text-redbull-yellow" />
                        Kayıtlı Yarışçılar
                    </h2>

                    <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
                        {registeredRacers.length === 0 ? (
                            <div className="text-center text-redbull-silver py-12">
                                Henüz kayıtlı yarışçı yok.
                            </div>
                        ) : (
                            registeredRacers.map(racer => (
                                <div key={racer.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all">
                                    {editingId === racer.id ? (
                                        <div className="flex-1 grid grid-cols-2 gap-2 mr-4">
                                            <input
                                                value={editData.name}
                                                onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                className="bg-black/20 p-2 rounded text-sm"
                                                placeholder="İsim"
                                            />
                                            <input
                                                value={editData.email}
                                                onChange={e => setEditData({ ...editData, email: e.target.value })}
                                                className="bg-black/20 p-2 rounded text-sm"
                                                placeholder="Email"
                                            />
                                            <input
                                                value={editData.phone}
                                                onChange={e => setEditData({ ...editData, phone: e.target.value })}
                                                className="bg-black/20 p-2 rounded text-sm"
                                                placeholder="Telefon"
                                            />
                                            <select
                                                value={editData.category}
                                                onChange={e => setEditData({ ...editData, category: e.target.value })}
                                                className="bg-black/20 p-2 rounded text-sm"
                                            >
                                                <option value="Men">Erkek</option>
                                                <option value="Women">Kadın</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="font-bold text-lg">{racer.name}</div>
                                            <div className="text-xs text-redbull-silver flex gap-2">
                                                <span>{racer.category === 'Men' ? 'Erkek' : 'Kadın'}</span>
                                                <span>•</span>
                                                <span>{racer.email}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        {editingId === racer.id ? (
                                            <>
                                                <button onClick={saveEdit} className="p-2 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEditing(racer)} className="p-2 text-redbull-silver hover:text-white transition-colors">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStart(racer.id)}
                                                    className="bg-redbull-yellow text-redbull-navy px-4 py-2 rounded font-bold text-sm hover:bg-white transition-colors flex items-center gap-2"
                                                >
                                                    <Play size={16} /> BAŞLAT
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Running Racers */}
            {runningRacers.length > 0 && (
                <div className="mt-8 bg-redbull-red/10 p-6 rounded-xl border border-redbull-red/20">
                    <h2 className="text-xl font-bold mb-4 text-redbull-red flex items-center gap-2">
                        <Timer className="animate-pulse" />
                        Şu An Yarışanlar
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {runningRacers.map(racer => (
                            <div key={racer.id} className="bg-redbull-navy p-4 rounded border border-redbull-red/30 flex justify-between items-center">
                                <div>
                                    <div className="font-bold">{racer.name}</div>
                                    <div className="text-sm text-redbull-silver">{racer.category === 'Men' ? 'Erkek' : 'Kadın'}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-redbull-red font-mono font-bold animate-pulse">
                                        YARIŞIYOR
                                    </div>
                                    <button
                                        onClick={() => handleResetStart(racer.id)}
                                        className="p-2 bg-redbull-red/20 text-redbull-red rounded hover:bg-redbull-red hover:text-white transition"
                                        title="Sıfırla"
                                    >
                                        <RotateCcw size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
