# Low Price Auto Glass — Project Specification

**Version:** 1.0.0  
**Created:** 2026-04-15  
**Location:** Monte Vista, Colorado  
**Project Type:** Mobile-first service booking web app  
**Status:** Pre-build

---

## 1. Concept & Vision

Low Price Auto Glass is a Monte Vista, CO–based mobile auto glass replacement service with a booking platform that lets customers get instant pricing and book a mobile technician visit in minutes — no phone call required. The app projects honesty, speed, and trustworthiness: clean design, transparent pricing, and a frictionless path from "I need glass" to "booked and confirmed." Admin side is equally clean: a dashboard to manage bookings, services, and customer contacts.

---

## 2. App Name & Branding

| Field | Value |
|---|---|
| **App Name** | Low Price Auto Glass |
| **DBA / Brand Name** | Low Price Auto Glass |
| **Tagline** | _TBD — client input required_ |
| **Service Area** | Monte Vista, CO and surrounding San Luis Valley |
| **Business Type** | Mobile auto glass replacement (technician comes to customer) |

---

## 3. Service Types

| Service | Description |
|---|---|
| Windshield Replacement | Full replacement of laminated windshield glass |
| Side Window Replacement | Replacement of side door windows |
| Rear Window Replacement | Replacement of back glass |
| Windshield Repair | Chip/pit repair to prevent cracking |
| Calibration / Recalibration | ADAS camera calibration after replacement |

---

## 4. Feature List

### 4.1 Customer View

#### Home / Pricing Page
- Hero section with service area callout (Monte Vista, CO)
- Service type selector (cards or tabs: Windshield, Side Window, Rear Window, Repair, Calibration)
- Vehicle info form: Year, Make, Model (dropdown or text input)
- Glass type selector (OEM, Aftermarket, Tinted, etc.) — **TBD: client input**
- **Instant price display** — generated after service + vehicle selection
- "Book Now" CTA prominent on pricing page
- Trust signals: "Mobile Service — We Come To You", years in business, certified technicians

#### Booking Form
- Pre-filled from pricing page selections (service type, vehicle)
- Customer info: Full Name, Phone, Email
- Preferred date + time slot picker (available slots based on calendar)
- Location: Address field (customer's location for mobile visit)
- Additional notes textarea (e.g., "car parked in driveway")
- Terms acceptance checkbox
- Submit booking

#### Booking Confirmation
- Confirmation number displayed
- Summary of booking (service, date/time, location, vehicle)
- "What happens next" steps (technician will call, etc.)
- Option to add to calendar
- Contact info to modify/cancel

#### Customer Dashboard (post-booking)
- View booking status: Pending → Confirmed → In Progress → Complete
- Contact info for the shop
- Cancel/modify booking option

### 4.2 Admin View

#### Bookings Dashboard
- Table/card view of all bookings
- Filters: date range, status, service type
- Search by customer name, phone, confirmation number
- Booking detail expand/collapse: full customer info, vehicle, service, notes
- Status update controls: Pending → Confirmed → In Progress → Complete / Cancelled
- Export bookings (CSV) — **Phase 2**

#### Service/Pricing Manager *(removes TBD pricing blocker)*
- **Service Entry CRUD:** Create, read, update, delete service entries
  - Fields per entry: name, base price, description, active/inactive toggle
- **Vehicle Type Modifiers:** Set multipliers per vehicle class
  - Examples: sedan (1.0×), SUV (1.2×), truck (1.3×), van (1.1×)
  - Modifier is a decimal multiplier applied to base price
- **Glass Type Modifiers:** Set modifiers per glass type
  - Examples: OEM (1.0×), Aftermarket (0.85×), Tinted (1.15×), OEM+ (1.2×)
  - Modifier is a decimal multiplier applied to base price
- **Persistence:** Pricing data stored in `pricing-data.json` (MVP)
  - File located in project root or `/public/data/`
  - Loaded at app startup; writable via admin UI
  - No external DB required for Phase 1
- **Price Calculation Engine:**
  ```
  final_price = base_price × vehicle_modifier × glass_modifier
  ```
- **Customer Pricing Widget:** Reads dynamically from admin-configured pricing
  - No hardcoded prices in UI
  - If no pricing data exists, display "Contact us for pricing" placeholder
  - Vehicle make/model → maps to vehicle class modifier via lookup table

#### Customer Contact Info
- Full list of customer records linked to bookings
- Quick call/text/email actions
- Notes per customer

#### Admin Settings
- Business info: name, phone, address, hours
- Service area boundary settings
- Booking availability calendar (set available slots per day)
- Notification preferences (email/SMS on new booking)

---

## 5. Pricing Model

> ✅ **Client-managed via Service/Pricing Manager** — no external data entry required.

All pricing is configured by the client via the **Service/Pricing Manager** in the admin panel (Section 4.2). The pricing engine reads from `pricing-data.json` at runtime:

| Component | Managed By | Config Location |
|---|---|---|
| Base price per service | Admin | Service/Pricing Manager → Service Entries |
| Vehicle class modifiers | Admin | Service/Pricing Manager → Vehicle Modifiers |
| Glass type modifiers | Admin | Service/Pricing Manager → Glass Modifiers |
| Vehicle make/model → class mapping | Admin | Service/Pricing Manager → Vehicle Lookup Table |

**Price formula:** `final_price = base_price × vehicle_modifier × glass_modifier`

**Empty state:** If no pricing data is configured, the customer widget displays "Contact us for pricing" instead of a calculated price. This allows the app to launch without any pricing data — the client populates it from the admin panel on their own schedule.

---

## 6. Design Direction

### Visual Theme
- **Style:** Clean, professional automotive/glass service aesthetic
- **Feel:** Trustworthy, fast, no-nonsense — the anti-body-shop experience
- **Metaphor:** Clarity of glass = clarity of pricing

### Color Palette (Direction — final palette TBD)
| Role | Direction |
|---|---|
| Primary | Deep blue (#1a3a5c) — trust, reliability |
| Accent | Bright amber/gold (#f5a623) — automotive, action CTAs |
| Background | Clean whites / light grays |
| Text | Near-black (#1a1a1a) on white |
| Success | Green (#2e7d32) |
| Alert | Red (#c62828) |

### Typography
- Clean sans-serif (Inter or similar)
- Large, legible type for pricing numbers
- Clear hierarchy: prices prominent, supporting info secondary

### Layout
- Mobile-first single column, max-width ~480px for main content
- Desktop: centered column with side admin panel
- Card-based UI for service selection and pricing
- Minimal, purposeful animations

### Iconography
- Lucide or Heroicons for UI icons
- Auto/glass-relevant imagery: windshield silhouette, calendar, phone, map pin

---

## 7. Tech Stack

### Decision: Single-Page React App (Zo Site or Vite + React)

**Rationale:** The app is primarily a booking/pricing interface — not a content-heavy site. A React SPA gives:
- Instant pricing interactivity without page reloads
- Shared state between pricing → booking flow
- Easy deployment as a hosted static app
- Zo Sites template (`Vite + Bun + TypeScript React + Tailwind`) fits perfectly

| Layer | Choice |
|---|---|
| **Frontend** | React 18 + TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router v6 (if multi-page) or single-page state |
| **State** | React Context or Zustand (lightweight) |
| **Date/Time Picker** | react-day-picker or similar |
| **Forms** | React Hook Form + Zod validation |
| **Deployment** | Zo Site (publish to `*.zocomputer.io`) |
| **Admin Auth** | Simple password gate (Phase 1); consider OAuth in Phase 2 |
| **Data/Backend** | Zo's built-in API routes (Hono) for form submissions; Airtable or Google Sheets as lightweight DB (Phase 1) |

**Out of Scope for Phase 1:**
- Native mobile apps (iOS/Android)
- Payment processing
- Real-time chat
- SMS notifications (Phase 2)
- Customer account/login system
- Multi-location support

---

## 8. Out of Scope (Phase 1)

| Item | Reason |
|---|---|
| Payment gateway integration | Requires client setup (Stripe etc.) |
| Native iOS/Android apps | Web app covers MVP |
| Customer accounts/login | Simple confirmation link via email is sufficient for MVP |
| Real-time chat | Not needed for booking flow |
| SMS reminders | Phase 2 |
| Insurance billing / claims | Separate workflow, Phase 2+ |
| Multi-location support | Monte Vista focus only |
| Blog / content pages | Pure booking app |
| Reviews/testimonials section | Phase 2 |
| Backend DB with full CRUD | Use Airtable/Sheets for MVP admin management |

---

## 9. Directory Structure

```
low-price-auto-glass/
├── SPEC.md                          # This file
├── README.md                        # Setup/run instructions (TBD)
├──/
│   └── src/
│       ├── main.tsx                 # Entry point
│       ├── App.tsx                  # Root component + routing
│       ├── index.css                # Global styles + Tailwind
│       ├── components/
│       │   ├── ui/                  # Shared UI primitives (Button, Input, Card, etc.)
│       │   ├── pricing/            # PricingWidget, ServiceSelector, VehicleForm
│       │   ├── booking/            # BookingForm, TimeSlotPicker, ConfirmationView
│       │   ├── customer/           # CustomerDashboard, BookingStatus
│       │   └── admin/              # AdminSidebar, BookingsTable, ServiceManager
│       ├── pages/
│       │   ├── HomePage.tsx        # / — pricing + CTA
│       │   ├── BookingPage.tsx     # /book
│       │   ├── ConfirmationPage.tsx # /confirmation/:id
│       │   ├── CustomerDashboard.tsx # /my-booking/:id
│       │   └── admin/
│       │       ├── AdminDashboard.tsx  # /admin
│       │       ├── AdminBookings.tsx   # /admin/bookings
│       │       ├── AdminServices.tsx   # /admin/services
│       │       └── AdminCustomers.tsx  # /admin/customers
│       ├── context/
│       │   └── BookingContext.tsx  # Shared booking state
│       ├── hooks/
│       │   └── usePricing.ts       # Pricing calculation logic
│       ├── lib/
│       │   ├── pricing.ts          # Pricing engine (mock data → real data later)
│       │   ├── services.ts         # Service type definitions
│       │   └── adminAuth.ts        # Simple admin gate
│       └── types/
│           └── index.ts            # TypeScript interfaces
└── public/
    └── favicon.svg
```

---

## 10. Build & Deployment

- **Dev:** `bun run dev` (Vite dev server)
- **Build:** `bun run build`
- **Deploy:** Publish via Zo Sites (`publish_site`) or deploy as Zo Space API + page routes
- Admin route: `/admin/*` — protected by password (env var `ADMIN_PASSWORD`)

---

## 11. Next Steps

1. [ ] Confirm color palette + tagline
2. [ ] Initialize project: `bun create vite low-price-auto-glass --template react-ts`
3. [ ] Build UI primitives (Button, Card, Input, Select)
4. [ ] Build pricing widget (service + vehicle selection → price)
5. [ ] Build booking form + date/time picker
6. [ ] Build confirmation view
7. [ ] Build admin dashboard
8. [ ] Wire up Airtable/Sheets as data backend
9. [ ] Deploy to Zo Sites

---

*Last updated: 2026-04-15*
