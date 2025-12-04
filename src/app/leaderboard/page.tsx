"use client";

import { useState } from "react";
import { useRacers } from "@/hooks/useRacers";
import { formatDuration, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy } from "lucide-react";

export default function Leaderboard() {
    const racers = useRacers();
    const [categoryFilter, setCategoryFilter] = useState("All");

    const finishedRacers = racers
        .filter(r => r.status === 'finished' && r.duration !== null)
        .filter(r => categoryFilter === "All" || r.category === categoryFilter)
        .sort((a, b) => (a.duration || 0) - (b.duration || 0));

    return (
        <div className="min-h-screen bg-redbull-navy text-white font-sans">
            <div className="container mx-auto px-4 py-8">
                <header className="flex justify-between items-center mb-12">
                    <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 bg-redbull-silver rounded-full flex items-center justify-center text-redbull-navy font-bold">RB</div>
                        <h1 className="text-xl font-bold tracking-tighter italic">STAR RUSH</h1>
                    </Link>
                    <div className="flex gap-2">
                        {["All", "Men", "Women"].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full font-bold text-sm transition-all",
                                    categoryFilter === cat
                                        ? "bg-redbull-red text-white"
                                        : "bg-white/10 text-redbull-silver hover:bg-white/20"
                                )}
                            >
                                {cat === 'All' ? 'Tümü' : cat === 'Men' ? 'Erkek' : 'Kadın'}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4">LİDERLİK TABLOSU</h2>
                    <p className="text-redbull-silver">Yıldız Teknik Üniversitesi Canlı Sonuçlar</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-redbull-silver font-bold text-sm uppercase tracking-wider">
                        <div className="col-span-2 md:col-span-1 text-center">Sıra</div>
                        <div className="col-span-7 md:col-span-7">İsim</div>
                        <div className="col-span-3 md:col-span-2">Kategori</div>
                        <div className="col-span-12 md:col-span-2 text-right md:text-left mt-2 md:mt-0">Süre</div>
                    </div>

                    <div className="divide-y divide-white/5">
                        {finishedRacers.map((racer, index) => (
                            <motion.div
                                key={racer.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors",
                                    index === 0 ? "bg-gradient-to-r from-redbull-yellow/20 to-transparent" : ""
                                )}
                            >
                                <div className="col-span-2 md:col-span-1 flex justify-center">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                                        index === 0 ? "bg-redbull-yellow text-redbull-navy" :
                                            index === 1 ? "bg-redbull-silver text-redbull-navy" :
                                                index === 2 ? "bg-[#cd7f32] text-white" : "text-redbull-silver"
                                    )}>
                                        {index < 3 ? <Trophy size={14} /> : index + 1}
                                    </div>
                                </div>
                                <div className="col-span-7 md:col-span-7 font-bold text-lg">{racer.name}</div>
                                <div className="col-span-3 md:col-span-2 text-sm text-redbull-silver">{racer.category === 'Men' ? 'Erkek' : 'Kadın'}</div>
                                <div className="col-span-12 md:col-span-2 text-right md:text-left mt-2 md:mt-0 font-mono text-xl font-bold text-redbull-red">
                                    {formatDuration(racer.duration!)}
                                </div>
                            </motion.div>
                        ))}
                        {finishedRacers.length === 0 && (
                            <div className="text-center py-20 text-redbull-silver/50 italic">
                                Henüz tamamlanmış yarış yok.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
