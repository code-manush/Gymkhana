import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/layout/PrivateRoute";

// Pages
import Home       from "./pages/Home";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Dashboard  from "./pages/Dashboard";
import Events     from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Clubs      from "./pages/Clubs";
import ClubDetail from "./pages/ClubDetail";
import Profile    from "./pages/Profile";
import NotFound   from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/events"     element={<PrivateRoute><Events /></PrivateRoute>} />
          <Route path="/events/:id" element={<PrivateRoute><EventDetail /></PrivateRoute>} />
          <Route path="/clubs"      element={<PrivateRoute><Clubs /></PrivateRoute>} />
          <Route path="/clubs/:id"  element={<PrivateRoute><ClubDetail /></PrivateRoute>} />
          <Route path="/profile"    element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;