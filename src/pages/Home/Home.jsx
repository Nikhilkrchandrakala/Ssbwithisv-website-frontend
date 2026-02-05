import React, { lazy, Suspense } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import CircleBox from "./CircleBox";
import { Helmet } from "react-helmet-async";

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
            <Helmet>
                <title>
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    Best online SSB Coaching in India with over 50% recommendation rate
                </title>

                <meta
                    name="description"
                    content="India’s trusted SSB coaching institute led by ex-SSB assessors. Complete SSB preparation for Army, Navy & Air Force aspirants."
                />
            </Helmet>
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
