import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell } from "react-icons/fi";
import { useNotification } from "../hooks/useNotification";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotification();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative p-2 rounded-full cursor-pointer hover:bg-slate-100 transition"
      >
        <FiBell className="text-slate-700" size={18} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[11px] flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 max-h-105 overflow-y-auto bg-white border border-slate-200 shadow-xl rounded-xl z-50"
          >
            <div className="px-4 py-3 border-b border-slate-200">
              <p className="text-sm font-medium text-slate-700">
                Notifications
              </p>
            </div>

            {notifications.length === 0 && (
              <p className="p-4 text-sm text-slate-500 text-center">
                No notifications yet
              </p>
            )}

            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`px-4 py-3 cursor-pointer transition border-b last:border-b-0 ${
                  n.read
                    ? "bg-white hover:bg-slate-50"
                    : "bg-indigo-50 hover:bg-indigo-100"
                }`}
              >
                <p className="text-sm text-slate-800">
                  {n.message}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
