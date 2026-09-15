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
          "bg-oliva/10 text-oliva-dark border border-oliva/20 shadow-sm shadow-oliva/10":
            variant === "success",
          "bg-ambar/10 text-ambar-dark border border-ambar/20 shadow-sm shadow-ambar/10":
            variant === "warning",
          "bg-red-50 text-danger border border-red-200 shadow-sm shadow-red-200/50":
            variant === "danger",
          "bg-terracota/10 text-terracota-dark border border-terracota/20 shadow-sm shadow-terracota/10":
            variant === "info",
        }
      )}
    >
      {/* Indicador animado */}
      <span
        className={classNames(
          "h-2 w-2 rounded-full",
          {
            "bg-oliva": variant === "success",
            "bg-ambar": variant === "warning",
            "bg-danger": variant === "danger",
            "bg-terracota": variant === "info",
          },
          pulse && "animate-pulse"
        )}
      />
      {children}
    </span>
  );
}
