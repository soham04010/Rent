import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { List, Search, Handshake, MessageCircle } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">How RentalApp Works</h1>
        <p className="text-lg text-muted-foreground mt-2 max-w-3xl mx-auto">
          Our platform makes it simple and secure to rent items or earn money from your own. Here’s a breakdown of the process.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* For Customers */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-center">For Customers (Renters)</h2>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Search className="w-8 h-8 text-primary" />
              <CardTitle>1. Find Your Item</CardTitle>
            </CardHeader>
            <CardContent>
              Browse our extensive marketplace of products. Use the search and filter options to find exactly what you need for your project, event, or trip.
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Handshake className="w-8 h-8 text-primary" />
              <CardTitle>2. Request to Book</CardTitle>
            </CardHeader>
            <CardContent>
              Once you find the perfect item, select your desired rental dates on the calendar and send a booking request to the seller. Your payment is not processed until the seller approves.
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <MessageCircle className="w-8 h-8 text-primary" />
              <CardTitle>3. Coordinate & Enjoy</CardTitle>
            </CardHeader>
            <CardContent>
             After your request is approved, use our secure inbox to chat with the seller and arrange for pickup or delivery. Enjoy your rental!
            </CardContent>
          </Card>
        </div>

        {/* For Sellers */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-center">For Sellers</h2>
           <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <List className="w-8 h-8 text-primary" />
              <CardTitle>1. List Your Item</CardTitle>
            </CardHeader>
            <CardContent>
              Create a listing for your item in minutes. Add high-quality photos, write a clear description, set your price, and specify your location.
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Handshake className="w-8 h-8 text-primary" />
              <CardTitle>2. Approve Requests</CardTitle>
            </CardHeader>
            <CardContent>
              You'll receive notifications for new rental requests. Review the customer's profile and the requested dates, then approve or decline the booking from your Seller Dashboard.
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <MessageCircle className="w-8 h-8 text-primary" />
              <CardTitle>3. Get Paid</CardTitle>
            </CardHeader>
            <CardContent>
              Coordinate with the customer for a smooth handoff. Once the rental period begins, your payment is processed securely. It's that easy to start earning.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

