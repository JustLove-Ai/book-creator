'use client';

import { useState } from 'react';
import { Book, Chapter, Section } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Plus, Settings } from 'lucide-react';
import Link from 'next/link';
import { updateBook } from '@/app/actions/books';
import { ChapterList } from './chapter-list';
import { ChapterEditor } from './chapter-editor';

type BookWithChapters = Book & {
  chapters: (Chapter & { sections: Section[] })[];
};

export function BookEditor({ book: initialBook }: { book: BookWithChapters }) {
  const [book, setBook] = useState(initialBook);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    book.chapters[0]?.id || null
  );
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [title, setTitle] = useState(book.title || '');
  const [description, setDescription] = useState(book.description || '');

  const selectedChapter = book.chapters.find((c) => c.id === selectedChapterId);

  const handleSaveInfo = async () => {
    const result = await updateBook(book.id, { title, description });
    if (result.success && result.book) {
      setBook({ ...book, ...result.book });
      setIsEditingInfo(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/10 flex flex-col">
        <div className="p-4 border-b">
          <Link href="/books">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Button>
          </Link>
        </div>

        <div className="p-4 border-b">
          {isEditingInfo ? (
            <div className="space-y-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book Title"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Book Description / Idea"
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveInfo}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingInfo(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-bold">{book.title || 'Untitled Book'}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditingInfo(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {book.description || 'No description'}
              </p>
            </div>
          )}
        </div>

        <ChapterList
          bookId={book.id}
          chapters={book.chapters}
          selectedChapterId={selectedChapterId}
          onSelectChapter={setSelectedChapterId}
          onChaptersChange={(chapters) => setBook({ ...book, chapters })}
        />
      </div>

      {/* Main Editor */}
      <div className="flex-1 overflow-auto">
        {selectedChapter ? (
          <ChapterEditor
            chapter={selectedChapter}
            bookContext={{
              title: book.title || '',
              description: book.description || '',
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="mb-4">No chapter selected</p>
              <p className="text-sm">Create a chapter to start writing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
