"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRacers } from "@/hooks/useRacers";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ClipboardList, Zap, Timer, Medal, Trophy, CalendarPlus } from "lucide-react";

export default function Home() {
  const racers = useRacers();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get top 10 finished racers
  const topRacers = racers
    .filter(r => r.status === 'finished' && r.duration !== null)
    .sort((a, b) => (a.duration || 0) - (b.duration || 0))
    .slice(0, 10);

  if (loading) {
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

      <main className="flex-1 flex flex-col items-center relative z-10 text-center">
        {/* Hero Section */}
        <div className="min-h-[90vh] w-full px-4 relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-[95vw] mx-auto">
          {/* Left Side: Title & Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
          >
            <h2 className="text-redbull-red font-black text-xl md:text-3xl mb-4 tracking-[0.2em] uppercase skew-x-[-10deg]">
              Yıldız Teknik Üniversitesi
            </h2>

            <div className="relative w-full flex justify-center lg:justify-start">
              <h1 className="text-[15vw] lg:text-[10rem] font-black italic tracking-tighter text-redbull-navy mb-8 skew-x-[-5deg] leading-[0.8] drop-shadow-sm break-words pl-4 lg:pl-0">
                STAR<span className="text-transparent bg-clip-text bg-gradient-to-r from-redbull-red to-redbull-red pr-8 md:pr-12">RUSH</span>
              </h1>
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-redbull-yellow rounded-full blur-2xl opacity-50 animate-pulse hidden lg:block"></div>
            </div>

            <p className="text-xl md:text-3xl text-redbull-silver font-bold max-w-2xl italic tracking-wide mb-8">
              HIZINI KEŞFET, SINIRLARI ZORLA, <br /> <span className="text-redbull-navy">LİDERLİĞE OYNA.</span>
            </p>

            <div className="flex flex-col items-center gap-2 mb-12">
              <div className="text-2xl font-black text-redbull-navy bg-redbull-yellow/20 px-6 py-2 rounded skew-x-[-10deg]">
                <span className="skew-x-[10deg] inline-block">26 ARALIK 2025</span>
              </div>
              <div className="text-lg font-bold text-redbull-silver tracking-widest">
                09.00 - 20.00
              </div>
            </div>
          </motion.div>

          {/* Right Side: Top 5 Leaderboard Boxes */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full lg:w-[450px] z-10 flex flex-col items-end gap-3"
          >
            <h3 className="text-3xl font-black italic text-redbull-navy mb-4 pr-2 skew-x-[-10deg]">
              <span className="text-redbull-red">TOP 5</span> LİDERLER
            </h3>

            {topRacers.slice(0, 5).map((racer, index) => (
              <div
                key={racer.id}
                className={cn(
                  "bg-white p-4 shadow-lg flex items-center justify-between transform skew-x-[-10deg] border-r-4 border-r-redbull-red hover:bg-redbull-navy hover:text-white group transition-all duration-300 cursor-default",
                  index === 0 ? "w-full" :
                    index === 1 ? "w-[92%]" :
                      "w-[84%]"
                )}
              >
                <div className="flex items-center gap-4 skew-x-[10deg]">
                  <div className={cn(
                    "w-8 h-8 flex items-center justify-center font-black text-sm",
                    index === 0 ? "bg-redbull-yellow text-redbull-navy" :
                      index === 1 ? "bg-gray-300 text-redbull-navy" :
                        index === 2 ? "bg-[#cd7f32] text-white" : "bg-gray-100 text-redbull-silver group-hover:text-redbull-navy"
                  )}>
                    {index + 1}
                  </div>
                  <div className="font-bold truncate max-w-[150px]">{racer.name}</div>
                </div>
                <div className="font-mono font-black text-sm skew-x-[10deg] text-redbull-red group-hover:text-redbull-yellow">
                  {formatDuration(racer.duration!)}
                </div>
              </div>
            ))}

            {topRacers.length === 0 && (
              <div className="text-center py-8 text-redbull-silver italic text-sm w-full">
                Henüz kayıt yok.
              </div>
            )}

            <Link href="/leaderboard" className="mt-4 mr-2 text-redbull-navy font-black uppercase tracking-wider hover:text-redbull-red transition-colors flex items-center gap-2 skew-x-[-10deg]">
              <span className="skew-x-[10deg]">Tüm Sıralamayı Gör →</span>
            </Link>
          </motion.div>
        </div>

        {/* Locations Section */}
        <div className="w-full max-w-7xl mx-auto px-4 py-20">
          <h3 className="text-4xl md:text-6xl font-black italic text-redbull-navy mb-20 skew-x-[-5deg] text-left border-l-8 border-redbull-red pl-8">
            ROTA <span className="text-redbull-silver">&</span> NOKTALAR
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* A Kapısı */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-redbull-navy via-transparent to-transparent z-10 opacity-90"></div>
              <img src="/akapisi.jpg" alt="A Kapısı" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 p-8 z-20 text-left">
                <h4 className="text-3xl font-black text-white italic mb-2">A KAPISI</h4>
                <p className="text-redbull-silver font-bold">BAŞLANGIÇ NOKTASI</p>
              </div>
            </motion.div>

            {/* Yıldızlı Ağaç */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative h-[400px] rounded-2xl overflow-hidden shadow-2xl md:mt-20"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-redbull-navy via-transparent to-transparent z-10 opacity-90"></div>
              <img src="/yildizli_agac.png" alt="Yıldızlı Ağaç" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 p-8 z-20 text-left">
                <h4 className="text-3xl font-black text-white italic mb-2">YILDIZLI AĞAÇ</h4>
                <p className="text-redbull-silver font-bold">HIZ BÖLGESİ</p>
              </div>
            </motion.div>

            {/* Ortabahçe */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-redbull-navy via-transparent to-transparent z-10 opacity-90"></div>
              <img src="/ortabahce.png" alt="Ortabahçe" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 p-8 z-20 text-left">
                <h4 className="text-3xl font-black text-white italic mb-2">ORTABAHÇE</h4>
                <p className="text-redbull-silver font-bold">FESTİVAL ALANI</p>
              </div>
            </motion.div>

            {/* Tamer Yılmaz */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative h-[400px] rounded-2xl overflow-hidden shadow-2xl md:mt-20"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-redbull-navy via-transparent to-transparent z-10 opacity-90"></div>
              <img src="/tamer_yilmaz.png" alt="Tamer Yılmaz" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 p-8 z-20 text-left">
                <h4 className="text-3xl font-black text-white italic mb-2">TAMER YILMAZ</h4>
                <p className="text-redbull-silver font-bold">REKTÖRLÜK BİTİŞİ</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* SECTION 1: MANIFESTO */}
        <section className="w-full py-24 bg-redbull-navy text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-redbull-red rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-50%] right-[-20%] w-[800px] h-[800px] bg-redbull-yellow rounded-full blur-[150px]"></div>
          </div>

          <div className="container max-w-7xl mx-auto px-4 relative z-10 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-8xl font-black italic tracking-tighter mb-8 skew-x-[-5deg]"
            >
              SINIRLARI <span className="text-transparent bg-clip-text bg-gradient-to-r from-redbull-yellow to-redbull-red">ZORLA</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-redbull-silver font-bold max-w-4xl mx-auto leading-relaxed"
            >
              Star Rush, sıradan bir koşu değil. Bu, kampüsün damarlarında akan bir adrenalin patlaması.
              Stratejini kur, rotanı belirle ve <span className="text-redbull-red">en hızlı</span> sen ol.
              Sadece bacaklarına değil, zekana da güvenmelisin.
            </motion.p>
          </div>
        </section>

        {/* SECTION 2: MECHANICS (NASIL ÇALIŞIR?) */}
        <section className="w-full py-24 bg-white relative">
          <div className="container max-w-7xl mx-auto px-4">
            <h3 className="text-4xl md:text-6xl font-black italic text-redbull-navy mb-16 text-center skew-x-[-5deg]">
              NASIL <span className="text-redbull-red">ÇALIŞIR?</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "KAYIT OL", desc: "A Kapısı'ndaki standımıza gel, kaydını yaptır ve başlangıç kitini al.", icon: <ClipboardList size={48} /> },
                { title: "ISIN & HAZIRLAN", desc: "Vücudunu yarışa hazırla, parkuru tanı ve stratejini belirle.", icon: <Zap size={48} /> },
                { title: "400 METRE DEPARI", desc: "Start verildiği an tüm gücünle koş! En iyi süreni yap ve liderliğe otur.", icon: <Timer size={48} /> }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-gray-50 p-8 rounded-2xl border-b-4 border-redbull-navy hover:border-redbull-red transition-colors group"
                >
                  <div className="text-redbull-navy mb-6 group-hover:text-redbull-red transition-colors duration-300 flex justify-center">{item.icon}</div>
                  <h4 className="text-2xl font-black italic text-redbull-navy mb-4 skew-x-[-5deg]">{item.title}</h4>
                  <p className="text-redbull-silver font-bold text-lg">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: TIMELINE (PROGRAM) */}
        <section className="w-full py-24 bg-redbull-navy text-white relative overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 relative z-10">
            <h3 className="text-4xl md:text-6xl font-black italic text-white mb-20 text-center skew-x-[-5deg]">
              GÜNÜN <span className="text-redbull-yellow">PROGRAMI</span>
            </h3>

            <div className="max-w-3xl mx-auto relative">
              {/* Vertical Line */}
              <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-1 bg-redbull-silver/20 transform md:-translate-x-1/2"></div>

              {[
                { time: "10:00", event: "Etkinlik Başlangıcı", loc: "A Kapısı" },
                { time: "10:00 - 18:00", event: "Yarış Heyecanı", loc: "Tüm Kampüs" },
                { time: "19:00", event: "Ödül Töreni", loc: "Ortabahçe" },
                { time: "20:00", event: "After Party", loc: "Ortabahçe" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={cn(
                    "flex flex-col md:flex-row items-center mb-12 relative",
                    i % 2 === 0 ? "md:flex-row-reverse" : ""
                  )}
                >
                  <div className="w-full md:w-1/2 p-4">
                    <div className={cn(
                      "bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-center md:text-left",
                      i % 2 === 0 ? "md:text-right" : ""
                    )}>
                      <div className="text-3xl font-black text-redbull-yellow italic mb-1">{item.time}</div>
                      <div className="text-xl font-bold text-white mb-1">{item.event}</div>
                      <div className="text-sm font-mono text-redbull-silver">{item.loc}</div>
                    </div>
                  </div>

                  <div className="absolute left-[10px] md:left-1/2 w-5 h-5 bg-redbull-red rounded-full border-4 border-redbull-navy transform md:-translate-x-1/2 z-10"></div>

                  <div className="w-full md:w-1/2 p-4 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: PRIZES (ÖDÜLLER) */}
        <section className="w-full py-24 bg-gray-50 relative">
          <div className="container max-w-7xl mx-auto px-4">
            <h3 className="text-4xl md:text-6xl font-black italic text-redbull-navy mb-16 text-center skew-x-[-5deg]">
              BÜYÜK <span className="text-redbull-red">ÖDÜLLER</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* 2nd Place */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-t-8 border-redbull-silver flex flex-col items-center text-center transition-colors duration-300 order-2 md:order-1 mt-0 md:mt-12 hover:border-redbull-red">
                <div className="text-redbull-silver mb-4"><Medal size={64} /></div>
                <h4 className="text-2xl font-black text-redbull-navy mb-2">İKİNCİLİK</h4>
                <p className="text-redbull-silver font-bold mb-6">Red Bull Özel Paketi + Teknoloji Mağazası Hediye Çeki</p>
                <ul className="text-sm text-left w-full space-y-2 text-gray-600">
                  <li>• 2000 TL Hediye Çeki</li>
                  <li>• Red Bull Hoodie</li>
                  <li>• 1 Koli Red Bull</li>
                </ul>
              </div>

              {/* 1st Place */}
              <div className="bg-redbull-navy text-white rounded-3xl p-8 shadow-2xl border-t-8 border-redbull-yellow flex flex-col items-center text-center transition-colors duration-300 order-1 md:order-2 relative overflow-hidden hover:border-redbull-red">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="text-redbull-yellow mb-6 relative z-10"><Trophy size={96} /></div>
                <h4 className="text-4xl font-black text-redbull-yellow mb-2 relative z-10">ŞAMPİYON</h4>
                <p className="text-gray-300 font-bold mb-8 relative z-10">Red Bull Racing Deneyimi + Büyük Teknoloji Ödülü</p>
                <ul className="text-base text-left w-full space-y-3 text-gray-200 relative z-10">
                  <li className="font-bold text-redbull-yellow">• Red Bull Ring Gezisi (Avusturya)</li>
                  <li>• iPhone 16 Pro</li>
                  <li>• Şampiyonluk Kupası</li>
                  <li>• 1 Yıllık Red Bull Üyeliği</li>
                </ul>
              </div>

              {/* 3rd Place */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-t-8 border-[#cd7f32] flex flex-col items-center text-center transition-colors duration-300 order-3 md:order-3 mt-0 md:mt-12 hover:border-redbull-red">
                <div className="text-[#cd7f32] mb-4"><Medal size={64} /></div>
                <h4 className="text-2xl font-black text-redbull-navy mb-2">ÜÇÜNCÜLÜK</h4>
                <p className="text-redbull-silver font-bold mb-6">Red Bull Merch Paketi + Spor Mağazası Hediye Çeki</p>
                <ul className="text-sm text-left w-full space-y-2 text-gray-600">
                  <li>• 1000 TL Hediye Çeki</li>
                  <li>• Red Bull T-Shirt</li>
                  <li>• 1 Koli Red Bull</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FAQ (SSS) */}
        <section className="w-full py-24 bg-white">
          <div className="container max-w-4xl mx-auto px-4">
            <h3 className="text-4xl md:text-6xl font-black italic text-redbull-navy mb-16 text-center skew-x-[-5deg]">
              MERAK <span className="text-redbull-silver">EDİLENLER</span>
            </h3>

            <div className="space-y-4">
              {[
                { q: "Yarışa kimler katılabilir?", a: "Yıldız Teknik Üniversitesi öğrencisi olan herkes yarışa katılabilir. Öğrenci kimliğinizi yanınızda bulundurmanız yeterlidir." },
                { q: "Takım olarak katılabilir miyiz?", a: "Star Rush bireysel bir zamana karşı yarışıdır. Arkadaşlarınla gelebilirsin ama her yarışçı kendi süresiyle yarışır." },
                { q: "Kayıt ücretli mi?", a: "Hayır, Star Rush etkinliği tamamen ücretsizdir. Red Bull enerjisi de bizden!" },
                { q: "Ne giymeliyim?", a: "Rahat spor kıyafetleri ve koşu ayakkabısı önerilir. Kampüs içinde bolca hareket edeceksiniz." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl p-6 border-l-4 border-redbull-navy hover:bg-gray-100 transition-colors"
                >
                  <h5 className="text-xl font-black text-redbull-navy mb-2">{item.q}</h5>
                  <p className="text-gray-600">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: CTA */}
        <section className="w-full py-32 bg-redbull-red text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="container max-w-7xl mx-auto px-4 relative z-10">
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-8 skew-x-[-5deg]">
              EFSANE OLMAYA <br /> <span className="text-redbull-navy">HAZIR MISIN?</span>
            </h2>
            <p className="text-2xl font-bold max-w-2xl mx-auto">
              26 Aralık'ta Davutpaşa Kampüsü'nde yer yerinden oynayacak. Enerjini topla, stratejini kur.
            </p>
            <Link
              href="https://www.google.com/calendar/render?action=TEMPLATE&text=Red+Bull+Star+Rush&dates=20251226T060000Z/20251226T170000Z&details=Yıldız+Teknik+Üniversitesi+Davutpaşa+Kampüsü'nde+hızını+göster!&location=Yıldız+Teknik+Üniversitesi+Davutpaşa+Kampüsü&sf=true&output=xml"
              target="_blank"
              className="px-12 py-6 bg-white text-redbull-red font-black text-2xl rounded-lg shadow-2xl hover:bg-redbull-navy hover:text-white transition-colors duration-300 ease-in-out transform skew-x-[-10deg] inline-block mt-12"
            >
              <span className="skew-x-[10deg] flex items-center gap-2"><CalendarPlus /> TAKVİME EKLE</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
