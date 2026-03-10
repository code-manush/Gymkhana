import React from "react";
import { Link } from "react-router-dom";

/**
 * EventCard – reusable card for displaying a single event.
 *
 * Props:
 *  - event: { id, title, date, location, description }
 */
const EventCard = ({ event }) => {
  const { id, title, date, location, description } = event;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      {/* Date badge */}
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full w-fit">
        📅 {date}
      </span>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 leading-snug">{title}</h3>

      {/* Location */}
      <p className="text-xs text-gray-500 flex items-center gap-1">
        📍 {location}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 flex-1">{description}</p>

      {/* Register button */}
      <Link
        to="/register"
        className="mt-2 inline-flex items-center justify-center bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
      >
        Register Now
      </Link>
    </div>
  );
};

export default EventCard;
