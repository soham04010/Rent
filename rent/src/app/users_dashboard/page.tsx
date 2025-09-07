"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

axios.defaults.withCredentials = true;
const API_BASE_URL = "http://localhost:5000";

interface Booking {
    _id: string;
    product: { name: string; imageUrl: string };
    status: 'pending' | 'approved' | 'declined' | 'completed';
    startDate: string;
    endDate: string;
}

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/bookings/my-bookings`);
        setBookings(data);
      } catch (error) {
        toast.error("Failed to fetch your bookings.");
      }
    };
    fetchBookings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Rental History</CardTitle>
        <CardDescription>
          Here is a list of your past and current rental requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Product</TableHead>
              <TableHead>Rental Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell className="flex items-center gap-4">
                    <img
                      src={
                        booking.product.imageUrl ||
                        "https://placehold.co/600x400/eee/ccc?text=Image"
                      }
                      alt={booking.product.name}
                      className="h-16 w-16 rounded-md object-cover hidden sm:block"
                    />
                    <span className="font-medium">{booking.product.name}</span>
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.startDate), "MMM dd, yyyy")} -{" "}
                    {format(new Date(booking.endDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "pending"
                          ? "secondary"
                          : booking.status === "approved"
                          ? "default"
                          : booking.status === "declined"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/inbox?bookingId=${booking._id}`}>
                        Message Seller
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

