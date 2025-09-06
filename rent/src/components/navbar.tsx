"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, Package, Users } from "lucide-react";

// Configure axios for all requests
axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:5000";

// Updated User type to include the role
type User = {
  name: string;
  role: "user" | "seller" | "admin";
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

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    // Increased height and added a subtle shadow
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Package className="h-7 w-7" />
            {/* Increased font size */}
            <span className="text-xl font-bold">RentalApp</span>
          </Link>
          <nav className="flex items-center space-x-6 text-base font-medium">
            <Link
              href="/explore"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/explore" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Explore
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            // --- Logged In State ---
            <>
              {user.role === "seller" && (
                <Button variant="outline" asChild>
                  <Link href="/seller/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Seller Dashboard
                  </Link>
                </Button>
              )}
              {user.role === "user" && (
                <Button variant="outline" asChild>
                  <Link href="/customer/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Customer Dashboard
                  </Link>
                </Button>
              )}
               {user.role === "admin" && (
                <Button variant="outline" asChild>
                  <Link href="/admin/dashboard">
                    <Users className="mr-2 h-4 w-4" /> Admin Dashboard
                  </Link>
                </Button>
              )}

              {/* Profile Icon and Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      {/* Add AvatarImage here if you store user profile pics */}
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                     <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // --- Logged Out State ---
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

