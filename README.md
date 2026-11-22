# FixMate: Device and Home Appliance Repair Service Platform (Client)

FixMate is a full-stack, role-based repair service booking platform. Verified technicians list the repair services they offer, customers send repair requests and track every job step by step, and payment happens online with Stripe **only after the job is completed**. Admins approve services, manage users and monitor all bookings and revenue.

This repository contains the **Next.js client**. The Express API lives in the server repository.

## Purpose

People often struggle to find a trustworthy repair technician. After handing over a device they have no idea what is happening with the job, and they often pay before any work is done. FixMate gives every job a clear, trackable status and releases payment only after the work is delivered. Skilled technicians get a structured place to show their services and manage incoming jobs.

## Live Links

| | URL |
|---|---|
| Live site | https://fixmate-client-seven.vercel.app |
| Live server (API) | https://fixmate-server-tawny.vercel.app|
| Client repository | https://github.com/Jannatulakiba/fixmate_client |
| Server repository | https://github.com/Jannatulakiba/fixmate_server |

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@fixmate.com | Admin123 |
| Technician | rahim@fixmate.com | Tech1234 |
| Technician | karim@fixmate.com | Tech1234 |
| Customer | customer@fixmate.com | Customer123 |

Stripe runs in **test mode**. Use card `4242 4242 4242 4242`, any future expiry date and any CVC.

## Roles

- **Customer**: browses approved services, sends repair requests, cancels a request while it is still requested, tracks the job, pays for completed jobs and sees payment history.
- **Technician**: adds and manages services, accepts or rejects requests, moves jobs through the status pipeline and sets the final amount on completion.
- **Admin**: approves or rejects services, manages users and roles, monitors all bookings and tracks Stripe revenue. Nobody can sign up as admin; the admin account is created with the seed script.

## Key Features

**Authentication and security**
- BetterAuth with the MongoDB adapter, email and password sign up and sign in, and Google social login
- Role, phone, area and bio stored as BetterAuth additional fields
- Server-side role validation: only `customer` or `technician` can be chosen at sign up, and a user can never change their own role
- Route protection with a proxy session check plus a server-side role guard on every dashboard layout
- Logged-in users are redirected away from the sign in and sign up pages, and reloading a private route keeps the session
- Password validation: minimum 6 characters, at least one uppercase and one lowercase letter

**Public pages**
- Responsive sticky navbar with active route highlight, avatar dropdown with role badge and a hamburger menu on mobile
- Home page with hero search, featured services (6 latest approved), how it works, popular categories and trust stats
- Browse Services with server-side search, category and service mode filters and sorting (price low to high, high to low, newest). Filters live in the URL, survive a reload, and `/services?category=AC` opens already filtered
- Service details with technician summary and a role-restricted repair request form
- How it works page, custom 404 page and error boundary

**Repair request flow**
- Request form with phone, address, preferred date (today or later) and problem description (minimum 20 characters)
- Duplicate active requests for the same service are blocked by the server
- Technicians and admins cannot send requests, and a technician cannot request their own service

**Dashboards** (collapsible sidebar, role-based menu, reusable stats cards, charts, consistent status badges)
- Customer: overview, My Bookings with cancel confirmation, job tracker and Pay Now, payment history
- Technician: overview with earnings, add service with ImgBB image upload, My Services with edit, delete and availability toggle, manage requests with status actions and final amount modal
- Admin: overview, manage users and roles, service approval with filters, all bookings with status filter, transactions with total revenue
- Update profile for every role (name, phone, area, bio and photo upload). Changes show in the navbar without signing out

**Payments**
- Stripe Checkout in test mode, payment only for a completed and unpaid booking
- The amount is always read from the database on the server, never from the client
- Success page verifies the session and saves the payment; the webhook is also supported and the same payment is never saved twice

**UX**
- Toast notifications for every action, skeleton loaders, empty states with call to action, confirmation modals for delete, cancel and reject
- Fully responsive for mobile, tablet and desktop

## Booking Status Pipeline

```
requested -> accepted -> in-progress -> completed -> paid
requested -> rejected   (technician)
requested -> cancelled  (customer)
```

Status badge colors are consistent across all dashboards: Requested (blue), Accepted (indigo), In Progress (amber), Completed (green), Rejected (red), Cancelled (gray).

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4, DaisyUI 5 |
| Auth | BetterAuth (MongoDB adapter, JWT plugin, Google provider) |
| Database | MongoDB Atlas |
| Payments | Stripe Checkout (test mode) |
| Images | ImgBB API |

## npm Packages Used

**Dependencies**: `next`, `react`, `react-dom`, `better-auth`, `mongodb`, `lucide-react`, `sonner`, `recharts`

**Dev dependencies**: `typescript`, `tailwindcss`, `daisyui`, `tsx`, `eslint`

## Routes

| Route | Access |
|---|---|
| `/`, `/services`, `/services/[id]`, `/about` | Public |
| `/sign-in`, `/sign-up` | Public (logged-in users are redirected to their dashboard) |
| `/payment/success`, `/payment/cancel` | Customer |
| `/dashboard/customer`, `/bookings`, `/payments` | Customer |
| `/dashboard/technician`, `/add-service`, `/my-services`, `/requests` | Technician |
| `/dashboard/admin`, `/users`, `/services`, `/bookings`, `/transactions` | Admin |
| `/dashboard/profile` | All logged-in users |

## Environment Variables

Create a `.env.local` file in the project root. Do not commit it.

```env
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

`MONGODB_URI` must point to the same database as the server. `BETTER_AUTH_URL` must be exactly the same value as the server's `BETTER_AUTH_URL`.

## Run Locally

```bash
git clone https://github.com/Jannatulakiba/YOUR_CLIENT_REPO.git
cd YOUR_CLIENT_REPO
npm install
npm run dev
```

The app runs on http://localhost:3000. Start the server from the server repository as well.

### Seed data

```bash
npx tsx --env-file=.env.local scripts/seed.ts
```

This creates the admin, two technicians, a customer and a set of approved services. It is safe to run more than once.

## Deployment

- Client and server are deployed on Vercel
- Production domain is added to the BetterAuth trusted origins and to the server CORS allowed origins
- Stripe webhook endpoint: `https://fixmate-server-tawny.vercel.app/api/payments/webhook` (event `checkout.session.completed`, test mode)
- Google OAuth redirect URI: `https://fixmate-client-seven.vercel.app/api/auth/callback/google`