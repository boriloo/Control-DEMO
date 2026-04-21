# Control

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

> A web-based virtual desktop platform inspired by the Windows interface.

![project running](client/public/assets/images/readme.png)

## About

Control is a web platform where users can create virtual desktops to organize 
links, files and folders visually. Inspired by the Windows interface, it brings 
a familiar desktop experience to the browser, with support for multiple desktops, 
icon synchronization and customizable appearance.

## Features

- Virtual desktops with customizable wallpapers
- Drag and drop icons
- Recursive folder navigation
- Links with automatic favicon detection
- Multiple desktops per user
- Appearance filters (blur, darkness, saturation)

## Stack

**Frontend**
- React + Vite + TypeScript
- TailwindCSS

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL

## Screenshots

![Screenshot 1](client/public/assets/images/sc1.png)

![Screenshot 2](client/public/assets/images/sc2.png)

![Screenshot 3](client/public/assets/images/sc3.png)

![Screenshot 4](client/public/assets/images/sc4.png)

![Screenshot 5](client/public/assets/images/sc5.png)

## Running locally

### Prerequisites
- Node.js 18+
- PostgreSQL running locally or via Supabase

### Installation

```bash
# Clone the repository
git clone https://github.com/boriloo/Control.git
cd Control

# Install dependencies
npm run install:all

# Set up environment variables
npm run copy-env

# Your .env file will work just fine with .env-example values,
# but feel free to customize it with your credentials
```

### Running

```bash
# From the project root (Make sure Docker is running)
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

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

