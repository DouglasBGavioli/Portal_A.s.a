import React from "react";

type Variant = "primary" | "secondary" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  secondary: "bg-[#e7ebde] text-brand-600 hover:bg-brand-500 hover:text-white",
  outline: "border-2 border-brand-600 bg-transparent text-brand-600 hover:bg-brand-600 hover:text-white",
  danger: "bg-[#b85b5b] text-white hover:bg-[#a34848]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs font-normal",
  md: "px-5 py-2.5 text-sm font-semibold",
  lg: "px-6 py-3.5 text-base font-semibold",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md border-none transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? "Carregando..." : children}
    </button>
  );
}

