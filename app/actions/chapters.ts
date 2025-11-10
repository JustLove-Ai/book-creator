'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createChapter(data: {
  bookId: string;
  title: string;
  layoutType?: string;
  content?: string;
  imageUrl?: string;
}) {
  try {
    // Get the highest order number for this book
    const lastChapter = await prisma.chapter.findFirst({
      where: { bookId: data.bookId },
      orderBy: { order: 'desc' },
    });

    const order = (lastChapter?.order ?? -1) + 1;

    const chapter = await prisma.chapter.create({
      data: {
        bookId: data.bookId,
        title: data.title,
        layoutType: data.layoutType || 'chapter',
        content: data.content,
        imageUrl: data.imageUrl,
        order,
      },
    });

    revalidatePath(`/books/${data.bookId}`);
    return { success: true, chapter };
  } catch (error) {
    console.error('Failed to create chapter:', error);
    return { success: false, error: 'Failed to create chapter' };
  }
}

export async function getChapter(id: string) {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
        book: true,
      },
    });

    if (!chapter) {
      return { success: false, error: 'Chapter not found' };
    }

    return { success: true, chapter };
  } catch (error) {
    console.error('Failed to fetch chapter:', error);
    return { success: false, error: 'Failed to fetch chapter' };
  }
}

export async function updateChapter(
  id: string,
  data: {
    title?: string;
    layoutType?: string;
    content?: string;
    imageUrl?: string;
  }
) {
  try {
    const chapter = await prisma.chapter.update({
      where: { id },
      data,
    });

    revalidatePath(`/books/${chapter.bookId}`);
    return { success: true, chapter };
  } catch (error) {
    console.error('Failed to update chapter:', error);
    return { success: false, error: 'Failed to update chapter' };
  }
}

export async function deleteChapter(id: string) {
  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id },
    });

    if (!chapter) {
      return { success: false, error: 'Chapter not found' };
    }

    await prisma.chapter.delete({
      where: { id },
    });

    revalidatePath(`/books/${chapter.bookId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete chapter:', error);
    return { success: false, error: 'Failed to delete chapter' };
  }
}

export async function reorderChapters(bookId: string, chapterIds: string[]) {
  try {
    await Promise.all(
      chapterIds.map((id, index) =>
        prisma.chapter.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath(`/books/${bookId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to reorder chapters:', error);
    return { success: false, error: 'Failed to reorder chapters' };
  }
}
