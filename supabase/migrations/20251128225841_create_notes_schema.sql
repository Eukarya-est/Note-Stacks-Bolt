/*
  # Create Notes Application Schema

  ## Overview
  This migration creates the database schema for a note-taking application with categories,
  pages, and full-text search capabilities.

  ## New Tables
  
  ### `categories`
  - `id` (uuid, primary key) - Unique identifier for each category
  - `name` (text, unique) - Category name (e.g., "Math", "Physics")
  - `created_at` (timestamptz) - When the category was created
  - `updated_at` (timestamptz) - When the category was last updated
  
  ### `pages`
  - `id` (uuid, primary key) - Unique identifier for each page
  - `category_id` (uuid, foreign key) - Reference to categories table
  - `page_number` (integer) - Page number within the category
  - `cover` (text) - Cover/section name
  - `revision` (integer) - Revision number of the page
  - `title` (text) - Page title
  - `content` (text) - HTML content of the page
  - `created_at` (timestamptz) - When the page was created
  - `updated_at` (timestamptz) - When the page was last updated
  
  ## Indexes
  - Full-text search index on pages (title and content)
  - Category index on pages for faster queries
  - Unique constraint on category_id + page_number
  
  ## Security
  - Enable RLS on all tables
  - Public read access for all users (both authenticated and anonymous)
  - Only authenticated users can create/update/delete data
  
  ## Important Notes
  1. Full-text search using PostgreSQL's built-in tsvector
  2. Automatic timestamp updates via triggers
  3. Cascading deletes (when category is deleted, all its pages are deleted)
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  cover text DEFAULT '',
  revision integer DEFAULT 1,
  title text NOT NULL,
  content text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(category_id, page_number)
);

-- Create index for category lookups
CREATE INDEX IF NOT EXISTS idx_pages_category_id ON pages(category_id);

-- Create index for page number sorting
CREATE INDEX IF NOT EXISTS idx_pages_page_number ON pages(page_number);

-- Add full-text search column and index
ALTER TABLE pages ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_pages_search ON pages USING gin(search_vector);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_categories_updated_at'
  ) THEN
    CREATE TRIGGER update_categories_updated_at
      BEFORE UPDATE ON categories
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_pages_updated_at'
  ) THEN
    CREATE TRIGGER update_pages_updated_at
      BEFORE UPDATE ON pages
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- Pages policies
CREATE POLICY "Anyone can view pages"
  ON pages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert pages"
  ON pages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pages"
  ON pages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pages"
  ON pages FOR DELETE
  TO authenticated
  USING (true);

-- Create a function for full-text search
CREATE OR REPLACE FUNCTION search_pages(search_query text)
RETURNS TABLE (
  id uuid,
  category_id uuid,
  category_name text,
  page_number integer,
  cover text,
  revision integer,
  title text,
  content text,
  created_at timestamptz,
  updated_at timestamptz,
  rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.category_id,
    c.name as category_name,
    p.page_number,
    p.cover,
    p.revision,
    p.title,
    p.content,
    p.created_at,
    p.updated_at,
    ts_rank(p.search_vector, websearch_to_tsquery('english', search_query)) as rank
  FROM pages p
  JOIN categories c ON p.category_id = c.id
  WHERE p.search_vector @@ websearch_to_tsquery('english', search_query)
  ORDER BY rank DESC, p.updated_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;