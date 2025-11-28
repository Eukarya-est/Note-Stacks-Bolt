export * from './database.types';

export interface PageInfo {
  cover: string;
  pageNumber: number;
  revision: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  documentId: string;
}

export interface PageListItem {
  pageNumber: number;
  title: string;
}

export interface ShelfContextType {
  categories: string[];
  loading: boolean;
  error: string | null;
}
