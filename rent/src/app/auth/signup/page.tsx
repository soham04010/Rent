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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

axios.defaults.withCredentials = true;

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleRoleChange = (value: 'user' | 'seller') => {
      setFormData({ ...formData, role: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      toast.success("Account Created!", {
        description: "Welcome! You have been successfully signed up.",
      });
      router.push('/');
    } catch (err: any) {
      toast.error("Signup Failed", {
        description: err.response?.data?.message || 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
          <CardDescription className="text-md">Enter your details below to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2 text-left">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" placeholder="John Doe" required onChange={handleChange} className="h-10"/>
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required onChange={handleChange} className="h-10"/>
            </div>
            <div className="grid gap-2 text-left">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required onChange={handleChange} className="h-10"/>
            </div>
             <div className="grid gap-2 text-left">
                <Label>I am signing up as a...</Label>
                <RadioGroup defaultValue="user" name="role" onValueChange={handleRoleChange} className="flex gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="user" id="role-user" />
                        <Label htmlFor="role-user" className="cursor-pointer font-normal">User (I want to rent items)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="seller" id="role-seller" />
                        <Label htmlFor="role-seller" className="cursor-pointer font-normal">Seller (I want to list items)</Label>
                    </div>
                </RadioGroup>
            </div>
            <Button type="submit" className="w-full h-11 text-md mt-2" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

