"use client";

import { useEffect, useState } from "react";
import { BannerSlide } from "@/lib/types";
import { getAllBanners, upsertBanner, deleteBanner } from "@/lib/db";

export default function BannerManager() {
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BannerSlide>>({});

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setLoading(true);
    const data = await getAllBanners();
    setBanners(data);
    setLoading(false);
  }

  const handleEdit = (banner: BannerSlide) => {
    setEditingId(banner.id);
    setEditForm(banner);
  };

  const handleAddNew = () => {
    setEditingId("new");
    setEditForm({
      title: "New Banner",
      subtitle: "",
      image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1200&q=80",
      cta_text: "Mulai Belajar",
      badge_text: "New",
      badge_color: "#14b8a6",
      title_color: "#ffffff",
      overlay_color: "#000000",
      overlay_opacity: 0.4,
      is_active: true,
      sort_order: banners.length + 1
    });
  };

  const handleSave = async () => {
    try {
      await upsertBanner(editForm);
      setEditingId(null);
      fetchBanners();
    } catch (error) {
      console.error(error);
      alert("Failed to save banner");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner(id);
      fetchBanners();
    } catch (error) {
      console.error(error);
      alert("Failed to delete banner");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : 
                type === "number" ? parseFloat(value) : value;
    setEditForm(prev => ({ ...prev, [name]: val }));
  };

  if (loading) return <div className="text-center p-10 font-bold text-slate-400">Loading banners...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800">Carousel Slides</h3>
        <button onClick={handleAddNew} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition">+ ADD SLIDE</button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="flex gap-6 p-6 bg-slate-50 rounded-[2rem] ring-1 ring-inset ring-slate-200">
            <div className="w-48 h-32 rounded-2xl overflow-hidden bg-slate-200 shrink-0">
               <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${banner.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                  {banner.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs font-bold text-slate-400">Order: {banner.sort_order}</span>
              </div>
              <h4 className="text-lg font-black text-slate-800">{banner.title}</h4>
              <p className="text-sm text-slate-500 line-clamp-1">{banner.subtitle}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => handleEdit(banner)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 transition">EDIT</button>
                <button onClick={() => handleDelete(banner.id)} className="px-4 py-2 bg-rose-50 text-rose-500 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition">DELETE</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-800 mb-8">{editingId === "new" ? "Add New Slide" : "Edit Slide"}</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Image URL</label>
                <input name="image_url" value={editForm.image_url || ""} onChange={handleFormChange} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Title</label>
                <input name="title" value={editForm.title || ""} onChange={handleFormChange} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Subtitle</label>
                <input name="subtitle" value={editForm.subtitle || ""} onChange={handleFormChange} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">CTA Text</label>
                <input name="cta_text" value={editForm.cta_text || ""} onChange={handleFormChange} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Badge Text</label>
                <input name="badge_text" value={editForm.badge_text || ""} onChange={handleFormChange} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Sort Order</label>
                <input type="number" name="sort_order" value={editForm.sort_order || 0} onChange={handleFormChange} className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="is_active" checked={editForm.is_active || false} onChange={handleFormChange} id="is_active" className="h-5 w-5 rounded-md border-slate-300" />
                <label htmlFor="is_active" className="text-sm font-bold text-slate-700">Active Slide</label>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-10 pt-6 border-t font-black">
              <button onClick={() => setEditingId(null)} className="px-6 py-3 text-slate-400 hover:text-slate-600 transition tracking-widest text-xs uppercase">Cancel</button>
              <button onClick={handleSave} className="px-10 py-3 bg-slate-900 text-white rounded-2xl shadow-xl active:scale-95 transition tracking-widest text-xs uppercase">Save Slide</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
