'use client';

import { useState } from 'react';
import { Chapter, Section } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Sparkles, Edit2, Trash2, Loader2 } from 'lucide-react';
import {
  createSection,
  updateSection,
  deleteSection,
  generateSectionContent,
} from '@/app/actions/sections';
import { updateChapter } from '@/app/actions/chapters';

type ChapterWithSections = Chapter & { sections: Section[] };

interface ChapterEditorProps {
  chapter: ChapterWithSections;
  bookContext: {
    title: string;
    description: string;
  };
}

export function ChapterEditor({ chapter: initialChapter, bookContext }: ChapterEditorProps) {
  const [chapter, setChapter] = useState(initialChapter);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [chapterTitle, setChapterTitle] = useState(chapter.title);
  const [newMainPoint, setNewMainPoint] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [generatingSection, setGeneratingSection] = useState<string | null>(null);

  const handleUpdateTitle = async () => {
    const result = await updateChapter(chapter.id, { title: chapterTitle });
    if (result.success && result.chapter) {
      setChapter({ ...chapter, title: result.chapter.title });
      setIsEditingTitle(false);
    }
  };

  const handleAddSection = async () => {
    if (!newMainPoint.trim()) return;

    const result = await createSection({
      chapterId: chapter.id,
      mainPoint: newMainPoint,
    });

    if (result.success && result.section) {
      setChapter({
        ...chapter,
        sections: [...chapter.sections, result.section],
      });
      setNewMainPoint('');
      setIsAddingSection(false);
    }
  };

  const handleGenerateContent = async (sectionId: string) => {
    setGeneratingSection(sectionId);
    const result = await generateSectionContent(sectionId);

    if (result.success && result.section) {
      setChapter({
        ...chapter,
        sections: chapter.sections.map((s) =>
          s.id === sectionId ? result.section! : s
        ),
      });
    }
    setGeneratingSection(null);
  };

  const handleUpdateSectionContent = async (sectionId: string, content: string) => {
    const result = await updateSection(sectionId, { content });
    if (result.success && result.section) {
      setChapter({
        ...chapter,
        sections: chapter.sections.map((s) =>
          s.id === sectionId ? result.section! : s
        ),
      });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    const result = await deleteSection(sectionId);
    if (result.success) {
      setChapter({
        ...chapter,
        sections: chapter.sections.filter((s) => s.id !== sectionId),
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Chapter Header */}
      <div className="mb-8">
        {isEditingTitle ? (
          <div className="flex gap-2 items-center">
            <Input
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="text-3xl font-bold h-auto"
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
            />
            <Button onClick={handleUpdateTitle}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditingTitle(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{chapter.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditingTitle(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          Layout: {chapter.layoutType}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {chapter.sections.map((section, index) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{section.mainPoint}</CardTitle>
                </div>
                <div className="flex gap-2">
                  {!section.content && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateContent(section.id)}
                      disabled={generatingSection === section.id}
                    >
                      {generatingSection === section.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingSection === section.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={section.content || ''}
                    onChange={(e) =>
                      setChapter({
                        ...chapter,
                        sections: chapter.sections.map((s) =>
                          s.id === section.id ? { ...s, content: e.target.value } : s
                        ),
                      })
                    }
                    rows={8}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        handleUpdateSectionContent(section.id, section.content || '');
                        setEditingSection(null);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingSection(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="prose prose-sm max-w-none cursor-pointer hover:bg-accent/50 rounded p-2 -m-2 transition-colors"
                  onClick={() => setEditingSection(section.id)}
                >
                  {section.content ? (
                    <div className="whitespace-pre-wrap">{section.content}</div>
                  ) : (
                    <div className="text-muted-foreground italic">
                      Click &quot;Generate&quot; to create content or click here to write manually
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Section */}
      <div className="mt-6">
        {isAddingSection ? (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Input
                  placeholder="Main point to cover in this section..."
                  value={newMainPoint}
                  onChange={(e) => setNewMainPoint(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddSection}>Add Section</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingSection(false);
                      setNewMainPoint('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsAddingSection(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Main Point
          </Button>
        )}
      </div>
    </div>
  );
}
