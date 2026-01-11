# 🚀 AI-Powered Full-Stack Creative Suite

## ✨ Project Overview

The **AI-Powered Full-Stack Creative Suite** is a modern, feature-rich web application that leverages the power of Artificial Intelligence for various creative and productivity tasks. It offers tools for content generation, image manipulation, and professional document review, all secured behind a robust subscription and authentication system.

This project follows a **Full-Stack MERN-style architecture**, utilizing a high-performance **React/Vite** frontend and a powerful **Node.js/Express** backend. It integrates **Clerk** for secure user management, **Cloudinary** for media handling, and specialized services like the **Gemini API** and **Clipdrop** for core AI functionalities. Data is stored in a scalable **Neon Serverless PostgreSQL** database.

---

## 💡 Key Features

The application provides a diverse set of AI tools, organized by category and access level:

### 📝 Content & Writing (Free Tier Available)

| Feature | Description | Access Level |
| :--- | :--- | :--- |
| **Article Generation** | Generates full, detailed articles based on user prompts. | **Free** (capped at 10 uses) / **Premium** |
| **Blog Title Generator** | Creates multiple engaging blog titles from a specific topic. | **Free** (capped at 10 uses) / **Premium** |

### 🖼️ Image Manipulation (Premium Only)

| Feature | Description | Access Level |
| :--- | :--- | :--- |
| **Text-to-Image Generation** | Creates entirely new images from a text prompt using the Clipdrop API. | **Premium Only** |
| **Background Removal** | Seamlessly removes the background from an uploaded image using Cloudinary. | **Premium Only** |
| **Object Removal** | Magically erases a specified object from an image using Cloudinary's Generative Remove feature. | **Premium Only** |

### 💼 Productivity & Community

| Feature | Description | Access Level |
| :--- | :--- | :--- |
| **Resume Review** | Parses an uploaded PDF resume and provides in-depth, constructive feedback via the AI model. | **Premium Only** |
| **Community Feed** | View publicly shared AI image creations from other users. | **All Users** |
| **User Creations** | View and manage all your personal AI creations (articles, images, etc.). | **Authenticated Users** |
| **Liking System** | Toggle likes on published community creations. | **Authenticated Users** |

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
    node server.js
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
    npm run dev
    # or
    yarn dev
    ```

---

## 🔒 Authentication & Subscription Logic

The application uses a sophisticated middleware system to manage user access and limits:

* **Global Protection**: The `clerkMiddleware()` and `requireAuth()` in `server.js` protect all API routes by default.
* **Custom `auth` Middleware**: This middleware runs before most controllers and does the following:
    1.  Checks if the user has a **premium** plan using Clerk's subscription API.
    2.  Reads and updates the user's **`privateMetadata.free_usage`** count stored in Clerk.
    3.  Sets **`req.plan`** (`'premium'` or `'free'`) and **`req.free_usage`** for the controller to use.
* **Usage Control**:
    * **Free-Tier Limit**: Content generation features are limited to **10 uses** for free users.
    * **Premium Requirement**: Image and resume features are strictly locked behind the premium plan.

---

## 📂 Project Structure

### Backend Endpoints

The core API is structured under `/api/ai` and `/api/ai/user`:

| Route File | Endpoint | Method | Middleware | Description |
| :--- | :--- | :--- | :--- | :--- |
| `aiRoutes.js` | `/api/ai/generate-article` | `POST` | `auth` | Generate article content. |
| `aiRoutes.js` | `/api/ai/generate-image` | `POST` | `auth` | Generate image from prompt (Premium). |
| `aiRoutes.js` | `/api/ai/remove-image-background` | `POST` | `upload.single('image')`, `auth` | Remove image background (Premium). |
| `aiRoutes.js` | `/api/ai/resume-review` | `POST` | `upload.single('resume')`, `auth` | Review and provide feedback on a resume PDF (Premium). |
| `userRoutes.js` | `/api/ai/user/get-published-creations` | `GET` | `auth` | Fetch all publicly shared AI creations. |
| `userRoutes.js` | `/api/ai/user/toggle-like-creations` | `POST` | `auth` | Add or remove a user's like on a creation. |

### Frontend Routing (`App.jsx`)

The frontend uses nested routing under a main AI layout:

| Route | Component | Description |
| :--- | :--- | :--- |
| `/` | `<Home />` | Public landing page. |
| `/ai` | `<Layout />` + `<Dashboard />` | Main authenticated dashboard view. |
| `/ai/write-article` | `<WriteArticle />` | UI for the article generator. |
| `/ai/generate-images` | `<GenerateImages />` | UI for the text-to-image tool. |
| `/ai/review-resume` | `<ReviewResume />` | UI for the resume review tool. |
| `/ai/community` | `<Community />` | UI for viewing published creations. |

---
