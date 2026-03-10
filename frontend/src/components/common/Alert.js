import React from "react";

/**
 * Alert component – displays success, error, warning, or info message.
 *
 * Props:
 *  - type: "success" | "error" | "warning" | "info"  (default: "info")
 *  - message: string
 *  - onClose: function  (optional – shows close button if provided)
 */

const styles = {
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: "✅",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "❌",
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: "⚠️",
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "ℹ️",
  },
};

const Alert = ({ type = "info", message, onClose }) => {
  if (!message) return null;

  const { container, icon } = styles[type] || styles.info;

  return (
    <div className={`flex items-start gap-3 border rounded-lg px-4 py-3 text-sm ${container}`}>
      <span className="text-base leading-5">{icon}</span>
      <p className="flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-current opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
