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

// This default is for OUR backend API
axios.defaults.withCredentials = true;
const API_BASE_URL = "https://rental-app-backend-wk4u.onrender.com";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
  address: string;
  phone: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Corrected the API endpoint back to /api/auth/profile
        const { data } = await axios.get<UserProfile>(`${API_BASE_URL}/api/auth/profile`);
        setUser(data);
      } catch (error) {
        toast.error("Not Authorized", { description: "Please log in to view your profile." });
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (user) {
        setUser({ ...user, avatar: URL.createObjectURL(file) });
      }
    }
  };
  
  const getInitials = (name: string = "") => {
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };


  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    let uploadedAvatarUrl = user.avatar;

    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', 'picture');

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
          { withCredentials: false }
        );
        
        uploadedAvatarUrl = response.data.secure_url;
      } catch (error: any) {
        console.error("Cloudinary Upload Error:", error.response?.data);
        const errorMessage = error.response?.data?.error?.message || "Please check your Cloudinary settings.";
        toast.error("Image Upload Failed", {
          description: `Error: ${errorMessage}`,
        });
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }
    
    try {
      // Corrected the API endpoint back to /api/auth/profile
      const { data } = await axios.put(`${API_BASE_URL}/api/auth/profile`, {
        name: user.name,
        email: user.email,
        avatar: uploadedAvatarUrl,
        address: user.address,
        phone: user.phone,
      });
      setUser(data);
      setSelectedFile(null);
      toast.success("Profile Updated", { description: "Your information has been successfully saved." });
      
      // --- THIS IS THE FIX ---
      // This tells Next.js to refresh the data for the current page,
      // which includes the Navbar, causing it to fetch the new user info.
      router.refresh(); 

    } catch (err: any) {
      toast.error("Update Failed", { description: err.response?.data?.message || "An error occurred." });
    }
  };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
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
          <CardDescription>Manage your account settings and personal information.</CardDescription>
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
                 <Input id="avatar-upload" type="file" onChange={handleFileChange} className="mt-2" />
                 <p className="text-xs text-muted-foreground mt-2">PNG, JPG, GIF up to 10MB.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={user.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={user.email} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={user.phone} onChange={handleChange} placeholder="e.g., +1 234 567 890"/>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={user.address} onChange={handleChange} placeholder="e.g., 123 Main St, Anytown, USA"/>
                </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Save Changes"}
            </Button>
             <Button variant="destructive" type="button">Delete Account</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
