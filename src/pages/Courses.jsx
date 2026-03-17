import React, { useState } from "react";
import CustomHeader from "../components/CustomHeader";
import From from "./From";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import { CoursesfaqData, scheduleData, CoursesModuleOne, tabs } from "../util/data";
import Faq from "../components/Faq";

function Courses() {

    const [activeTab, setActiveTab] = useState("c1");
    const [scheduleTab, setScheduleTab] = useState("morning");

    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const data = {
        heading: "Our Courses - SSB Coaching & Interview Preparation Program",
        text: `Preparing for the Services Selection Board (SSB) interview requires much more than academic knowledge. The SSB selection process is designed to assess a candidate’s personality, leadership potential, decision-making ability, emotional intelligence, and officer-like qualities through a structured five-day evaluation system.`,
        banner: '/assets/website/courses_banner.webp',

    };





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

            <section className="container sectionspace60">
                <div className="course-intro">

                    <p>
                        At SSB with ISV, we offer a comprehensive SSB coaching and interview preparation
                        program designed to help aspirants understand the psychology behind the
                        SSB selection process and develop the behavioural traits expected of future
                        officers in the Indian Armed Forces.
                    </p>

                    <p>
                        Our structured mentoring program combines theoretical understanding,
                        practical training, mock assessments, and personalised feedback to help
                        candidates build clarity, confidence, and authenticity during the SSB interview.
                    </p>
                    {/* 
                    <h3 className="course-intro-title">
                        The course is designed for aspirants preparing for:
                    </h3>

                    <ul className="course-intro-list">
                      
                    </ul> */}

                    <div className="mvk-benefits">

                        <h3>   The course is designed for aspirants preparing for:</h3>

                        <ul>
                            <li>NDA SSB Interview</li>
                            <li>CDS SSB Interview</li>
                            <li>AFCAT SSB Interview</li>
                            <li>TES Entry</li>
                            <li>NCC Special Entry</li>
                            <li>Direct Entry into the Armed Forces</li>
                        </ul>

                    </div>

                </div>
            </section>

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

                                <h3 className="course-tab-card-hours">
                                    <strong>Total Sessions:</strong> 10 |{" "}
                                    <strong>Total Learning Hours:</strong> 60
                                </h3>

                                <p>
                                    This intensive SSB training program is designed to simulate the learning and behavioural development required to successfully navigate the Services Selection Board interview process.
                                </p>

                                <h3 className="m-0 fs-4">Topics Covered:</h3>

                                <div className="ssb-accordion">
                                    {CoursesModuleOne?.map((item, index) => (
                                        <div key={index} className="ssb-accordion-item">

                                            {/* TITLE */}
                                            <div
                                                className="ssb-accordion-title"
                                                onClick={() => toggleAccordion(index)}
                                            >
                                                {item.title}
                                                <span>{openIndex === index ? "-" : "+"}</span>
                                            </div>

                                            {/* CONTENT */}
                                            {openIndex === index && (
                                                <div className="ssb-accordion-content">

                                                    <p>{item.content}</p>

                                                    {item.points?.length > 0 && (
                                                        <ul>
                                                            {item.points.map((point, i) => (
                                                                <li key={i}>{point}</li>
                                                            ))}
                                                        </ul>
                                                    )}

                                                    <p>{item?.content2}</p>
                                                    <p>{item?.content3}</p>

                                                </div>
                                            )}

                                        </div>
                                    ))}
                                </div>
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




            <section className="container sectionspace80">

                <div className="schedule-section">

                    <h2 className="schedule-title">SSB Hackathon Schedule</h2>

                    {/* TABS */}
                    <div className="schedule-tabs">

                        <button
                            className={scheduleTab === "morning" ? "active" : ""}
                            onClick={() => setScheduleTab("morning")}
                        >
                            Morning Batch
                        </button>

                        <button
                            className={scheduleTab === "evening" ? "active" : ""}
                            onClick={() => setScheduleTab("evening")}
                        >
                            Evening Batch
                        </button>

                    </div>


                    {/* DESKTOP TABLE */}
                    <div className="schedule-table-wrapper">

                        <table className="schedule-table">

                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Time</th>
                                    <th>Topic</th>
                                    <th>Classes Taken By</th>
                                </tr>
                            </thead>

                            <tbody>
                                {scheduleData[scheduleTab]?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.day}</td>
                                        <td>{item.time}</td>
                                        <td>{item.topic}</td>
                                        <td>{item.by}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>

                    </div>


                    {/* MOBILE CARD VIEW */}
                    <div className="schedule-mobile">

                        {scheduleData[scheduleTab]?.map((item, index) => (
                            <div key={index} className="schedule-card">

                                <div className="schedule-row">
                                    <span>Day</span>
                                    <p>{item.day}</p>
                                </div>

                                <div className="schedule-row">
                                    <span>Time</span>
                                    <p>{item.time}</p>
                                </div>

                                <div className="schedule-row">
                                    <span>Topic</span>
                                    <p>{item.topic}</p>
                                </div>

                                <div className="schedule-row">
                                    <span>Classes Taken By</span>
                                    <p>{item.by}</p>
                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </section>


            <section className="container sectionspace80">

                <div className="mvk-benefits">

                    <h3>Why Choose SSB with ISV for SSB Coaching</h3>
                    <p>SSB with ISV focuses on authentic personality development rather than superficial coaching techniques.Our training philosophy is based on the principle of Manasa – Vacha – Karmana, emphasizing alignment between thought, communication, and action. Through structured mentoring, behavioural training, and realistic simulations, we help candidates develop the mindset and qualities required to succeed in the SSB interview and eventually serve as officers in the Indian Armed Forces.</p>
                </div>

            </section>


            <Faq data={CoursesfaqData} />

            <From />
            <Footer />
        </>
    );
}

export default Courses;
