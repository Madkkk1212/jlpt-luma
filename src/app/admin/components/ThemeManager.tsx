"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AppTheme } from "@/lib/types";
import { getTheme, updateTheme } from "@/lib/db";

export default function ThemeManager() {
  const [theme, setTheme] = useState<AppTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchTheme() {
      const data = await getTheme();
      setTheme(data);
      setLoading(false);
    }
    fetchTheme();
  }, []);

  const handleSave = async () => {
    if (!theme) return;
    setSaving(true);
    try {
      await updateTheme(theme);
      alert("Theme updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update theme.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTheme((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400">Loading theme...</div>;

  const colorFields: (keyof AppTheme)[] = [
    "primary_color", "accent_color", "bg_gradient_from", "bg_gradient_to", 
    "card_bg", "text_primary", "text_secondary", "nav_bg", "nav_active_color",
    "button_primary_bg", "button_primary_text", "splash_gradient_from", "splash_gradient_to"
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-800 border-b pb-4">General Info</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">App Name</label>
              <input name="app_name" value={theme?.app_name || ""} onChange={handleChange as any} className="w-full px-6 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none transition" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Tagline</label>
              <input name="tagline" value={theme?.tagline || ""} onChange={handleChange as any} className="w-full px-6 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none transition" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Logo Text</label>
              <input name="logo_text" value={theme?.logo_text || ""} onChange={handleChange as any} className="w-full px-6 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white outline-none transition" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-800 border-b pb-4">Theme Colors</h3>
          <div className="grid grid-cols-2 gap-4">
            {colorFields.map((field) => (
              <div key={field}>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">{field.replace(/_/g, ' ')}</label>
                <div className="flex gap-2">
                  <input type="color" name={field} value={theme?.[field] as string || "#000000"} onChange={handleChange as any} className="h-10 w-10 p-0 border-0 bg-transparent cursor-pointer rounded overflow-hidden" />
                  <input type="text" name={field} value={theme?.[field] as string || ""} onChange={handleChange as any} className="flex-1 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-sm font-mono" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t">
        <button onClick={handleSave} disabled={saving} className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-xl active:scale-95 transition disabled:opacity-50">
          {saving ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </div>
    </div>
  );
}
