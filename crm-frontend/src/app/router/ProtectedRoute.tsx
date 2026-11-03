import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute() {

    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null;
    }

    if (!authContext.token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}