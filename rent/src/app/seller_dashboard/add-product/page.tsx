"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:5000";

export default function AddProductPage() {
  const [formData, setFormData] = useState({ name: '', description: '', pricePerDay: '', category: '', location: '' });
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      toast.error("Please upload at least one image for the product.");
      return;
    }
    
    setIsUploading(true);
    const imageUrls: string[] = [];
    
    // Upload images to Cloudinary
    for (const file of Array.from(files)) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('upload_preset', 'picture'); // Your preset name
      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, uploadFormData, { withCredentials: false });
        imageUrls.push(response.data.secure_url);
      } catch (error) {
        toast.error("Image upload failed. Please try again.");
        setIsUploading(false);
        return;
      }
    }
    
    // Send product data to your backend
    try {
        await axios.post(`${API_BASE_URL}/api/products`, {
            ...formData,
            pricePerDay: Number(formData.pricePerDay),
            imageUrls,
        });
        toast.success("Product listed successfully!");
        router.push("/seller_dashboard");
    } catch (error: any) {
        toast.error("Failed to list product", { description: error.response?.data?.message });
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">List a New Item for Rent</CardTitle>
          <CardDescription>Fill out the details below to add your item to the marketplace.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input id="name" name="name" placeholder="E.g., Professional DSLR Camera" required onChange={handleChange} />
            </div>
             <div className="grid grid-cols-2 gap-6">
                 <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" placeholder="E.g., Electronics" required onChange={handleChange} />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="pricePerDay">Price per Day ($)</Label>
                  <Input id="pricePerDay" name="pricePerDay" type="number" placeholder="50" required onChange={handleChange} />
                </div>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="E.g., Mumbai, India" required onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Describe your item, its condition, and any accessories included." required onChange={handleChange} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="photos">Product Photos</Label>
              <Input id="photos" type="file" multiple required onChange={handleFileChange} />
              <p className="text-xs text-muted-foreground">You can upload multiple images.</p>
            </div>
             <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? "Uploading & Listing..." : "List Item"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
