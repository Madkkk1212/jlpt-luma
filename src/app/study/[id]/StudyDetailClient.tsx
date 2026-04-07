"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// --- CUSTOM ICONS ---
const StudyIcon = {
  Back: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Sensei: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path d="M12 4V10M12 14V20M4 12H10M14 12H20" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="9" strokeWidth="1.5"/>
    </svg>
  ),
  Example: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path d="M7 8L3 12L7 16M17 8L21 12L17 16M14 4L10 20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// --- DETAILED DATA ---
interface DetailedMaterial {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  image: string;
  gradient: string;
  grammar: {
    rule: string;
    usage: string;
    nuance: string;
  }[];
  senseiTips: string[];
  examples: {
    jp: string;
    furigana: string;
    id: string;
    note?: string;
  }[];
}

const DETAILED_MATERIALS: Record<string, DetailedMaterial> = {
  'n5-aisatsu': {
    id: 'n5-aisatsu',
    title: 'JLPT N5: Salam Dasar (Aisatsu)',
    subtitle: 'Cara menyapa dengan sopan berdasarkan waktu.',
    level: 'N5 - Basic',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04cb2201?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-teal-500 to-emerald-400',
    grammar: [
      { rule: 'Ohayou Gozaimasu', usage: 'Pagi hari (sampai jam 10:00).', nuance: 'Gunakan "Gozaimasu" untuk guru atau atasan.' },
      { rule: 'Konnichiwa', usage: 'Siang hari (jam 11:00 - 17:00).', nuance: 'Salam umum, tidak perlu "Gozaimasu".' },
      { rule: 'Konbanwa', usage: 'Malam hari (setelah jam 18:00).', nuance: 'Dipakai saat bertemu di tempat gelap/malam.' }
    ],
    senseiTips: [
      'Di kantor, "Ohayou" bisa digunakan sepanjang hari jika itu pertemuan pertama Anda.',
      'Jangan gunakan "Ohayou" kepada atasan tanpa "Gozaimasu" karena kurang sopan.'
    ],
    examples: [
      { jp: 'おはようございます、先生。', furigana: 'Ohayou gozaimasu, sensei.', id: 'Selamat pagi, Pak Guru.', note: 'Sopan' },
      { jp: 'こんにちは、お元気ですか？', furigana: 'Konnichiwa, ogenki desu ka?', id: 'Halo, apa kabar?', note: 'Umum' }
    ]
  },
  'n4-aktivitas': {
    id: 'n4-aktivitas',
    title: 'JLPT N4: Aktivitas Harian',
    subtitle: 'Belajar kata kerja bentuk -masu dan kebiasaan.',
    level: 'N4 - Intermediate',
    image: 'https://images.unsplash.com/photo-1510519133418-2410659fcc2e?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-orange-500 to-amber-400',
    grammar: [
      { rule: 'V-masu', usage: 'Bentuk sopan untuk aktivitas rutin.', nuance: 'Cocok untuk percakapan di sekolah atau kantor.' },
      { rule: 'V-masen', usage: 'Bentuk negatif sopan.', nuance: 'Menyatakan tidak melakukan sesuatu.' }
    ],
    senseiTips: [
      'Pelajari perubahan kata kerja Golongan 1, 2, dan 3 agar lancar merubah ke bentuk -masu.',
      'Gunakan penanda waktu seperti "mainichi" (setiap hari) untuk memperjelas konteks.'
    ],
    examples: [
      { jp: '毎朝６時に起きます。', furigana: 'Maiasa rokuji ni okimasu.', id: 'Setiap pagi saya bangun jam 6.', note: 'Rutinitas' },
      { jp: '明日, 会社で働きます。', furigana: 'Ashita, kaisha de hatarakimasu.', id: 'Besok saya bekerja di kantor.', note: 'Aktivitas' }
    ]
  },
  'n3-perasaan': {
    id: 'n3-perasaan',
    title: 'JLPT N3: Perasaan & Pendapat',
    subtitle: 'Ekspresi perasaan mendalam dan menyatakan opini pribadi.',
    level: 'N3 - Business',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-indigo-500 to-purple-400',
    grammar: [
      { rule: '~to omoimasu', usage: 'Menyatakan pendapat pribadi.', nuance: 'Lebih lembut daripada klaim langsung.' },
      { rule: '~garu', usage: 'Menyatakan perasaan orang ketiga.', nuance: 'Gunakan untuk mendeskripsikan emosi orang lain.' }
    ],
    senseiTips: [
      'Gunakan "~to omoimasu" sesering mungkin dalam diskusi untuk menghindari kesan terlalu agresif.',
      'Ingat bahwa "~garu" hanya untuk emosi yang terlihat secara fisik (seperti kedinginan atau ketakutan).'
    ],
    examples: [
      { jp: '日本はとてもきれいだと思います。', furigana: 'Nihon wa totemo kirei da to omoimasu.', id: 'Saya pikir Jepang sangat indah.', note: 'Opini' },
      { jp: '子供が犬を怖がっています。', furigana: 'Kodomo ga inu wo kowagatte imasu.', id: 'Anak itu (terlihat) takut pada anjing.', note: 'Orang Ketiga' }
    ]
  },
  'n2-kantor': {
    id: 'n2-kantor',
    title: 'JLPT N2: Ungkapan Kantor',
    subtitle: 'Keigo tingkat lanjut dan komunikasi profesional.',
    level: 'N2 - Professional',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-slate-700 to-slate-500',
    grammar: [
      { rule: 'Sonkeigo (Sopan)', usage: 'Meninggikan posisi orang lain.', nuance: 'Wajib digunakan untuk klien atau bos besar.' },
      { rule: 'Kenjougo (Rendah Diri)', usage: 'Merendahkan diri sendiri.', nuance: 'Digunakan saat berbicara tentang tindakan kita ke orang lain.' }
    ],
    senseiTips: [
      'Keigo adalah kunci sukses di perusahaan Jepang. Hafalkan pola "O + V + ni naru".',
      'Jangan campur aduk Sonkeigo and Kenjougo dalam satu kalimat tanpa dasar yang kuat.'
    ],
    examples: [
      { jp: '少々お待ちくださいませ。', furigana: 'Shoushou omachi kudasaimase.', id: 'Mohon tunggu sebentar.', note: 'Bisnis Formal' },
      { jp: '何でもお申し付けください。', furigana: 'Nandemo omoushitsuke kudasai.', id: 'Silakan sampaikan apa saja yang dibutuhkan.', note: 'Pelayanan' }
    ]
  },
  'n1-akademik': {
    id: 'n1-akademik',
    title: 'JLPT N1: Wacana Akademik',
    subtitle: 'Analisis konsep abstrak dan latar belakang sosial.',
    level: 'N1 - Expert',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-rose-600 to-orange-500',
    grammar: [
      { rule: '~ni mo kakawarazu', usage: 'Terlepas dari/Meskipun.', nuance: 'Sangat formal, sering muncul di teks berita atau esai.' },
      { rule: '~wo yoyooshite', usage: 'Bertujuan untuk/Dengan maksud.', nuance: 'Menjelaskan maksud dari sebuah kebijakan atau tindakan.' }
    ],
    senseiTips: [
      'Fokus pada kanji yang jarang muncul di percakapan tapi sering ada di koran Nikkei.',
      'Pahami nuansa halus antara kata-kata yang berarti sama namun beda level formalitasnya.'
    ],
    examples: [
      { jp: '悪天候にもかかわらず、決行された。', furigana: 'Akutenkou ni mo kakawarazu, kekkou sareta.', id: 'Meskipun cuaca buruk, tetap dilaksanakan.', note: 'Laporan' },
      { jp: '背景には複雑な概念がある。', furigana: 'Haikei ni wa fukuzatsu na gainen ga aru.', id: 'Ada konsep yang rumit di latar belakangnya.', note: 'Analisis' }
    ]
  },
  'ssw-kaigo': {
    id: 'ssw-kaigo',
    title: 'SSW: Kaigo (Caregiver Basics)',
    subtitle: 'Istilah penting dalam perawatan lansia di Jepang.',
    level: 'SSW - Professional',
    image: 'https://images.unsplash.com/photo-1516383740770-fbcc5cbece02?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-blue-600 to-indigo-500',
    grammar: [
      { rule: 'Check & Report', usage: 'Gunakan "Konkakunin" dan "Houkoku".', nuance: 'Penting untuk keselamatan lansia.' }
    ],
    senseiTips: [
      'Selalu sapa lansia dengan "Konnichiwa" and perkenalkan diri sebelum membantu.',
      'Pastikan posisi badan tegak saat melakukan transfer pasien.'
    ],
    examples: [
      { jp: '体温を確認しますね。', furigana: 'Taion wo kakunin shimasu ne.', id: 'Saya cek suhu tubuhnya ya.', note: 'Protokol' },
      { jp: 'ゆっくり動いてください。', furigana: 'Yukkuri ugoite kudasai.', id: 'Silakan bergerak perlahan.', note: 'Instruksi' }
    ]
  },
  'ssw-food': {
    id: 'ssw-food',
    title: 'SSW: Food Service',
    subtitle: 'Bahasa kerja di restoran dan kafe Jepang.',
    level: 'SSW - Hospitality',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-amber-600 to-yellow-500',
    grammar: [
      { rule: 'Irasshaimase', usage: 'Menyambut pelanggan.', nuance: 'Ucapkan dengan suara lantang dan ceria.' }
    ],
    senseiTips: [
      'Jangan lupa tersenyum saat mengantarkan pesanan.',
      'Selalu konfirmasi ulang pesanan sebelum pergi ke dapur.'
    ],
    examples: [
      { jp: 'ご注文は以上でしょうか？', furigana: 'Gochuumon wa ijou deshou ka?', id: 'Apakah pesanannya sudah cukup?', note: 'Konfirmasi' },
      { jp: 'かしこまりました。', furigana: 'Kashikomarimashita.', id: 'Baik, saya mengerti.', note: 'Sopan' }
    ]
  },
  'ssw-factory': {
    id: 'ssw-factory',
    title: 'SSW: Factory & Safety',
    subtitle: 'Prosedur keselamatan dan instruksi pabrik.',
    level: 'SSW - Industry',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-slate-600 to-slate-400',
    grammar: [
      { rule: 'Anzen Daiichi', usage: 'Utamakan Keselamatan.', nuance: 'Slogan wajib di setiap pabrik Jepang.' }
    ],
    senseiTips: [
      'Selalu gunakan APD lengkap sebelum memasuki area kerja.',
      'Laporkan segera jika menemukan kerusakan pada mesin.'
    ],
    examples: [
      { jp: 'ヘルメットを被ってください。', furigana: 'Herumetto wo kabutte kudasai.', id: 'Tolong pakai helm Anda.', note: 'Keamanan' },
      { jp: '点検を忘れないで。', furigana: 'Tenken wo wasurenaide.', id: 'Jangan lupa lakukan pengecekan.', note: 'Pabrik' }
    ]
  }
};

export default function StudyDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const data = (DETAILED_MATERIALS as any)[id] || DETAILED_MATERIALS['n5-aisatsu'];
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const toggleReveal = (idx: number) => {
    setRevealed(p => ({ ...p, [idx]: !p[idx] }));
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fbff,_#ffffff)] pb-24">
      {/* HERO SECTION */}
      <section className={`relative h-[40vh] min-h-[320px] w-full overflow-hidden bg-gradient-to-br ${data.gradient} shadow-[0_20px_60px_rgba(0,0,0,0.12)]`}>
        {/* ARTISTIC PATTERN OVERLAY */}
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center text-white">
           <button onClick={() => router.back()} className="absolute top-10 left-6 h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/40 active:scale-90 transition shadow-xl ring-1 ring-white/30 group z-50">
              <span className="group-hover:-translate-x-1 transition-transform"><StudyIcon.Back /></span>
           </button>
           <div className="mt-4 animate-in fade-in zoom-in-95 duration-1000 max-w-4xl mx-auto">
             <span className="bg-white/20 px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.6em] uppercase backdrop-blur-md ring-1 ring-white/40 shadow-2xl border border-white/20">{data.level}</span>
             <h1 className="mt-10 text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tight leading-[1.1] drop-shadow-2xl px-4">
                {data.title.split(': ').map((part: string, i: number) => (
                  <span key={i} className={i === 1 ? 'block mt-2 opacity-90' : 'underline decoration-white/20 underline-offset-12'}>
                    {part}{i === 0 && ':'}
                  </span>
                ))}
             </h1>
             <p className="mt-8 text-white/90 font-bold max-w-2xl text-lg md:text-xl drop-shadow-lg mx-auto leading-relaxed px-6 italic">
                {data.subtitle}
             </p>
           </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10">
        {/* GRAMMAR CARDS */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
           {data.grammar.map((item: any, i: number) => (
             <div key={i} className="bg-white p-10 rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 hover:-translate-y-4 transition-all duration-700 group">
                <p className="text-[10px] font-black uppercase text-teal-600 mb-4 tracking-widest group-hover:tracking-[0.5em] transition-all">Rule #{i+1}</p>
                <h4 className="text-2xl font-black text-slate-800 italic mb-6 leading-tight underline decoration-teal-100 underline-offset-8">{item.rule}</h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Purpose & Usage</p>
                    <p className="text-base text-slate-600 font-bold mt-1">{item.usage}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Nuances</p>
                    <p className="text-sm text-slate-500 italic font-medium mt-1 leading-relaxed">"{item.nuance}"</p>
                  </div>
                </div>
             </div>
           ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
           {/* EXAMPLES SECTION */}
           <section>
              <div className="flex items-center gap-4 mb-10">
                 <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-2xl rotate-3">
                    <StudyIcon.Example />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-slate-800 italic">Praktek Penggunaan.</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Real world examples</p>
                 </div>
              </div>
              
              <div className="space-y-8">
                 {data.examples.map((ex: any, i: number) => (
                    <div key={i} className="bg-white p-10 rounded-[3.5rem] shadow-[0_15px_60px_rgba(0,0,0,0.04)] ring-1 ring-slate-100 group hover:shadow-2xl transition-all duration-500">
                       <div className="flex justify-between items-start mb-6">
                          <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">Example 0{i+1}</p>
                          {ex.note && (
                            <span className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">{ex.note}</span>
                          )}
                       </div>
                       <h2 className="text-4xl font-black text-slate-900 leading-[1.3] mb-3 italic tracking-tight underline decoration-slate-100 underline-offset-[12px]">"{ex.jp}"</h2>
                       <p className="text-teal-600 font-black tracking-widest text-sm mb-10 uppercase">{ex.furigana}</p>
                       
                       <button 
                         onClick={() => toggleReveal(i)}
                         className={`w-full py-6 rounded-[2rem] font-black text-base tracking-[0.2em] transition-all duration-500 active:scale-[0.98] ${revealed[i] ? "bg-slate-50 text-slate-400 ring-1 ring-inset ring-slate-100" : "bg-slate-900 text-white shadow-2xl shadow-slate-900/40 hover:shadow-slate-900/60"}`}
                       >
                         {revealed[i] ? ex.id : "REVEAL MEANING"}
                       </button>
                    </div>
                 ))}
              </div>
           </section>

           {/* SENSEI TIPS ASIDE */}
           <aside className="space-y-8">
              <div className="bg-[radial-gradient(circle_at_top_right,_#f0fdf4,_#ffffff)] p-12 rounded-[4rem] ring-1 ring-emerald-100 shadow-[0_30px_90px_rgba(16,185,129,0.08)] sticky top-24">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="h-12 w-12 text-emerald-500 bg-white rounded-2xl flex items-center justify-center shadow-lg ring-1 ring-emerald-50">
                       <StudyIcon.Sensei />
                    </div>
                    <h4 className="text-3xl font-black text-emerald-900 italic">Sensei Tips.</h4>
                 </div>
                 <div className="space-y-10">
                    {data.senseiTips.map((tip: string, i: number) => (
                      <div key={i} className="relative flex gap-6 items-start group">
                         <div className="h-3 w-3 rounded-full bg-emerald-500 mt-2.5 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.6)] group-hover:scale-150 transition-transform" />
                         <p className="text-slate-700 font-bold text-lg leading-relaxed italic">"{tip}"</p>
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-14 pt-10 border-t border-emerald-100/50">
                    <button 
                      onClick={() => router.push("/?tab=soal")}
                      className="w-full py-6 bg-[linear-gradient(135deg,_#10b981,_#059669)] text-white rounded-[2.5rem] font-black text-xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] active:scale-95 transition-all hover:shadow-[0_25px_60px_rgba(16,185,129,0.4)]"
                    >
                      UJIKAN KEMAMPUAN
                    </button>
                    <p className="mt-6 text-center text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] italic leading-loose">
                      Sudah paham Materinya?<br/>Ayo lanjutkan ke Latihan Soal!
                    </p>
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </main>
  );
}
