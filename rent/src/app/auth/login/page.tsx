"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner"; // Import toast from sonner
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

axios.defaults.withCredentials = true;

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      const data = response.data as { name: string; role: string }; // Type assertion

      // Use the new toast syntax from sonner
      toast.success("Login Successful!", {
        description: `Welcome back, ${data.name}!`,
      });
      
      if (data.role === 'seller') {
        router.push('/seller/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    } catch (err: any) {
      // Use the new error toast syntax
      toast.error("Login Failed", {
        description: err.response?.data?.message || 'Please check your credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-md">Enter your email to log in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required onChange={handleChange} className="h-10"/>
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required onChange={handleChange} className="h-10"/>
            </div>
            <Button type="submit" className="w-full h-11 text-md mt-2" disabled={isLoading}>
              {isLoading ? "Logging In..." : "Log In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

