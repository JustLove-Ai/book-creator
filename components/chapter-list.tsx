'use client';

import { useState } from 'react';
import { Chapter, Section } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, FileText } from 'lucide-react';
import { createChapter } from '@/app/actions/chapters';
import { cn } from '@/lib/utils';

type ChapterWithSections = Chapter & { sections: Section[] };

interface ChapterListProps {
  bookId: string;
  chapters: ChapterWithSections[];
  selectedChapterId: string | null;
  onSelectChapter: (id: string) => void;
  onChaptersChange: (chapters: ChapterWithSections[]) => void;
}

export function ChapterList({
  bookId,
  chapters,
  selectedChapterId,
  onSelectChapter,
  onChaptersChange,
}: ChapterListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [layoutType, setLayoutType] = useState('chapter');

  const handleCreateChapter = async () => {
    if (!newChapterTitle.trim()) return;

    const result = await createChapter({
      bookId,
      title: newChapterTitle,
      layoutType,
    });

    if (result.success && result.chapter) {
      const newChapter = { ...result.chapter, sections: [] };
      onChaptersChange([...chapters, newChapter]);
      onSelectChapter(result.chapter.id);
      setNewChapterTitle('');
      setIsCreating(false);
      setLayoutType('chapter');
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Chapters</h3>
        <div className="space-y-1">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => onSelectChapter(chapter.id)}
              className={cn(
                'w-full text-left p-3 rounded-lg hover:bg-accent transition-colors',
                selectedChapterId === chapter.id && 'bg-accent'
              )}
            >
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{chapter.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {chapter.sections.length} section{chapter.sections.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {isCreating ? (
        <div className="space-y-2 p-3 border rounded-lg">
          <Input
            placeholder="Chapter title"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateChapter()}
            autoFocus
          />
          <select
            value={layoutType}
            onChange={(e) => setLayoutType(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="chapter">Chapter</option>
            <option value="cover">Cover Page</option>
            <option value="regular">Regular Page</option>
            <option value="image">Image Page</option>
          </select>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreateChapter}>
              Create
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setNewChapterTitle('');
                setLayoutType('chapter');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chapter
        </Button>
      )}
    </div>
  );
}
