import { useEffect } from "react";
import "../style/LoadingScreen.css";
import axios from "axios";
import { useUserProfileQuery } from "../redux/api";
// import logo from "../assets/logo.png"; // 👉 apna logo yahan daalo

export default function LoadingScreen() {

    // useEffect(()

    // const { data } = useUserProfileQuery()

    const {
        data,
        error,
        isLoading,
        isSuccess,
        isError
    } = useUserProfileQuery();

    console.log(data)


    useEffect(() => {
        if (isSuccess && data?.status === "ok") {
            console.log("User authenticated", data.user);
        }

        if (isError) {
            console.log("Token expired or invalid");
            localStorage.removeItem("authToken");
            // window.location.href = "/login";
        }

    }, [isSuccess, isError, data]);


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
