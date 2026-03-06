# 🚀 Axiom (AI-Powered Full-Stack Creative Suite)

## ✨ Project Overview

The **AI-Powered Full-Stack Creative Suite** is a modern, feature-rich web application that leverages the power of Artificial Intelligence for various creative and productivity tasks. It offers tools for content generation, image manipulation, and professional document review, all secured behind a robust subscription and authentication system.

This project follows a **Full-Stack MERN-style architecture**, utilizing a high-performance **React/Vite** frontend and a powerful **Node.js/Express** backend. It integrates **Clerk** for secure user management, **Cloudinary** for media handling, and specialized services like the **Gemini API** and **Clipdrop** for core AI functionalities. Data is stored in a scalable **Neon Serverless PostgreSQL** database.

### 🎯 **Two-Tier Access Model:**

- **🟢 Guest Mode**: Try all AI tools immediately without sign-up. Perfect for testing and quick demos.
- **👤 User Mode**: Create an account to unlock community features, save creations, and build your portfolio.

---

## 💡 Key Features

The application provides a diverse set of AI tools, accessible to both guests and authenticated users:

### 📝 Content & Writing

| Feature | Description | Access Level |
| :--- | :--- | :--- |
| **Article Generation** | Generates full, detailed articles based on user prompts. | **Guests & Users** |
| **Blog Title Generator** | Creates multiple engaging blog titles from a specific topic. | **Guests & Users** |

### 🖼️ Image Manipulation

| Feature | Description | Access Level |
| :--- | :--- | :--- |
| **Text-to-Image Generation** | Creates entirely new images from a text prompt using the Clipdrop API. | **Guests & Users** |
| **Background Removal** | Seamlessly removes the background from an uploaded image using Cloudinary. | **Guests & Users** |
| **Object Removal** | Magically erases a specified object from an image using Cloudinary's Generative Remove feature. | **Guests & Users** |

### 💼 Productivity & Community

| Feature | Description | Access Level |
| :--- | :--- | :--- |
| **Resume Review** | Parses an uploaded PDF resume and provides in-depth, constructive feedback via the AI model. | **Guests & Users** |
| **Publish to Community** | Share your AI-generated creations (images) publicly with other users. | **Authenticated Users** |
| **Community Feed** | View and explore publicly shared AI image creations from other users. | **Guests & Users** |
| **User Creations Dashboard** | View and manage all your personal AI creations (articles, images, etc.). | **Authenticated Users** |
| **Liking System** | Toggle likes on published community creations to show appreciation. | **Authenticated Users** |

---

## 🛠️ Tech Stack & Architecture

### 🌐 Frontend (Client)

The frontend is built for speed and a smooth user experience.

| Technology | Purpose |
| :--- | :--- |
| **React** & **Vite** | Core SPA framework and next-generation build tooling. |
| **Tailwind CSS** | Utility-first CSS for responsive, component-based styling. |
| **React Router DOM** | Manages application routing and nested views (e.g., `/ai/write-article`). |
| **Clerk** (`@clerk/clerk-react`) | Handles client-side authentication flow and user state. |
| **React Hot Toast** | Provides modern, accessible notifications. |

### ⚙️ Backend (Server)

The backend handles all business logic, AI calls, and database interactions.

| Technology | Purpose |
| :--- | :--- |
| **Node.js** & **Express** | Fast, scalable server runtime and web framework. |
| **Clerk** (`@clerk/express`) | Server-side authentication and user metadata management. |
| **Neon** (`@neondatabase/serverless`) | Serverless PostgreSQL database for secure data persistence. |
| **OpenAI SDK** (configured for **Gemini API**) | Core generative AI for content and text analysis (via a custom base URL). |
| **Cloudinary** | Secure media storage and advanced image transformation services. |
| **Clipdrop API** | Dedicated service used for high-quality Text-to-Image generation. |
| **Multer** & **PDF-Parse** | Middleware for handling multipart file uploads (images, resumes) and extracting text from PDFs. |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js (v18+)** installed. You will also need API keys from the following services:

* **Clerk** (Publishable Key and Secret Key)
* **Neon** (PostgreSQL Database URL)
* **Google AI Studio/API Key** (for Gemini API)
* **Cloudinary** (Cloud Name, API Key, API Secret)
* **Clipdrop** (API Key)

### 1. Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-project-folder>
    ```

2.  **Install server dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a **`.env`** file in the root of your *server* directory and populate it:

    ```env
    # Clerk Keys
    CLERK_SECRET_KEY=sk_live_...

    # Database
    DATABASE_URL=postgres://...

    # Google/Gemini API (used via OpenAI SDK)
    GEMINI_API_KEY=AIzaSy...

    # Cloudinary Keys
    CLOUDINARY_CLOUD_NAME=
    CLOUD_API_KEY=
    CLOUDINARY_API_SECRET=

    # Clipdrop API Key
    CLIPDROP_API_KEY=...

    # Server Port
    PORT=3000
    ```

4.  **Start the Server:**
    ```bash
    cd server
    npm install    # Install dependencies (if not already done)
    npm run server # Starts the server with nodemon (auto-restarts on changes)

    ```

### 2. Frontend Setup

1.  **Navigate to the client directory (e.g., `cd client`):**
    ```bash
    cd <frontend-directory>
    ```

2.  **Install client dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables (Frontend):**
    Create a **`.env`** file in the frontend root and add your Clerk Public Key:

    ```env
    # Clerk Public Key
    VITE_CLERK_PUBLISHABLE_KEY="pk_live_********************************"
    ```

4.  **Start the Frontend:**
    ```bash
    cd Frontend
    npm install    # Install dependencies (if not already done)
    npm run dev    # Starts the Vite development server
    ```

---

## � Authentication & Access Control

The application uses a flexible middleware system to manage user access:

* **Guest Access**: Unauthenticated users can access all AI generation tools via the `/api/guest/ai/*` routes. Guest requests are tracked using a `guestMode` context.
* **Global Authentication**: The `clerkMiddleware()` and `requireAuth()` in `server.js` authenticate logged-in users. Authenticated routes are protected and require valid Clerk tokens.
* **User-Specific Features**: Community publishing, creation management, and liking system require user authentication to maintain user attribution and personalization.
* **Custom Middleware**:
    * **`auth.js`**: Validates authenticated user tokens and injects user context into requests.
    * **`guestAuth.js`**: Marks guest requests with a guest mode identifier for usage tracking.

---

## 📂 Project Structure

### Backend Endpoints

#### Guest Routes (No Authentication Required)

| Route File | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| `guestAiRoutes.js` | `/api/guest/ai/generate-article` | `POST` | Generate article content as a guest. |
| `guestAiRoutes.js` | `/api/guest/ai/generate-blog-title` | `POST` | Generate blog titles as a guest. |
| `guestAiRoutes.js` | `/api/guest/ai/generate-image` | `POST` | Generate images as a guest. |
| `guestAiRoutes.js` | `/api/guest/ai/remove-image-background` | `POST` | Remove image background as a guest. |
| `guestAiRoutes.js` | `/api/guest/ai/remove-image-object` | `POST` | Remove image objects as a guest. |
| `guestAiRoutes.js` | `/api/guest/ai/resume-review` | `POST` | Review resumes as a guest. |

#### Authenticated Routes (Login Required)

| Route File | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| `aiRoutes.js` | `/api/ai/generate-article` | `POST` | Generate article content for authenticated users. |
| `aiRoutes.js` | `/api/ai/generate-blog-title` | `POST` | Generate blog titles for authenticated users. |
| `aiRoutes.js` | `/api/ai/generate-image` | `POST` | Generate images with publishing option for authenticated users. |
| `aiRoutes.js` | `/api/ai/remove-image-background` | `POST` | Remove image background for authenticated users. |
| `aiRoutes.js` | `/api/ai/remove-image-object` | `POST` | Remove image objects for authenticated users. |
| `aiRoutes.js` | `/api/ai/resume-review` | `POST` | Review resumes for authenticated users. |
| `userRoutes.js` | `/api/ai/user/get-user-creations` | `GET` | Fetch all personal AI creations. |
| `userRoutes.js` | `/api/ai/user/get-published-creations` | `GET` | Fetch all publicly shared AI creations from community. |
| `userRoutes.js` | `/api/ai/user/toggle-like-creations` | `POST` | Add or remove likes on community creations. |

### Frontend Routing (`App.jsx`)

The frontend uses nested routing with public and protected views:

| Route | Component | Description | Access |
| :--- | :--- | :--- | :--- |
| `/` | `<Home />` | Public landing page with features overview. | **Public** |
| `/ai` | `<Layout />` + `<Dashboard />` | Main dashboard showing user's creations and activity. | **Authenticated** |
| `/ai/write-article` | `<WriteArticle />` | UI for generating articles from prompts. | **Guests & Users** |
| `/ai/blog-titles` | `<Blogtitle />` | UI for generating engaging blog titles. | **Guests & Users** |
| `/ai/generate-images` | `<GenerateImages />` | UI for text-to-image generation with publishing option. | **Guests & Users** |
| `/ai/remove-background` | `<RemoveBackground />` | UI for removing image backgrounds. | **Guests & Users** |
| `/ai/remove-object` | `<RemoveObject />` | UI for removing specific objects from images. | **Guests & Users** |
| `/ai/review-resume` | `<ReviewResume />` | UI for uploading and reviewing resumes with AI feedback. | **Guests & Users** |
| `/ai/community` | `<Community />` | UI for viewing, exploring, and liking community creations. | **Guests & Users** |

---

## ?? Database Schema

The application stores data in Neon PostgreSQL with the following main table:

### **creations** Table

| Column | Type | Purpose |
| :--- | :--- | :--- |
| `id` | UUID | Unique creation identifier. |
| `user_id` | String | Clerk user ID (null for guest creations). |
| `prompt` | Text | The input prompt/description. |
| `content` | Text | The AI-generated output (article, URL to image, etc.). |
| `type` | String | Creation type: `article`, `blog-title`, `image`, `Resume-Review`. |
| `publish` | Boolean | Whether the creation is shared publicly (images only). |
| `likes` | Integer | Number of likes received (community features). |
| `created_at` | Timestamp | When the creation was made. |

---

## 💾 Database Schema

The application stores data in Neon PostgreSQL with the following main table:

### **creations** Table

| Column | Type | Purpose |
| :--- | :--- | :--- |
| `id` | UUID | Unique creation identifier. |
| `user_id` | String | Clerk user ID (null for guest creations). |
| `prompt` | Text | The input prompt/description. |
| `content` | Text | The AI-generated output (article, URL to image, etc.). |
| `type` | String | Creation type: `article`, `blog-title`, `image`, `Resume-Review`. |
| `publish` | Boolean | Whether the creation is shared publicly (images only). |
| `likes` | Integer | Number of likes received (community features). |
| `created_at` | Timestamp | When the creation was made. |

---

## ⚙️ **Constraints & Limits**

| Constraint | Limit | Notes |
| :--- | :--- | :--- |
| **Resume File Size** | 2 MB | Keep PDFs small for faster processing. |
| **API Response Time** | ~5-30 sec | Gemini API and Clipdrop may take time; implement loading states. |
| **Concurrent Requests** | Limited by API quotas | Keep an eye on Gemini API rate limits if scaling. |
| **Image Upload** | Cloudinary limits | Typically 100 MB, but adjust in Multer config if needed. |

---

## 🔍 **How Guest vs Authenticated Flow Works**

### **Guest Flow:**
1. User lands on home page (no login required)
2. Clicks on any AI tool → routes to `/ai/tool-name`
3. Frontend sets `isGuest = true` via `GuestContext`
4. Requests go to `/api/guest/ai/*` endpoints
5. Backend `guestAuth` middleware processes the request
6. Result is shown but **NOT saved** to database

### **Authenticated Flow:**
1. User signs up/logs in via Clerk
2. Clerk token is stored in the browser
3. Requests go to `/api/ai/*` endpoints
4. Backend `auth` middleware validates the token
5. `userId` is extracted and passed to controllers
6. Results are saved to the database with user attribution
7. User can view, publish, and like creations

---

## 🐛 **Troubleshooting**

### **Common Issues**

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| "API Key not found" | Missing environment variables | Check all `.env` files; restart servers after updating. |
| "Gemini API limit is over" | Rate limit exceeded | Wait a few minutes or upgrade API quota. |
| "Database fetching problem" | Neon connection issue | Verify `DATABASE_URL` and network connection. |
| Images not uploading | Cloudinary config wrong | Check `CLOUDINARY_CLOUD_NAME`, `CLOUD_API_KEY`, and `CLOUDINARY_API_SECRET`. |
| Guest requests fail | Backend not started | Ensure backend is running on correct port (default: 3000). |
| CORS errors | Frontend/Backend mismatch | Verify `VITE_BASE_URL` matches backend `PORT`. |
| Multer file upload fails | File too large | Check file size limits in `configs/multer.js`. |
| Can't see community creations | Database empty | First, publish an image as an authenticated user to populate. |

---

## 💡 **Development Tips**

### **Testing Both Flows:**
```javascript
// To test guest mode:
// 1. Open app in incognito/private window
// 2. Or manually toggle in React DevTools: GuestContext.isGuest = true

// To test authenticated mode:
// 1. Sign up with Clerk
// 2. Make a request to /api/ai/* endpoints
```

### **Debug Tips:**
- Use **Redux DevTools** to inspect `GuestContext` state
- Check **Network tab** to see request headers and response bodies
- Use **Postman** to test API endpoints directly (include Bearer token for authenticated routes)
- Enable console logs in controllers to see what data is being processed

---

## 📁 **Project File Structure Overview**

```
Project_SaaS_PERN/
├── Frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Dashboard, Home, etc.)
│   │   ├── context/        # React contexts (GuestContext)
│   │   └── assets/         # Icons, images, constants
│   └── package.json
│
├── server/                 # Node.js + Express backend
│   ├── controllers/        # Business logic (AI functions)
│   ├── routes/             # API endpoints
│   ├── middlewares/        # Auth & guest middlewares
│   ├── configs/            # Database, Cloudinary, Multer setup
│   ├── server.js           # Express app entry point
│   └── package.json
│
└── README.md               # This file
```

---

## 🚀 **Quick Start (Copy & Paste)**

```bash
# Backend
cd server
npm install
# Add your environment variables to .env
npm run server

# Frontend (in new terminal)
cd Frontend
npm install
# Add your environment variables to .env
npm run dev
```

### **Environment Variables Checklist:**

**Backend** (server/.env):
```env
✅ CLERK_SECRET_KEY
✅ DATABASE_URL
✅ GEMINI_API_KEY
✅ CLOUDINARY_CLOUD_NAME
✅ CLOUD_API_KEY
✅ CLOUDINARY_API_SECRET
✅ CLIPDROP_API_KEY
✅ PORT (optional, defaults to 3000)
```

**Frontend** (Frontend/.env):
```env
✅ VITE_CLERK_PUBLISHABLE_KEY
✅ VITE_BASE_URL (e.g., http://localhost:3000)
```

