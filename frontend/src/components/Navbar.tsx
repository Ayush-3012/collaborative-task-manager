import { Link } from "react-router-dom";
import { logout } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Task Dashboard</h1>

      <nav className="flex gap-3">
        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm"
            >
              Register
            </Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <Link
              to="/create"
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              + Create Task
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
