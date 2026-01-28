import { NavLink, useNavigate } from "react-router-dom";
import styles from "../style/Sidebar.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomButton from "./CustomButton";

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = localStorage.getItem("authToken"); // 🔑 JWT token

                const res = await axios.get(
                    'https://api.ssbwithisv.in/api/user/profile',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                setBlogs(res.data);

            } catch (err) {
                console.error(err);
                setError('Failed to load blogs');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);


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




    // console.log(blogs?.user?.name)


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

                    {/* Top line */}
                    {/* <div className={styles.topLine}>
                        <span className={styles.dot}></span>
                        <span className={styles.line}></span>
                    </div> */}

                    {blogs?.user?.name ? (<div className="mb-4">
                        Welcome Back {blogs?.user?.name}!
                    </div>) :

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
                            to="/blogs"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            Blogs
                        </NavLink>








                        <NavLink
                            to="/Contactus"
                            onClick={onClose}
                            className={({ isActive }) =>
                                isActive ? styles.active : ""
                            }
                        >
                            Contact us
                        </NavLink>

                        {/* <button
                            onClick={handleLogout}
                            className={styles.logoutBtn}
                        >
                            Log Out
                        </button>} */}

                        {blogs?.user?.name &&
                            <CustomButton text={'Log Out'} onClick={handleLogout} />}



                    </nav>

                    {/* Bottom line */}
                    {/* <div className={styles.bottomLine}>
                        <span className={styles.line}></span>
                        <span className={styles.dot}></span>
                    </div> */}

                    <div className={styles.bottomLine}>
                        <span className={`${styles.dot} ${styles.dotRightToLeft}`}></span>
                        <span className={styles.line}></span>
                    </div>


                    {/* Contact */}
                    {/* <div className={styles.contact}>
                        <div> <i className="fa fa-whatsapp"></i> +91 84204 22821</div>
                        <div> <i className="fa fa-phone"></i> +91 90246 67319</div>
                    </div> */}

                    <div className={styles.contact}>
                        {/* WhatsApp */}
                        <a
                            href="https://wa.me/918420422821"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.contactItem}
                        >
                            <i className="fa fa-whatsapp"></i> +91 84204 22821
                        </a>

                        {/* Phone Call */}
                        <a
                            href="tel:+919024667319"
                            className={styles.contactItem}
                        >
                            <i className="fa fa-phone"></i> +91 90246 67319
                        </a>
                    </div>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;
