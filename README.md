## ✨ Features

### 🔐 Authentication
- **Email/Password** registration with real-time password strength validation
- **Google OAuth** one-click sign-in / sign-up
- Session-based auth powered by [Better Auth](https://www.better-auth.com/)
- Smart redirect — after login, return to the page you were on
- Middleware-protected routes via [`proxy.js`](proxy.js) (auth guard)

### 💡 Share Ideas
Submit a detailed startup idea through a rich form with:

| Field | Description |
|-------|-------------|
| **Title** | Catchy name (up to 120 chars) |
| **Short Description** | One-line pitch (10–300 chars) |
| **Detailed Description** | Full breakdown (up to 5,000 chars) |
| **Category** | FinTech, HealthTech, EdTech, CleanTech, AI/ML, Web3/Crypto, SaaS, E-Commerce, Social, Other |
| **Tags** | Up to 8 custom tags (2–25 chars each) |
| **Image URL** | Optional preview image |
| **Budget** | Optional estimated budget |
| **Target Audience** | Who is this for? |
| **Problem Statement** | What problem does it solve? |
| **Proposed Solution** | How does it solve it? |

Includes an animated stats counter section and real-time character counters.

### 🔍 Discover Ideas
- **Search** by title with debounced input
- **Category filter pills** with horizontal scroll arrows
- **Grid layout** showing category, time-ago timestamps, tags, and a "View Details" link
- **Skeleton loading states** for smooth UX
- **Empty / no-results states** with clear CTAs

### 📄 Idea Detail Page
Full breakdown of a single idea with:
- Author attribution, tags, timestamps
- Image preview
- Problem / Solution sections
- Estimated budget display
- **Live comment system** — add, edit, and delete your own comments
- Confirmation modal before deleting comments

### 📦 My Ideas Dashboard
- View all ideas you've submitted
- **Edit** any idea via a full-screen modal with the same rich form
- **Delete** with a confirmation dialog
- "Create New Idea" CTA when empty

### 💬 My Interactions
- See every idea you've commented on
- Preview your latest comment on each idea
- Quick-link back to the full discussion

### 👤 Profile Management
- View profile with avatar (image or auto-generated initials)
- **Edit profile** — update display name and photo URL
- Redirects to login if unauthenticated

### 🎨 Theming & UI
- **Dark / Light mode** toggle with localStorage persistence
- Animated hero carousel with 3 slides (auto-play, pause on hover, keyboard & touch swipe support)
- **About** section with features and stats
- **FAQ accordion**
- Fully responsive — mobile hamburger menu, adaptive layouts
- CSS custom properties architecture for consistent theming
- Custom SVG icons throughout

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js](https://nextjs.org/) 16.2.6 (App Router) |
| **UI Library** | [React](https://react.dev/) 19.2.4 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) v4 + [DaisyUI](https://daisyui.com/) v5 |
| **Authentication** | [Better Auth](https://www.better-auth.com/) v1.6.11 (MongoDB adapter) |
| **Notifications** | [react-hot-toast](https://react-hot-toast.com/) |
| **Fonts** | Geist (via `next/font`) |
| **Linting** | ESLint + `eslint-config-next` |
| **Compiler** | React Compiler (via Babel plugin) |

### Backend (External)
The frontend communicates with a separate backend server:
- Auth API proxied to `https://ideavault-server-gamma.vercel.app/api/auth/*`
- Ideas & comments API via `http://localhost:5000/api/*` (or `NEXT_PUBLIC_API_URL`)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.js                  # Root layout (Navbar, Footer, ThemeProvider)
│   ├── page.js                    # Landing page (Hero, Trending, About, FAQ)
│   ├── globals.css                # Global styles & CSS custom properties
│   ├── global-not-found.jsx       # Global 404 page
│   ├── favicon.ico
│   │
│   ├── add-idea/page.jsx          # Submit a new idea form
│   ├── ideas/page.jsx             # Browse all ideas (search + filter)
│   ├── ideas/[id]/page.jsx        # Idea detail + comments
│   ├── my-ideas/page.jsx          # User's own ideas (edit/delete)
│   ├── my-interactions/page.jsx   # Ideas the user commented on
│   ├── login/page.jsx             # Login page (email + Google)
│   ├── register/page.jsx          # Register page (with password rules)
│   ├── profile/page.jsx           # View profile
│   └── profile/edit/page.jsx      # Edit profile form
│
├── app/components/
│   ├── ThemeProvider.jsx           # Dark/light theme context
│   ├── navbar/page.jsx            # Responsive navbar + dropdown menu
│   ├── hero/page.jsx              # Animated carousel hero section
│   ├── hero/Ideas/page.jsx        # Trending ideas section (landing)
│   ├── about/page.jsx             # About section
│   ├── faq/page.jsx               # FAQ accordion
│   └── footer/page.jsx            # Footer with links & socials
│
├── lib/
│   └── auth-client.js             # Better Auth client config
│
├── proxy.js                       # Middleware (auth route protection)
├── next.config.mjs                # Next.js config + API rewrites
├── package.json
└── postcss.config.mjs
```

---

## 🔗 API Reference

The frontend communicates with a backend server running at `http://localhost:5000`. Auth routes are proxied through Next.js rewrites to `https://ideavault-server-gamma.vercel.app/api/auth/*`.

### Ideas

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/ideas` | List all ideas (supports `?search=` & `?category=`) |
| `GET` | `/api/ideas/trending` | Trending ideas for landing page |
| `GET` | `/api/ideas/my` | Current user's own ideas |
| `GET` | `/api/ideas/interacted` | Ideas the user commented on |
| `GET` | `/api/ideas/:id` | Get single idea detail |
| `POST` | `/api/ideas` | Create a new idea |
| `PUT` | `/api/ideas/:id` | Update an idea |
| `DELETE` | `/api/ideas/:id` | Delete an idea |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ideas/:id/comments` | Add a comment |
| `PUT` | `/api/ideas/:id/comments/:commentId` | Edit a comment |
| `DELETE` | `/api/ideas/:id/comments/:commentId` | Delete a comment |

### Auth (proxied)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/email/register` | Register with email/password |
| `POST` | `/api/auth/email/login` | Login with email/password |
| `POST` | `/api/auth/social/login` | Google OAuth login |
| `GET` | `/api/auth/session` | Get current session |

---

## 📸 Pages Overview

```
/                  → Hero carousel + Trending Ideas + About + FAQ
/ideas             → Browse & search all ideas
/ideas/:id         → Idea detail with comments
/add-idea          → Submit a new idea (auth required)
/my-ideas          → Manage your own ideas (auth required)
/my-interactions   → View your comment history (auth required)
/login             → Sign in (redirects to / if already logged in)
/register          → Create an account (redirects to /login on success)
/profile           → View profile (auth required)
/profile/edit      → Edit profile (auth required)
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built by <a href="https://github.com/Mahathir-Mohammod">Mahathir Mohammod</a></sub>
  <br />
  <sub>© 2026 IdeaVault. All rights reserved.</sub>
</div>
