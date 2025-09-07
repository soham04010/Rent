import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 py-20 bg-gradient-to-br from-pink-50 via-white to-blue-50 overflow-hidden">
      {/* Decorative colorful gradient blobs */}
      <div className="absolute top-[-80px] left-[-60px] w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-80px] right-[-40px] w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900 drop-shadow-sm">
        Rent Smarter, <br className="hidden md:block" /> Live Better
      </h1>

      {/* Subtitle */}
      <p className="max-w-[750px] text-gray-700 md:text-lg mb-10">
        From everyday essentials to rare finds — explore a world of rentals. 
        Save money, reduce waste, and connect with a global community of sharers.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mb-16 justify-center">
        <Button
          asChild
          size="lg"
          className="rounded-full px-8 bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 text-white shadow-lg hover:scale-105 transition-transform"
        >
          <Link href="/#explore">Explore Rentals</Link>
        </Button>
        <Button
          asChild
          size="lg"
          className="rounded-full px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg hover:scale-105 transition-transform"
        >
          <Link href="/products/new">List an Item</Link>
        </Button>
      </div>

      {/* Quote */}
      <blockquote className="italic text-gray-600 text-lg mb-20 max-w-[650px]">
        “Why own when you can rent? Share more, spend less, and live sustainably.”
      </blockquote>

      {/* Showcase Section (clickable) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1000px]">
        <Link
          href="/products"
          className="rounded-2xl h-[200px] bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center text-gray-900 font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          🏠 Home & Living
        </Link>
        <Link
          href="/products"
          className="rounded-2xl h-[200px] bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-gray-900 font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          💻 Tech & Gadgets
        </Link>
        <Link
          href="/products"
          className="rounded-2xl h-[200px] bg-gradient-to-br from-yellow-200 to-orange-400 flex items-center justify-center text-gray-900 font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          🎒 Travel & Outdoors
        </Link>
      </div>

      {/* Footer tagline */}
      <p className="text-gray-500 text-sm mt-20">
        🌍 Join thousands worldwide who choose smarter rentals.
      </p>
    </div>
  );
}
