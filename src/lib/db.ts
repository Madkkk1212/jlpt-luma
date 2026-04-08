import { supabase } from './supabase'
import { AppTheme, BannerSlide, MaterialCategory, Material, ExamLevel, ExamTest, Question, Profile } from './types'

// Theme
export async function getTheme(): Promise<AppTheme | null> {
  const { data, error } = await supabase.from('app_theme').select('*').single()
  if (error) return null
  return data
}

export async function updateTheme(theme: Partial<AppTheme>) {
  const { data, error } = await supabase.from('app_theme').update(theme).eq('id', theme.id).select()
  if (error) throw error
  return data
}

// Banner Slides
export async function getBanners(): Promise<BannerSlide[]> {
  const { data, error } = await supabase.from('banner_slides').select('*').eq('is_active', true).order('sort_order', { ascending: true })
  if (error) return []
  return data
}

export async function getAllBanners(): Promise<BannerSlide[]> {
  const { data, error } = await supabase.from('banner_slides').select('*').order('sort_order', { ascending: true })
  if (error) return []
  return data
}

// Material Categories
export async function getMaterialCategories(): Promise<MaterialCategory[]> {
  const { data, error } = await supabase.from('material_categories').select('*').order('sort_order', { ascending: true })
  if (error) return []
  return data
}

// Materials
export async function getMaterials(): Promise<Material[]> {
  const { data, error } = await supabase.from('materials').select('*').order('sort_order', { ascending: true })
  if (error) return []
  return data
}

export async function getMaterialsByCategory(categoryId: string): Promise<Material[]> {
  const { data, error } = await supabase.from('materials').select('*').eq('category_id', categoryId).order('sort_order', { ascending: true })
  if (error) return []
  return data
}

export async function getMaterialBySlug(slug: string): Promise<Material | null> {
  const { data, error } = await supabase.from('materials').select('*').eq('slug', slug).single()
  if (error) return null
  return data
}

// Exam Levels
export async function getExamLevels(): Promise<ExamLevel[]> {
  const { data, error } = await supabase.from('exam_levels').select('*').order('sort_order', { ascending: true })
  if (error) return []
  return data
}

// Exam Tests
export async function getExamTests(levelId: string): Promise<ExamTest[]> {
  const { data, error } = await supabase.from('exam_tests').select('*').eq('level_id', levelId).eq('is_active', true).order('sort_order', { ascending: true })
  if (error) return []
  return data
}

// Questions
export async function getQuestions(testId: string): Promise<Question[]> {
  const { data, error } = await supabase.from('questions').select('*').eq('test_id', testId).order('sort_order', { ascending: true })
  if (error) return []
  return data
}

// --- CRUD OPERATIONS FOR ADMIN ---

export async function upsertBanner(banner: Partial<BannerSlide>) {
  const { data, error } = await supabase.from('banner_slides').upsert(banner).select()
  if (error) throw error
  return data
}

export async function deleteBanner(id: string) {
  const { error } = await supabase.from('banner_slides').delete().eq('id', id)
  if (error) throw error
}

export async function upsertMaterialCategory(category: Partial<MaterialCategory>) {
  const { data, error } = await supabase.from('material_categories').upsert(category).select()
  if (error) throw error
  return data
}

export async function deleteMaterialCategory(id: string) {
  const { error } = await supabase.from('material_categories').delete().eq('id', id)
  if (error) throw error
}

export async function upsertMaterial(material: Partial<Material>) {
  const { data, error } = await supabase.from('materials').upsert(material).select()
  if (error) throw error
  return data
}

export async function deleteMaterial(id: string) {
  const { error } = await supabase.from('materials').delete().eq('id', id)
  if (error) throw error
}

export async function upsertExamLevel(level: Partial<ExamLevel>) {
  const { data, error } = await supabase.from('exam_levels').upsert(level).select()
  if (error) throw error
  return data
}

export async function deleteExamLevel(id: string) {
  const { error } = await supabase.from('exam_levels').delete().eq('id', id)
  if (error) throw error
}

export async function upsertExamTest(test: Partial<ExamTest>) {
  const { data, error } = await supabase.from('exam_tests').upsert(test).select()
  if (error) throw error
  return data
}

export async function deleteExamTest(id: string) {
  const { error } = await supabase.from('exam_tests').delete().eq('id', id)
  if (error) throw error
}

export async function upsertQuestion(question: Partial<Question>) {
  const { data, error } = await supabase.from('questions').upsert(question).select()
  if (error) throw error
  return data
}

export async function deleteQuestion(id: string) {
  const { error } = await supabase.from('questions').delete().eq('id', id)
  if (error) throw error
}

// --- PROFILES ---

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (error) return []
  return data
}

export async function getProfileByEmail(email: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single()
  if (error) return null
  return data
}

export async function upsertProfile(profile: Partial<Profile>) {
  const { data, error } = await supabase.from('profiles').upsert(profile).select()
  if (error) throw error
  return data
}

export async function deleteProfile(id: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  if (error) throw error
}
