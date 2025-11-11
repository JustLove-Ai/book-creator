'use client';

import { useState } from 'react';
import { demoBook as initialDemoBook } from '@/lib/demo-data';
import { DemoBookEditor } from '@/components/demo-book-editor';

export default function DemoPage() {
  const [book] = useState(initialDemoBook);

  return (
    <div>
      <div className="bg-yellow-50 border-b border-yellow-200 p-3 text-center text-sm">
        <strong>Demo Mode</strong> - Changes are not saved. This is a preview of the editor.
      </div>
      <DemoBookEditor book={book} />
    </div>
  );
}
