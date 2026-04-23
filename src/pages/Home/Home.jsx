import React, { lazy, Suspense, useEffect } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import CircleBox from "./CircleBox";
import { Helmet } from "react-helmet-async";
import Faq from "../../components/Faq";
import { faqDataHome } from "../../util/data";
import { useParams } from "react-router-dom";

const OurMentor = lazy(() => import("./OurMentor"));
const Philosophy = lazy(() => import("./Philosophy"));
const OurCourses = lazy(() => import("./OurCourses"));
const UniquePedagogy = lazy(() => import("./UniquePedagogy"));
const Resources = lazy(() => import("./Resources"));
const RogerThat = lazy(() => import("./RogerThat"));
const AllYouNeed = lazy(() => import("./AllYouNeed"));
const From = lazy(() => import("../From"));

function Home() {





    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get("ref");

        if (ref) {
            localStorage.setItem("referralCode", ref);
        }
    }, []);


    const navbarData = {
        video: {
            src: "/assets/video/BannerVideo.mp4",
            type: "video/mp4"
        },
        logo: "/assets/logo/ISV.webp",

        subtitle: "CRAFTING THE FUTURE OF",

        title: "Indian Military",
        title1: "Leadership",

        subtitleTwo: "Integrated SSB Virtuosos"

    };


    // {}
    return (
        <>
            {/* import { Helmet } from "react-helmet"; */}

            <Helmet>
                <title>
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    Best SSB Coaching in India | Online SSB Training by Ex-GTO | SSB with ISV
                </title>

                <meta
                    name="description"
                    content="Prepare for the Services Selection Board (SSB) with India’s leading SSB coaching institute. Learn how to crack SSB interviews, psychology tests, GTO tasks and leadership assessments through expert mentoring by DIPR certified former SSB assessors"
                />

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "WebSite",
                                "@id": "https://ssbwithisv.in/#website",
                                "url": "https://ssbwithisv.in/",
                                "name": "SSB with ISV",
                                "description":
                                    "SSB with ISV provides expert Services Selection Board (SSB) coaching, mentoring and interview preparation for Indian Army, Navy and Air Force aspirants.",
                                "publisher": {
                                    "@id": "https://ssbwithisv.in/#organization"
                                },
                                "potentialAction": {
                                    "@type": "SearchAction",
                                    "target": "https://ssbwithisv.in/?s={search_term_string}",
                                    "query-input": "required name=search_term_string"
                                }
                            },
                            {
                                "@type": "Organization",
                                "@id": "https://ssbwithisv.in/#organization",
                                "name": "SSB with ISV",
                                "url": "https://ssbwithisv.in/",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://ssbwithisv.in/assets/logo/ISV.webp"
                                },
                                "sameAs": [
                                    "https://www.instagram.com/ssbwithisv/",
                                    "https://www.facebook.com/ssbwithisv/",
                                    "https://www.linkedin.com/company/ssbwithisv"
                                ],
                                "contactPoint": [
                                    {
                                        "@type": "ContactPoint",
                                        "telephone": "+91-8420422821",
                                        "contactType": "customer support",
                                        "areaServed": "IN",
                                        "availableLanguage": ["English", "Hindi"]
                                    }
                                ]
                            },
                            {
                                "@type": "EducationalOrganization",
                                "@id": "https://ssbwithisv.in/#educationalorganization",
                                "name": "SSB with ISV",
                                "url": "https://ssbwithisv.in/",
                                "description":
                                    "A professional SSB coaching institute offering structured courses, mock interviews and mentoring by experienced assessors.",
                                "parentOrganization": {
                                    "@id": "https://ssbwithisv.in/#organization"
                                }
                            }
                        ]
                    })}
                </script>

                <link rel="canonical" href="https://ssbwithisv.in/" />
            </Helmet>

            <Navbar video={navbarData.video}
                subtitle={navbarData.subtitle}
                title={navbarData.title}
                title1={navbarData.title1}
                subtitleTwo={navbarData.subtitleTwo}
            />
            <CircleBox />

            <Suspense fallback={<div>Loading...</div>}>
                <OurMentor />
                <Philosophy />
                <OurCourses />
                <UniquePedagogy />
                <Resources />
                <RogerThat />
                <AllYouNeed />
                <Faq data={faqDataHome} />
                <From />
            </Suspense>

            <Footer />
        </>
    );
}

export default Home;
