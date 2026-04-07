"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// --- ART ICON COMPONENTS ---
const ArtNavIcon = {
  Home: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path d="M12 2L4 10V22H20V10L12 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 22V12H15V22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2V5" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  Study: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current text-teal-500">
      <path d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Exam: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current text-amber-500">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 10V17C22 17 19 20 12 20C5 20 2 17 2 17V10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 12V22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Profile: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current text-indigo-500">
      <circle cx="12" cy="7" r="4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

type TabId = "dashboard" | "materi" | "soal" | "profile";
type ExamLevel = "N5" | "N4" | "N3" | "N2" | "N1";
type MaterialItem = { 
  id: string; // Unique slug
  title: string; 
  subtitle: string; 
  japanese: string; 
  indonesian: string; 
  example: string; 
  locked: boolean; 
};

const EXAM_PROGRESS_KEY = "luma-exam-progress";

const tabs = [
  { id: "dashboard" as const, label: "Home", short: "庵", Icon: ArtNavIcon.Home },
  { id: "materi" as const, label: "Materi", short: "書", Icon: ArtNavIcon.Study },
  { id: "soal" as const, label: "Latih", short: "試", Icon: ArtNavIcon.Exam },
  { id: "profile" as const, label: "Profil", short: "名", Icon: ArtNavIcon.Profile },
];

const stats = [
  { label: "Progress User", value: "68%", note: "Target N5 Juli 2026" },
  { label: "Last Read", value: "Grammar Bab 4", note: "12 menit lalu" },
  { label: "Last Soal", value: "Quiz N5", note: "Skor 8/10" },
  { label: "Rekomendasi Soal", value: "Reading Basic", note: "20 soal berikutnya" },
];

const materials: Record<"jlpt" | "ssw", MaterialItem[]> = {
  jlpt: [
    { id: "n5-aisatsu", title: "N5 Salam Dasar", subtitle: "Aisatsu untuk pemula", japanese: "おはよう / こんにちは / こんばんは", indonesian: "Selamat pagi / siang / malam", example: "おはようございます。Saya ucapkan selamat pagi dengan sopan.", locked: false },
    { id: "n4-aktivitas", title: "N4 Aktivitas Harian", subtitle: "Kata kerja sehari-hari", japanese: "起きる・食べる・働く", indonesian: "Bangun / makan / bekerja", example: "わたしは まいあさ 6じに おきます。Saya bangun jam 6 setiap pagi.", locked: false },
    { id: "n3-perasaan", title: "N3 Perasaan & Pendapat", subtitle: "Ekspresi menengah", japanese: "うれしい・不安・意見", indonesian: "Senang / cemas / pendapat", example: "わたしの意見では、その方法がいいです。Menurut saya cara itu bagus.", locked: true },
    { id: "n2-kantor", title: "N2 Bahasa Kerja", subtitle: "Ungkapan formal kantor", japanese: "確認・報告・対応", indonesian: "Konfirmasi / laporan / penanganan", example: "内容を確認してから報告します。Saya laporkan setelah cek isi dulu.", locked: true },
    { id: "n1-akademik", title: "N1 Wacana Lanjut", subtitle: "Nuansa akademik dan opini", japanese: "概念・背景・傾向", indonesian: "Konsep / latar belakang / kecenderungan", example: "社会の傾向を分析する必要があります。Perlu menganalisis kecenderungan masyarakat.", locked: true },
  ],
  ssw: [
    { id: "ssw-kaigo", title: "SSW Kaigo", subtitle: "Caregiver basic terms", japanese: "食事介助・移動・体温", indonesian: "Bantu makan / perpindahan / suhu tubuh", example: "体温を確認します。Saya akan cek suhu tubuh.", locked: false },
    { id: "ssw-food", title: "SSW Food Service", subtitle: "Bahasa kerja restoran", japanese: "注文・会計・片付け", indonesian: "Pesanan / pembayaran / merapikan", example: "ご注文をお願いします。Silakan sampaikan pesanannya.", locked: true },
    { id: "ssw-factory", title: "SSW Factory", subtitle: "Instruksi kerja dasar", japanese: "点検・作業・安全", indonesian: "Pemeriksaan / pekerjaan / keselamatan", example: "作業の前に安全を確認します。Sebelum kerja, cek keselamatan dulu.", locked: true },
  ],
};

const examLevels: { level: ExamLevel; title: string; examNumber: number; passPoint: number }[] = [
  { level: "N5", title: "Beginning", examNumber: 25, passPoint: 80 },
  { level: "N4", title: "Basic Japanese", examNumber: 25, passPoint: 90 },
  { level: "N3", title: "Welcome to Japan", examNumber: 25, passPoint: 95 },
  { level: "N2", title: "Professional", examNumber: 25, passPoint: 90 },
  { level: "N1", title: "Senpai", examNumber: 25, passPoint: 100 },
];

const levelOrder: ExamLevel[] = ["N5", "N4", "N3", "N2", "N1"];

function isAuthed() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("luma-auth") === "true";
}

function getExamProgress(): Partial<Record<ExamLevel, boolean>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(EXAM_PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as Partial<Record<ExamLevel, boolean>>) : {};
  } catch { return {}; }
}

function isLevelUnlocked(level: ExamLevel, progress: Partial<Record<ExamLevel, boolean>>) {
  if (level === "N5") return true;
  const index = levelOrder.indexOf(level);
  const previousLevel = levelOrder[index - 1];
  return Boolean(progress[previousLevel]);
}

export default function Home() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [loggedIn, setLoggedIn] = useState(false);
  const [examProgress, setExamProgress] = useState<Partial<Record<ExamLevel, boolean>>>({});

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLoggedIn(isAuthed());
      setExamProgress(getExamProgress());
      const nextTab = new URLSearchParams(window.location.search).get("tab") as TabId | null;
      if (nextTab && tabs.some((tab) => tab.id === nextTab)) {
        setActiveTab(nextTab);
      }
    });
    const timer = window.setTimeout(() => setShowSplash(false), 1000);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  const score = useMemo(() => 2, []);

  const goProtected = (tab: TabId) => {
    if (isAuthed()) {
      setLoggedIn(true);
      setActiveTab(tab);
      return;
    }
    router.push(`/login?redirect=${tab}`);
  };

  const changeTab = (tab: TabId) => {
    if (tab === "profile" && !isAuthed()) {
      router.push(`/login?redirect=${tab}`);
      return;
    }
    setLoggedIn(isAuthed());
    setActiveTab(tab);
  };

  const logout = () => {
    window.localStorage.removeItem("luma-auth");
    setLoggedIn(false);
    setActiveTab("dashboard");
    router.push("/");
  };

  const handleLevelClick = (item: any) => {
    if (!isAuthed()) {
      router.push(`/login?redirect=soal`);
      return;
    }
    if (!isLevelUnlocked(item.level, examProgress)) {
      alert('Selesaikan level sebelumnya dahulu!');
      return;
    }
    router.push(`/exam/${item.level.toLowerCase()}`);
  };

  if (showSplash) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#dff8f6,_#f8fbff_45%,_#eef5fa_100%)] px-6">
        <div className="rounded-[2.4rem] bg-white/82 px-10 py-14 text-center shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[linear-gradient(135deg,_#14b8a6,_#f59e0b)] text-4xl font-black text-white">L</div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.42em] text-teal-500">Luma JLPT</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-700">Premium Japanese Study Experience</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#dff8f6,_#f8fbff_42%,_#eff4f8_100%)] px-4 py-4 text-slate-900 md:px-7 md:py-6 xl:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-screen-2xl flex-col pb-28 md:pb-8">
        <header className="mb-5 hidden rounded-[2rem] bg-white/78 px-5 py-4 shadow-[0_18px_70px_rgba(15,23,42,0.06)] ring-1 ring-white/80 backdrop-blur md:block md:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div />
            <div className="flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => changeTab(tab.id)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    activeTab === tab.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-5">
            {activeTab === "dashboard" && (
              <>
                <section className="overflow-hidden rounded-[2.2rem] bg-white shadow-[0_18px_70px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                  <div className="bg-[linear-gradient(180deg,_rgba(202,247,244,0.95),_rgba(255,255,255,0.96)_65%)] px-5 pb-6 pt-5 md:px-7">
                    <div className="flex items-center justify-between">
                      <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-teal-500 shadow-sm">09:44</div>
                      <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-500">Luma</p>
                        <h1 className="text-3xl font-black text-amber-500">N5</h1>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-sm font-bold text-slate-600 shadow-sm border border-slate-100 italic">
                         Luma
                      </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-[1.9rem] bg-[linear-gradient(135deg,_#fff3be,_#ffe59a_48%,_#fb923c_48%,_#f97316)] p-[1px] shadow-[0_14px_50px_rgba(249,115,22,0.18)]">
                      <div className="grid overflow-hidden rounded-[1.85rem] bg-white sm:grid-cols-[1.25fr_0.75fr]">
                        <div className="bg-[linear-gradient(135deg,_#fff8d9,_#fff0b6)] px-6 py-6 font-sans">
                          <p className="inline-flex rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white">Study Hub</p>
                          <h3 className="mt-4 text-3xl font-black leading-tight text-orange-500 italic underline decoration-orange-300">Fokus latihan, progres, dan materi</h3>
                          <button type="button" onClick={() => goProtected("soal")} className="mt-5 rounded-full bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 active:scale-95 transition">
                            Masuk online exam
                          </button>
                        </div>
                        <div className="relative min-h-52 overflow-hidden bg-orange-500">
                          <img src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=900&q=80" alt="Japanese study desk" className="h-full w-full object-cover opacity-65" />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(249,115,22,0.15),rgba(17,24,39,0.35))]" />
                          <div className="absolute bottom-5 left-5 right-5 rounded-[1.2rem] bg-white/18 p-4 backdrop-blur">
                            <p className="text-lg font-black text-white italic">Materi kurikulum 2024 terbaru</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </section>

                <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-[1.7rem] bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.05)] ring-1 ring-slate-100">
                      <p className="text-sm font-bold underline decoration-teal-300 decoration-2 underline-offset-4 uppercase tracking-[0.2em] text-slate-800">{item.label}</p>
                      <p className="mt-3 text-2xl font-black text-slate-800 italic">{item.value}</p>
                      <p className="mt-2 text-sm text-slate-500 font-medium">{item.note}</p>
                    </div>
                  ))}
                </section>

                <section className="rounded-[2rem] bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.05)] ring-1 ring-slate-100 md:p-7">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black tracking-tight text-slate-700 italic">Rekomendasi soal</h3>
                    <button type="button" className="text-lg font-bold text-teal-600 hover:underline">Lihat semua</button>
                  </div>
                  <div className="mt-6 grid gap-5 lg:grid-cols-3">
                    {[
                      { title: "Vocabulary Sprint", subtitle: "20 soal pilihan ganda", image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80" },
                      { title: "Grammar Booster", subtitle: "Partikel wa, o, ni, de", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80" },
                      { title: "Reading Flow", subtitle: "Bacaan pendek level N5", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80" },
                    ].map((item) => (
                      <button key={item.title} type="button" onClick={() => goProtected("soal")} className="overflow-hidden rounded-[1.8rem] bg-white text-left shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">
                        <img src={item.image} alt={item.title} className="h-40 w-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        <div className="p-5">
                          <p className="text-2xl font-black text-slate-800 italic underline decoration-slate-200">{item.title}</p>
                          <p className="mt-2 text-base text-slate-400 font-medium">{item.subtitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeTab === "materi" && (
              <div className="space-y-6">
                {Object.entries(materials).map(([key, items]) => (
                  <section key={key} className="rounded-[2rem] bg-white p-5 shadow-[0_18px_70_rgba(15,23,42,0.05)] ring-1 ring-slate-100 md:p-7">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-black tracking-tight text-slate-700 italic">{key === "jlpt" ? "Materi JLPT" : "Materi SSW"}</h3>
                    </div>
                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {items.map((item, i) => {
                        const Icon = i % 4 === 0 ? ArtNavIcon.Home : i % 4 === 1 ? ArtNavIcon.Study : i % 4 === 2 ? ArtNavIcon.Exam : ArtNavIcon.Profile;
                        // Actually, I'll use specific icons for levels if I can, but let's stick to the high-end brush icons.
                        return (
                          <button 
                            key={item.id} 
                            type="button" 
                            onClick={() => {
                              if (!isAuthed()) {
                                 router.push(`/login?redirect=materi`);
                                 return;
                              }
                              if (item.locked) {
                                 alert('Modul ini masih terkunci!');
                                 return;
                              }
                              router.push(`/study/${item.id}`);
                            }} 
                            className={["group relative overflow-hidden rounded-[2.2rem] border px-6 py-6 text-left transition-all duration-500", item.locked ? "border-amber-100 bg-amber-50/20 opacity-80" : "border-slate-100 bg-white hover:-translate-y-2 hover:shadow-[0_25px_80px_rgba(15,23,42,0.08)]"].join(" ")}
                          >
                            {/* ARTISTIC BACKGROUND ICON */}
                            <div className="absolute -right-4 -top-4 h-24 w-24 opacity-[0.03] grayscale transition-all duration-700 group-hover:scale-125 group-hover:opacity-10 group-hover:rotate-12 group-hover:grayscale-0">
                               <Icon />
                            </div>

                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <span className={["inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset mb-4", item.locked ? "bg-amber-50 text-amber-500 ring-amber-100" : "bg-teal-50 text-teal-600 ring-teal-100"].join(" ")}>
                                   {item.locked ? 'Premium Member' : 'Gratis'}
                                </span>
                                <h4 className="text-2xl font-black text-slate-800 italic leading-tight underline decoration-slate-100 group-hover:decoration-teal-200 transition-all underline-offset-4">{item.title}</h4>
                                <p className="mt-2 text-sm text-slate-400 font-medium leading-relaxed">{item.subtitle}</p>
                              </div>
                            </div>
                            <div className="mt-6 space-y-4 rounded-[1.8rem] bg-slate-50/50 p-5 ring-1 ring-inset ring-slate-100/60 backdrop-blur-sm">
                              <div>
                                <p className="text-[10px] font-black uppercase text-teal-600/60 tracking-widest">Japanese Focus</p>
                                <p className="mt-1 text-lg font-bold text-slate-800 truncate">{item.japanese}</p>
                              </div>
                              <div className="pt-3 border-t border-slate-100/50">
                                 <p className="text-[10px] font-black uppercase text-orange-600/60 tracking-widest">Bahasa Indonesia</p>
                                 <p className="mt-1 text-sm text-slate-600 font-medium line-clamp-1">{item.indonesian}</p>
                              </div>
                            </div>
                            
                            {!item.locked && (
                               <div className="mt-5 flex items-center justify-end text-[10px] font-black uppercase tracking-widest text-teal-500 group-hover:translate-x-1 transition-transform">
                                  BACA SEKARANG →
                               </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {activeTab === "soal" && (
              <div className="space-y-6">
                <section className="rounded-[2rem] bg-white p-5 shadow-[0_18px_70px_rgba(15,23,42,0.05)] ring-1 ring-slate-100 md:p-7">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-600 italic">Exam Center</p>
                      <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-700 italic">Pilih level untuk memulai tes</h3>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {examLevels.map((item) => (
                      <button
                        key={item.level}
                        type="button"
                        onClick={() => handleLevelClick(item)}
                        className={[
                          "flex w-full items-center gap-4 rounded-[2rem] px-6 py-5 text-left shadow-sm ring-1 transition",
                          isLevelUnlocked(item.level, examProgress)
                            ? "bg-white ring-slate-100 hover:-translate-y-1 hover:shadow-xl hover:border-teal-500/20"
                            : "bg-slate-50 ring-slate-100 opacity-60",
                        ].join(" ")}
                      >
                        <div className={[
                          "flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black text-white rotate-3",
                          isLevelUnlocked(item.level, examProgress) ? "bg-slate-900 shadow-xl" : "bg-slate-400",
                        ].join(" ")}>
                          {item.level}
                        </div>
                        <div className="flex-1">
                          <p className="text-2xl font-black text-slate-800 italic underline decoration-slate-100 underline-offset-4">{item.title}</p>
                          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-teal-600">{item.examNumber} Available Tests</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-slate-300">Min Score</p>
                          <p className="text-xl font-black text-slate-800">{item.passPoint}%</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "profile" && (
              loggedIn ? (
                <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
                  <div className="rounded-[2.5rem] bg-white p-10 shadow-xl ring-1 ring-slate-100 text-center">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-slate-900 text-4xl font-black text-white shadow-2xl rotate-6">RK</div>
                    <h3 className="mt-8 text-3xl font-black text-slate-800 italic italic">Raka Kurniawan</h3>
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-xs mt-2">demo@luma-jlpt.app</p>
                    <div className="mt-10 grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-6 rounded-[2rem] ring-1 ring-inset ring-slate-100">
                          <p className="text-[10px] font-black text-slate-300 uppercase">Progress</p>
                          <p className="text-4xl font-black text-slate-800 mt-1">68%</p>
                       </div>
                       <div className="bg-slate-50 p-6 rounded-[2rem] ring-1 ring-inset ring-slate-100">
                          <p className="text-[10px] font-black text-slate-300 uppercase">Status</p>
                          <p className="text-2xl font-black text-emerald-500 mt-1">Master</p>
                       </div>
                    </div>
                  </div>
                  <div className="rounded-[2.5rem] bg-white p-8 shadow-xl ring-1 ring-slate-100">
                    <h3 className="text-2xl font-black text-slate-800 italic underline decoration-slate-200 underline-offset-8">Aksi Akun</h3>
                    <div className="mt-10 space-y-4">
                      <button type="button" onClick={() => setActiveTab("soal")} className="w-full rounded-[1.8rem] bg-slate-900 py-6 text-lg font-black text-white shadow-xl active:scale-95 transition">LANJUT BELAJAR</button>
                      <button type="button" onClick={logout} className="w-full rounded-[1.8rem] border-2 border-rose-100 bg-rose-50 text-rose-500 py-6 font-black active:scale-95 transition">KELUAR</button>
                    </div>
                  </div>
                </section>
              ) : null
            )}
          </section>

          <aside className="hidden space-y-5 lg:block">
            <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl ring-1 ring-slate-100">
              <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80" alt="Study atmosphere" className="h-64 w-full object-cover grayscale" />
              <div className="p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600">Study Insights</p>
                <h3 className="mt-4 text-3xl font-black text-slate-800 leading-tight italic">Premium design, focused study.</h3>
                <p className="mt-6 text-slate-500 leading-relaxed font-medium">Kurikulum yang dirancang khusus untuk efektivitas belajar dan penguasaan bahasa Jepang secara mendalam.</p>
              </div>
            </div>
          </aside>
        </div>

        <nav className="fixed inset-x-0 bottom-8 z-50 px-6 md:hidden">
          <div className="mx-auto flex max-w-[320px] items-center justify-around rounded-[2.5rem] bg-slate-900/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10 backdrop-blur-xl">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => changeTab(tab.id)}
                  className={[
                    "relative flex h-14 w-14 flex-col items-center justify-center rounded-2xl transition-all duration-500",
                    active ? "bg-white/10 text-teal-400" : "text-slate-400 hover:text-slate-100",
                  ].join(" ")}
                >
                  <span className={`transition-all duration-500 ${active ? 'scale-110 -translate-y-1' : 'scale-100'}`}>
                    <tab.Icon />
                  </span>
                  <span className={`mt-1 text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    {tab.label}
                  </span>
                  {active && (
                    <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </main>
  );
}
