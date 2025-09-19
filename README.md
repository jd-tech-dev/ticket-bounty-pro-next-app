# Multi-tenant system with organization management

[![Next.js Build](https://github.com/jd-tech-dev/ticket-bounty-pro-next-app/actions/workflows/main.yml/badge.svg)](https://github.com/jd-tech-dev/ticket-bounty-pro-next-app/actions/workflows/main.yml)

Ticket Bounty is a Next.js 15 application that helps organizations manage their work through a ticket-based system, with features like multi-tenant architecture, organization management, and user roles. Built from ground up with updates and new features while completing [The Road to Next](https://www.road-to-next.com/) course.

<img src="./resources/ticket-bounty-demo.gif" width="540" alt="Ticket Bounty Demo" style="max-width: 100%; height: auto;">

## Technical Stack

+ 🌐 Frontend: **Next.js 15, TypeScript, React 19, Shadcn UI, Tailwind CSS**  
+ 🗄️ Backend: **Supabase, Prisma, Zod**  
+ 📊 State Management: **TanStack Query**  
+ 💳 Services: **AWS S3, Stripe, Resend, Inngest**  
+ 🔧 Utilities: **Nuqs, Big.js, Sonner** 

## Core Features 

+ Multi-tenant architecture with organization-specific views 
+ Organization management system with admin/members roles 
+ Ticket CRUD operations with real-time updates 
+ Email invitation system for both registered and new users 
+ Stripe integration with billing & subscriptions 
+ Ticket search functionality with filtering 
+ File Upload & Download with AWS S3, presigned URLs 
+ Background job processing for async operations

## Installation

1. Clone the repository
2. Create `.env` file with:
```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Services
RESEND_API_KEY="..."
AWS_BUCKET_NAME="..."
AWS_REGION="..."
AWS_ACCESS_KEY="..."
AWS_SECRET_ACCESS_KEY="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
```
3. Run `npm install` to install the dependencies
4. Run the database migration `npx prisma db push` to create the DB tables

## Usage

```sh
npm run prisma-seed
```

```sh
npm run dev
```

```sh
npx prisma studio
```

```sh
npm run email
```

```sh
npx inngest-cli@latest dev
```

```sh
stripe listen --forward-to localhost:3000/api/stripe
```
