"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

// Configure axios for all requests
axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:5000";

type User = {
  name: string;
  // add other fields as needed
};

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/auth/profile`);
        setUser(data as User);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, [pathname]); // Refetch user when route changes

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`);
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span className="font-bold">RentalApp</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Home
            </Link>
            <Link
              href="/profile"
               className={`transition-colors hover:text-foreground/80 ${
                pathname === "/profile" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Profile
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline-block">Welcome, {user.name}</span>
              <Button onClick={handleLogout} variant="destructive">Logout</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
