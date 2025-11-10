import Link from 'next/link';
import { getBooks } from '@/app/actions/books';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus } from 'lucide-react';
import { CreateBookButton } from '@/components/create-book-button';

export default async function BooksPage() {
  const { books } = await getBooks();

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Books</h1>
          <p className="text-muted-foreground">Create and manage your books</p>
        </div>
        <CreateBookButton />
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No books yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start your writing journey by creating your first book. You can begin with just an idea and develop it as you write.
          </p>
          <CreateBookButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{book.title || 'Untitled Book'}</CardTitle>
                  <CardDescription>
                    {book.description || 'No description yet'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {book.chapters.length} chapter{book.chapters.length !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Updated {new Date(book.updatedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
