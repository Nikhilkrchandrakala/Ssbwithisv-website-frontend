import { NavLink, useNavigate } from "react-router-dom";
import styles from "../style/Sidebar.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomButton from "./CustomButton";
import { useUserProfileQuery, useGetContactSettingsQuery } from "../redux/api";
import ContactUs from "./ContactUs";

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();


    const [openContact, setOpenContact] = useState(false);



    const { data: blogs } = useUserProfileQuery()
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




    const handleLogout = () => {
        // 🔹 LocalStorage clear
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("lastLoginType");
        // localStorage.removeItem("rememberMe");
        // localStorage.removeItem("cookieConsent");
        navigate('/')
        window.location.reload(); // 🔥 page refresh

        // 🔹 SessionStorage (if used)
        sessionStorage.clear();

        // 🔹 Clear cookies (important)
        document.cookie.split(";").forEach((cookie) => {
            document.cookie = cookie
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });

        // 🔹 Optional: close menu / sidebar
        if (onClose) onClose();
    };







    return (
        <>
            {/* Overlay */}
            <div
                // style={{ zIndex: '999999999999' }}
                className={`${styles.overlay} ${open ? styles.show : ""}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>

                <div className={styles.sidebarContainer}>


                    {/* Close */}
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>



                    {blogs?.user?.name ? (
                        <div className="mb-4 d-flex justify-content-between align-items-center" style={{ color: "#c6c5af", fontSize: "16px", fontWeight: "bold", width: "100%", paddingRight: "30px" }}>
                            <span>{blogs?.user?.name}</span>
                            <button
                                onClick={handleLogout}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#c6c5af",
                                    cursor: "pointer",
                                    fontSize: "21px",
                                    padding: "0 5px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                title="Log Out"
                            >
                                <i className="fa fa-sign-out"></i>
                            </button>
                        </div>
                    ) :

                        (<div className="mb-4 d-flex justify-content-between">
                            {/* <button style={{ color: 'var( --white)' }} onClick={() => navigate('/SignUp')} >Sign Up</button> */}
                            <button style={{ color: 'var( --white)' }} onClick={() => navigate('/SignIn')}>Sign In</button>
                        </div>)
                    }

                    <div className={styles.topLine}>
                        <span className={styles.line}></span>
                        <span className={`${styles.dot} ${styles.dotLeftToRight}`}></span>
                    </div>



                    {/* Menu */}
                    <nav className={styles.menu}>
                        {blogs?.user?.name && <NavLink
                            to="/ProfileDashboard"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            My Profile
                        </NavLink>}
                        <NavLink
                            to="/"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            Home
                        </NavLink>


                        <NavLink
                            to="/Courses"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            Courses
                        </NavLink>

                        <NavLink
                            to="/ssbVirtualTrainingXperience"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            VTX™
                        </NavLink>

                        <NavLink
                            to="/magazine"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            Roger That - Our monthly magazine
                        </NavLink>

                        <NavLink
                            to="/HalfOfFame"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            Hall of fame
                        </NavLink>


                        <NavLink
                            to="/aboutSSB"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            About SSB
                        </NavLink>


                        <NavLink
                            to="/aboutssbwithisv"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            About us
                        </NavLink>

                        <NavLink
                            to="/Gallery"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            Gallery
                        </NavLink>


                        <NavLink
                            to="/blogs"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            Blogs
                        </NavLink>








                        <NavLink
                            to="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setOpenContact(true);
                                if (onClose) onClose();
                            }}
                            className={({ isActive }) =>
                                isActive ? "text-blue-600 font-semibold" : ""
                            }
                        >
                            Contact Us
                        </NavLink>

                        {/* Dialog */}
                        <ContactUs open={openContact} setOpen={setOpenContact} />








                    </nav>


                    <div className={styles.bottomLine}>
                        <span className={`${styles.dot} ${styles.dotRightToLeft}`}></span>
                        <span className={styles.line}></span>
                    </div>



                    <div className={styles.contact}>
                        {/* WhatsApp */}
                        <a
                            href={`https://wa.me/91${whatsappNumRaw}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactItem}
                        >
                            <i className="fa fa-whatsapp"></i> +91 {whatsappNumFormatted}
                        </a>

                        {/* Phone Call */}
                        <a
                            href={`tel:+91${callNumRaw}`}
                            className={styles.contactItem}
                        >
                            <i className="fa fa-phone"></i> +91 {callNumFormatted}
                        </a>
                    </div>

                    {/* <div className={styles.footerMarginBottom}>
                       
                    </div> */}

                </div>
            </aside>
        </>
    );
};

export default Sidebar;
