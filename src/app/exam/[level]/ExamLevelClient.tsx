"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";

// --- ART ICON COMPONENTS ---

const ArtIcon = {
  Scroll: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path d="M15.5 19C15.5 20.3807 14.3807 21.5 13 21.5H6C4.61929 21.5 3.5 20.3807 3.5 19V5C3.5 3.61929 4.61929 2.5 6 2.5H13C14.3807 2.5 15.5 3.61929 15.5 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.5 19V5C15.5 3.61929 16.6193 2.5 18 2.5H20.5V17C20.5 18.3807 19.3807 19.5 18 19.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 7H12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 11H12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 15H10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Spark: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Target: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <circle cx="12" cy="12" r="9" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="5" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  ),
  Lock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="1.5"/>
      <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" strokeWidth="1.5"/>
    </svg>
  ),
  Fire: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path d="M12 2C12 2 15 5.5 15 8.5C15 10.1569 13.6569 11.5 12 11.5C10.3431 11.5 9 10.1569 9 8.5C9 5.5 12 2 12 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 4C17.5228 4 22 8.47715 22 14C22 19.5228 17.5228 24 12 24C6.47715 24 2 19.5228 2 14C2 11.2386 3.11929 8.73858 4.92893 6.92893" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Check: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path d="M5 13L9 17L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Sakura: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
      <path d="M16 4C18 4 19 8 16 12C13 8 14 4 16 4Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 28C14 28 13 24 16 20C19 24 18 28 16 28Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 16C4 14 8 13 12 16C8 19 4 18 4 16Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 16C28 18 24 19 20 16C24 13 28 14 28 16Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Back: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
       <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// --- DATA & TYPES ---

type ExamLevel = "n5" | "n4" | "n3" | "n2" | "n1";
type Category = "full" | "mini" | "skill";
type ViewState = "dashboard" | "pretest" | "exam" | "result";

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface ExamTest {
  id: number;
  category: Category;
  title: string;
  questions: Question[];
  duration: number;
  passPoint: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

const CATEGORY_TABS: { id: Category; label: string; Icon: any }[] = [
  { id: "full", label: "Full Test", Icon: ArtIcon.Scroll },
  { id: "mini", label: "Mini Test", Icon: ArtIcon.Spark },
  { id: "skill", label: "Skill Test", Icon: ArtIcon.Target },
];

const LEVEL_CONFIG: Record<ExamLevel, { title: string; gradient: string }> = {
  n5: { title: "Beginning", gradient: "from-teal-500 to-emerald-400" },
  n4: { title: "Basic Japanese", gradient: "from-orange-500 to-amber-400" },
  n3: { title: "Daily Context", gradient: "from-blue-500 to-sky-400" },
  n2: { title: "Professional", gradient: "from-indigo-500 to-violet-400" },
  n1: { title: "Mastery", gradient: "from-rose-500 to-pink-400" },
};

const MOCK_QUESTIONS_POOL: Record<ExamLevel, Question[]> = {
    n5: [
      { id: 1, text: "Read the word: 「先生」", options: ["Gakusei", "Sensei", "Tenshu", "Isha"], correct: 1, explanation: "Sensei means teacher." },
      { id: 2, text: "Which particle is used to mark the subject?", options: ["wa", "ga", "wo", "ni"], correct: 1, explanation: "Particle 'ga' is the subject marker." },
      { id: 3, text: "Meaning of 「ありがとう」", options: ["Hello", "Goodbye", "Thank you", "Sorry"], correct: 2, explanation: "Arigatou means Thank you." },
      { id: 4, text: "Read the word: 「水」", options: ["Mizu", "Hi", "Ki", "Tsuchi"], correct: 0, explanation: "Mizu means water." },
      { id: 5, text: "Wait for a minute (In Japanese)", options: ["Chotto matte", "Hayaku", "Oshiete", "Sumimasen"], correct: 0, explanation: "Chotto matte kudasai." },
    ],
    n4: [{ id: 1, text: "Read: 「働く」", options: ["Hataraku", "Asobu", "Yasumu", "Tsukuru"], correct: 0, explanation: "Hataraku means to work." }],
    n3: [{ id: 1, text: "Meaning of 「偶然」", options: ["Suddenly", "Coincidence", "Planned", "Impossible"], correct: 1, explanation: "Guuzen means coincidence." }],
    n2: [{ id: 1, text: "Formal word for 'Report'", options: ["Houkoku", "Zatsudan", "Iken", "Mondai"], correct: 0, explanation: "Houkoku is reporting." }],
    n1: [{ id: 1, text: "Advanced concept for 'Constraint'", options: ["Seiyaku", "Kaisetsu", "Yurasu", "Hassei"], correct: 0, explanation: "Seiyaku is constraint." }],
};

export default function ExamLevelClient({ level }: { level: ExamLevel }) {
  const router = useRouter();
  const config = LEVEL_CONFIG[level];
  
  const [activeView, setActiveView] = useState<ViewState>("dashboard");
  const [activeCategory, setActiveCategory] = useState<Category>("full");
  const [selectedTest, setSelectedTest] = useState<ExamTest | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tests = useMemo(() => {
    const list: ExamTest[] = [];
    const pool = MOCK_QUESTIONS_POOL[level] || [];
    CATEGORY_TABS.forEach(cat => {
      for (let i = 1; i <= 5; i++) {
        list.push({
          id: list.length + 1,
          category: cat.id,
          title: `${cat.label} #${i}`,
          questions: pool,
          duration: 60,
          passPoint: i === 5 ? 90 : 75,
          difficulty: i <= 2 ? "Easy" : i <= 4 ? "Medium" : "Hard",
        });
      }
    });
    return list;
  }, [level]);

  const filteredTests = tests.filter(t => t.category === activeCategory);

  // Auth Guard Helper
  const checkAuth = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("luma-auth") === "true";
  };

  const handleStartTest = (test: ExamTest) => {
    if (!checkAuth()) {
      router.push(`/login?redirect=exam/${level}`);
      return;
    }
    setSelectedTest(test);
    setActiveView("pretest");
  };

  useEffect(() => {
    if (activeView === 'exam' && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(p => {
          if (p <= 1) {
            handleComplete();
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeView, timer]);

  const beginExam = () => {
    setTimer(selectedTest!.duration * 60);
    setCurrentIdx(0);
    setUserAnswers({});
    setActiveView("exam");
  };

  const handleComplete = () => setActiveView("result");

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. DASHBOARD VIEW
  if (activeView === "dashboard") {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fbff,_#f0fdfa_42%,_#ffffff_100%)] px-4 py-8 md:px-12">
        <div className="mx-auto max-w-2xl">
          <header className="mb-8 flex items-center justify-between">
            <button onClick={() => router.push("/?tab=soal")} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 hover:bg-slate-50 transition">
              <ArtIcon.Back />
            </button>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-600">Luma Master Study</p>
              <h1 className="text-2xl font-black text-slate-800">Level {level.toUpperCase()}</h1>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center font-bold text-teal-600">{level.toUpperCase()}</div>
          </header>

          <section className={`mb-8 p-8 rounded-[2.5rem] bg-gradient-to-br shadow-xl text-white ${config.gradient}`}>
            <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest backdrop-blur">ELITE HUB</span>
            <h2 className="mt-4 text-4xl font-black leading-none italic">Think, and Grow.</h2>
            <p className="mt-4 opacity-85 text-sm leading-6 max-w-xs">Curated by top Nihongo sensei for professional mastery.</p>
          </section>

          <div className="grid grid-cols-3 gap-2 bg-slate-100/50 p-1.5 rounded-[1.8rem] mb-8 ring-1 ring-slate-100 backdrop-blur">
            {CATEGORY_TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveCategory(tab.id)} className={`py-4 rounded-2xl flex flex-col items-center gap-2 transition ${activeCategory === tab.id ? 'bg-white shadow-md text-teal-600 ring-1 ring-slate-200' : 'text-slate-400'}`}>
                <tab.Icon />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-1">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <div className="space-y-3 pb-24">
            {filteredTests.map((test, idx) => {
              const locked = idx > 1;
              return (
                <button 
                  key={test.id} 
                  disabled={locked}
                  onClick={() => handleStartTest(test)}
                  className={`w-full p-5 rounded-[2rem] border text-left transition flex items-center justify-between ${locked ? 'bg-slate-50 opacity-60 grayscale' : 'bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-teal-100 border-slate-100'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-black ${locked ? 'bg-slate-100 text-slate-300' : 'bg-teal-50 text-teal-600'}`}>{idx + 1}</div>
                    <div>
                      <h4 className="font-bold text-slate-800">{test.title}</h4>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{test.questions.length} Q • {test.duration}M</p>
                    </div>
                  </div>
                  {locked ? <div className="text-slate-300"><ArtIcon.Lock /></div> : <span className="text-teal-400">→</span>}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  // 2. PRE-TEST BRIEFING (LIGHT MODE)
  if (activeView === "pretest" && selectedTest) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0f9ff,_#ffffff)] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center p-10 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.08)] rounded-[3rem] ring-1 ring-slate-100">
          <div className="h-24 w-24 mx-auto bg-teal-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-teal-500/20 animate-bounce mb-8">
            <ArtIcon.Target />
          </div>
          <p className="text-teal-500 font-bold tracking-[0.4em] text-xs uppercase mb-2">Study Hub</p>
          <h2 className="text-3xl font-black text-slate-800 mb-6">{selectedTest.title}</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-50 rounded-2xl p-6 ring-1 ring-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Duration</p>
              <p className="text-2xl font-black mt-1 text-slate-800">{selectedTest.duration}m</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 ring-1 ring-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Pass Point</p>
              <p className="text-2xl font-black mt-1 text-slate-800">{selectedTest.passPoint}</p>
            </div>
          </div>

          <div className="space-y-4 text-left text-slate-500 text-sm leading-relaxed mb-10 px-2">
            <div className="flex gap-4 items-center"> <ArtIcon.Check /> <p>Jawab semua soal sebelum waktu habis.</p></div>
            <div className="flex gap-4 items-center"> <ArtIcon.Fire /> <p>Fokus penuh pada setiap pertanyaan.</p></div>
          </div>

          <button onClick={beginExam} className="w-full py-5 rounded-3xl bg-slate-900 text-white font-black text-lg shadow-xl active:scale-95 transition">START NOW</button>
          <button onClick={() => setActiveView('dashboard')} className="mt-4 text-slate-400 font-bold text-[10px] tracking-widest uppercase hover:text-slate-600 transition">Go Back</button>
        </div>
      </main>
    );
  }

  // 3. ACTIVE EXAM (LUXURY)
  if (activeView === "exam" && selectedTest) {
    const q = selectedTest.questions[currentIdx];
    const progress = ((currentIdx + 1) / selectedTest.questions.length) * 100;
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <header className="bg-white p-6 md:px-12 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg rotate-3">{currentIdx + 1}</div>
             <p className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Active Question</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right bg-rose-50 px-4 py-2 rounded-xl ring-1 ring-rose-100 shadow-sm animate-pulse">
              <p className="font-black text-lg text-rose-500 tabular-nums">{formatTime(timer)}</p>
            </div>
            <button onClick={() => { if(confirm('Exit exam?')) setActiveView('dashboard')}} className="h-10 px-6 rounded-xl border border-slate-100 text-[10px] font-black tracking-widest text-slate-400 hover:bg-slate-50 transition uppercase">Exit Hub</button>
          </div>
        </header>

        <div className="h-1.5 w-full bg-slate-100">
          <div className="h-full bg-teal-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-12 md:px-12 max-w-4xl mx-auto w-full">
           <h2 className="text-3xl md:text-4xl font-black mb-12 text-slate-800 leading-tight italic">"{q?.text}"</h2>
           <div className="grid gap-4 mb-20 md:grid-cols-2">
             {q?.options.map((opt, i) => (
               <button 
                 key={i} 
                 onClick={() => setUserAnswers(p => ({ ...p, [q.id]: i}))}
                 className={`group relative w-full p-8 text-left rounded-[2.2rem] border-2 transition-all overflow-hidden ${userAnswers[q.id] === i ? 'border-teal-500 bg-teal-50 shadow-xl' : 'border-slate-100 bg-white hover:border-slate-200'}`}
               >
                 <div className="flex items-center justify-between relative z-10">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-slate-400 mb-1">Option {String.fromCharCode(65+i)}</span>
                      <span className={`text-xl font-black ${userAnswers[q.id] === i ? 'text-teal-700' : 'text-slate-800'}`}>{opt}</span>
                   </div>
                   <div className={`h-8 w-8 rounded-full border-2 transition-all ${userAnswers[q.id] === i ? 'border-teal-500 bg-teal-500 flex items-center justify-center' : 'border-slate-100 group-hover:border-slate-300'}`}>
                      {userAnswers[q.id] === i ? <div className="text-white"><ArtIcon.Check /></div> : null}
                   </div>
                 </div>
               </button>
             ))}
           </div>
        </div>

        <footer className="bg-white p-8 flex items-center justify-between md:px-24 border-t border-slate-50">
            <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(p => p - 1)} className="font-black text-[10px] tracking-[0.2em] text-slate-400 disabled:opacity-20 uppercase">Previous</button>
            <button 
               onClick={() => currentIdx < selectedTest.questions.length - 1 ? setCurrentIdx(p => p + 1) : handleComplete()}
               className="px-12 py-5 rounded-[2rem] bg-slate-900 text-white font-black shadow-2xl active:scale-95 transition text-lg"
            >
              {currentIdx === selectedTest.questions.length - 1 ? 'Finish Exam' : 'Next Lesson'}
            </button>
        </footer>
      </main>
    );
  }

  // 4. RESULT VIEW
  if (activeView === "result") {
    const score = selectedTest?.questions.reduce((acc, q) => acc + (userAnswers[q.id] === q.correct ? 1 : 0), 0) || 0;
    const total = selectedTest?.questions.length || 1;
    const finalScore = Math.round((score / total) * 100);
    const passed = finalScore >= (selectedTest?.passPoint || 80);

    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[3.5rem] p-12 shadow-[0_40px_120px_rgba(15,23,42,0.1)] text-center ring-1 ring-slate-50">
           <div className={`h-40 w-40 mx-auto rounded-[3.2rem] flex items-center justify-center mb-8 ${passed ? 'bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30' : 'bg-rose-500 text-white shadow-2xl shadow-rose-500/30'}`}>
              <ArtIcon.Sakura />
           </div>
           <h2 className="text-4xl font-black text-slate-800">{passed ? 'True Mastery.' : 'Try Again.'}</h2>
           <p className="mt-4 text-slate-400 font-medium">Results for {selectedTest?.title}</p>
           
           <div className="mt-10 mb-10 py-10 bg-[radial-gradient(circle_at_center,_#ffffff,_#f8fafc)] rounded-[2.5rem] ring-1 ring-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Final Precision</p>
              <p className={`text-7xl font-black mt-2 ${passed ? 'text-emerald-500' : 'text-rose-500'}`}>{finalScore}%</p>
           </div>

           <button onClick={() => setActiveView('dashboard')} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-xl hover:shadow-slate-900/20 active:scale-95 transition">BACK TO HUB</button>
        </div>
      </main>
    );
  }
}
