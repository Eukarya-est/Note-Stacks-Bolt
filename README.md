# The Note Stacks

A modern note-taking application built with React, TypeScript, and Supabase. Features include organized note categories, full-text search, and a clean, professional interface.

## Features

- **Category Organization**: Browse notes by category
- **Full-Text Search**: Search through note titles and content with real-time results
- **Page Navigation**: Easy navigation between pages with keyboard shortcuts
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Full type safety throughout the application
- **Supabase Backend**: Secure, scalable database with real-time capabilities

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL database)
- **Styling**: Custom CSS with modern animations
- **Routing**: React Router v7
- **Search**: PostgreSQL full-text search with tsvector

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account and project

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with your Supabase project credentials.

### 3. Database Setup

The database schema is automatically created via the Supabase migration. It includes:

- **categories**: Stores note categories
- **pages**: Stores individual note pages with full-text search
- **search_pages()**: PostgreSQL function for searching notes

### 4. Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── notepage/       # Note page display
│   ├── notepages/      # Page list view
│   ├── pagelistcontroller/  # Page navigation controls
│   ├── search/         # Search component
│   └── shelf/          # Category sidebar
├── faces/              # Main page layouts
│   ├── desk/          # Profile/about page
│   ├── noteshelf/     # Main notes view
│   └── topbar/        # Top navigation
├── lib/               # Core utilities
│   └── supabase.ts    # Supabase client
├── services/          # API services
│   └── notesService.ts  # Notes CRUD operations
├── types/             # TypeScript definitions
│   ├── database.types.ts  # Database schema types
│   └── index.ts       # Shared types
└── App.tsx            # Main app component
```

## Usage

### Browsing Notes

1. Click on a category in the left sidebar
2. Navigate through pages using the page controller
3. Click on page numbers in the list to jump to specific pages

### Searching Notes

1. Click the search icon in the top bar
2. Type your search query
3. Results appear in real-time
4. Click on a result to navigate to that page

### Navigation Shortcuts

- **Fast Forward/Backward**: Jump 5 pages at a time
- **Previous/Next**: Navigate one page at a time
- **Direct Input**: Type a page number to jump directly

## Database Schema

### Categories Table
- `id`: UUID primary key
- `name`: Unique category name
- `created_at`, `updated_at`: Timestamps

### Pages Table
- `id`: UUID primary key
- `category_id`: Foreign key to categories
- `page_number`: Page number within category
- `cover`: Section/cover name
- `revision`: Revision number
- `title`: Page title
- `content`: HTML content
- `created_at`, `updated_at`: Timestamps
- `search_vector`: Full-text search index

## API Service Methods

```typescript
// Get all categories
await notesService.getCategories()

// Get pages by category
await notesService.getPagesByCategory(categoryId, limit, offset)

// Get specific page
await notesService.getPageByNumber(categoryId, pageNumber)

// Search notes
await notesService.searchPages(query)

// Create/Update/Delete operations
await notesService.createPage(data)
await notesService.updatePage(id, updates)
await notesService.deletePage(id)
```

## Docker Deployment

The project includes Docker configuration for containerized deployment:

```bash
docker build -t note-stacks .
docker run -p 3000:3000 note-stacks
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
