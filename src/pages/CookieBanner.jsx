import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/CookieBanner.css";

export default function CookieBanner() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setShow(true);
        }
    }, []);

    const acceptAll = () => {
        localStorage.setItem(
            "cookieConsent",
            JSON.stringify({
                essential: true,
                analytics: true,
                marketing: true,
                timestamp: new Date().toISOString(),
            })
        );
        setShow(false);
        window.dispatchEvent(new Event("cookieConsentChanged"));
    };

    const rejectNonEssential = () => {
        localStorage.setItem(
            "cookieConsent",
            JSON.stringify({
                essential: true,
                analytics: false,
                marketing: false,
                timestamp: new Date().toISOString(),
            })
        );
        setShow(false);
        window.dispatchEvent(new Event("cookieConsentChanged"));
    };

    if (!show) return null;

    return (
        <div className="cookie-banner">
            <p className="cookie-text">
                We use cookies and similar technologies to improve website
                functionality, analyse traffic, and personalise content. By
                clicking “Accept”, you consent to the use of cookies as described
                in our{" "}
                <span
                    className="cookie-link"
                    onClick={() => navigate("/PrivacyPolicy")}
                >
                    Privacy Policy
                </span>.
            </p>

            <div className="cookie-actions">
                <button className="btn accept" onClick={acceptAll}>
                    Accept All
                </button>
            </div>
        </div>
    );
}
