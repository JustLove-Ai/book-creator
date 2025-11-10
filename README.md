# Book Creator

An AI-powered book writing application built with Next.js, focusing on the writing experience rather than metadata management.

## Features

- **Write First, Publish Later**: Start writing with just an idea. Add title and other details when you're ready to publish.
- **Context-Aware AI**: Each chapter understands the book's concept and previous content for coherent AI-generated content.
- **Section-Based Writing**: Break chapters into main points, let AI expand them, then edit as needed.
- **Multiple Layout Types**: Support for different page layouts (chapters, cover pages, regular pages, image pages).
- **Real-time Editing**: Edit AI-generated content directly in the interface.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: MongoDB with Prisma ORM
- **AI**: OpenAI GPT-4
- **Architecture**: Server Actions for CRUD operations

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book-creator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/book-creator?retryWrites=true&w=majority"
OPENAI_API_KEY="your-openai-api-key-here"
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. (Optional) Push the database schema:
```bash
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Book
- `id`: Unique identifier
- `title`: Book title (optional initially)
- `description`: Book concept/idea
- `coverImage`: Cover image URL (optional)
- `chapters`: Related chapters

### Chapter
- `id`: Unique identifier
- `bookId`: Reference to parent book
- `title`: Chapter title
- `order`: Position in the book
- `layoutType`: Type of page layout (chapter, cover, regular, image)
- `content`: Content for non-sectioned pages
- `sections`: Related sections

### Section
- `id`: Unique identifier
- `chapterId`: Reference to parent chapter
- `mainPoint`: The main topic/point to cover
- `content`: AI-generated and user-edited content
- `order`: Position within the chapter

## Usage

### Creating a Book

1. Click "Get Started" or "New Book" button
2. Optionally add a title and description (you can do this later)
3. Start writing!

### Working with Chapters

1. Create chapters from the sidebar
2. Choose the layout type (chapter, cover, regular, image)
3. Add main points you want to cover in each chapter

### AI Content Generation

1. Add a main point to a section
2. Click "Generate" to let AI expand it based on your book's context
3. Edit the generated content as needed
4. Click on any content area to edit it directly

### Context Management

The AI automatically considers:
- Your book's description/concept
- Previous sections in the current chapter
- The chapter's title and purpose

This ensures coherent, contextual content throughout your book.

## Project Structure

```
book-creator/
├── app/
│   ├── actions/          # Server actions (CRUD operations)
│   │   ├── books.ts
│   │   ├── chapters.ts
│   │   └── sections.ts
│   ├── books/            # Book-related pages
│   │   ├── [id]/         # Individual book editor
│   │   └── page.tsx      # Books listing
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── book-editor.tsx   # Main book editor
│   ├── chapter-list.tsx  # Chapter sidebar
│   ├── chapter-editor.tsx # Chapter content editor
│   └── ...
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── openai.ts         # OpenAI integration
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Future Enhancements

- Export to PDF/EPUB formats
- Collaboration features
- Version history
- Advanced AI writing modes
- Image upload and management
- Publishing workflow
- Template library

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
