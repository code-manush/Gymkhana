import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import EventCard from "../components/common/EventCard";

/* ─── Dummy event data ─────────────────────────────────────────────────────── */
const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Inter-College Debate Championship",
    date: "March 18, 2026",
    location: "Main Auditorium",
    description:
      "Annual inter-college debate competition covering social, political, and technological topics. Open to all departments.",
  },
  {
    id: 2,
    title: "Cultural Fest – Rhythms 2026",
    date: "March 22, 2026",
    location: "College Grounds",
    description:
      "A vibrant cultural evening featuring dance, music, drama, and art exhibitions by talented students.",
  },
  {
    id: 3,
    title: "Hackathon – CodeSprint",
    date: "March 28, 2026",
    location: "Computer Science Block",
    description:
      "24-hour hackathon for students to build innovative solutions to real-world problems. Prizes worth ₹50,000.",
  },
];

/* ─── Feature data ─────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "🗓️",
    title: "Event Management",
    desc: "Create and manage gymkhana events easily with a streamlined admin panel.",
  },
  {
    icon: "📝",
    title: "Online Registration",
    desc: "Students can discover and register for events quickly from any device.",
  },
  {
    icon: "🏆",
    title: "Result Publishing",
    desc: "View event results and leaderboards instantly after events conclude.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* ── 1. Hero Section ──────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-brand-800 via-brand-700 to-indigo-700 text-white overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 py-24 sm:py-32 text-center">
          <span className="inline-block bg-white/10 text-brand-100 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Welcome to the Portal
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            College Gymkhana
            <br />
            <span className="text-brand-200">Management System</span>
          </h1>

          <p className="text-lg sm:text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            Manage events, registrations, and results efficiently — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-semibold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors shadow-lg"
            >
              🗓️ View Events
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/60 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Features Section ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Use Gymkhana Portal?</h2>
            <p className="text-gray-500 mt-3 text-sm max-w-xl mx-auto">
              Everything you need to participate in campus life — built for students, by students.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4 p-4 bg-brand-50 rounded-2xl">{icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Upcoming Events Preview ───────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Don't miss out — register before spots fill up.
              </p>
            </div>
            <Link
              to="/events"
              className="text-brand-600 font-semibold text-sm hover:underline shrink-0"
            >
              View all events →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Call To Action ────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Participate in Exciting College Events
          </h2>
          <p className="text-brand-100 text-base mb-8">
            Create your account today and never miss a campus event again.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-xl text-base hover:bg-brand-50 transition-colors shadow-lg"
          >
            🚀 Register Now
          </Link>
        </div>
      </section>

      {/* ── 5. Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-brand-900 text-brand-200 pt-12 pb-6 px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="text-white text-lg font-bold mb-2">🎓 Gymkhana Portal</p>
            <p className="text-sm text-brand-300 leading-relaxed">
              College Gymkhana Management System — bringing students and activities together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </p>
            <ul className="space-y-2">
              {[
                { to: "/",         label: "Home" },
                { to: "/events",   label: "Events" },
                { to: "/login",    label: "Login" },
                { to: "/register", label: "Register" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-brand-300 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Contact
            </p>
            <p className="text-sm text-brand-300">College Gymkhana Management System</p>
            <p className="text-sm text-brand-300 mt-1">gymkhana@college.edu</p>
            <p className="text-sm text-brand-300 mt-1">+91 98765 43210</p>
          </div>
        </div>

        <div className="border-t border-brand-800 pt-6 text-center text-xs text-brand-400">
          © {new Date().getFullYear()} College Gymkhana Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
