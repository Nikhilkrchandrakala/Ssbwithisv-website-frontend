import { NavLink, useNavigate } from "react-router-dom";
import styles from "../style/Sidebar.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomButton from "./CustomButton";
import { useUserProfileQuery } from "../redux/api";
import ContactUs from "./ContactUs";
import { BiX, BiLogOut } from "react-icons/bi";

const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();


    const [openContact, setOpenContact] = useState(false);



    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const { data: blogs, isLoading, error, isError } = useUserProfileQuery(undefined, { skip: !token });





    const handleLogout = () => {
        // 🔹 LocalStorage clear
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        sessionStorage.removeItem("userData");
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

    useEffect(() => {
        if (isError && (error?.status === 401 || error?.status === 403)) {
            handleLogout();
        }
    }, [isError, error]);







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


                    {/* Header Row */}
                    <div className={styles.sidebarHeader}>
                        <div className={styles.topRow} style={{ justifyContent: "flex-end" }}>
                            <button className={styles.closeBtn} onClick={onClose} title="Close Menu">
                                <BiX />
                            </button>
                        </div>

                        {token && isLoading ? (
                            <div className={styles.welcomeCard}>
                                <div className={styles.welcomeInfo}>
                                    <span className={styles.welcomeTitle}>Welcome</span>
                                    <span className={styles.welcomeSubtitle}>Checking session...</span>
                                </div>
                            </div>
                        ) : blogs?.user?.name ? (
                            <div className={styles.profileCard}>
                                <div className={styles.avatar}>
                                    {blogs.user.profileImage ? (
                                        <img
                                            src={blogs.user.profileImage}
                                            alt={blogs.user.name}
                                            className={styles.avatarImg}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <span
                                        className={styles.avatarInitials}
                                        style={{ display: blogs.user.profileImage ? 'none' : 'flex' }}
                                    >
                                        {getInitials(blogs.user.name)}
                                    </span>
                                </div>
                                <div className={styles.profileInfo}>
                                    <span className={styles.userName}>{blogs.user.name}</span>
                                    <span className={styles.userSubtitle}>{blogs.user.email || "SSB Aspirant"}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className={styles.logoutBtn}
                                    title="Log Out"
                                >
                                    <BiLogOut />
                                </button>
                            </div>
                        ) : (
                            <div className={styles.welcomeCard}>
                                <div className={styles.welcomeInfo}>
                                    <span className={styles.welcomeTitle}>Welcome</span>
                                    <span className={styles.welcomeSubtitle}>Sign in to access your profile</span>
                                </div>
                                <button
                                    onClick={() => navigate('/SignIn')}
                                    className={styles.signInBtn}
                                >
                                    Sign In
                                </button>
                            </div>
                        )}

                        <div className={styles.topLine}>
                            <span className={styles.line}></span>
                            <span className={`${styles.dot} ${styles.dotLeftToRight}`}></span>
                        </div>
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
                            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}
                        >
                            <span>Contact Us</span>
                            <span style={{ fontSize: "11px", color: "#8a8978", textTransform: "none", fontWeight: "normal", lineHeight: "1.3" }}>
                                [For business enquiries only, not for SSB course queries]
                            </span>
                        </NavLink>

                        {/* Dialog */}
                        <ContactUs open={openContact} setOpen={setOpenContact} />








                    </nav>
                    <div className={styles.sidebarFooter}>
                        <div className={styles.bottomLine}>
                            <span className={`${styles.dot} ${styles.dotRightToLeft}`}></span>
                            <span className={styles.line}></span>
                        </div>

                        <div className={styles.contact}>
                            {/* WhatsApp */}
                            <a
                                href={`https://wa.me/917483617249`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.contactCard}
                            >
                                <div className={styles.contactIconWrapper} style={{ color: "#4CAF50" }}>
                                    <i className="fa fa-whatsapp"></i>
                                </div>
                                <div className={styles.contactTextWrapper}>
                                    <span className={styles.contactTitle}>Whatsapp only</span>
                                    <span className={styles.contactNumber}>+91 7483617249</span>
                                </div>
                            </a>

                            {/* Phone Call */}
                            <a
                                href={`tel:+918420422821`}
                                className={styles.contactCard}
                            >
                                <div className={styles.contactIconWrapper} style={{ color: "#d2a100" }}>
                                    <i className="fa fa-phone"></i>
                                </div>
                                <div className={styles.contactTextWrapper}>
                                    <span className={styles.contactTitle}>Call only</span>
                                    <span className={styles.contactNumber}>+91 8420422821, +91 9024667319</span>
                                </div>
                            </a>
                        </div>
                    </div>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;
