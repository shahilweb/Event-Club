import { cn } from "@/lib/utils";

type Status = "pending" | "confirmed" | "rejected";

interface StatusBadgeProps {
  status: Status | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase() as Status;

  const styles = {
    pending: "bg-amber-500/15 text-amber-500 border-amber-500/20",
    confirmed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
    rejected: "bg-red-500/15 text-red-500 border-red-500/20",
  };

  const labels = {
    pending: "Pending Review",
    confirmed: "Confirmed",
    rejected: "Not Accepted",
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      styles[normalizedStatus] || styles.pending,
      className
    )}>
      {labels[normalizedStatus] || status}
    </span>
  );
}
