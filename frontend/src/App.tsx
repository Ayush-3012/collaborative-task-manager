import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CreateTask from "./pages/CreateTask";
import { useAuth } from "./hooks/useAuth";
import Register from "./pages/Registe";
import Navbar from "./components/Navbar";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateTask />} />
      </Routes>
    </>
  );
}

export default App;
