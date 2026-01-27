import React, { useState } from "react";
import styles from "../style/Navbar.module.css";
import { IoMenu } from "react-icons/io5";

import Sidebar from "../components/Sidebar";

function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.pageWrapper}>

            {/* 🔥 BACKGROUND VIDEO */}
            <video
                className={styles.bgVideo}
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="/assets/video/BannerVideo.mp4" type="video/mp4" />
            </video>

            {/* CONTENT ABOVE VIDEO */}
            <div className={styles.pageWrapperMain}>

                <section className={styles.heroSection}>
                    <div className={styles.topBar}>
                        <img
                            src="/assets/logo/ISV.png"
                            alt="Logo"
                            className={styles.logo}
                        />
                        <IoMenu
                            className={styles.menuIcon}
                            onClick={() => setOpen(true)}
                        />
                    </div>

                    <header className={styles.header}>
                        <div className={styles.subtitle}>
                            CRAFTING THE FUTURE OF
                        </div>

                        <h1 className={styles.title}>
                            <span className={styles.military}>Indian Military</span>{" "}
                            <span className={styles.leadership}>Leadership</span>
                        </h1>

                        <div className={styles.subtitleTwo}>
                            Integrated SSB Virtuosos
                        </div>
                    </header>
                </section>

                <Sidebar open={open} onClose={() => setOpen(false)} />
            </div>
        </div>
    );
}


export default Navbar;
