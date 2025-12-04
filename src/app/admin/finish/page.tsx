"use client";

import { useSocket } from "@/providers/SocketProvider";
import { useRacers } from "@/hooks/useRacers";
import { formatDuration } from "@/lib/utils";
import { Flag, Clock, Timer, CheckCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminFinish() {
    const socket = useSocket();
    const racers = useRacers();
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
        <div className="min-h-screen bg-redbull-navy text-white p-8 font-sans">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-redbull-yellow">Bitiş Noktası Yönetimi</h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                >
                    <LogOut size={18} /> Çıkış
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Running Racers (To Finish) */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col h-[600px]">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-redbull-yellow">
                        <Timer className="animate-spin-slow" />
                        Pistteki Yarışçılar
                    </h2>

                    <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
                        {runningRacers.length === 0 ? (
                            <div className="text-center text-redbull-silver py-12">
                                Şu an yarışan kimse yok.
                            </div>
                        ) : (
                            runningRacers.map(racer => (
                                <div key={racer.id} className="bg-white/5 p-6 rounded-lg border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all border-l-4 border-l-redbull-yellow">
                                    <div>
                                        <div className="font-bold text-2xl mb-1">{racer.name}</div>
                                        <div className="text-sm text-redbull-silver">{racer.category === 'Men' ? 'Erkek' : 'Kadın'}</div>
                                    </div>
                                    <button
                                        onClick={() => handleFinish(racer.id)}
                                        className="bg-redbull-red text-white px-6 py-3 rounded font-bold hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                                    >
                                        <Flag size={20} /> BİTİR
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recently Finished */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 flex flex-col h-[600px]">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CheckCircle className="text-green-500" />
                        Son Tamamlayanlar
                    </h2>

                    <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
                        {finishedRacers.length === 0 ? (
                            <div className="text-center text-redbull-silver py-12">
                                Henüz bitiren yok.
                            </div>
                        ) : (
                            finishedRacers.map(racer => (
                                <div key={racer.id} className="bg-white/5 p-4 rounded-lg border border-white/10 flex justify-between items-center opacity-75 hover:opacity-100 transition-opacity">
                                    <div>
                                        <div className="font-bold text-lg">{racer.name}</div>
                                        <div className="text-sm text-redbull-silver">{racer.category === 'Men' ? 'Erkek' : 'Kadın'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono text-xl font-bold text-redbull-yellow">
                                            {formatDuration(racer.duration!)}
                                        </div>
                                        <div className="text-xs text-redbull-silver">Süre</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
