'use client';

import { useRacers } from "@/hooks/useRacers";
import { useSocket } from "@/providers/SocketProvider";
import { Trash2, AlertTriangle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboard() {
    const racers = useRacers();
    const socket = useSocket();
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
        <div className="min-h-screen bg-redbull-navy text-white p-8 font-sans">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-redbull-yellow">Süper Admin Paneli</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push('/admin/start')}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                    >
                        Başlangıç Noktasına Git
                    </button>
                    <button
                        onClick={() => router.push('/admin/finish')}
                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                    >
                        Bitiş Noktasına Git
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                    >
                        <LogOut size={18} /> Çıkış Yap
                    </button>
                </div>
            </div>

            <div className="bg-white text-redbull-navy rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Tüm Yarışçılar ({racers.length})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="p-4">İsim</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Telefon</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Durum</th>
                                <th className="p-4">Süre</th>
                                <th className="p-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {racers.map(racer => (
                                <tr key={racer.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold">{racer.name}</td>
                                    <td className="p-4 text-sm text-gray-600">{racer.email}</td>
                                    <td className="p-4 text-sm text-gray-600">{racer.phone}</td>
                                    <td className="p-4">{racer.category === 'Men' ? 'Erkek' : racer.category === 'Women' ? 'Kadın' : racer.category}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${racer.status === 'finished' ? 'bg-green-100 text-green-700' :
                                            racer.status === 'running' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {racer.status === 'finished' ? 'Tamamladı' :
                                                racer.status === 'running' ? 'Koşuyor' :
                                                    'Kayıtlı'}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono">
                                        {racer.duration ? (racer.duration / 1000).toFixed(2) + 's' : '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(racer.id, racer.name)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                                            title="Yarışçıyı Sil"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {racers.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400">Veritabanı boş.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
