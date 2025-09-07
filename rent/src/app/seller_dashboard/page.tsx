"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:5000";

interface Product {
  _id: string; name: string; pricePerDay: number; isAvailable: boolean;
}
interface Booking {
  _id: string; product: { name: string }; customer: { name: string }; status: 'pending' | 'approved' | 'declined';
}

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const fetchData = async () => {
    try {
      const [productsRes, bookingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/products/my-products`),
        axios.get(`${API_BASE_URL}/api/bookings/seller`)
      ]);
      setProducts(productsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  const handleStatusChange = async (bookingId: string, status: 'approved' | 'declined') => {
    toast.promise(axios.put(`${API_BASE_URL}/api/bookings/${bookingId}/status`, { status }), {
      loading: 'Updating status...',
      success: () => {
        fetchData(); // Refresh all data
        return `Booking has been ${status}.`;
      },
      error: 'Failed to update status.',
    });
  }

  const handleDeleteProduct = async (productId: string) => {
    toast.promise(axios.delete(`${API_BASE_URL}/api/products/${productId}`), {
        loading: 'Deleting product...',
        success: () => {
            fetchData(); // Refresh all data
            return "Product deleted successfully.";
        },
        error: "Failed to delete product."
    });
  }

  return (
    <Tabs defaultValue="requests" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="requests">Rental Requests</TabsTrigger>
        <TabsTrigger value="products">My Products</TabsTrigger>
      </TabsList>
      <TabsContent value="requests">
        <Card>
          <CardHeader>
            <CardTitle>Incoming Rental Requests</CardTitle>
            <CardDescription>
              Manage rental requests for your items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.product.name}</TableCell>
                    <TableCell>{booking.customer.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "pending"
                            ? "secondary"
                            : booking.status === "approved"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusChange(booking._id, "approved")
                            }
                            className="mr-2"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusChange(booking._id, "declined")
                            }
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/inbox?bookingId=${booking._id}`}>
                          Message
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="products">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Listed Products</CardTitle>
              <CardDescription>
                View, edit, or delete your rental items.
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/seller_dashboard/add-product">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>${product.pricePerDay}</TableCell>
                    <TableCell>{product.isAvailable ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                /* TODO: Implement Edit */
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="text-red-500">
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{product.name}".
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product._id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

