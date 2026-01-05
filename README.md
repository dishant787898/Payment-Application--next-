# Banking App

A full-stack banking application built with Next.js, Prisma, and TypeScript.

## Features

- 🔐 User Authentication (NextAuth.js)
- 💸 P2P Money Transfers
- 💰 Wallet Balance Management
- 📊 Transaction History (Credited/Debited)
- 🏦 Bank Webhook Integration

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Monorepo**: Turborepo

## Project Structure

```
├── apps/
│   ├── user-app/          # Main user-facing banking app
│   └── bank-webhook/      # Bank webhook handler
├── packages/
│   ├── db/                # Prisma database client
│   ├── ui/                # Shared UI components
│   ├── store/             # State management
│   └── typescript-config/ # Shared TypeScript configs
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Set up the database:
   ```bash
   cd packages/db
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

- User App: http://localhost:3001

## License

MIT
