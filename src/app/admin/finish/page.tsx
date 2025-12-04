"use client";

import { useSocket } from "@/providers/SocketProvider";
import { useRacers } from "@/hooks/useRacers";
import { formatDuration } from "@/lib/utils";
import { Flag, Clock, Timer, CheckCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminFinish() {
    const { socket } = useSocket();
    const { racers } = useRacers();
    const router = useRouter();

    const handleFinish = (id: string) => {
        if (socket) {
            socket.emit("finish_race", id);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const runningRacers = racers.filter(r => r.status === 'running');
    const finishedRacers = racers
        .filter(r => r.status === 'finished')
        .sort((a, b) => (b.finishTime || 0) - (a.finishTime || 0)) // Most recent first
        .slice(0, 10);

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
                        <h1 className="text-3xl font-black italic tracking-tighter text-white">BİTİŞ NOKTASI</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition font-bold uppercase tracking-wider text-sm shadow-lg shadow-red-900/20"
                    >
                        <LogOut size={18} /> Çıkış
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Running Racers (To Finish) */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 flex flex-col h-[600px] shadow-xl">
                        <h2 className="text-xl font-black italic mb-6 flex items-center gap-2 text-redbull-yellow">
                            <Timer className="animate-spin-slow" />
                            PİSTTEKİ YARIŞÇILAR
                        </h2>

                        <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
                            {runningRacers.length === 0 ? (
                                <div className="text-center text-redbull-silver py-12 italic">
                                    Şu an yarışan kimse yok.
                                </div>
                            ) : (
                                runningRacers.map(racer => (
                                    <div key={racer.id} className="bg-white/5 p-6 rounded-lg border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all border-l-4 border-l-redbull-yellow shadow-lg">
                                        <div>
                                            <div className="font-black text-2xl mb-1 italic tracking-tight">{racer.name}</div>
                                            <div className="text-sm font-bold text-redbull-silver uppercase tracking-wider">{racer.category === 'Men' ? 'Erkek' : 'Kadın'}</div>
                                        </div>
                                        <button
                                            onClick={() => handleFinish(racer.id)}
                                            className="bg-redbull-red text-white px-6 py-3 rounded font-black hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 uppercase tracking-wider"
                                        >
                                            <Flag size={20} fill="currentColor" /> BİTİR
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recently Finished */}
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 flex flex-col h-[600px] shadow-xl">
                        <h2 className="text-xl font-black italic mb-6 flex items-center gap-2 text-white">
                            <CheckCircle className="text-green-500" />
                            SON TAMAMLAYANLAR
                        </h2>

                        <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
                            {finishedRacers.length === 0 ? (
                                <div className="text-center text-redbull-silver py-12 italic">
                                    Henüz bitiren yok.
                                </div>
                            ) : (
                                finishedRacers.map(racer => (
                                    <div key={racer.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex justify-between items-center opacity-75 hover:opacity-100 transition-all hover:bg-white/10">
                                        <div>
                                            <div className="font-bold text-lg">{racer.name}</div>
                                            <div className="text-sm text-redbull-silver font-bold uppercase tracking-wider">{racer.category === 'Men' ? 'Erkek' : 'Kadın'}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono text-xl font-black text-redbull-yellow italic tracking-tighter">
                                                {formatDuration(racer.duration!)}
                                            </div>
                                            <div className="text-xs text-redbull-silver font-bold uppercase tracking-wider">Süre</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
