"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
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
// Update the import path if your use-toast file is located elsewhere, for example:
import { toast } from "sonner";
// Or, if you do not have a useToast hook, remove this import and related usage, or implement it.


axios.defaults.withCredentials = true;

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // toast is now imported directly from 'sonner'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill out all fields.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      toast.success("Account created successfully! Redirecting...");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" placeholder="John Doe" required onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required onChange={handleChange} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
