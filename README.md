# Elite Superior Construction — Website

Next.js 16 (App Router) site for **Elite Superior Construction**: unified **commercial** and **residential** lines, with MongoDB, Cloudinary uploads, NextAuth admin, and Resend for lead emails.

## Stack

- **Next.js 16** + **React 19** + **TypeScript** + **Tailwind CSS 4**
- **MongoDB Atlas** + **Mongoose**
- **NextAuth.js v5** (credentials login for `/admin`)
- **Cloudinary** (image uploads from admin)
- **Resend** (optional lead notification emails)

## Setup

1. Copy environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in `.env.local`:

   | Variable | Purpose |
   |----------|---------|
   | `MONGODB_URI` | MongoDB connection string |
   | `AUTH_SECRET` | Random string (32+ chars), e.g. `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | Site URL (`http://localhost:3000` in dev, production URL in prod) |
   | `ADMIN_EMAIL` | Admin login email |
   | `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password |
   | `CLOUDINARY_*` | Cloud name, API key, secret |
   | `RESEND_API_KEY` | Optional; omit to skip emails |
   | `CONTACT_EMAIL` | Where lead emails are sent |
   | `RESEND_FROM_EMAIL` | Verified sender in Resend (or use `onboarding@resend.dev` for tests) |
   | `WHATSAPP_NUMBER` | Digits only, e.g. `18644164728` |

3. **Generate admin password hash** (Node):

   ```bash
   node -e "require('bcryptjs').hash('YourPassword',10).then(console.log)"
   ```

   Put the output in `ADMIN_PASSWORD_HASH`.

4. **MongoDB local (Docker)** — optional for development:

   ```bash
   docker compose up -d
   ```

   In `.env.local`:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/elite
   ```

   Start MongoDB **before** or restart `npm run dev` after the container is running so the app can connect. Data persists in the `elite_mongo_data` volume.

5. Install and run:

   ```bash
   npm install
   npm run dev
   ```

- Public site: [http://localhost:3000](http://localhost:3000)  
- Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Project structure (high level)

- `app/(public)/` — Home, Commercial, Residential, Portfolio, Contact
- `app/admin/login/` — Login (no auth layout)
- `app/admin/(protected)/` — Dashboard, Services, Portfolio, Testimonials, Site Images, Settings, Leads
- `app/api/` — REST-style routes for CMS + NextAuth
- `components/sections/` — Marketing sections (hero, stats, etc.)
- `models/` — Mongoose schemas

## Deploy

Recommended: **Vercel**. Set the same env vars in the project settings. Ensure `NEXTAUTH_URL` matches the production domain.

## License

Private / client project.
