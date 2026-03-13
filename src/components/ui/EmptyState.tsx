import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EmptyStateSize = "sm" | "md" | "lg";
type EmptyStateVariant = "default" | "dashed" | "ghost";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

interface EmptyStateProps {
  // Content
  icon?: React.ReactNode;
  title: string;
  description?: string;

  // Actions — first action is treated as primary if variant not set
  actions?: EmptyStateAction[];

  // Appearance
  size?: EmptyStateSize;
  variant?: EmptyStateVariant;

  // Layout
  className?: string;
}

// ─── Size Config ──────────────────────────────────────────────────────────────

const sizeMap: Record<
  EmptyStateSize,
  {
    wrapper: string;
    icon: string;
    title: string;
    description: string;
    gap: string;
  }
> = {
  sm: {
    wrapper: "py-8 px-4",
    icon: "w-8 h-8",
    title: "text-sm font-semibold",
    description: "text-xs",
    gap: "gap-2",
  },
  md: {
    wrapper: "py-12 px-6",
    icon: "w-10 h-10",
    title: "text-base font-semibold",
    description: "text-sm",
    gap: "gap-3",
  },
  lg: {
    wrapper: "py-20 px-8",
    icon: "w-14 h-14",
    title: "text-xl font-semibold",
    description: "text-base",
    gap: "gap-4",
  },
};

const variantMap: Record<EmptyStateVariant, string> = {
  default: "bg-gray-50 rounded-xl",
  dashed: "border-2 border-dashed border-gray-200 rounded-xl bg-transparent",
  ghost: "bg-transparent",
};

// ─── Default Icon ─────────────────────────────────────────────────────────────

const DefaultIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actions,
  size = "md",
  variant = "default",
  className = "",
}) => {
  const sz = sizeMap[size];

  return (
    <div
      className={[
        "w-full flex flex-col items-center justify-center text-center",
        sz.wrapper,
        variantMap[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Icon */}
      <div className={["text-gray-300 mb-1", sz.gap].join(" ")}>
        {icon ? (
          <span className={sz.icon}>{icon}</span>
        ) : (
          <DefaultIcon className={sz.icon} />
        )}
      </div>

      {/* Text */}
      <div className={["flex flex-col items-center", sz.gap].join(" ")}>
        <p className={["text-gray-700", sz.title].join(" ")}>{title}</p>

        {description && (
          <p className={["text-gray-400 max-w-sm", sz.description].join(" ")}>
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div
          className={[
            "flex flex-wrap items-center justify-center gap-2 mt-2",
            sz.gap,
          ].join(" ")}
        >
          {actions.map((action, i) => {
            const isPrimary =
              action.variant === "primary" ||
              (action.variant === undefined && i === 0);

            return isPrimary ? (
              <button
                key={i}
                onClick={action.onClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {action.label}
              </button>
            ) : (
              <button
                key={i}
                onClick={action.onClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-600 text-sm font-medium rounded-lg border border-gray-200 transition-colors"
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
