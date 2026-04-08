"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getProfileByEmail } from "@/lib/db";

const redirectLabels: Record<string, string> = {
  dashboard: "Dashboard",
  materi: "Materi",
  soal: "Soal",
  profile: "Profile",
};

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "soal";

  const [emailInput, setEmailInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    
    setLoading(true);
    setErrorMsg("");
    
    try {
      const profile = await getProfileByEmail(emailInput);
      if (profile) {
        window.localStorage.setItem("luma-auth", "true");
        window.localStorage.setItem("luma-user-profile", JSON.stringify(profile));
        router.push(`/?tab=${redirect}`);
      } else {
        setErrorMsg("Email tidak terdaftar. Silakan registrasi terlebih dahulu.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan saat mengecek akun.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#dff8f6,_#f8fbff_42%,_#eff4f8_100%)] px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-4 md:gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="overflow-hidden rounded-[2.4rem] bg-[linear-gradient(145deg,_#0f172a,_#20304a_58%,_#182235)] text-white shadow-[0_30px_100px_rgba(15,23,42,0.22)]">
          <div className="relative h-full px-6 py-8 md:px-10 md:py-10">
            <div className="absolute inset-0 opacity-25">
              <img
                src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=1400&q=80"
                alt="Study books"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-white/16 text-2xl font-black">
                L
              </div>
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-300">
                Luma JLPT
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
                Silahkan Login Ke Akun Anda
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
                User datang ke halaman ini saat ingin membuka fitur terkunci seperti
                <span className="font-semibold text-white"> {redirectLabels[redirect] ?? "Soal"}</span>.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2.2rem] bg-white/80 p-5 shadow-[0_24px_90px_rgba(15,23,42,0.12)] ring-1 ring-white/80 backdrop-blur md:p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,_#14b8a6,_#f59e0b)] text-xl font-black text-white">
                L
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-500">
                  Login Page
                </p>
                <h2 className="text-2xl font-black text-slate-800">Masuk ke akun demo</h2>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="rounded-[1.6rem] bg-slate-50 px-5 py-4 ring-1 ring-slate-200 focus-within:ring-teal-500 transition-all">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Email Address</p>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent font-bold text-slate-800 outline-none placeholder:text-slate-300"
                  required
                />
              </div>

              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 text-rose-500 text-xs font-bold ring-1 ring-rose-100 italic">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[1.5rem] bg-slate-900 px-5 py-5 text-base font-black text-white transition hover:bg-slate-800 shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Mengecek..." : "Login dan lanjutkan"}
              </button>
            </form>

            <div className="mt-8 text-center">
               <p className="text-sm text-slate-400 font-medium">Belum punya akun?</p>
               <Link 
                 href={`/register?redirect=${redirect}`} 
                 className="mt-2 inline-block text-teal-600 font-black text-xs uppercase tracking-widest hover:underline"
               >
                 Daftar Sekarang →
               </Link>
            </div>

            <Link
              href="/"
              className="mt-4 inline-flex w-full justify-center rounded-[1.5rem] border border-slate-200 px-5 py-4 text-base font-semibold text-slate-700"
            >
              Kembali ke homepage
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
