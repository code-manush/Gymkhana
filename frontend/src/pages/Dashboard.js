import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/eventService";
import { getClubs } from "../services/clubService";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import Badge from "../components/common/Badge";

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4`}>
    <div className={`text-3xl p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, clRes] = await Promise.all([getEvents(), getClubs()]);
        setEvents(evRes.data.slice(0, 4));   // Show latest 4 events
        setClubs(clRes.data.slice(0, 4));    // Show first 4 clubs
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Good day, {user?.name || "Student"} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Here's what's happening on campus today.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon="🗓️" label="Total Events" value={events.length} color="bg-blue-50" />
            <StatCard icon="🏛️" label="Clubs"  value={clubs.length}  color="bg-purple-50" />
            <StatCard icon="✅" label="Registered" value="—"          color="bg-green-50" />
            <StatCard icon="⭐" label="My Clubs"    value="—"          color="bg-yellow-50" />
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              <Card title="🗓️ Upcoming Events">
                {events.length === 0 ? (
                  <p className="text-sm text-gray-400">No events yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {events.map((event) => (
                      <li key={event.id} className="py-3 flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm text-gray-800">{event.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{event.date}</p>
                        </div>
                        <Badge variant="info">{event.category || "Event"}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
                <Link to="/events" className="text-brand-600 text-sm font-medium hover:underline mt-3 block">
                  View all events →
                </Link>
              </Card>

              {/* Clubs */}
              <Card title="🏛️ Featured Clubs">
                {clubs.length === 0 ? (
                  <p className="text-sm text-gray-400">No clubs yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {clubs.map((club) => (
                      <li key={club.id} className="py-3 flex items-center justify-between">
                        <p className="font-medium text-sm text-gray-800">{club.name}</p>
                        <Badge variant="default">{club.category || "Club"}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
                <Link to="/clubs" className="text-brand-600 text-sm font-medium hover:underline mt-3 block">
                  Browse all clubs →
                </Link>
              </Card>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
