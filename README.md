# Control

> A web-based virtual desktop platform inspired by the Windows interface.

![test img](client/public/assets/images/authBG3.jpg)

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
git clone https://github.com/boriloo/Control.git
cd Control

# Install root dependencies
npm run install:all

# Set up environment variables
npm run copy-env
# Edit server/.env with your credentials
```

### Running

```bash
# From the project root
npm run start:all
```

Access http://localhost:5173


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