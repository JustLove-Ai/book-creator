import { notFound } from 'next/navigation';
import { getBook } from '@/app/actions/books';
import { BookEditor } from '@/components/book-editor';

export default async function BookPage({ params }: { params: { id: string } }) {
  const result = await getBook(params.id);

  if (!result.success || !result.book) {
    notFound();
  }

  return <BookEditor book={result.book} />;
}
