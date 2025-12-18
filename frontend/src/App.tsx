import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CreateTask from "./pages/CreateTask";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { useAuth } from "./hooks/useAuth";
import Loader from "./components/Loader";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Home />} />

        <Route
          path="/create"
          element={isAuthenticated ? <CreateTask /> : <Login />}
        />
      </Routes>
    </>
  );
}

export default App;
