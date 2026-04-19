# Control

> A web-based virtual desktop platform inspired by the Windows interface.

![Project Screenshot](.github/preview.png)

## About

Control is a web platform where users can create virtual desktops to organize
links, files and folders in a visual and intuitive way. Desktops can be shared
between users with real-time synchronization.

## Features

- Virtual desktops with customizable wallpapers
- Drag and drop icons with position synchronization
- Recursive folder navigation
- Links with automatic favicon detection
- Multiple desktops per user
- Appearance filters (blur, darkness, saturation)
- Internationalization support (PT-BR / EN)

## Stack

**Frontend**
- React + Vite + TypeScript
- TailwindCSS
- i18next

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL

## Running locally

### Prerequisites
- Node.js 18+
- PostgreSQL running locally or via Supabase

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/control.git
cd control

# Install root dependencies
npm install

# Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your credentials
```

### Database

```bash
cd server
npx prisma migrate deploy
npx prisma generate
```

### Running

```bash
# From the project root
npm run dev
```

Access http://localhost:5173

## Environment variables

Create a `server/.env` file based on `server/.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/control
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
PORT=3000
```

## Project structure

```
control/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
└── server/          # Express backend
    ├── src/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── routes/
    │   ├── services/
    │   └── types/
    └── prisma/
        └── schema.prisma
```