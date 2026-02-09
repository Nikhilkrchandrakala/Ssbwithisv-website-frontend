import { useEffect } from "react";
import "../style/LoadingScreen.css";
import axios from "axios";
// import logo from "../assets/logo.png"; // 👉 apna logo yahan daalo

export default function LoadingScreen() {

    // useEffect(()


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("authToken");

                if (!token) {
                    // token hi nahi hai
                    localStorage.removeItem("authToken");
                    // window.location.href = "/login";
                    return;
                }

                const res = await axios.get(
                    "https://api.ssbwithisv.in/api/user/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // agar backend ne bola token invalid
                if (res.data.status !== "ok") {
                    localStorage.removeItem("authToken");
                    // window.location.href = "/login";
                }

                console.log("User authenticated", res.data);

            } catch (err) {
                console.log("Token expired or invalid", err);

                // 👇 yahin token remove karo
                localStorage.removeItem("authToken");

                // 👇 login page pe bhejo
                // window.location.href = "/login";
            }
        };

        fetchProfile();
    }, []);


    return (

        <div className="loading-root">
            <div className="loading-content">
                <img
                    src={'/assets/logo/ISV.webp'}
                    alt="SSB with ISV Logo"
                    className="loading-logo"
                />

                <h1 className="loading-text">SSB with ISV</h1>
                <p className="loading-pre">India’s first online SSB mentoring platform with a virtual GTO ground</p>


                {/* Opening PAGE Text below LOGO:-
                First line text - SSB with ISV (Bold faced)
                second line text - */}
            </div>
        </div>
    );
}
