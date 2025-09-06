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
// If your toast hook is located elsewhere, update the path accordingly.
// Example: If it's at '@/components/use-toast', use:
import { toast } from "sonner";
// Or, if you have not created it yet, you need to implement the useToast hook or install the required package.

axios.defaults.withCredentials = true;

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // toast is now imported directly from 'sonner'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/login", formData);
      toast("Login Successful. Welcome back!");
      router.push("/");
      router.refresh(); // This helps the navbar update its state
    } catch (err: any) {
      toast(
        err.response?.data?.message || "Login Failed. Please check your credentials."
      );
      // If you want to use toast.error for error styling:
      // toast.error(err.response?.data?.message || "Login Failed. Please check your credentials.");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" placeholder="m@example.com" required onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required onChange={handleChange} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
