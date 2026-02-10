# API Design & Endpoint Mapping

## 1. Authentication & User Flow
**UI Page**: Login / Signup / Profile
- `POST /api/auth/register` - Create new customer account.
- `POST /api/auth/login` - Authenticate user and return JWT.
- `GET /api/auth/me` - Get current user profile details.
- `PUT /api/auth/me` - Update profile information.

## 2. Blouse Design & Catalog
**UI Page**: Gallery / Design Studio
- `GET /api/designs` - List all base blouse designs (thumbnails).
- `GET /api/designs/:id` - Get detailed info for a specific design.
- `GET /api/options` - Get available customization options (necklines, sleeves, fabrics) to populate dropdowns.

## 3. Measurements
**UI Page**: "My Measurements" / Fit Profile
- `GET /api/measurements` - specific user's saved measurement profiles.
- `POST /api/measurements` - new measurement profile.
- `PUT /api/measurements/:id` - measurement profile.
- `DELETE /api/measurements/:id` - measurement profile.

## 4. Order Creation (Cart & Checkout)
**UI Page**: Customizer -> Cart -> Checkout
- `POST /api/cart` - Add a customized design to session/cart.
- `GET /api/cart` - View current cart items.
- `POST /api/orders` - specific order from cart items. Default status: "Draft" or "Placed".
- `GET /api/orders/:id` - order summary.

## 5. Payments
**UI Page**: Payment Gateway Integration
- `POST /api/payments/initiate` - Start payment process (mock or Stripe/Razorpay intent).
- `POST /api/payments/confirm` - Confirm payment success and update order status to "Confirmed".
- `GET /api/payments/:order_id` - Check payment status.

## 6. Order Tracking
**UI Page**: Order History / Track Order
- `GET /api/orders` - List all past orders for the logged-in user.
- `GET /api/orders/:id/track` - Get detailed status timeline (e.g., "Fabric Sourced", "Cutting", "Stitching").

## 7. Admin Management
**UI Page**: Admin Dashboard
- `GET /api/admin/orders` - List all orders (filter by status).
- `PUT /api/admin/orders/:id/status` - Update order stage (e.g., "In Production" -> "Shipped").
- `GET /api/admin/alterations` - View requested alterations.
