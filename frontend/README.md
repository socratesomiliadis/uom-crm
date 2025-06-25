# CRM Frontend

This is the frontend for the CRM application built with Next.js 14, featuring secure cookie-based JWT authentication.

## Environment Setup

Create a `.env.local` file in the frontend directory with the following:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Node Environment
NODE_ENV=development
```

## Authentication System

The application uses a hybrid cookie-based authentication system:

- **Secure**: JWT tokens are stored in httpOnly cookies to prevent XSS attacks
- **Compatible**: Works with existing Spring Boot backend without modifications
- **Seamless**: Automatic token refresh and validation

### How it works:

1. **Login**: Frontend API route `/api/auth/login` proxies to backend and sets secure cookies
2. **Authentication**: Cookies are automatically included in requests
3. **Token Refresh**: Automatic refresh using `/api/auth/refresh` route
4. **Logout**: Clears both frontend cookies and backend sessions

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Make sure your backend is running on `http://localhost:8080`

## Features

- 🔐 Secure cookie-based authentication
- 🔄 Automatic token refresh
- 🛡️ Protected routes
- 📱 Responsive design
- 🌙 Dark mode support
- 📊 Dashboard with CRM features

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Custom cookie-based JWT system
- **State Management**: React Context + useState
- **TypeScript**: Full type safety
