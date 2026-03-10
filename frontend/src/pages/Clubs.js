import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClubs } from "../services/clubService";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import Card from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import Alert from "../components/common/Alert";
import Badge from "../components/common/Badge";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getClubs()
      .then((res) => { setClubs(res.data); setFiltered(res.data); })
      .catch(() => setError("Failed to load clubs."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(clubs.filter((c) =>
      c.name?.toLowerCase().includes(term) || c.category?.toLowerCase().includes(term)
    ));
  }, [search, clubs]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">🏛️ Clubs</h1>
            <input
              type="text"
              placeholder="Search clubs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field max-w-xs"
            />
          </div>

          {error && <Alert type="error" message={error} />}

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-16">No clubs found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((club) => (
                <Link to={`/clubs/${club.id}`} key={club.id} className="block group">
                  <Card className="h-full transition-shadow group-hover:shadow-md">
                    <div className="flex items-start justify-between mb-2">
                      <h2 className="font-semibold text-gray-800 text-sm">{club.name}</h2>
                      <Badge variant="default">{club.category || "Club"}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      👥 {club.members_count ?? "—"} members
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2">{club.description}</p>
                    <p className="text-brand-600 text-xs font-medium mt-3 group-hover:underline">
                      View club →
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

export default Clubs;
