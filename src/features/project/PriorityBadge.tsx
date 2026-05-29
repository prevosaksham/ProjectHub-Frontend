interface Props {
  priority: string;
}

const styles: Record<string, string> = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

function PriorityBadge({ priority }: Props) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

export default PriorityBadge;