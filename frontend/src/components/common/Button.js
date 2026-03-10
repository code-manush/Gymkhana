import React from "react";

/**
 * Reusable Button component
 *
 * Props:
 *  - variant: "primary" | "secondary" | "danger"  (default: "primary")
 *  - size: "sm" | "md" | "lg"                      (default: "md")
 *  - loading: boolean                               (shows spinner)
 *  - disabled: boolean
 *  - onClick: function
 *  - type: "button" | "submit"                     (default: "button")
 *  - children: node
 */

const variantClasses = {
  primary:   "bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500",
  secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-brand-500",
  danger:    "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
