# Onlook Starter Template

<p align="center">
  <img src="app/favicon.ico" />
</p>

This project now uses [Supabase](https://supabase.com/) as the backend, combined with
[Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/) and
[ShadCN](https://ui.shadcn.com).

## ⚡ Quick Setup

1. Create Supabase project at https://supabase.com
2. Create `.env.local` with your Supabase credentials
3. Execute `supabase-schema.sql` in Supabase SQL Editor
4. Create storage buckets: `avatars`, `posts`, `resources`
5. Run `npm install && npm run dev`

👉 **Detailed guide**: [SETUP.md](./SETUP.md)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in Onlook to see the result.

## Backend: Supabase

This project uses [Supabase](https://supabase.com) for backend (PostgreSQL + Auth + Storage).

📖 Setup guide: [README-SUPABASE.md](./README-SUPABASE.md)
👤 User roles (admin/user): [USER-ROLES-GUIDE.md](./USER-ROLES-GUIDE.md)
