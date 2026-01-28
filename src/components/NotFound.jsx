import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you are looking for does not exist or the URL is incorrect.</p>

            {/* <button style={styles.button} onClick={() => navigate(-1)}>
                Go Back
            </button> */}

            <CustomButton text='Go Back' onClick={() => navigate("/")} />

            {/* Or Go Home */}
            {/* <button style={styles.button} onClick={() => navigate("/")}>
        Go Home
      </button> */}
        </div>
    );
}

export default NotFound;

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },
    button: {
        marginTop: "20px",
        padding: "10px 20px",
        cursor: "pointer"

    }
};
