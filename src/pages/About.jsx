import React, { useRef } from 'react'
import From from './From'
import Footer from './Footer'
import CustomHeader from '../components/CustomHeader'
import SwiperComponents from '../components/SwiperComponents'

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import styles from '../style/RogerThat.module.css'
import { Helmet } from 'react-helmet-async'

// import 

function About() {


    const prevRef = useRef(null);
    const nextRef = useRef(null);


    const data =
    {
        heading: 'About us',

        text: ' The Integrated SSB Virtuosos was setup on 04 July 2021 with a goal to shape India’s youth and fuel their aspirations to join Indian Armed Forces in the Officer Cadre.',
        textTwo: `We are not just an academy, we’re a close-knit mentoring community. At SSB with ISV , every aspirant is personally guided by Lt Cdr Nikhil, whose experience of assessing over 13000 SSB candidates shapes our focused,
         psychology-driven approach to SSB preparation. Our goal is simple yet powerful: to help deserving young aspirants realise the dream of becoming commissioned officers in the Indian Armed Forces.`,
        banner: '/assets/website/about_us_banner.webp',

        headingTwo: "About SSB with ISV ",
        preragraph: "SSB Coaching & Mentoring for Services Selection Board Preparation"



    }

    const teamData = [
        {
            id: "member-1",
            image: "/assets/founder.webp",
            designation: "Group Testing Officer",
            name: "Lt. Commander Nikhil Kumar Chandrakala (Retd.)",
            sections: [
                {
                    id: "ssb",
                    title: "SSB Assessor Background",
                    content: [
                        // "Trained at DIPR & NSB, Coimbatore",
                        // "Certified Group Testing Officer",
                        // "Youngest Panelist in SSB history",
                        // "Assessed 12,500+ candidates",


                        ` Trained at Defence Institute of Psychological Research and Naval Selection Board, Coimbatore - Certified "Group Testing Officer"`,
                        `Youngest Panellist (Group Testing Officer) at Services Selection Board since 1947`,
                        `Founding Member and 1st Group Testing Officer of SSB(Kolkata) – Indian Navy's Fourth Officers’ Selection Board`,
                        ` Served as Group Testing Officer at 12 SSB Bangalore, Selection Centre South`,
                        `Assessed 13000+ candidates appearing for the SSB`,
                        // `Experience in mentorship, career guidance, and personality assessment`,
                    ],
                },
                {
                    id: "navy",
                    title: "Navy Background",
                    content: [

                        `Served onboard INS Prabal, INS Abhay, and as Flag Lieutenant to Flag Officer Commanding Maharashtra and  Gujarat Naval Area`,
                        ` Captain of Indian Naval Immediate Support Vessel T - 15`,
                        `Squadron Commander 81st ISV Squadron`,
                        `Senior Officer ISVs (West)`,
                    ],
                },

                {
                    id: "Educational",
                    title: "Educational Background",
                    content: [
                        ` B.Tech. (Electrical Engineering), NIT Srinagar (J&K)`,
                        `Masters in Psychology, Minor in Industrial and Organisational Psychology`,
                        `Masters in Mobility Engineering, Indian Institute of Science, Bangalore`,
                    ],
                },
            ],
        },
        // Mentor-in-residence & Principal Insight Officer
        {
            id: "member-2",
            image: "/assets/1.jpeg",
            designation: "Mentor-in-residence & Principal Insight Officer",
            name: "Lt Colonel Vivek Talwar (Retd.)",
            sections: [
                {
                    id: "SSB",
                    title: "SSB Background",
                    content: [
                        // `Coord Officer, 12 SSB (Bangalore)`,
                        ` Ex Coord Officer,  Selection Center South (Bangalore)`
                    ],
                },
                {
                    id: "Army",
                    title: "Army Background",
                    content: [
                        `21+ years of experience in strategic operations across broad theaters`,


                    ],
                },
                {
                    id: "Educational",
                    title: "Educational Background",
                    content: [
                        `Graduation &
                        Post Grad (St Xavier’s College, Calcutta)`,
                        `MBA, Pune University`,
                        `Masters in Human Rights, Delhi University`,
                        `PGDBA (HR)`,
                        `PMP`,
                        ` Certified Life Coach & Alternate Counsellor`
                    ],
                },
            ],
        },
    ];

    return (
        <>

            <Helmet>
                <title>
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    About SSB with ISV | Veteran-Led SSB Coaching in India
                </title>

                <meta
                    name="description"
                    content=" Learn about SSB with ISV, a mentoring platform focused on personality development, officer-like qualities, and structured preparation for the Services Selection Board (SSB) interview, led by defence veterans and seasoned assessors."
                />

                {/* *ABOUT US PAGE* */}

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
                                "name": "About Us",
                                "item": "https://ssbwithisv.in/aboutssbwithisv"
                            }
                        ]
                    })}
                </script>
                <link rel="canonical" href="https://ssbwithisv.in/aboutssbwithisv" />
            </Helmet>

            <CustomHeader heading={data?.heading} text={data?.text} textTwo={data.textTwo} banner={data?.banner} headingTwo={data.headingTwo} preragraph={data.preragraph} />



            <SwiperComponents />


            <section className={`container sectionspace80 ${styles.aboutIntro}`}>
                <div className="row justify-content-center">
                    <div className="col-lg-10">

                        <div className="sct-title mb-4 text-center">
                            <h2>SSB with ISV</h2>
                        </div>

                        <p className={styles.aboutIntroText}>
                            SSB with ISV is a mentoring platform dedicated to helping defence aspirants
                            understand and prepare for the Services Selection Board (SSB) interview
                            through authentic guidance, leadership development, and behavioural insight.
                        </p>

                        <p className={styles.aboutIntroText}>
                            What makes SSB with ISV different from conventional coaching institutes
                            is that the mentoring is delivered by professionals who have direct
                            experience with the SSB selection system itself.
                        </p>

                        <p className={styles.aboutIntroText}>
                            Candidates receive SSB coaching by an actual Group Testing Officer (GTO)
                            along with guidance from former armed forces officers, providing insights
                            that go far beyond theoretical preparation.
                        </p>

                        <p className={styles.aboutIntroText}>
                            This unique perspective helps aspirants understand how candidates are
                            evaluated during the SSB interview and how officer-like qualities are
                            observed in real situations.
                        </p>

                    </div>
                </div>
            </section>




            <section className="team-section container sectionspace80 ">
                <div className="row align-items-center gy-3">

                    {/* TITLE */}
                    <div className="col-12 col-lg-9">
                        <div style={{ margin: '0' }} className="sct-title">
                            <h2>SSB with ISV Core Team</h2>
                        </div>
                    </div>

                    {/* ARROWS */}
                    <div className="col-12 col-lg-3 d-none d-lg-flex justify-content-end gap-2">
                        <div ref={prevRef} className={styles.arrow}>
                            <IoIosArrowBack />
                        </div>
                        <div ref={nextRef} className={styles.arrow}>
                            <IoIosArrowForward />
                        </div>
                    </div>


                </div>







                {/* <div className="team-swiper-wrapper">

                    CUSTOM BUTTONS
                    <div className="team-swiper-btn prev-btn">←</div>
                    <div className="team-swiper-btn next-btn">→</div> */}

                <Swiper
                    slidesPerView={1}
                    spaceBetween={40}
                    loop={true}

                    // autoplay={{
                    //     delay: 3000,
                    //     disableOnInteraction: false,
                    //     pauseOnMouseEnter: true,
                    // }}

                    pagination={{
                        el: ".roger-pagination",
                        clickable: true,
                    }}

                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}

                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}

                    breakpoints={{
                        0: { slidesPerView: 1 },
                        1024: { slidesPerView: 1 },
                        1420: { slidesPerView: 1 },
                        1520: { slidesPerView: 1 },
                    }}

                    modules={[Pagination, Navigation, Autoplay]}
                    className={styles.mySwiper}
                >


                    {teamData.map((member, slideIndex) => (
                        <SwiperSlide key={member.id} className="team-slide">
                            <div className="team-card">
                                <div className="col-12 row mx-auto">

                                    {/* LEFT */}
                                    <div className="col-xl-3 col-lg-4 col-md-5">
                                        <div className="team-image">
                                            <div className="teamImgDiv">
                                                <img src={member.image} alt={member.name} />
                                            </div>
                                            <span className="team-designation">{member.designation}</span>
                                            <h3>{member.name}</h3>
                                        </div>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="col-xl-9 col-lg-8 col-md-7">
                                        <div className="team-detailed-content">
                                            <div className="accordion team-accordion">

                                                {member.sections.map((section, index) => {
                                                    const collapseId = `collapse-${slideIndex}-${section.id}`;

                                                    return (
                                                        <div className="accordion-item" key={section.id}>
                                                            <div className="accordion-header">
                                                                <button
                                                                    className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target={`#${collapseId}`}
                                                                >
                                                                    {section.title}
                                                                </button>
                                                            </div>

                                                            <div
                                                                id={collapseId}
                                                                className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                                                            >
                                                                <div className="accordion-body">

                                                                    {/* LIST CONTENT */}
                                                                    {section.content && (
                                                                        <ul>
                                                                            {section.content.map((item, i) => (
                                                                                <li key={i}>{item}</li>
                                                                            ))}
                                                                        </ul>
                                                                    )}

                                                                    {/* TEXT CONTENT */}
                                                                    {section.text && <p>{section.text}</p>}

                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </SwiperSlide>
                    ))}


                </Swiper>

                <div className={styles.paginationWrapper}>
                    <div className="roger-pagination"></div>
                </div>

            </section>


            <section className="about-detailed-section sectionspace80">
                <div className="container">

                    {/* SECTION 1 */}
                    <div className="row justify-content-center">
                        <div className="col-lg-10">

                            <div className="sct-title mb-4 text-center">
                                <h2>Learning the SSB Process from Those Who Have Assessed It</h2>
                            </div>

                            <p className="about-text">
                                The Services Selection Board interview is one of the most comprehensive leadership selection systems used anywhere in the world. The process evaluates personality traits such as decision-making ability, initiative, cooperation, emotional stability, and leadership potential.
                            </p>

                            <p className="about-text">
                                At SSB with ISV, candidates learn the SSB process from the perspective of assessors rather than from guesswork or second-hand coaching methods.
                            </p>

                            <p className="about-text">
                                Through mentoring by an actual GTO and experienced armed forces professionals, aspirants gain a deeper understanding of:
                            </p>

                            <ul className="about-list">
                                <li>how psychologists interpret responses in psychological tests</li>
                                <li>how GTOs observe behaviour during group tasks</li>
                                <li>how interviewing officers evaluate personality and motivation</li>
                                <li>how consistency of behaviour influences the final recommendation</li>
                            </ul>

                            <p className="about-text">
                                This assessor-led guidance helps candidates approach the SSB interview with clarity and authenticity.
                            </p>

                        </div>
                    </div>

                    {/* SECTION 2 */}
                    <div className="row justify-content-center mt-5">
                        <div className="col-lg-10">

                            <div className="sct-title mb-4 text-center">
                                <h2>A Unique Advantage: The Virtual Training Experience (VTX)</h2>
                            </div>

                            <p className="about-text">
                                One of the biggest challenges for many defence aspirants preparing for the SSB interview is the lack of exposure to the Group Testing Officer (GTO) ground. To bridge this gap, SSB with ISV has developed the Virtual Training Experience (VTX) — a platform that provides aspirants with a virtual representation of the SSB GTO ground and task environment from any part of the globe.
                            </p>

                            <p className="about-text">
                                Through VTX, candidates can:
                            </p>

                            <ul className="about-list">
                                <li>understand how GTO tasks are structured and conducted</li>
                                <li>visualize obstacle layouts and task strategies</li>
                                <li>develop clarity about group planning exercises and command tasks</li>
                                <li>experience the logic behind different group testing activities</li>
                            </ul>

                        </div>
                    </div>

                    {/* SECTION 3 */}
                    <div className="row justify-content-center mt-5">
                        <div className="col-lg-10">

                            <div className="sct-title mb-4 text-center">
                                <h2>Our Philosophy: Manasa, Vacha, Karmana</h2>
                            </div>

                            <p className="about-text">
                                The mentoring philosophy at SSB with ISV is rooted in the concept of Manasa, Vacha, Karmana — the alignment of thought, speech, and action.
                            </p>

                            <p className="about-text">
                                In the context of the SSB interview, this principle reflects the importance of authentic behaviour and internal consistency.
                            </p>

                            <p className="about-text">
                                Rather than teaching scripted responses or shortcuts, SSB with ISV focuses on helping aspirants develop self-awareness, clarity of thought, and confidence.
                            </p>

                        </div>
                    </div>

                    {/* SECTION 4 */}
                    <div className="row justify-content-center mt-5">
                        <div className="col-lg-10">

                            <div className="sct-title mb-4 text-center">
                                <h2>Understanding Officer Like Qualities</h2>
                            </div>

                            <p className="about-text">
                                The SSB interview is designed to identify individuals who demonstrate Officer Like Qualities (OLQs) — the leadership attributes required to serve in the Armed Forces.
                            </p>

                            <ul className="about-list">
                                <li>effective intelligence</li>
                                <li>initiative and responsibility</li>
                                <li>cooperation and teamwork</li>
                                <li>self-confidence</li>
                                <li>determination and courage</li>
                                <li>emotional stability and stamina</li>
                            </ul>

                        </div>
                    </div>

                    {/* SECTION 5 */}
                    <div className="row justify-content-center mt-5">
                        <div className="col-lg-10">

                            <div className="sct-title mb-4 text-center">
                                <h2>Preparing Future Officers</h2>
                            </div>

                            <p className="about-text">
                                The objective of SSB with ISV is not simply to help candidates clear an interview. Instead, the focus is on helping aspirants develop the qualities, mindset, and leadership awareness expected from future officers in the Indian Armed Forces.
                            </p>

                            <p className="about-text">
                                By combining assessor-led mentoring, armed forces experience, and innovative training platforms like VTX, SSB with ISV provides aspirants with a deeper understanding of the SSB selection process and the behavioural traits required to succeed.
                            </p>

                        </div>
                    </div>

                </div>
            </section>

            <From />
            <Footer />


        </>
    )
}

export default About