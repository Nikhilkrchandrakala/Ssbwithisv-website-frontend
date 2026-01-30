import React, { lazy, Suspense } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import CircleBox from "./CircleBox";

const OurMentor = lazy(() => import("./OurMentor"));
const Philosophy = lazy(() => import("./Philosophy"));
const OurCourses = lazy(() => import("./OurCourses"));
const UniquePedagogy = lazy(() => import("./UniquePedagogy"));
const Resources = lazy(() => import("./Resources"));
const RogerThat = lazy(() => import("./RogerThat"));
const AllYouNeed = lazy(() => import("./AllYouNeed"));
const From = lazy(() => import("../From"));

function Home() {
    return (
        <>
            <Navbar />
            <CircleBox />

            <Suspense fallback={<div>Loading...</div>}>
                <OurMentor />
                <Philosophy />
                <OurCourses />
                <UniquePedagogy />
                <Resources />
                <RogerThat />
                <AllYouNeed />
                <From />
            </Suspense>

            <Footer />
        </>
    );
}

export default Home;
