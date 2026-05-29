interface Props {
  status: string;
}

const styles: Record<string, string> = {
  PLANNING: "bg-[#FFFDEF] text-[#AF9400]",
  IN_PROGRESS: "bg-[#EEF8FF] text-[#007ADD]",
  REVIEW: "bg-[#F7F2FF] text-[#5920C0]",
  COMPLETED: "bg-[#F0FFF1] text-[#08A30E]",
  ON_HOLD: "bg-[#FFF6F2] text-[#CE4C00]",
  CANCELLED: "bg-[#FFFFFF] text-[#444444]",
};

function StatusBadge({ status }: Props) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-normal font-[Poppins] leading-none capitalize ${styles[status]}`}
    >
      {status.replace("_", " ").toLowerCase()}
    </span>
  );
}

export default StatusBadge;