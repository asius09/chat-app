# Chat App Monorepo

A modern, full-stack chat application built with React Native, Next.js, and Node.js. This monorepo contains all the necessary components for a complete chat application across mobile, web, and backend services.

## 🏗️ Architecture

This project uses a monorepo structure with the following applications and packages:

### Applications
- **`apps/mobile`** - React Native mobile app (iOS/Android)
- **`apps/browser`** - Next.js web application
- **`apps/backend`** - Node.js/Express API server

### Packages
- **`packages/types`** - Shared TypeScript type definitions
- **`packages/schemas`** - Zod validation schemas
- **`packages/utils`** - Shared utility functions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+
- For mobile development: Expo CLI
- For iOS: Xcode (macOS only)
- For Android: Android Studio

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-app
```

2. Install dependencies:
```bash
npm run install:all
```

### Development

Start all applications in development mode:
```bash
npm run dev
```

Or start individual applications:
```bash
# Backend API server
npm run dev:backend

# Web application
npm run dev:browser

# Mobile application
npm run dev:mobile
```

## 📱 Mobile App

The mobile app is built with React Native and Expo, featuring:
- Modern chat interface with real-time messaging
- Tab-based navigation (Chats, Calls, Profile)
- Beautiful UI components with proper theming
- TypeScript support with shared types

### Mobile Development
```bash
cd apps/mobile
npm run start          # Start Expo dev server
npm run ios           # Run on iOS simulator
npm run android       # Run on Android emulator
npm run web           # Run on web browser
```

## 🌐 Web Application

The web application is built with Next.js and features:
- Responsive chat interface
- Real-time messaging with Socket.io
- Modern UI with Tailwind CSS
- TypeScript support

### Web Development
```bash
cd apps/browser
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
```

## 🔧 Backend API

The backend is built with Node.js, Express, and features:
- RESTful API endpoints
- Real-time messaging with Socket.io
- MongoDB integration with Mongoose
- JWT authentication
- Input validation with Zod schemas
- TypeScript support

### Backend Development
```bash
cd apps/backend
npm run dev           # Start development server
npm run build         # Build TypeScript
npm run start         # Start production server
```

## 📦 Shared Packages

### Types (`@chat-app/types`)
Shared TypeScript interfaces and types used across all applications:
- User types
- Message types
- Chat types
- API response types

### Schemas (`@chat-app/schemas`)
Zod validation schemas for consistent data validation:
- User validation
- Message validation
- Chat validation
- API response validation

### Utils (`@chat-app/utils`)
Shared utility functions:
- API response helpers
- Authentication utilities
- Validation helpers
- Formatting functions

## 🛠️ Scripts

### Root Level Scripts
- `npm run dev` - Start all applications
- `npm run build` - Build all applications
- `npm run test` - Run tests across all packages
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages
- `npm run clean` - Clean all build artifacts

### Individual Application Scripts
Each application has its own set of scripts for development, building, and testing.

## 🏛️ Project Structure

```
chat-app/
├── apps/
│   ├── mobile/          # React Native mobile app
│   ├── browser/         # Next.js web app
│   └── backend/         # Node.js API server
├── packages/
│   ├── types/           # Shared TypeScript types
│   ├── schemas/         # Zod validation schemas
│   └── utils/           # Shared utilities
├── config.ts            # Shared configuration
├── tsconfig.json        # Root TypeScript config
├── package.json         # Root package.json
└── README.md           # This file
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/chat-app

# Server
PORT=3001

# JWT
JWT_SECRET=your-jwt-secret-here

# Other configurations...
```

## 🧪 Testing

Run tests across all packages:
```bash
npm run test
```

## 📝 Code Style

This project uses ESLint and Prettier for code formatting and linting. Run:
```bash
npm run lint
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Individual Applications
Each application can be deployed independently:
- **Mobile**: Use Expo Application Services (EAS) or build locally
- **Web**: Deploy to Vercel, Netlify, or any static hosting service
- **Backend**: Deploy to Railway, Heroku, or any Node.js hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.
