RentalApp - A Peer-to-Peer Rental Marketplace
Tagline: Access, Don't Own.

RentalApp is a full-stack web application that creates a trusted community marketplace for peer-to-peer rentals. It allows users to earn money by listing their own items for rent, and provides an affordable and sustainable way for others to access items they need without having to own them.

Key Features
For Customers (Renters)
Browse & Discover: Explore a marketplace of available products with filtering and search capabilities.

Detailed Product Views: View product details, multiple photos, pricing, location, and seller information.

Seamless Booking: Select a date range from a calendar and send a rental request directly to the seller.

Customer Dashboard: Track the status of all your rental requests (pending, approved, declined).

Real-Time Chat: Once a booking is approved, communicate directly with the seller via a built-in, real-time inbox to coordinate pickup and return.

Secure User Profiles: Manage your profile, update personal information, and upload an avatar.

For Owners (Sellers)
Effortless Listing: Easily add new products for rent with details like name, description, category, price, location, and multiple photos.

Seller Dashboard: A central hub to view all your listed products and manage incoming rental requests.

Request Management: Approve or decline rental requests from customers with a single click.

Inventory Control: Approving a request automatically marks the item as "Rented Out," preventing double-bookings.

Direct Communication: Use the real-time inbox to chat with customers about their approved rentals.

Tech Stack
This project is a full-stack application built with a modern technology stack.

Category

Technology

Frontend

Next.js (React Framework), TypeScript, shadcn/ui, Tailwind CSS, Zustand (State Management), Socket.IO Client

Backend

Node.js, Express.js, Socket.IO

Database

MongoDB (with Mongoose) hosted on MongoDB Atlas

Image & File Storage

Cloudinary

Deployment

Vercel (Frontend) & Render (Backend)

Local Development Setup
To run this project on your local machine, follow these steps.

Prerequisites
Node.js (v18 or later)

npm or yarn

Git

1. Backend Setup
# Clone the backend repository
git clone [https://github.com/your-username/rental-app-backend.git](https://github.com/your-username/rental-app-backend.git)
cd rental-app-backend

# Install dependencies
npm install

# Create a .env file in the root of the backend folder
# and add the variables from the .env.example section below.

# Run the server
npm run dev

The backend server will start on http://localhost:5000.

2. Frontend Setup
# Clone the frontend repository in a separate directory
git clone [https://github.com/your-username/rental-app-frontend.git](https://github.com/your-username/rental-app-frontend.git)
cd rental-app-frontend

# Install dependencies
npm install

# Create a .env.local file in the root of the frontend folder
# and add the variables from the .env.local.example section below.

# Run the application
npm run dev

The frontend application will start on http://localhost:3000.

Environment Variables
You must create .env and .env.local files for the backend and frontend respectively.

Backend .env
# MongoDB Connection String from MongoDB Atlas
MONGO_URI=mongodb+srv://...

# JWT Secret for authentication tokens
JWT_SECRET=a_very_long_and_super_secret_string

# Cloudinary Credentials for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Port
PORT=5000
NODE_ENV=development

Frontend .env.local
# Your backend server URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

# Your Cloudinary Cloud Name
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

Challenges & Key Learnings
A significant challenge during development was ensuring real-time state synchronization between separate components, such as updating the Navbar avatar instantly after a profile picture change. This was solved by implementing a global state management solution with Zustand, creating a single source of truth for user data and ensuring a seamless user experience across the application. This approach proved far more reliable than prop drilling or simple data re-fetching.

Author
Soham Chaudhary
