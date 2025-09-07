"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:5000";

// Define the structure of a product for this page
interface Product {
  _id: string;
  name: string;
  pricePerDay: number;
  imageUrls: string[];
  location: string;
  category: string;
}

// A reusable component for displaying a single product card
const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/products/${product._id}`} className="block group">
        <Card className="overflow-hidden h-full flex flex-col transition-all group-hover:shadow-xl group-hover:-translate-y-1">
            <CardHeader className="p-0">
                <img 
                    src={product.imageUrls[0] || 'https://placehold.co/600x400/eee/ccc?text=Product+Image'} 
                    alt={product.name} 
                    className="rounded-t-lg object-cover h-48 w-full" 
                />
            </CardHeader>
            <CardContent className="pt-4 flex-grow">
                <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                <h3 className="text-lg font-semibold leading-tight truncate group-hover:text-primary">{product.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{product.location}</p>
            </CardContent>
            <CardFooter>
                <p className="text-xl font-bold">${product.pricePerDay}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
            </CardFooter>
        </Card>
    </Link>
);

// A skeleton component for the loading state
const LoadingSkeleton = () => (
    <div className="flex flex-col space-y-3">
        <Skeleton className="h-[192px] w-full rounded-xl" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    </div>
)

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/products`);
        setProducts(data);
      } catch (error) {
        toast.error("Failed to fetch products", {
          description: "There was an issue loading rental items. Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">All Rental Products</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Browse all available items from our community of sellers. Find what you need for your next project, event, or adventure.</p>
      </div>
      
      {isLoading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Show 8 skeleton loaders */}
            {Array.from({ length: 8 }).map((_, i) => <LoadingSkeleton key={i} />)}
         </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
      ) : (
        // Handle case where there are no products to show
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold">No Items Found</h2>
            <p className="text-muted-foreground mt-2">There are currently no items listed for rent. Be the first!</p>
            <Button asChild className="mt-4">
                <Link href="/seller/add-product">List an Item</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
