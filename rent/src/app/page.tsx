import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
        The New Way to Rent
      </h1>
      <p className="max-w-[600px] text-muted-foreground md:text-xl mb-8">
        Discover a seamless rental experience. From tools to tech, find what
        you need, or list your own items to start earning today.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/#explore">Explore Rentals</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/products/new">List an Item</Link>
        </Button>
      </div>
      
    </div>
  );
}
