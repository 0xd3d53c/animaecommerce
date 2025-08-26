# Anima – The Ethic Store

Anima is a full-stack e-commerce platform dedicated to selling authentic Assamese textiles, with a focus on cultural storytelling and ethical sourcing. The platform provides a seamless shopping experience for customers and a comprehensive admin panel for store management.

## Key Features

* **Customer-Facing Storefront**: A responsive and modern user interface for browsing and purchasing products.
* **Product Catalog**: Detailed product pages with image galleries, cultural stories, and customer reviews.
* **Shopping Cart & Checkout**: A persistent shopping cart and a secure checkout process with Razorpay integration.
* **User Authentication**: Secure user sign-up, login, and profile management powered by Supabase Auth.
* **Admin Dashboard**: A comprehensive back-office for managing:
    * Products and inventory
    * Orders and fulfillment
    * Customers
    * Content pages (About, Contact, etc.)
* **Order Tracking with Shiprocket**: Customers can track their orders in real-time through an integration with the Shiprocket shipping platform.
* **Ethical Sourcing Focus**: The platform is designed to highlight the stories of artisans and the cultural significance of the products.

## Technologies Used

* **Framework**: Next.js (with React Server Components)
* **Database & Auth**: Supabase
* **Styling**: Tailwind CSS with shadcn/ui components
* **Payment Gateway**: Razorpay
* **Shipping**: Shiprocket (for order tracking and fulfillment)
* **Linting & Formatting**: ESLint
* **Package Manager**: pnpm

## Project Structure & Modules

The project is organized into several key modules:

### 1. **Core Application (`/app`)**

* **`/(store)`**: Contains all the customer-facing pages like the homepage, product listings, product details, cart, and checkout.
* **`/admin`**: The admin dashboard for managing the e-commerce store. It includes pages for managing products, orders, customers, inventory, and site settings.
* **`/api`**: Houses all the API routes for handling tasks like payment processing with Razorpay, order tracking with Shiprocket, and contact form submissions.
* **`layout.tsx`**: The main layout file for the application, which includes the basic HTML structure and providers.

### 2. **UI Components (`/components`)**

* **`/admin`**: Components specific to the admin dashboard, such as tables for displaying products, orders, and customers.
* **`/auth`**: User authentication components, including the user navigation menu in the header.
* **`/cart`**: Components related to the shopping cart, such as the cart drawer and cart items.
* **`/checkout`**: The checkout form and order summary components.
* **`/products`**: Components for displaying products, including the product grid, filters, and individual product details.
* **`/ui`**: A collection of reusable UI components built with shadcn/ui, such as buttons, cards, forms, and tables.

### 3. **Backend & Data Logic (`/lib`)**

* **`/supabase`**: Supabase client and server configurations for interacting with the database and authentication services.
* **`/auth`**: Authentication-related helper functions and middleware for protecting routes.
* **`/cart-client.ts` & `/cart-server.ts`**: Functions for managing the shopping cart on both the client and server sides.
* **`/orders.ts`**: Logic for creating and processing orders.
* **`/razorpay.ts` & `/shiprocket.ts`**: Integrations with Razorpay for payments and Shiprocket for order tracking and fulfillment.
* **`/security`**: Security-related functionalities, including environment variable validation, rate limiting, and secure headers.

### 4. **Database (`/scripts`)**

* **SQL files**: A series of SQL scripts for setting up the database schema, enabling Row Level Security (RLS), and seeding the database with initial data.

### 5. **Public Assets (`/public`)**

* Contains all static assets, such as images, logos, and placeholder content used throughout the application.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js and pnpm installed
* A Supabase project set up
* A Razorpay account for payment processing
* A Shiprocket account for shipping and tracking

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/0xd3d53c/animaecommerce.git](https://github.com/0xd353c/animaecommerce.git)
    ```
2.  **Install NPM packages**
    ```sh
    pnpm install
    ```
3.  **Set up environment variables**
    Create a `.env.local` file in the root of the project and add your Supabase, Razorpay, and Shiprocket API keys.
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

    NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret

    SHIPROCKET_EMAIL=your_shiprocket_email
    SHIPROCKET_PASSWORD=your_shiprocket_password
    ```
4.  **Set up the database**
    Run the SQL scripts in the `/scripts` directory in your Supabase project's SQL editor to set up the database schema and seed initial data.
5.  **Run the development server**
    ```sh
    pnpm dev
    ```

The application will be available at `http://localhost:3000`.

## API Endpoints

The application includes several API endpoints to handle server-side logic:

* **`POST /api/razorpay/create-order`**: Creates a new order with Razorpay to initiate a payment.
* **`POST /api/razorpay/verify-payment`**: Verifies the payment signature from Razorpay after a successful transaction.
* **`GET /api/orders/[orderId]/tracking`**: Fetches tracking information for a specific order using the Shiprocket API.
* **`POST /api/contact`**: Handles submissions from the contact form, saving them to the database and sending notifications.

## Database Schema

The database schema is defined in the SQL scripts located in the `/scripts` directory. The key tables include:

* **`profiles`**: Stores user profile information, extending the `auth.users` table from Supabase.
* **`products`**: Contains all product information, including pricing, stock levels, and cultural stories.
* **`categories`**, **`artisans`**, **`motifs`**: Tables for organizing and enriching product data.
* **`orders`** & **`order_items`**: Manages all customer orders and the items within them.
* **`carts`** & **`cart_items`**: Manages shopping cart data for both authenticated and anonymous users.
* **`reviews`**: Stores customer reviews for products.
* **`pages`**: A simple CMS for managing static content pages.

All tables are secured with Row Level Security (RLS) policies to ensure data privacy and security.
