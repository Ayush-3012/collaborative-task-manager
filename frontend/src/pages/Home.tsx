import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogIn, FiUserPlus, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl text-center"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm rounded-full bg-indigo-50 text-indigo-600">
          <FiCheckCircle />
          Simple. Fast. Collaborative.
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-800 mb-4">
          Manage your tasks <br />
          <span className="text-indigo-600">without the chaos</span>
        </h1>

        {/* Description */}
        <p className="text-slate-600 text-base sm:text-lg mb-10 max-w-xl mx-auto">
          Create, assign, track and collaborate on tasks in real-time. Built to
          keep teams focused and productive.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-md shadow hover:bg-indigo-700 transition"
            >
              <FiLogIn />
              Login
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 border border-indigo-600 text-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-50 transition"
            >
              <FiUserPlus />
              Register
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
