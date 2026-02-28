import React from "react";
import "./style.scss";

type Variant = "primary" | "secondary" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    fullWidth?: boolean;
    loading?: boolean;
}

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
            className={`
        dua-button
        dua-button--${variant}
        dua-button--${size}
        ${fullWidth ? "dua-button--full" : ""}
        ${loading ? "dua-button--loading" : ""}
        ${className}
      `}
            disabled={disabled || loading}
            {...rest}
        >
            {loading ? "Carregando..." : children}
        </button>
    );
}