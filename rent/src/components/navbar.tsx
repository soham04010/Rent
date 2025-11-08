"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import { LayoutDashboard, LogOut, Package, Users, Compass, User as UserIcon, MessageSquare } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";

axios.defaults.withCredentials = true;
const API_BASE_URL = "https://rental-app-backend-wk4u.onrender.com";

type User = {
  name: string;
  email: string;
  role: "user" | "seller";
  avatar?: string;
};

const DEFAULT_AVATAR_URL = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

export function Navbar() {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get<User>(`${API_BASE_URL}/api/auth/profile`);
        setUser(data);
      } catch (error) {
        setUser(null);
      }
    };
    if (user === null) {
        fetchUser();
    }
  }, [setUser, user]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`);
      setUser(null);
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string = "") => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Package className="h-7 w-7" />
            <span className="text-xl font-bold">RentalApp</span>
          </Link>
          <nav className="flex items-center space-x-6 text-base font-medium">
            <Link
              href="/products"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Products
            </Link>
            {/* --- NEW: Link to How It Works --- */}
          <Link href="/how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">
            How It Works
          </Link>
           {/* --- NEW: Link to Contact Us --- */}
          <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Contact Us
          </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            // --- Logged In State ---
            <>
              {/* --- THIS IS THE FIX: Enabled Inbox button and made it a link --- */}
              <Button variant="outline" size="icon" asChild>
                <Link href="/inbox">
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </Button>
              {user.role === "seller" && (
                <Button variant="outline" asChild>
                  <Link href="/seller_dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Seller Dashboard
                  </Link>
                </Button>
              )}
              {user.role === "user" && (
                <Button variant="outline" asChild>
                  <Link href="/users_dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Customer Dashboard
                  </Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || DEFAULT_AVATAR_URL} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                     <Link href="/profile"><UserIcon className="mr-2 h-4 w-4" /> Profile</Link>
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
