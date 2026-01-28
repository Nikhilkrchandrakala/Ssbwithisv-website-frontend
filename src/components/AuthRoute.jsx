import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingScreen from "../pages/LoadingScreen";

function AuthRoute() {
    const navigate = useNavigate();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (token) {
            navigate("/", { replace: true });
        } else {
            setCheckingAuth(false); // token nahi mila, ab page render hone do
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
