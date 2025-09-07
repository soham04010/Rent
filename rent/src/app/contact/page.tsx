"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
        if (!accessKey) {
            toast.error("Configuration Error", {
                description: "The form is not configured correctly. Please contact the site administrator.",
            });
            setIsLoading(false);
            return;
        }

        const formData = new FormData(e.currentTarget);
        formData.append("access_key", accessKey);

        // --- THIS IS THE FIX ---
        // Convert FormData to a plain JavaScript object
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            // Use the native fetch API for a more robust request
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: json
            });

            const res = await response.json();
            
            if (res.success) {
                toast.success("Message Sent!", {
                    description: "Thank you for contacting us. We will get back to you shortly.",
                });
                (e.target as HTMLFormElement).reset();
            } else {
                toast.error("Failed to Send Message", {
                    description: res.message || "An unexpected error occurred.",
                });
            }
        } catch (error) {
            toast.error("Failed to Send Message", {
                description: "There was a problem connecting to the server.",
            });
        } finally {
            setIsLoading(false);
        }
        // --- END OF FIX ---
    };

  return (
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
          <CardDescription className="text-md">
            Have a question or feedback? Fill out the form below to get in touch.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="e.g., Question about a rental" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Please describe your inquiry in detail..."
                className="min-h-[150px]"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

