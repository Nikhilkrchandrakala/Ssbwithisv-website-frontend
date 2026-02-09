import React, { useState } from "react";
import CustomHeader from "../components/CustomHeader";
import From from "./From";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";

function Courses() {
    const [activeTab, setActiveTab] = useState("c1");

    const data = {
        heading: "Our Courses",
        text: `Our courses offer structured SSB preparation within a supportive mentoring ecosystem.
        With direct guidance from ex-SSB DIPR certified assessors and a strong emphasis on the psychology of assessment,
        students learn to align their thinking, behaviour, and actions with the expectations of the
        Services Selection Board.`,
        banner: '/assets/website/courses_banner.webp',

    };

    const tabs = [
        { id: "c1", label: "10 days Services Selection Board Hackathon" },
        { id: "c2", label: "Introduction to SSB & PPDT, Stage 1 Process" },
        { id: "c3", label: "Psychology Test Preparation Program" },
        { id: "c4", label: "Interview Theory Course and Mock Interview" },
        { id: "c5", label: "Group Testing Course" },
    ];

    return (
        <>

            {/* import { Helmet } from "react-helmet"; */}

            <Helmet>
                <title>
                    SSB Preparation Courses | Online Structured Training
                </title>

                <meta
                    name="description"
                    content="Explore comprehensive SSB preparation courses covering psychology, GTO tasks, interviews and personality development by experts."
                />

                {/* BREADCRUMB SCHEMA */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://ssbwithisv.in/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Courses",
                                "item": "https://ssbwithisv.in/Courses"
                            }
                        ]
                    })}
                </script>

                <link rel="canonical" href="https://ssbwithisv.in/Courses" />
            </Helmet>


            <CustomHeader heading={data.heading} text={data.text} banner={data.banner} />

            <section className="container sectionspace80">
                <div className="our-courses-section">

                    {/* ================= MOBILE SELECT ================= */}
                    <div className="course-mobile-select d-md-none mb-3">
                        <div className="form-group">



                        </div>
                    </div>

                    <div className="col-12 col-md-4 text-md-end d-md-none">
                        <form>
                            <div className="form-group">

                                <label
                                    htmlFor="courseTabSelect"
                                    className="form-label mb-1"
                                    style={{ color: "var(--theme-white)" }}
                                >
                                    Select Course:-
                                </label>


                                {/* <select
                                    className="form-select thm-select w-100 w-md-auto"
                                    value={selectedTag}
                                    onChange={(e) => setSelectedTag(e.target.value)}
                                >
                                    <option value="all">All Resources</option>
                                    <option value="Magazine">Current Affairs Magazine</option>
                                    <option value="Books">Books</option>
                                    <option value="SSBPrep">SSB Prep Material</option>
                                </select> */}

                                <select
                                    className="form-select thm-select w-100 w-md-auto"

                                    id="courseTabSelect"
                                    value={activeTab}
                                    onChange={(e) => setActiveTab(e.target.value)}
                                // onChange={(e) => setSelectedTag(e.target.value)}

                                >
                                    {tabs.map((tab) => (
                                        <option key={tab.id} value={tab.id}>
                                            {tab.label}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </form>
                    </div>

                    {/* ================= DESKTOP TABS ================= */}
                    <ul className="nav course-nav-tabs d-none d-md-flex">
                        {tabs.map((tab) => (
                            <li className="nav-item" key={tab.id}>
                                <button
                                    className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* ================= TAB CONTENT ================= */}
                    <div className="tab-content mt-4">

                        {activeTab === "c1" && (
                            <div className="course-tab-card">
                                <h2 className="course-tab-card-title">
                                    10 days Services Selection Board Hackathon
                                </h2>
                                {/* <p>INR 11000/- · 18% GST</p> */}
                                <h3 className="course-tab-card-hours">
                                    <strong>Total Sessions:</strong> 10 |{" "}
                                    <strong>Total Learning Hours:</strong> 60
                                </h3>

                                <h3 className="m-0 fs-4 ">Topics Covered:</h3>
                                <ul>

                                    <li>
                                        Introduction to SSB, Complete SSB Procedure, Stage 1 Testing – OIR Test, Picture Perception &
                                        Discussion Test
                                    </li>
                                    <li>
                                        PIQ Form and Interview Procedure
                                    </li>
                                    <li>
                                        Mock Interview by a DIPR certified Interviewing Officer
                                    </li>
                                    <li>
                                        Projective Technique Theory – Decoding the Psych Tests (Thematic Apperception Test, Word
                                        Association Test, Situation Reaction Test, Self-Description Test)
                                    </li>
                                    <li>
                                        Mock Psych Test and feedback by a DIPR certified Psychologist
                                    </li>
                                    <li>
                                        Theory and Concepts of the Group Situational Tasks – Group Discussion, Group Planning
                                        Exercise, Progressive Group Task, Group Obstacle Race, Half Group Task, Lecturette,
                                        Individual Obstacles, Command Task, Final Group Task
                                    </li>
                                    <li>
                                        Genesis of the Group Testing Technique and what GTO looks at during the Group Testing
                                    </li>
                                    <li>
                                        Officer Like Qualities Theory and the OLQ Correlation
                                    </li>
                                    <li>
                                        Conference Procedure
                                    </li>
                                    <li>
                                        Correlation amongst all three techniques of assessment (GTO, Psych, IO)
                                    </li>
                                    <li>
                                        Doubt Clearing, SOCIOMETRY, Individual Feedback
                                    </li>
                                    <li>
                                        Two General Awareness sessions with Mentor-in-Residence
                                    </li>
                                    {/* <li>Introduction to SSB & Stage 1 Testing </li>
                                    <li>PIQ Form & Interview Procedure</li>
                                    <li>Mock Interview by DIPR certified IO</li>
                                    <li>Psych Tests (TAT, WAT, SRT, SD)</li>
                                    <li>Mock Psych Test & feedback</li>
                                    <li>Group Testing Tasks (GTO)</li>
                                    <li>Officer Like Qualities & Correlation</li>
                                    <li>Conference Procedure</li>
                                    <li>Doubt Clearing & Feedback</li> */}
                                </ul>
                            </div>
                        )}

                        {activeTab === "c2" && (
                            <div className="course-tab-card">
                                <h3 className="course-tab-card-title">
                                    Introduction to SSB & PPDT
                                </h3>
                                <ul>
                                    <li>
                                        Introduction to SSB
                                    </li>
                                    <li>
                                        Genesis of SSB procedure and breaking of myths around SSB
                                    </li>
                                    <li>
                                        Stage 1 Testing – OIR Test
                                    </li>
                                    <li>
                                        Picture Perception & Description Test
                                    </li>
                                    {/* <li>Complete SSB Procedure</li>
                                    <li>OIR Test</li>
                                    <li>Picture Perception & Description Test</li> */}
                                </ul>
                            </div>
                        )}

                        {activeTab === "c3" && (
                            <div className="course-tab-card">
                                <h3 className="course-tab-card-title">
                                    Psych Theory Course
                                </h3>
                                <ul>

                                    {/* Introduction to SSB,
                                    Complete SSB Procedure,
                                    Stage 1 Testing – OIR Test,
                                    Picture Perception & Description Test */}


                                    <li>
                                        Projective Technique Theory – Decoding the Psych Tests (Thematic Apperception Test, Word Association Test, Situation Reaction Test, Self-Description Test)

                                    </li>
                                    <li>
                                        Mock Psych Test and feedback by a DIPR certified Psychologist.
                                    </li>

                                    {/* <li>Thematic Apperception Test</li>
                                    <li>Word Association Test</li>
                                    <li>Situation Reaction Test</li>
                                    <li>Self Description Test</li>
                                    <li>Mock Psych Test & Feedback</li> */}
                                </ul>
                            </div>
                        )}

                        {activeTab === "c4" && (
                            <div className="course-tab-card">
                                <h3 className="course-tab-card-title">
                                    Interview Theory Course
                                </h3>
                                <ul>
                                    {/* <li>PIQ Form</li>
                                    <li>Interview Techniques</li>
                                    <li>Mock Interview & Feedback</li> */}

                                    <li>
                                        PIQ Form and Interview Procedure
                                    </li>
                                    <li>
                                        Mock Interview and feedback by a DIPR certified Interviewing Officer.
                                    </li>
                                </ul>
                            </div>
                        )}

                        {activeTab === "c5" && (
                            <div className="course-tab-card">
                                <h3 className="course-tab-card-title">
                                    Group Testing Course
                                </h3>
                                <ul>
                                    {/* <li>Group Discussion</li>
                                    <li>Group Planning Exercise</li>
                                    <li>Progressive Group Task</li>
                                    <li>Command Task</li>
                                    <li>Final Group Task</li>
                                    <li>Digital GTO Ground</li> */}

                                    <li>
                                        Theory and Concepts of the Group Situational Tasks:
                                    </li>
                                    <li>
                                        Group Discussion
                                    </li>
                                    <li>
                                        Group Planning Exercise
                                    </li>
                                    <li>
                                        Progressive Group Task
                                    </li>
                                    <li>
                                        Group Obstacle Race
                                    </li>
                                    <li>
                                        Half Group Task
                                    </li>
                                    <li>
                                        Lecturette
                                    </li>
                                    <li>
                                        Individual Obstacles
                                    </li>
                                    <li>
                                        Command Task
                                    </li>
                                    <li>
                                        Final Group Task
                                    </li>
                                    <li>
                                        Genesis of the Group Testing Technique and what GTO looks at during the Group Testing.
                                    </li>
                                    <li>
                                        Feedback by a DIPR certified Group Testing Officer.
                                    </li>
                                    <li>
                                        The entire course is covered through a virtual GTO Ground.
                                    </li>
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            <From />
            <Footer />
        </>
    );
}

export default Courses;
