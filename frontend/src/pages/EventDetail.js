import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent, registerForEvent } from "../services/eventService";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import Alert from "../components/common/Alert";
import Badge from "../components/common/Badge";
import Modal from "../components/common/Modal";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getEvent(id)
      .then((res) => setEvent(res.data))
      .catch(() => setError("Event not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await registerForEvent(id);
      setAlert({ type: "success", message: "You are registered for this event! 🎉" });
      setModalOpen(false);
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.detail || "Registration failed." });
      setModalOpen(false);
    } finally {
      setRegistering(false);
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
            ← Back to Events
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
                  <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
                  <Badge variant="info">{event.category || "Event"}</Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-6">
                  <div><span className="font-medium">📅 Date:</span> {event.date}</div>
                  <div><span className="font-medium">📍 Location:</span> {event.location || "TBA"}</div>
                  <div><span className="font-medium">🕐 Time:</span> {event.time || "TBA"}</div>
                  <div><span className="font-medium">👥 Capacity:</span> {event.capacity || "Open"}</div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-6">{event.description}</p>

                <Button onClick={() => setModalOpen(true)}>
                  Register for this Event
                </Button>
              </Card>
            </>
          )}

          {/* Confirmation Modal */}
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Confirm Registration">
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to register for <strong>{event?.title}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button loading={registering} onClick={handleRegister}>Confirm</Button>
            </div>
          </Modal>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetail;
