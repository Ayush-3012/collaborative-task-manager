# 🧑‍💻 Collaborative Task Manager  
**Full-Stack Engineering Assessment Submission**

---

## 🎯 Overview

This project is a **production-ready, full-stack Collaborative Task Management application** built as part of a Full-Stack Engineering assessment.  
It focuses on **clean architecture**, **secure authentication**, **real-time collaboration**, and **scalable state management** using modern JavaScript/TypeScript best practices.

The application allows users to create, assign, track, and collaborate on tasks in real time with instant notifications.

---

## 🚀 Live Deployment

- **Frontend (Vercel):** https://collaborative-task-manager-pi.vercel.app/  
- **Backend API (Render/Railway):** https://collaborative-task-manager-backend-fk5p.onrender.com/  
- **API Base Path:** `/api`
- **Github URl:** https://github.com/Ayush-3012/collaborative-task-manager

> ⚠️ Note: Backend may take a few seconds to wake up on first request (cold start).

---

## 🧱 Tech Stack

### Frontend
- React (Vite) + TypeScript  
- Tailwind CSS  
- React Query
- React Hook Form + Zod  
- Framer Motion  
- Socket.io Client  

### Backend
- Node.js + Express + TypeScript  
- Prisma ORM  
- MongoDB  
- JWT Authentication
- Socket.io  

### Deployment
- Frontend: Vercel  
- Backend & Database: Render

---

## 🗄️ Database Choice & Justification

**MongoDB** was chosen for the following reasons:
- Flexible schema for rapid iteration
- Natural fit for task & notification models
- Prisma support with ObjectId
- Scales well for real-time, event-driven applications

Prisma provides **type-safe queries**, schema validation, and a clean data-access layer.

---

## 🧹 Core Features Implemented

### 1. Authentication & Authorization
- User registration & login
- Password hashing using bcrypt
- JWT-based authentication stored in HttpOnly cookies
- Protected routes on frontend & backend
- User profile view & update

---

### 2. Task Management (CRUD)

Each task includes:
- `title` (string, max 100 chars)
- `description` (multi-line)
- `dueDate` (date-time)
- `priority` (LOW, MEDIUM, HIGH, URGENT)
- `status` (TODO, IN_PROGRESS, REVIEW, COMPLETED)
- `creatorId`
- `assignedToId`

Supported operations:
- Create task
- Update task
- Delete task
- View task lists

---

### 3. Real-Time Collaboration (Socket.io)

- **Live Updates:**  
  Task status, priority, and assignee updates are broadcast instantly.
- **Assignment Notifications:**  
  Assigned users receive persistent in-app notifications stored in the database and delivered via sockets.

---

### 4. Dashboard & Data Exploration

Dashboard includes:
- Tasks assigned to the current user
- Tasks created by the current user
- Overdue tasks based on due date

Filtering & Sorting:
- Filter by Status
- Filter by Priority
- Sort by Due Date

---

## 🏗️ Architecture & Engineering Decisions

### Backend Architecture

backend/
├── controllers/
├── services/
├── repositories/
├── routes/
├── schemas/
├── socket/


- MVC-style separation
- Zod-based DTO validation
- Consistent error handling with proper HTTP status codes
- Strong TypeScript typing across layers

---

### Frontend Architecture

- React Query for server state & caching
- Centralized API layer
- Reusable hooks (`useAuth`, `useTask`, `useNotification`)
- Fully responsive Tailwind CSS UI
- Route-level lazy loading for performance

---

## 🔌 Socket.io Integration

- JWT validated during socket handshake
- Each user joins a private room using userId
- Events emitted:
  - `task-updated`
  - `task-assigned`
- Frontend listens and updates UI in real time

---

## 📡 API Endpoints (Key)

### Auth
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/logout`
- GET `/api/v1/auth/me`
- PUT `/api/v1/auth/profile`

### Tasks
- POST `/api/v1/tasks`
- GET `/api/v1/tasks/:id`
- PUT `/api/v1/tasks/:id`
- DELETE `/api/v1/tasks/:id`
- PATCH `/api/v1/tasks/:id/status`
- GET `/api/v1/dashboard`

### Notifications
- GET `/api/v1/notifications`
- PATCH `/api/v1/notifications/:id/read`

---

## 🧪 Testing

- Unit tests for critical backend business logic
- Focus on task creation and assignment flows
- Test framework: Jest

---

## ⚙️ Local Setup Instructions

### Clone Repository
```bash
git clone <repo-url>
cd collaborative-task-manager
``` 

### Backend Setup
```bash
cd backend
npm install
```

### Create .env file:

```bash
DATABASE_URL=<mongo-url>
COOKIE_NAME=<name>
COOKIE_SECRET=<secret>
JWT_SECRET=<secret>
NODE_ENV=development
```

### Run backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: ```http://localhost:5173```

### ⚖️ Trade-offs & Assumptions
* Role-based access control not implemented
* No email/SMS notifications (in-app only)
* Optimistic UI kept minimal for clarity

### ✨ Bonus Considerations
* Lazy loading and code splitting
* Clean commit history
* UI optimized for real-world usability

### 📌 Final Notes
* This project emphasizes:
    * Correctness & completeness
    * Clean architecture
    * Real-time collaboration
    * Production-ready deployment

## 👤 Author
Ayush Kumar \
Full-Stack Developer
