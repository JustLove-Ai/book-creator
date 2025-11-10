'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createBook(data: {
  title?: string;
  description?: string;
}) {
  try {
    const book = await prisma.book.create({
      data: {
        title: data.title || 'Untitled Book',
        description: data.description,
      },
    });

    revalidatePath('/books');
    return { success: true, book };
  } catch (error) {
    console.error('Failed to create book:', error);
    return { success: false, error: 'Failed to create book' };
  }
}

export async function getBooks() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
    });

    return { success: true, books };
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return { success: false, error: 'Failed to fetch books', books: [] };
  }
}

export async function getBook(id: string) {
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { order: 'asc' },
          include: {
            sections: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!book) {
      return { success: false, error: 'Book not found' };
    }

    return { success: true, book };
  } catch (error) {
    console.error('Failed to fetch book:', error);
    return { success: false, error: 'Failed to fetch book' };
  }
}

export async function updateBook(
  id: string,
  data: {
    title?: string;
    description?: string;
    coverImage?: string;
  }
) {
  try {
    const book = await prisma.book.update({
      where: { id },
      data,
    });

    revalidatePath('/books');
    revalidatePath(`/books/${id}`);
    return { success: true, book };
  } catch (error) {
    console.error('Failed to update book:', error);
    return { success: false, error: 'Failed to update book' };
  }
}

export async function deleteBook(id: string) {
  try {
    await prisma.book.delete({
      where: { id },
    });

    revalidatePath('/books');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete book:', error);
    return { success: false, error: 'Failed to delete book' };
  }
}
