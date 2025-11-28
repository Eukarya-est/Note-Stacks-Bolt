export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          category_id: string;
          page_number: number;
          cover: string;
          revision: number;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          page_number: number;
          cover?: string;
          revision?: number;
          title: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          page_number?: number;
          cover?: string;
          revision?: number;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      search_pages: {
        Args: { search_query: string };
        Returns: SearchResult[];
      };
    };
  };
}

export interface SearchResult {
  id: string;
  category_id: string;
  category_name: string;
  page_number: number;
  cover: string;
  revision: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  rank: number;
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type Page = Database['public']['Tables']['pages']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type PageInsert = Database['public']['Tables']['pages']['Insert'];
