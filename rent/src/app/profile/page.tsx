"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Update the import path below to the correct relative path if use-toast exists in your project structure.
// Example: import { useToast } from "../../components/ui/use-toast";
// import { useToast } from "@/components/ui/use-toast";
// Update the path below to the correct relative path if use-toast exists in your project structure.
// Example: import { useToast } from "../../components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

axios.defaults.withCredentials = true;

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/profile");
        const profile = data as { name: string; email: string };
        setUser({ name: profile.name, email: profile.email });
      } catch (error) {
        toast({
          title: "Not Authenticated",
          description: "Please login to view your profile.",
          variant: "destructive",
        });
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router, toast]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updateData: { name: string, email: string, password?: string } = {
        name: user.name,
        email: user.email,
      };
      if (password) {
        updateData.password = password;
      }
      await axios.put("http://localhost:5000/api/auth/profile", updateData);
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
      setPassword("");
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update your profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Update your personal information here.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
            </div>
            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
function useToast(): { toast: any; } {
    throw new Error("Function not implemented.");
}

