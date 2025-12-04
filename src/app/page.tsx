"use client";

import { useRacers } from "@/hooks/useRacers";
import { formatDuration, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const racers = useRacers();

  const topRacers = racers
    .filter(r => r.status === 'finished' && r.duration !== null)
    .sort((a, b) => (a.duration || 0) - (b.duration || 0))
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-redbull-navy text-white overflow-hidden relative font-sans">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-redbull-red/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-redbull-yellow/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-redbull-silver rounded-full flex items-center justify-center text-redbull-navy font-bold">RB</div>
            <h1 className="text-2xl font-bold tracking-tighter italic">STAR RUSH</h1>
          </div>
          <Link href="/leaderboard" className="text-redbull-silver hover:text-white transition-colors font-bold uppercase tracking-wider text-sm">
            Tüm Sıralama
          </Link>
        </header>

        {/* Hero */}
        <section className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-redbull-yellow font-bold text-xl mb-4 tracking-widest uppercase"
          >
            Yıldız Teknik Üniversitesi
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8 leading-none"
          >
            HIZINI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-redbull-red to-redbull-yellow">
              KEŞFET
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-redbull-silver text-xl max-w-2xl mx-auto"
          >
            En büyük yarış meydan okuması burada. Canlı sonuçları takip et ve pistin hakimi kim gör.
          </motion.p>
        </section>

        {/* Mini Leaderboard */}
        <section className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold italic">EN İYİLER</h3>
            <div className="h-[2px] flex-1 bg-redbull-silver/20 ml-6"></div>
          </div>

          <div className="space-y-4">
            {topRacers.length === 0 ? (
              <div className="text-center py-12 text-redbull-silver/50 italic">
                Henüz kayıt yok. İlk sen ol!
              </div>
            ) : (
              topRacers.map((racer, index) => (
                <motion.div
                  key={racer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                      index === 0 ? "bg-redbull-yellow text-redbull-navy" :
                        index === 1 ? "bg-redbull-silver text-redbull-navy" :
                          index === 2 ? "bg-[#cd7f32] text-white" : "bg-white/10 text-white"
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-lg group-hover:text-redbull-yellow transition-colors">{racer.name}</div>
                      <div className="text-sm text-redbull-silver">{racer.category === 'Men' ? 'Erkek' : 'Kadın'}</div>
                    </div>
                  </div>
                  <div className="font-mono text-2xl font-bold text-redbull-red">
                    {formatDuration(racer.duration!)}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Footer Links */}
        <footer className="mt-32 text-center text-redbull-silver/30 text-sm flex justify-center gap-8">
          <Link href="/admin/start" className="hover:text-redbull-silver">Yönetici Başlangıç</Link>
          <Link href="/admin/finish" className="hover:text-redbull-silver">Yönetici Bitiş</Link>
        </footer>
      </div>
    </main>
  );
}
