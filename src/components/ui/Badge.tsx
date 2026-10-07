import { classNames } from "@/lib/utils";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
  pulse?: boolean;
}

export default function Badge({
  variant = "info",
  children,
  pulse = false,
}: BadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 hover:scale-105 border",
        {
          "bg-[var(--badge-success-bg)] text-[var(--badge-success-text)] border-[var(--badge-success-border)]":
            variant === "success",
          "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] border-[var(--badge-warning-border)]":
            variant === "warning",
          "bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)] border-[var(--badge-danger-border)]":
            variant === "danger",
          "bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] border-[var(--badge-info-border)]":
            variant === "info",
        }
      )}
    >
      {/* Indicador animado */}
      <span
        className={classNames("h-2 w-2 rounded-full bg-current", {
          "animate-pulse": !!pulse,
        })}
      />
      {children}
    </span>
  );
}