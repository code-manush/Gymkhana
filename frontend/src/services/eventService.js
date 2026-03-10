import api from "./api";

// Get all events
export const getEvents = () => api.get("/events/");

// Get a single event by ID
export const getEvent = (id) => api.get(`/events/${id}/`);

// Register current user for an event
export const registerForEvent = (id) => api.post(`/events/${id}/register/`);

// Create a new event (admin/organiser)
export const createEvent = (data) => api.post("/events/", data);

// Update an event
export const updateEvent = (id, data) => api.put(`/events/${id}/`, data);

// Delete an event
export const deleteEvent = (id) => api.delete(`/events/${id}/`);
