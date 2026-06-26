import { NavLink, useNavigate } from "react-router-dom";
import styles from "../style/Sidebar.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomButton from "./CustomButton";
import { useUserProfileQuery, useGetContactSettingsQuery } from "../redux/api";
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
                        <div className={styles.topRow}>
                            <span className={styles.brandText}>Navigation</span>
                            <button className={styles.closeBtn} onClick={onClose} title="Close Menu">
                                <BiX />
                            </button>
                        </div>

                        {blogs?.user?.name ? (
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
                        >
                            Contact Us
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
                    </div>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;
