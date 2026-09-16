"use client";

import { useState } from "react";
import { X, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { classNames } from "@/lib/utils";

interface AlertBannerProps {
  variant?: "info" | "warning" | "success";
  title: string;
  message: string;
  dismissible?: boolean;
}

export default function AlertBanner({
  variant = "info",
  title,
  message,
  dismissible = true,
}: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
  };

  const Icon = icons[variant];

  const styles = {
    info: "bg-terracota/10 border-terracota/20 text-terracota-dark",
    warning: "bg-ambar/10 border-ambar/20 text-ambar-dark",
    success: "bg-oliva/10 border-oliva/20 text-oliva-dark",
  };

  const iconStyles = {
    info: "text-terracota",
    warning: "text-ambar",
    success: "text-oliva",
  };

  return (
    <div
      className={classNames(
        "flex items-start gap-4 rounded-2xl border p-4 transition-all duration-300",
        styles[variant]
      )}
      role="alert"
    >
      <Icon className={classNames("h-5 w-5 mt-0.5 shrink-0", iconStyles[variant])} />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm opacity-80 mt-0.5">{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
          aria-label="Fechar alerta"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
