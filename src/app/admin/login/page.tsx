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
        <div className="min-h-screen bg-redbull-navy flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-redbull-silver rounded-full flex items-center justify-center text-redbull-navy font-bold text-2xl mx-auto mb-4">RB</div>
                    <h1 className="text-2xl font-bold text-redbull-navy">Yönetici Girişi</h1>
                    <p className="text-gray-500">Lütfen kimliğinizi doğrulayın.</p>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Kullanıcı Adı</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-redbull-navy text-black"
                            placeholder="start, finish veya ersel"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Şifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-redbull-navy text-black"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-redbull-navy text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition-all uppercase tracking-wider"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
}
