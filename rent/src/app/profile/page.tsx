"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:5000";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get<UserProfile>(`${API_BASE_URL}/api/auth/profile`);
        setUser(data as UserProfile);
      } catch (error) {
        toast.error("Not Authorized", {
          description: "Please log in to view your profile.",
        });
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const { data } = await axios.put(`${API_BASE_URL}/api/auth/profile`, {
        name: user.name,
        email: user.email,
        // In a real app, you'd handle image uploads and get a new URL here
        // For now, we'll just re-save the existing avatar URL
        avatar: user.avatar,
      });
      setUser(data as UserProfile);
      toast.success("Profile Updated", {
        description: "Your information has been successfully saved.",
      });
    } catch (err: any) {
      toast.error("Update Failed", {
        description: err.response?.data?.message || "An error occurred.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };
  
  const getInitials = (name: string = "") => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoading || !user) {
    return (
        <div className="flex justify-center py-12">
            <Card className="w-full max-w-3xl">
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <CardDescription>
            Manage your account settings and personal information.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdate}>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                 <Label htmlFor="avatar-upload">Profile Photo</Label>
                 {/* This is a placeholder for file upload UI */}
                 <Input id="avatar-upload" type="file" disabled className="mt-2" />
                 <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG, GIF up to 10MB. (Upload functionality coming soon).
                 </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={user.name} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" value={user.email} onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-between">
            <Button type="submit">Save Changes</Button>
             <Button variant="destructive" type="button">Delete Account</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

