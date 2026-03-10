import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClub, joinClub, leaveClub } from "../services/clubService";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import Alert from "../components/common/Alert";
import Badge from "../components/common/Badge";

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    getClub(id)
      .then((res) => setClub(res.data))
      .catch(() => setError("Club not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = async () => {
    setActionLoading(true);
    try {
      await joinClub(id);
      setAlert({ type: "success", message: "You have joined the club! 🎉" });
      setClub((prev) => ({ ...prev, is_member: true }));
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.detail || "Action failed." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);
    try {
      await leaveClub(id);
      setAlert({ type: "info", message: "You have left the club." });
      setClub((prev) => ({ ...prev, is_member: false }));
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.detail || "Action failed." });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
          <button
            onClick={() => navigate(-1)}
            className="text-brand-600 text-sm font-medium hover:underline mb-4 inline-block"
          >
            ← Back to Clubs
          </button>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : error ? (
            <Alert type="error" message={error} />
          ) : (
            <>
              {alert.message && (
                <div className="mb-4">
                  <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />
                </div>
              )}
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-xl font-bold text-gray-900">{club.name}</h1>
                  <Badge variant="default">{club.category || "Club"}</Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{club.description}</p>

                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-6">
                  <div><span className="font-medium">👥 Members:</span> {club.members_count ?? "—"}</div>
                  <div><span className="font-medium">🧑‍💼 Lead:</span> {club.lead || "—"}</div>
                  <div><span className="font-medium">📧 Contact:</span> {club.email || "—"}</div>
                </div>

                <div className="flex gap-3">
                  {club.is_member ? (
                    <Button variant="danger" loading={actionLoading} onClick={handleLeave}>
                      Leave Club
                    </Button>
                  ) : (
                    <Button loading={actionLoading} onClick={handleJoin}>
                      Join Club
                    </Button>
                  )}
                </div>
              </Card>

              {/* Club Events */}
              {club.events && club.events.length > 0 && (
                <div className="mt-6">
                  <Card title="Upcoming Club Events">
                    <ul className="divide-y divide-gray-100">
                      {club.events.map((ev) => (
                        <li key={ev.id} className="py-3 text-sm text-gray-700">
                          <span className="font-medium">{ev.title}</span>
                          <span className="text-gray-400 ml-2">{ev.date}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ClubDetail;
