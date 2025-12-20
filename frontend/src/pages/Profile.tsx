import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiEdit2, FiSave, FiX } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user, isLoading, updateProfile } = useAuth();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [wishToUpdate, setWishToUpdate] = useState(false);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateProfile({ name });
      setSuccess("Profile updated successfully");
      setWishToUpdate(false);
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="text-center mt-16 text-slate-500">Loading profile...</div>
    );

  if (!user)
    return <div className="text-center mt-16 text-red-500">Unauthorized</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto bg-white border border-slate-200 rounded-xl shadow-lg p-6 sm:p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
            <FiUser size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">My Profile</h2>
            <p className="text-sm text-slate-500">
              Manage your personal details
            </p>
          </div>
        </div>

        {/* Success */}
        {success && (
          <p className="text-emerald-600 text-sm bg-emerald-50 px-3 py-2 rounded">
            {success}
          </p>
        )}

        {/* VIEW MODE */}
        {!wishToUpdate && (
          <div className="space-y-4">
            <InfoRow icon={<FiMail />} label="Email" value={user.email} />
            <InfoRow icon={<FiUser />} label="Name" value={user.name} />

            <button
              onClick={() => setWishToUpdate(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition"
            >
              <FiEdit2 />
              Update Profile
            </button>
          </div>
        )}

        {/* EDIT MODE */}
        {wishToUpdate && (
          <form onSubmit={handleUpdate} className="space-y-4">
            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Email (read-only)
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-100 text-slate-500"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition"
              >
                <FiSave />
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setWishToUpdate(false);
                  setName(user.name);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-600 py-2.5 rounded-lg hover:bg-slate-100 transition"
              >
                <FiX />
                Cancel
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;

/* ---------- helper ---------- */

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
    <div className="text-slate-500">{icon}</div>
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  </div>
);
