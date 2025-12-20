import { Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import { useAuth } from "./hooks/useAuth";

// 🔹 Lazy loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const DashboardOverview = lazy(() => import("./pages/Dashboard"));
const TaskForm = lazy(() => import("./pages/TaskForm"));

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar isAuthenticated={isAuthenticated} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Suspense
            fallback={
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/create-task"
                element={isAuthenticated ? <TaskForm /> : <Login />}
              />
              <Route
                path="/tasks/:id/edit"
                element={isAuthenticated ? <TaskForm /> : <Login />}
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </SnackbarProvider>
  );
}

export default App;
