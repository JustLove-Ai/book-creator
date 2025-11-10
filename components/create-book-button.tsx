'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateBookDialog } from './create-book-dialog';

export function CreateBookButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Book
      </Button>
      {showDialog && <CreateBookDialog onClose={() => setShowDialog(false)} />}
    </>
  );
}
