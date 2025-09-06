import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)]">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter">
          The New Way to Rent Anything
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl">
          From cameras to camping gear, find what you need from a trusted
          community of owners. Or, make money by renting out your own items.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button asChild size="lg">
          <Link href="/explore">Explore Rentals</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/products/new">List an Item</Link>
        </Button>
      </div>
    </main>
  );
}

