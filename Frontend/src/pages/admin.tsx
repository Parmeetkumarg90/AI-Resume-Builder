import { Outlet, useNavigate } from "react-router";
import SideBar from "../components/SideBar/sidebar";
import { useEffect } from "react";
import sessionStore from "../store";
import { checkAuth } from "../utils/authCheck";

export function Admin() {
    const navigate = useNavigate();
    useEffect(() => {
        const sessionData = sessionStore.getState().session;
        if (!checkAuth() || !sessionData) { navigate('/login'); }
        if (sessionData?.Credential?.role != 'admin') {
            navigate('/');
        }
    });

    return (
        <SideBar>
            <Outlet />
        </SideBar>
    );
}