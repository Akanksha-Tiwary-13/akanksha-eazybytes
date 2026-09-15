# Portfolio Website with CMS

A full-stack personal portfolio site with its own content management dashboard — Week 1 project.

Instead of hard-coding projects, skills, and blog posts into JSX, everything lives in a MySQL
database and is managed from a password-protected admin dashboard. The public site fetches
content live from the API and picks up changes instantly through a small Socket.io layer, so
editing a project in the CMS updates any open browser tab without a refresh.

## Features

- **Public site** — hero/about, featured + full project listings, a skills breakdown by category,
  a blog, and a contact form with validation.
- **CMS dashboard** (`/admin`) — JWT-protected admin login, and CRUD screens for projects, skills,
  and blog posts (with draft/published state), a contact-message inbox, and a site settings page.
- **Live updates** — the dashboard broadcasts a `content:updated` event over Socket.io whenever
  content changes, so the public site (and any other open dashboard tab) refetches automatically.
- **Theme customization** — the CMS settings page sets a default dark/light mode and accent color
  for the whole site; visitors can still toggle light/dark for themselves, remembered locally.
- **Contact form emails** — new messages optionally trigger an email notification via Nodemailer
  (SMTP configurable through env vars); without SMTP configured it just logs to the server console
  so nothing breaks in local dev.
- **Responsive** — mobile nav, fluid grids, and touch-friendly CMS forms.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Zustand, React Hook
  Form + Zod, Framer Motion, Socket.io client.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, MySQL, JWT auth (bcrypt password
  hashing), Zod validation, Socket.io, Nodemailer.

## Project structure

```
client/    React frontend (public site + CMS dashboard)
server/    Express API (auth, content CRUD, contact form, realtime)
shared/    TypeScript types shared between client and server
```

## Getting started

### 1. Database

You need a MySQL (or MariaDB) server running locally, or a hosted MySQL instance.

```sql
CREATE DATABASE portfolio_cms CHARACTER SET utf8mb4;
CREATE USER 'portfolio'@'localhost' IDENTIFIED BY 'portfolio_dev_pw';
GRANT ALL PRIVILEGES ON portfolio_cms.* TO 'portfolio'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend

```bash
cd server
cp .env.example .env      # adjust DATABASE_URL / admin credentials / SMTP if needed
npm install
npm run prisma:push       # creates the tables from prisma/schema.prisma
npm run seed               # creates the admin user + sample content
npm run dev                 # http://localhost:3001
```

Default seeded admin login: `admin@example.com` / `ChangeMe123!` (change these in `.env` before
seeding, or update the password afterwards).

### 3. Frontend

```bash
cd client
npm install
npm run dev   # http://localhost:5173 (proxies /api and /socket.io to the backend)
```

Visit `http://localhost:5173` for the public site and `http://localhost:5173/admin/login` for the
CMS dashboard.

## Environment variables (`server/.env`)

See `server/.env.example` for the full list — database connection, JWT secret, seeded admin
credentials, CORS origin, and optional SMTP settings for contact-form email notifications.

## Scripts

| Location | Command | What it does |
|---|---|---|
| `server` | `npm run dev` | Start the API with hot reload |
| `server` | `npm run build` / `npm start` | Build and run the compiled API |
| `server` | `npm run seed` | Seed the admin user, settings, and sample content |
| `server` | `npm run prisma:push` | Sync the database schema (dev) |
| `server` | `npm run prisma:migrate` | Create a versioned migration |
| `client` | `npm run dev` | Start the Vite dev server |
| `client` | `npm run build` | Type-check and build for production |
