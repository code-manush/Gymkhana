import React from "react";

/**
 * Card component – a white rounded container with shadow.
 *
 * Props:
 *  - title: string     (optional header text)
 *  - footer: node      (optional footer content)
 *  - className: string (extra classes for the outer wrapper)
 *  - children: node
 */
const Card = ({ title, footer, className = "", children }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">{footer}</div>
      )}
    </div>
  );
};

export default Card;
