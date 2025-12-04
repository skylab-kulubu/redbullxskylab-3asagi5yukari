"use client";

import { useState, useEffect } from "react";
import { useRacers } from "@/hooks/useRacers";
import { formatDuration, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Leaderboard() {
    const { racers, loading } = useRacers();
    const [showLoading, setShowLoading] = useState(true);

    // Minimum 2 saniye loading göster
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const [searchQuery, setSearchQuery] = useState("");

    const processedRacers = racers
        .filter(r => r.status === 'finished' && r.duration !== null)
        .sort((a, b) => (a.duration || 0) - (b.duration || 0))
        .map((r, i) => ({ ...r, rank: i + 1 }));

    const filteredRacers = processedRacers.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading || showLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <img src="/loading.gif" alt="Loading..." className="w-48 h-48 object-contain" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-redbull-navy font-sans selection:bg-redbull-yellow selection:text-redbull-navy flex flex-col">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-redbull-red/5 rounded-full blur-[120px] mix-blend-multiply" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-redbull-yellow/10 rounded-full blur-[100px] mix-blend-multiply" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
            </div>

            <Header />

            <div className="relative z-10 container mx-auto px-4 py-8 flex-1 flex flex-col">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-redbull-red font-black text-xl mb-2 tracking-[0.2em] uppercase skew-x-[-10deg]"
                    >
                        YILDIZ TEKNİK ÜNİVERSİTESİ
                    </motion.h2>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black italic tracking-tighter mb-8 skew-x-[-5deg] text-redbull-navy"
                    >
                        CANLI <span className="text-transparent bg-clip-text bg-gradient-to-r from-redbull-red to-redbull-red">SIRALAMA</span>
                    </motion.h1>
                </div>

                <div className="max-w-md mx-auto md:ml-auto md:mr-0 mb-8 w-full">
                    <div className="relative group">
                        <input
                            type="text"
                            className="block w-full pl-4 pr-12 py-4 border-2 border-gray-100 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:border-redbull-red focus:ring-0 transition-all shadow-lg text-redbull-navy font-bold"
                            placeholder="Yarışçı ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-redbull-navy group-focus-within:text-redbull-red transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-200 shadow-2xl mb-8">
                    <div className="grid grid-cols-12 gap-2 md:gap-4 p-3 md:p-6 border-b border-gray-100 text-redbull-silver font-black text-[10px] md:text-xs uppercase tracking-[0.1em]">
                        <div className="col-span-2 md:col-span-1 text-center">Sıra</div>
                        <div className="col-span-7 md:col-span-8">İsim</div>
                        <div className="col-span-3 md:col-span-3 text-right md:text-left mt-0">Süre</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {filteredRacers.map((racer, index) => (
                            <motion.div
                                key={racer.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "grid grid-cols-12 gap-2 md:gap-4 p-3 md:p-6 items-center hover:bg-gray-50 transition-all group relative overflow-hidden",
                                    racer.rank === 1 ? "bg-gradient-to-r from-yellow-50 to-transparent" : ""
                                )}
                            >
                                <div className="col-span-2 md:col-span-1 flex justify-center relative z-10">
                                    <div className={cn(
                                        "w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-black text-sm md:text-lg transform -skew-x-12 shadow-md",
                                        racer.rank === 1 ? "bg-redbull-yellow text-redbull-navy" :
                                            racer.rank === 2 ? "bg-gray-300 text-redbull-navy" :
                                                racer.rank === 3 ? "bg-[#cd7f32] text-white" : "bg-gray-100 text-redbull-silver"
                                    )}>
                                        {racer.rank <= 3 ? <Trophy size={14} className="skew-x-12 md:w-[18px] md:h-[18px]" /> : <span className="skew-x-12">{racer.rank}</span>}
                                    </div>
                                </div>
                                <div className="col-span-7 md:col-span-8 font-black text-sm md:text-xl italic tracking-tight text-redbull-navy group-hover:text-redbull-red transition-colors relative z-10 truncate">{racer.name}</div>
                                <div className="col-span-3 md:col-span-3 text-right md:text-left mt-0 font-mono text-sm md:text-2xl font-black text-redbull-red italic tracking-tighter relative z-10">
                                    {formatDuration(racer.duration!)}
                                </div>
                            </motion.div>
                        ))}
                        {filteredRacers.length === 0 && (
                            <div className="text-center py-20 text-redbull-silver/50 italic text-lg">
                                {searchQuery ? "Sonuç bulunamadı." : "Henüz tamamlanmış yarış yok."}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
