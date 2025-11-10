'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createBook } from '@/app/actions/books';

export function CreateBookDialog({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createBook({
        title: title || undefined,
        description: description || undefined,
      });

      if (result.success && result.book) {
        router.push(`/books/${result.book.id}`);
      }
    } catch (error) {
      console.error('Failed to create book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg max-w-md w-full p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Create New Book</h2>
          <p className="text-muted-foreground text-sm">
            Start with an idea. You can add the title and other details later when you're ready to publish.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title (Optional)
            </label>
            <Input
              id="title"
              placeholder="Untitled Book"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Book Idea / Description (Optional)
            </label>
            <Textarea
              id="description"
              placeholder="What is your book about? This will help provide context for AI-generated content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Book'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
