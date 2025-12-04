"use client";

import { useState } from "react";
import { useSocket } from "@/providers/SocketProvider";
import { useRacers, Racer } from "@/hooks/useRacers";
import { cn } from "@/lib/utils";
import { Play, RotateCcw, Edit2, Check, X, UserPlus, List, Timer, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminStart() {
    const { socket } = useSocket();
    const { racers } = useRacers();
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
        <div className="min-h-screen bg-redbull-navy text-white p-8 font-sans relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-redbull-red/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-redbull-yellow/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center gap-6 mb-4">
                            <img
                                src="/redbull.svg"
                                alt="Red Bull"
                                className="h-10"
                            />
                            <div className="h-8 w-[1px] bg-white/30"></div>
                            <img
                                src="/weblab.svg"
                                alt="WebLab"
                                className="h-8 w-auto"
                            />
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tighter text-white">BAŞLANGIÇ NOKTASI</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-redbull-silver font-bold uppercase tracking-wider">
                            Toplam Kayıt: <span className="text-white text-lg ml-1">{racers.length}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition font-bold uppercase tracking-wider text-sm shadow-lg shadow-red-900/20"
                        >
                            <LogOut size={18} /> Çıkış
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Registration Form */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl">
                        <h2 className="text-xl font-black italic mb-6 flex items-center gap-2 text-redbull-yellow">
                            <UserPlus className="text-redbull-yellow" />
                            YENİ YARIŞÇI KAYDI
                        </h2>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-redbull-silver uppercase tracking-wider mb-1">Ad Soyad</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-redbull-yellow transition-colors placeholder-white/20"
                                    placeholder="Yarışçı Adı"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-redbull-silver uppercase tracking-wider mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-redbull-yellow transition-colors placeholder-white/20"
                                        placeholder="ornek@email.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-redbull-silver uppercase tracking-wider mb-1">Telefon</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-redbull-yellow transition-colors placeholder-white/20"
                                        placeholder="555 123 45 67"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-redbull-silver uppercase tracking-wider mb-1">Kategori</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Men', 'Women'].map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={`p-3 rounded border transition-all font-black uppercase tracking-wider ${formData.category === cat
                                                ? 'bg-redbull-yellow text-redbull-navy border-redbull-yellow shadow-[0_0_15px_rgba(255,204,0,0.3)]'
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
                                className="w-full bg-redbull-red text-white font-black py-4 rounded hover:bg-red-600 transition-all uppercase tracking-widest mt-4 shadow-lg hover:shadow-redbull-red/30 transform hover:-translate-y-1"
                            >
                                KAYIT ET
                            </button>
                        </form>
                    </div>

                    {/* Registered Racers List */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 flex flex-col h-[600px] shadow-xl">
                        <h2 className="text-xl font-black italic mb-6 flex items-center gap-2 text-white">
                            <List className="text-redbull-silver" />
                            KAYITLI YARIŞÇILAR
                        </h2>

                        <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
                            {registeredRacers.length === 0 ? (
                                <div className="text-center text-redbull-silver py-12 italic">
                                    Henüz kayıtlı yarışçı yok.
                                </div>
                            ) : (
                                registeredRacers.map(racer => (
                                    <div key={racer.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all hover:border-white/20">
                                        {editingId === racer.id ? (
                                            <div className="flex-1 grid grid-cols-2 gap-2 mr-4">
                                                <input
                                                    value={editData.name}
                                                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                                                    className="bg-black/40 p-2 rounded text-sm text-white border border-white/20"
                                                    placeholder="İsim"
                                                />
                                                <input
                                                    value={editData.email}
                                                    onChange={e => setEditData({ ...editData, email: e.target.value })}
                                                    className="bg-black/40 p-2 rounded text-sm text-white border border-white/20"
                                                    placeholder="Email"
                                                />
                                                <input
                                                    value={editData.phone}
                                                    onChange={e => setEditData({ ...editData, phone: e.target.value })}
                                                    className="bg-black/40 p-2 rounded text-sm text-white border border-white/20"
                                                    placeholder="Telefon"
                                                />
                                                <select
                                                    value={editData.category}
                                                    onChange={e => setEditData({ ...editData, category: e.target.value })}
                                                    className="bg-black/40 p-2 rounded text-sm text-white border border-white/20"
                                                >
                                                    <option value="Men">Erkek</option>
                                                    <option value="Women">Kadın</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-bold text-lg group-hover:text-redbull-yellow transition-colors">{racer.name}</div>
                                                <div className="text-xs text-redbull-silver flex gap-2 font-bold uppercase tracking-wider">
                                                    <span>{racer.category === 'Men' ? 'Erkek' : 'Kadın'}</span>
                                                    <span className="text-white/20">•</span>
                                                    <span className="normal-case font-normal opacity-70">{racer.email}</span>
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
                                                        className="bg-redbull-yellow text-redbull-navy px-4 py-2 rounded font-black text-sm hover:bg-white transition-colors flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                                                    >
                                                        <Play size={16} fill="currentColor" /> BAŞLAT
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
                    <div className="mt-8 bg-redbull-red/10 backdrop-blur-md p-6 rounded-xl border border-redbull-red/30 shadow-[0_0_30px_rgba(219,10,64,0.1)]">
                        <h2 className="text-xl font-black italic mb-4 text-redbull-red flex items-center gap-2">
                            <Timer className="animate-pulse" />
                            ŞU AN YARIŞANLAR
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {runningRacers.map(racer => (
                                <div key={racer.id} className="bg-redbull-navy/80 p-4 rounded border border-redbull-red/30 flex justify-between items-center shadow-lg">
                                    <div>
                                        <div className="font-bold text-lg">{racer.name}</div>
                                        <div className="text-xs font-bold text-redbull-silver uppercase tracking-wider">{racer.category === 'Men' ? 'Erkek' : 'Kadın'}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-redbull-red font-mono font-bold animate-pulse tracking-widest">
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
        </div>
    );
}
