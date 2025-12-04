'use client';

import { useRacers } from "@/hooks/useRacers";
import { useSocket } from "@/providers/SocketProvider";
import { Trash2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboard() {
    const { racers } = useRacers();
    const { socket } = useSocket();
    const router = useRouter();

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Yarışçı ${name} silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            socket?.emit('delete_racer', id);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-redbull-navy text-white p-8 font-sans relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-redbull-red/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-redbull-yellow/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 md:gap-0">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-6 mb-4">
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
                        <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">SÜPER ADMIN PANELİ</h1>
                        <p className="text-redbull-silver">Tüm yarışçıları yönetin ve sistem durumunu kontrol edin.</p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-end gap-4 w-full md:w-auto">
                        <button
                            onClick={() => router.push('/admin/start')}
                            className="flex-1 md:flex-none px-6 py-3 bg-blue-600/20 border border-blue-500/50 text-blue-400 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-all uppercase tracking-wider text-sm backdrop-blur-sm whitespace-nowrap"
                        >
                            Başlangıç Noktası
                        </button>
                        <button
                            onClick={() => router.push('/admin/finish')}
                            className="flex-1 md:flex-none px-6 py-3 bg-green-600/20 border border-green-500/50 text-green-400 rounded-lg font-bold hover:bg-green-600 hover:text-white transition-all uppercase tracking-wider text-sm backdrop-blur-sm whitespace-nowrap"
                        >
                            Bitiş Noktası
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all uppercase tracking-wider text-sm shadow-lg shadow-red-900/20 whitespace-nowrap"
                        >
                            <LogOut size={18} /> Çıkış
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className="w-2 h-8 bg-redbull-yellow rounded-full"></span>
                            Tüm Yarışçılar <span className="text-redbull-silver text-sm ml-2">({racers.length})</span>
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-redbull-silver uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="p-6">İsim</th>
                                    <th className="p-6">Email</th>
                                    <th className="p-6">Telefon</th>
                                    <th className="p-6">Kategori</th>
                                    <th className="p-6">Durum</th>
                                    <th className="p-6">Süre</th>
                                    <th className="p-6 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {racers.map(racer => (
                                    <tr key={racer.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-6 font-bold text-lg group-hover:text-redbull-yellow transition-colors">{racer.name}</td>
                                        <td className="p-6 text-sm text-redbull-silver">{racer.email}</td>
                                        <td className="p-6 text-sm text-redbull-silver">{racer.phone}</td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${racer.category === 'Men' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-pink-500/10 border-pink-500/20 text-pink-400'
                                                }`}>
                                                {racer.category === 'Men' ? 'Erkek' : racer.category === 'Women' ? 'Kadın' : racer.category}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${racer.status === 'finished' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                racer.status === 'running' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse' :
                                                    'bg-gray-500/10 border-gray-500/20 text-gray-400'
                                                }`}>
                                                {racer.status === 'finished' ? 'Tamamladı' :
                                                    racer.status === 'running' ? 'Koşuyor' :
                                                        'Kayıtlı'}
                                            </span>
                                        </td>
                                        <td className="p-6 font-mono font-bold text-redbull-red">
                                            {racer.duration ? (racer.duration / 1000).toFixed(2) + 's' : '-'}
                                        </td>
                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => handleDelete(racer.id, racer.name)}
                                                className="text-red-500 hover:bg-red-500/20 p-2 rounded-lg transition-all"
                                                title="Yarışçıyı Sil"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {racers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-redbull-silver italic">Veritabanı boş.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
