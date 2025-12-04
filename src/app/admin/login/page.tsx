'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password }),
        });

        if (res.ok) {
            const data = await res.json();
            if (data.role === 'start') router.push('/admin/start');
            else if (data.role === 'finish') router.push('/admin/finish');
            else if (data.role === 'admin') router.push('/admin');
            else router.push('/');
        } else {
            setError('Geçersiz kimlik bilgileri');
        }
    };

    return (
        <div className="min-h-screen bg-redbull-navy flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-redbull-red/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-redbull-yellow/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 relative z-10">
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-6 mb-6">
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
                    <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2">YÖNETİCİ GİRİŞİ</h1>
                    <p className="text-redbull-silver text-sm">Erişim sağlamak için kimliğinizi doğrulayın.</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center font-bold flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-redbull-silver uppercase tracking-wider mb-2">Kullanıcı Adı</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full p-4 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-redbull-yellow text-white placeholder-white/20 transition-colors"
                            placeholder="ersel"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-redbull-silver uppercase tracking-wider mb-2">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-redbull-yellow text-white placeholder-white/20 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-redbull-red text-white font-black py-4 rounded-lg hover:bg-red-600 transition-all uppercase tracking-widest shadow-lg hover:shadow-redbull-red/20 transform hover:-translate-y-1"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
}
