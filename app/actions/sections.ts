'use server';

import { prisma } from '@/lib/prisma';
import { generateContent } from '@/lib/openai';
import { revalidatePath } from 'next/cache';

export async function createSection(data: {
  chapterId: string;
  mainPoint: string;
  content?: string;
}) {
  try {
    // Get the highest order number for this chapter
    const lastSection = await prisma.section.findFirst({
      where: { chapterId: data.chapterId },
      orderBy: { order: 'desc' },
    });

    const order = (lastSection?.order ?? -1) + 1;

    const section = await prisma.section.create({
      data: {
        chapterId: data.chapterId,
        mainPoint: data.mainPoint,
        content: data.content,
        order,
      },
    });

    const chapter = await prisma.chapter.findUnique({
      where: { id: data.chapterId },
    });

    if (chapter) {
      revalidatePath(`/books/${chapter.bookId}`);
    }

    return { success: true, section };
  } catch (error) {
    console.error('Failed to create section:', error);
    return { success: false, error: 'Failed to create section' };
  }
}

export async function updateSection(
  id: string,
  data: {
    mainPoint?: string;
    content?: string;
  }
) {
  try {
    const section = await prisma.section.update({
      where: { id },
      data,
    });

    const chapter = await prisma.chapter.findUnique({
      where: { id: section.chapterId },
    });

    if (chapter) {
      revalidatePath(`/books/${chapter.bookId}`);
    }

    return { success: true, section };
  } catch (error) {
    console.error('Failed to update section:', error);
    return { success: false, error: 'Failed to update section' };
  }
}

export async function deleteSection(id: string) {
  try {
    const section = await prisma.section.findUnique({
      where: { id },
      include: { chapter: true },
    });

    if (!section) {
      return { success: false, error: 'Section not found' };
    }

    await prisma.section.delete({
      where: { id },
    });

    revalidatePath(`/books/${section.chapter.bookId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete section:', error);
    return { success: false, error: 'Failed to delete section' };
  }
}

export async function generateSectionContent(sectionId: string) {
  try {
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        chapter: {
          include: {
            book: true,
            sections: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!section) {
      return { success: false, error: 'Section not found' };
    }

    // Build context from book description and previous sections
    const bookContext = section.chapter.book.description || '';
    const previousSections = section.chapter.sections
      .filter((s) => s.order < section.order && s.content)
      .map((s) => `${s.mainPoint}: ${s.content}`)
      .join('\n\n');

    const context = `Book concept: ${bookContext}\n\nChapter: ${section.chapter.title}\n\nPrevious content in this chapter:\n${previousSections}`;

    const prompt = `Write detailed content for the following main point: "${section.mainPoint}".

Make it engaging, well-structured, and approximately 200-300 words. Use appropriate formatting like paragraphs to make it readable.`;

    const generatedContent = await generateContent(prompt, context);

    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
      data: { content: generatedContent },
    });

    revalidatePath(`/books/${section.chapter.bookId}`);
    return { success: true, section: updatedSection };
  } catch (error) {
    console.error('Failed to generate section content:', error);
    return { success: false, error: 'Failed to generate content' };
  }
}

export async function reorderSections(chapterId: string, sectionIds: string[]) {
  try {
    await Promise.all(
      sectionIds.map((id, index) =>
        prisma.section.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (chapter) {
      revalidatePath(`/books/${chapter.bookId}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to reorder sections:', error);
    return { success: false, error: 'Failed to reorder sections' };
  }
}
