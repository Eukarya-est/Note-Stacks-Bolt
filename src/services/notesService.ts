import { supabase } from '../lib/supabase';
import { Category, Page, SearchResult } from '../types';

export const notesService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return (data || []) as Category[];
  },

  async getCategoryByName(name: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (error) throw error;
    return data as Category | null;
  },

  async getPagesByCategory(
    categoryId: string,
    limit: number = 5,
    offset: number = 0
  ): Promise<Page[]> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('category_id', categoryId)
      .order('page_number')
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return (data || []) as Page[];
  },

  async getPageByNumber(categoryId: string, pageNumber: number): Promise<Page | null> {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('category_id', categoryId)
      .eq('page_number', pageNumber)
      .maybeSingle();

    if (error) throw error;
    return data as Page | null;
  },

  async getTotalPages(categoryId: string): Promise<number> {
    const { count, error } = await supabase
      .from('pages')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId);

    if (error) throw error;
    return count || 0;
  },

  async searchPages(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const { data, error } = await supabase.rpc('search_pages', {
      search_query: query,
    } as any);

    if (error) throw error;
    return (data || []) as SearchResult[];
  },

  async createCategory(name: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name } as any)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  async createPage(page: {
    category_id: string;
    page_number: number;
    title: string;
    cover?: string;
    content?: string;
    revision?: number;
  }): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .insert(page as any)
      .select()
      .single();

    if (error) throw error;
    return data as Page;
  },

  async updatePage(id: string, updates: Partial<Page>): Promise<Page> {
    const { data, error } = await supabase
      .from('pages')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Page;
  },

  async deletePage(id: string): Promise<void> {
    const { error } = await supabase.from('pages').delete().eq('id', id);

    if (error) throw error;
  },
};
