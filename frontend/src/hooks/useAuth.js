import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook for convenient access to auth context
const useAuth = () => useContext(AuthContext);

export default useAuth;
