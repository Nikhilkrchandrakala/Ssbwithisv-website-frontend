import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingScreen from "../pages/LoadingScreen";

// Helper to verify JWT expiration clientside
const isTokenExpired = (t) => {
    if (!t) return true;
    try {
        const base64Url = t.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        if (payload.exp && Date.now() >= payload.exp * 1000) {
            return true;
        }
        return false;
    } catch (e) {
        return true;
    }
};

function AuthRoute() {
    const navigate = useNavigate();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

        if (token && !isTokenExpired(token)) {
            navigate("/", { replace: true });
        } else {
            if (token) {
                // Clear stale/expired session keys
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("authToken");
                localStorage.removeItem("userData");
                sessionStorage.removeItem("userData");
            }
            setCheckingAuth(false); // token nahi mila ya expired tha, ab page render hone do
        }
    }, [navigate]);

    // ✅ Jab tak check ho raha hai tab kuch bhi page render na ho
    if (checkingAuth) {
        return (
            <LoadingScreen />
        );
    }

    return <Outlet />;
}

export default AuthRoute;
