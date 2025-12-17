type Props = {
  status: string;
  priority: string;
  sort: string;
  onChange: (key: string, value: string) => void;
};

const TaskFilters = ({ status, priority, sort, onChange }: Props) => {
  return (
    <div className="flex gap-4 mb-6">
      <select
        value={status}
        onChange={(e) => onChange("status", e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">All Status</option>
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN PROGRESS</option>
        <option value="REVIEW">REVIEW</option>
        <option value="COMPLETED">COMPLETED</option>
      </select>

      <select
        value={priority}
        onChange={(e) => onChange("priority", e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">All Priority</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
        <option value="URGENT">URGENT</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onChange("sort", e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">Sort by</option>
        <option value="dueDate">Due Date</option>
      </select>
    </div>
  );
};

export default TaskFilters;
