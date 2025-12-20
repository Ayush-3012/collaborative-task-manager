import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogOut, FiUser, FiPlus, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { logout } from "../api/auth.api";
import NotificationBell from "./NotificationBell";

const Navbar = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-semibold text-slate-800 tracking-tight"
          >
            Task<span className="text-indigo-600">Manager</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3">
            {!isAuthenticated && (
              <>
                <NavLink to="/login" variant="outline">
                  Login
                </NavLink>
                <NavLink to="/register" variant="primary">
                  Register
                </NavLink>
              </>
            )}

            {isAuthenticated && (
              <>
                <NavLink to="/create-task" variant="primary" icon={<FiPlus />}>
                  Create
                </NavLink>

                <NavLink to="/profile" variant="ghost" icon={<FiUser />}>
                  Profile
                </NavLink>

                <NotificationBell />

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md text-red-600 hover:bg-red-50 transition"
                >
                  <FiLogOut />
                  Logout
                </motion.button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen((p) => !p)}
            className="md:hidden text-slate-700"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col gap-2 pt-2">
              {!isAuthenticated && (
                <>
                  <MobileLink to="/login" onClick={() => setOpen(false)}>
                    Login
                  </MobileLink>
                  <MobileLink to="/register" onClick={() => setOpen(false)}>
                    Register
                  </MobileLink>
                </>
              )}

              {isAuthenticated && (
                <>
                  <MobileLink to="/create-task" onClick={() => setOpen(false)}>
                    Create Task
                  </MobileLink>
                  <MobileLink to="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </MobileLink>

                  <div className="px-2">
                    <NotificationBell />
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

/* ---------------- helpers ---------------- */

const NavLink = ({
  to,
  children,
  variant = "ghost",
  icon,
}: {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  icon?: React.ReactNode;
}) => {
  const base =
    "inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition";

  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    ghost: "text-slate-600 hover:bg-slate-100",
  };

  return (
    <motion.div whileHover={{ y: -1 }}>
      <Link to={to} className={`${base} ${styles[variant]}`}>
        {icon}
        {children}
      </Link>
    </motion.div>
  );
};

const MobileLink = ({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100"
  >
    {children}
  </Link>
);

export default Navbar;
