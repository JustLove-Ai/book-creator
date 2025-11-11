import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center mb-8">
          <BookOpen className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-5xl font-bold">Book Creator</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          AI-powered book writing application. Focus on writing, let AI help you expand your ideas.
        </p>
        <div className="pt-6 flex gap-4 justify-center">
          <Link href="/demo">
            <Button size="lg" variant="outline">Try Demo</Button>
          </Link>
          <Link href="/books">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Try the demo to explore the editor without setup, or get started with your own books
        </p>
      </div>
    </main>
  );
}
