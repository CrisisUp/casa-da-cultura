import { classNames } from "@/lib/utils";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
  pulse?: boolean;
}

export default function Badge({ variant = "info", children, pulse }: BadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 hover:scale-105",
        {
          "bg-green-100 text-green-700 border border-green-200 shadow-sm shadow-green-200/50":
            variant === "success",
          "bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm shadow-yellow-200/50":
            variant === "warning",
          "bg-red-100 text-red-700 border border-red-200 shadow-sm shadow-red-200/50":
            variant === "danger",
          "bg-blue-100 text-blue-700 border border-blue-200 shadow-sm shadow-blue-200/50":
            variant === "info",
        }
      )}
    >
      {/* Indicador animado */}
      <span
        className={classNames(
          "h-2 w-2 rounded-full",
          {
            "bg-green-500": variant === "success",
            "bg-yellow-500": variant === "warning",
            "bg-red-500": variant === "danger",
            "bg-blue-500": variant === "info",
          },
          pulse && "animate-pulse"
        )}
      />
      {children}
    </span>
  );
}
