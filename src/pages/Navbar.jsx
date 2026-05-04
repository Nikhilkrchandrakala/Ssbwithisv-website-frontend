import React, { useState } from "react";
import styles from "../style/Navbar.module.css";
import { IoMenu } from "react-icons/io5";

import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
// import VisitorCounter from "../components/VisitorCounter";

function Navbar({ video, subtitle, title, title1, subtitleTwo, banner, text }) {


    const [open, setOpen] = useState(false);
    const navigate = useNavigate()

    return (
        <div className={styles.pageWrapper}>

            {/* 🔥 BACKGROUND VIDEO */}
            <video
                className={styles.bgVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                fetchpriority="high"
            >
                <source src={video?.src} />
            </video>




            {/* CONTENT ABOVE VIDEO */}
            <div className={styles.pageWrapperMain}>

                <section className={styles.heroSection}>
                    <div className={styles.topBar}>
                        <img
                            src="/assets/logo/ISV.webp"
                            alt="Logo"
                            className={styles.logo}
                            onClick={() => navigate('/')}
                        />
                        <IoMenu
                            className={styles.menuIcon}
                            onClick={() => setOpen(true)}
                        />
                    </div>

                    <header className={styles.header}>
                        <div className={styles.subtitle}>
                            {subtitle}
                        </div>

                        {banner && <div style={{ display: 'flex', justifyContent: 'center' }}>

                            <img src={banner} alt="banner" style={{width:'250px'}} />
                        </div>}

                        <h1 className={styles.title}>
                            <span className={styles.military}>{title}</span>{" "}
                            <span className={styles.leadership}>{title1}</span>
                        </h1>

                        <div className={styles.subtitleTwo}>
                            {subtitleTwo}
                        </div>

                        {text && (
                            <div  className={styles.text}>
                                {text}
                            </div>
                        )}
                    </header>
                </section>

                <Sidebar open={open} onClose={() => setOpen(false)} />
            </div>

        </div>
    );
}


export default Navbar;
