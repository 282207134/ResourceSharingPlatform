# Onlook Starter Template

<p align="center">
  <img src="app/favicon.ico" />
</p>

This project now uses [Supabase](https://supabase.com/) as the backend, combined with
[Next.js](https://nextjs.org/), [TailwindCSS](https://tailwindcss.com/) and
[ShadCN](https://ui.shadcn.com).

Before starting the project, configure Supabase environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the SQL statements in `supabase-schema.sql` via the Supabase SQL editor to create the database schema.

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
