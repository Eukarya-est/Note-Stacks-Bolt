# Migration Guide

This document explains the changes made during the TypeScript conversion and architecture improvements.

## Major Changes

### 1. TypeScript Conversion

All JavaScript files have been converted to TypeScript:
- `.jsx` → `.tsx`
- `.js` → `.ts`
- Added comprehensive type definitions
- Full type safety throughout the application

### 2. Improved Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── notepage/       # Note page display component
│   ├── notepages/      # Page list component
│   ├── pagelistcontroller/  # Navigation controls
│   ├── search/         # NEW: Search functionality
│   └── shelf/          # Category sidebar
├── faces/              # Page layouts
│   ├── desk/          # Profile page
│   ├── noteshelf/     # Main notes view
│   └── topbar/        # Top navigation with search
├── lib/               # Core utilities
│   └── supabase.ts    # Supabase client singleton
├── services/          # NEW: API service layer
│   └── notesService.ts  # Notes CRUD operations
├── types/             # NEW: TypeScript definitions
│   ├── database.types.ts
│   └── index.ts
└── App.tsx
```

### 3. Database Migration to Supabase

**Removed**: Backend proxy configuration for `http://back-end:6556`

**Added**:
- Supabase PostgreSQL database
- Full-text search with tsvector
- Row Level Security (RLS) policies
- Automatic timestamp management

#### Database Schema

**Categories Table**:
- Stores note categories
- Unique constraint on name
- Auto-updated timestamps

**Pages Table**:
- Stores individual note pages
- Foreign key to categories
- Full-text search index
- Unique constraint on (category_id, page_number)

### 4. Search Functionality

**New Feature**: Full-text search across note titles and content

- Real-time search with debouncing
- PostgreSQL full-text search using tsvector
- Search results ranked by relevance
- Click to navigate to specific page
- Keyboard-accessible search modal

### 5. Dependency Updates

**Removed**:
- `react-html-parser` (incompatible with React 19)

**Added**:
- `@supabase/supabase-js` - Supabase client
- `html-react-parser` - Modern HTML parser for React 19
- `typescript` - TypeScript compiler
- Type definitions for React, Node, etc.

### 6. Code Quality Improvements

- Removed unused context providers
- Centralized API calls in service layer
- Proper error handling throughout
- Loading states for async operations
- Type-safe component props

## Environment Setup

### Required Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Migration Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Up Supabase**:
   - Create a Supabase account at https://supabase.com
   - Create a new project
   - The database schema is automatically created via migration
   - Copy your project URL and anon key to `.env`

3. **Populate Database** (Optional):
   You can add sample data using the Supabase SQL editor or via the API:

   ```typescript
   // Create a category
   await notesService.createCategory('Mathematics');

   // Create a page
   await notesService.createPage({
     category_id: 'category-uuid',
     page_number: 1,
     title: 'Introduction to Calculus',
     content: '<h1>Calculus</h1><p>Content here...</p>',
     cover: 'Chapter 1'
   });
   ```

4. **Build and Run**:
   ```bash
   npm run build
   npm run dev
   ```

## Breaking Changes

### API Changes

The application no longer connects to `http://back-end:6556`. All data is now stored in Supabase.

**Before**:
```javascript
fetch('/server/shelf')
```

**After**:
```typescript
await notesService.getCategories()
```

### Component Props

Some component props have been updated for better type safety:

**NotePages**:
- Removed: `category` prop (not used)
- Kept: `pages`, `pageNo`, `setPageNo`

**NotePage**:
- Changed page data structure to include full dates
- Uses `html-react-parser` instead of `react-html-parser`

## New Features

### Search

Press the search icon in the top bar or use the keyboard to search:
- Searches across note titles and content
- Results show category, page number, and matched content
- Click any result to navigate directly to that page

### Improved Navigation

- Fast forward/backward buttons (5 pages at a time)
- Direct page number input
- Visual feedback on hover
- Disabled state for boundary pages

## Testing

The application has been tested with:
- TypeScript compilation (`tsc`)
- Vite build process
- All components rendering correctly
- Search functionality
- Navigation between pages

## Support

For issues or questions:
1. Check the README.md for setup instructions
2. Verify environment variables are set correctly
3. Ensure Supabase project is properly configured
4. Check browser console for errors

## Future Enhancements

Potential improvements:
- Authentication (Supabase Auth)
- Real-time collaboration
- Markdown editor for creating notes
- Export notes to PDF
- Tag system for better organization
- Dark mode support
