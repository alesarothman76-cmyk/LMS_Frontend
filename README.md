This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# LMS Web Frontend

A modern Learning Management System (LMS) web application built with Next.js 14, TypeScript, and shadcn/ui.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI + Nova preset)
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod validation
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Font:** Geist

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:5005` (or update `NEXT_PUBLIC_API_URL`)

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd lms-web
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5005
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.



## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com) for beautiful, accessible components:

- **Preset:** Nova (Lucide icons + Geist font)
- **UI Library:** Radix UI primitives
- **Theme:** Configurable via `tailwind.config.ts`

Add new components using:
```bash
npx shadcn@latest add <component-name>
```

## 🔄 API Integration

### Base URL
Configured via `NEXT_PUBLIC_API_URL` environment variable.

### Axios Client
Located in `shared/api/client.ts`:
- Automatic baseURL configuration
- Request interceptor adds `Authorization` header
- Response interceptor handles 401 errors

### TanStack Query
Used for:
- Data fetching and caching
- Optimistic updates
- Error handling
- Loading states

## 📝 Form Handling

Forms use **React Hook Form** with **Zod** validation:

```typescript
// Example validation schema
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  // ...
});
```

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 🧪 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5005` |

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📚 Features

### Authentication
- ✅ User registration
- ✅ User login
- ✅ JWT token management
- ✅ Protected routes
- ✅ Auto-logout on 401

### Book Management
- ✅ List all books
- ✅ View book details
- ✅ Create new book (protected)
- ✅ Edit book (protected)
- ✅ Delete book (protected)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Note:** This frontend requires a running backend API. Make sure your backend is started before running the development server.
