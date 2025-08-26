import sessionStore from "../../store"
import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
    const session = sessionStore((state) => state.session);
    return !session ? <Navigate to="/login" replace /> : <Outlet />;
}

export function AdminRoute() {
    const session = sessionStore((state) => state.session);
    if (!session) {
        return <Navigate to="/login" replace />;
    }
    else if (session?.Credential?.role != 'admin') {
        return <Navigate to="/user" replace />;
    }
    return <Outlet />;
}

export function UserRoute() {
    const session = sessionStore((state) => state.session);
    if (!session) {
        return <Navigate to="/login" replace />;
    }
    else if (session?.Credential?.role != 'user') {
        return <Navigate to="/admin/users" replace />;
    }
    return <Outlet />;
}

export function IsStagesCompleted() {
    const session = sessionStore((state) => state.session);
    if (!session) {
        return <Navigate to="/login" replace />;
    }
    else if ((session.Credential.role === 'user' && session.Credential.dbStage >= 8) || (session.Credential.role === 'admin')) {
        return <Outlet />;
    }
    return <Navigate to="/" />;
}

export function IsProfileApproved() {
    const session = sessionStore((state) => state.session);
    if (!session) {
        return <Navigate to="/login" replace />;
    }
    else if (session.Credential.dbStage === 9 || session.Credential.role === 'admin') {
        return <Outlet />;
    }
    return <Navigate to="/" />;
}