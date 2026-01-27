import React from "react";
import styles from "../../style/Home.module.css";
import OurMentor from "./OurMentor";
import Philosophy from "./Philosophy";
import OurCourses from "./OurCourses";
import UniquePedagogy from "./UniquePedagogy";
import Resources from "./Resources";
import RogerThat from "./RogerThat";
import AllYouNeed from "./AllYouNeed";
import Footer from "../Footer";
import From from "../From";
import Navbar from "../Navbar";
import CircleBox from "./CircleBox";

function Home() {
    return (
        <>
            <Navbar />
            <CircleBox />
            <OurMentor />
            <Philosophy />
            <OurCourses />
            <UniquePedagogy />
            {/* Resources for SSB preparation */}
            <Resources />
            <RogerThat />
            <AllYouNeed />
            <From />
            <Footer />
        </>
    );
}

export default Home;
