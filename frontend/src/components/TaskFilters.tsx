import { motion } from "framer-motion";
import { FiFilter, FiFlag, FiCheckCircle, FiClock } from "react-icons/fi";

type Props = {
  status: string;
  priority: string;
  sort: string;
  onChange: (key: "status" | "priority" | "sort", value: string) => void;
};

const TaskFilters = ({ status, priority, sort, onChange }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-wrap items-center gap-3 sm:gap-4"
    >
      {/* Status */}
      <FilterSelect
        icon={<FiCheckCircle />}
        value={status}
        onChange={(v) => onChange("status", v)}
      >
        <option value="">All Status</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="REVIEW">Review</option>
        <option value="COMPLETED">Completed</option>
      </FilterSelect>

      {/* Priority */}
      <FilterSelect
        icon={<FiFlag />}
        value={priority}
        onChange={(v) => onChange("priority", v)}
      >
        <option value="">All Priority</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </FilterSelect>

      {/* Sort */}
      <FilterSelect
        icon={<FiClock />}
        value={sort}
        onChange={(v) => onChange("sort", v)}
      >
        <option value="">Sort</option>
        <option value="dueDate">Due Date</option>
      </FilterSelect>

      {/* Hint (optional visual polish) */}
      <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 ml-auto">
        <FiFilter />
        Filters
      </div>
    </motion.div>
  );
};

export default TaskFilters;

/* ---------- helper ---------- */

const FilterSelect = ({
  icon,
  value,
  onChange,
  children,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
      {icon}
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none border border-slate-300 rounded-lg bg-white pl-10 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-slate-400 transition"
    >
      {children}
    </select>
  </div>
);
