import api from "./api";

// Get all clubs
export const getClubs = () => api.get("/clubs/");

// Get a single club by ID
export const getClub = (id) => api.get(`/clubs/${id}/`);

// Join a club
export const joinClub = (id) => api.post(`/clubs/${id}/join/`);

// Leave a club
export const leaveClub = (id) => api.post(`/clubs/${id}/leave/`);
