import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/eventService";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import Badge from "../components/common/Badge";
import Alert from "../components/common/Alert";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEvents()
      .then((res) => {
        setEvents(res.data);
        setFiltered(res.data);
      })
      .catch(() => setError("Failed to load events. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // Filter by search term
  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      events.filter(
        (e) =>
          e.title?.toLowerCase().includes(term) ||
          e.category?.toLowerCase().includes(term) ||
          e.location?.toLowerCase().includes(term)
      )
    );
  }, [search, events]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">🗓️ Events</h1>
            <input
              type="text"
              placeholder="Search events…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field max-w-xs"
            />
          </div>

          {error && <Alert type="error" message={error} />}

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-16">No events found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((event) => (
                <Link to={`/events/${event.id}`} key={event.id} className="block group">
                  <Card className="h-full transition-shadow group-hover:shadow-md">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="font-semibold text-gray-800 text-sm leading-snug">
                        {event.title}
                      </h2>
                      <Badge variant="info">{event.category || "Event"}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">📅 {event.date}</p>
                    <p className="text-xs text-gray-500 mb-3">📍 {event.location || "TBA"}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{event.description}</p>
                    <p className="text-brand-600 text-xs font-medium mt-3 group-hover:underline">
                      View details →
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Events;
