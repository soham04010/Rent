"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Badge } from "@/components/ui/badge"; // Import the Badge component

axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:5000";

// ADDITION: Added the isAvailable field
interface Product {
  _id: string;
  name: string;
  description: string;
  pricePerDay: number;
  category: string;
  location: string;
  imageUrls: string[];
  owner: { name: string; avatar: string; };
  isAvailable: boolean; // This field will now be fetched from the backend
}

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(), to: addDays(new Date(), 4) });
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/products/${params.id}`);
        setProduct(data);
      } catch (error) {
        toast.error("Product not found.");
        router.push("/products"); // Changed from /explore to /products
      }
    };
    if (params.id) {
        fetchProduct();
    }
  }, [params.id, router]);

  const handleBooking = async () => {
    if (!date?.from || !date?.to) {
        toast.error("Please select a valid date range.");
        return;
    }
    const days = (date.to.getTime() - date.from.getTime()) / (1000 * 3600 * 24);
    if (!product) return;

    try {
        await axios.post(`${API_BASE_URL}/api/bookings`, {
            productId: product._id,
            startDate: date.from,
            endDate: date.to,
            totalPrice: days * product.pricePerDay,
        });
        toast.success("Booking request sent!", { description: "The seller will respond shortly." });
        router.push("/users_dashboard"); // Changed from /users_dashboard
    } catch (error: any) {
        toast.error("Booking failed", { description: error.response?.data?.message });
    }
  }

  if (!product) {
    return <div>Loading product...</div>; // Add a skeleton loader here
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto py-12">
      {/* Image Gallery */}
      <div>
        {/* ADDITION: Wrapper div to position the badge */}
        <div className="relative">
            <img src={product.imageUrls[0]} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
            {/* ADDITION: Conditionally render a "Rented Out" badge */}
            {!product.isAvailable && (
                <Badge variant="destructive" className="absolute top-4 right-4 text-lg shadow-md">
                    Rented Out
                </Badge>
            )}
        </div>
      </div>

      {/* Product Info & Booking */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{product.name}</CardTitle>
            <CardDescription>{product.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{product.description}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle>Rent This Item</CardTitle>
                <p className="text-2xl font-bold">${product.pricePerDay}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
            </div>
          </CardHeader>
           <CardContent>
            {/* ADDITION: Conditional logic to show booking UI or an "unavailable" message */}
            {product.isAvailable ? (
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <Calendar mode="range" selected={date} onSelect={setDate} numberOfMonths={1} />
                    <div className="w-full space-y-4">
                        <Button onClick={handleBooking} className="w-full">Request to Rent</Button>
                        <Button variant="outline" className="w-full">Message Seller</Button>
                    </div>
                </div>
            ) : (
                <div className="text-center p-8 bg-muted rounded-lg">
                    <p className="font-semibold text-destructive">This item is currently unavailable for rent.</p>
                    <p className="text-sm text-muted-foreground mt-1">Please check back later.</p>
                </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="flex items-center p-4 gap-4">
            <Avatar>
                <AvatarImage src={product.owner.avatar} />
                <AvatarFallback>SL</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">{product.owner.name}</p>
                <p className="text-sm text-muted-foreground">Seller</p>
            </div>
        </Card>
      </div>
    </div>
  );
}

