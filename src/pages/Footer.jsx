import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style/Footer.module.css";
import VisitorCounter from "../components/VisitorCounter";
import PerCourses from "../pages/PerCourses";
import CustomButton from "../components/CustomButton";
import { useGetContactSettingsQuery } from "../redux/api";

function Footer() {
    const navigate = useNavigate();
    const [hideJoinBtn, setHideJoinBtn] = useState(!localStorage.getItem("cookieConsent"));
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const footerRef = useRef(null);

    useEffect(() => {
        const handleConsentChange = () => {
            setHideJoinBtn(!localStorage.getItem("cookieConsent"));
        };
        window.addEventListener("cookieConsentChanged", handleConsentChange);
        return () => window.removeEventListener("cookieConsentChanged", handleConsentChange);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFooterVisible(entry.isIntersecting);
            },
            { threshold: 0.05 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    const { data: contactSettings } = useGetContactSettingsQuery();

    const whatsappNumRaw = contactSettings?.whatsappNumber || "8420422821";
    const callNumRaw = contactSettings?.callNumber || "7483617249";

    const formatPhoneNumber = (num) => {
        if (num && num.length === 10) {
            return `${num.substring(0, 5)} ${num.substring(5)}`;
        }
        return num;
    };

    const whatsappNumFormatted = formatPhoneNumber(whatsappNumRaw);
    const callNumFormatted = formatPhoneNumber(callNumRaw);

    const openZohoChat = () => {
        if (window.$zoho && window.$zoho.salesiq) {
            window.$zoho.salesiq.floatwindow.visible("show");
        } else {
            console.warn("Zoho SalesIQ is not loaded yet.");
        }
    };

    const date = new Date();
    const year = date.getFullYear();

    return (
        <footer className={styles.footer} ref={footerRef}>
            <div className={styles.container}>
                {/* LOGO SECTION */}
                <div className={styles.logoBox}>
                    <img
                        src="/assets/logo/ISV.webp"
                        alt="Joint Services Academy"
                        className={styles.logo}
                    />
                    {/* SOCIAL MEDIA ICONS - Added here under logo */}
                    <div className={styles.socials}>
                        <a
                            href="https://www.youtube.com/@ssbwithisv"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                        >
                            <i className="fa fa-youtube-play"></i>
                        </a>

                        <a
                            href="https://www.linkedin.com/company/ssbwithisv/posts"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <i className="fa fa-linkedin-square"></i>
                        </a>

                        <a
                            href="https://www.instagram.com/ssbwithisv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <i className="fa fa-instagram"></i>
                        </a>

                        <a
                            href="https://www.facebook.com/ssbwithisv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <i className="fa fa-facebook"></i>
                        </a>
                    </div>
                </div>

                {/* Modern Floating Action Docks */}
                {!hideJoinBtn && !isFooterVisible && (
                    <div className="modern-floating-dock-left">
                        <button className="dock-join-btn" onClick={() => navigate('/Batches')}>
                            <span>Join SSB Batch</span>
                        </button>
                    </div>
                )}

                {!hideJoinBtn && !isFooterVisible && (
                    <div className="modern-floating-dock-right">
                        <div className="dock-actions">
                            <button
                                onClick={openZohoChat}
                                className="dock-icon-btn chat"
                                title="Chat with us"
                                aria-label="Chat with us"
                            >
                                <i className="fa fa-comments"></i>
                            </button>
                            <a
                                href={`https://wa.me/91${whatsappNumRaw}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dock-icon-btn whatsapp"
                                aria-label="Chat on WhatsApp"
                            >
                                <i className="fa fa-whatsapp"></i>
                            </a>
                        </div>
                    </div>
                )}



                {/* USEFUL LINKS WITH SOCIAL MEDIA */}
                <div className={styles.links}>
                    <h3 className="fs- fw-bold">Useful Links</h3>
                    <ul>
                        <li onClick={() => navigate("/")}>Home</li>
                        <li onClick={() => navigate('/aboutSSB')}>What is SSB?</li>
                        {/* <li onClick={() => window.open('/magazine')}>Podcast</li> */}

                        <li onClick={() => navigate('/ContactUS')}>Enquire with us</li>
                        <li onClick={() => navigate('/PrivacyPolicy')}>Privacy policy</li>
                    </ul>

                </div>

                {/* OUR SERVICES */}


                <div className={styles.links}>
                    <h3>Our Services</h3>
                    <ul>
                        <li onClick={() => navigate("/Courses")}>Courses</li>
                        <li onClick={() => navigate("/Magazine")}>Magazine</li>
                        <li onClick={() => navigate("/blogs")}>Blogs</li>
                    </ul>
                </div>

                {/* CONTACT US WITH COPYRIGHT */}
                <div className={styles.contact}>
                    <div>
                        <h3>Contact Us</h3>

                        <div className={styles.contactRow}>
                            <a
                                href={`https://wa.me/91${whatsappNumRaw}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.contactItem}
                            >
                                <p>
                                    <i className="fa fa-whatsapp"></i> +91 {whatsappNumFormatted}
                                </p>
                            </a>

                            <a
                                href={`tel:+91${callNumRaw}`}
                                className={styles.contactItem}
                            >
                                <p>
                                    <i className="fa fa-phone"></i> +91 {callNumFormatted}
                                </p>
                            </a>

                            <p>
                                <i className="fa fa-envelope"></i> info@ssbwithisv.in
                            </p>
                            {/* <p>
                                <VisitorCounter />
                            </p> */}
                        </div>

                        {/* <div style={{ paddingTop: '5px' }} className={styles.contactRow}>

                        </div> */}
                    </div>

                    {/* COPYRIGHT - Added here in same flex container */}

                </div>
            </div>
            <div className={styles.copyrightBox}>
                <span className={styles.copy}>
                    © Copyright 2021 – {year} SSB with ISV, CS Joint Services Academy Pvt. Ltd.
                </span>
            </div>
            <div className={styles.watermarkText}>
                SSB with ISV
            </div>
        </footer>
    );
}

export default Footer;