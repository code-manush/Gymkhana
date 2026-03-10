import React from "react";

/**
 * Spinner – a circular loading indicator.
 *
 * Props:
 *  - size: "sm" | "md" | "lg"  (default: "md")
 *  - color: Tailwind color string (default: "text-brand-600")
 */
const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-4",
  lg: "h-12 w-12 border-4",
};

const Spinner = ({ size = "md", color = "border-brand-600" }) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`
        inline-block rounded-full border-gray-200 border-t-transparent animate-spin
        ${sizeClasses[size]}
        border-t-[currentColor] ${color}
      `}
    />
  );
};

export default Spinner;
