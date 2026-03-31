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
        // heading: 'About us',

        text: 'SSB Coaching & Mentoring for Services Selection Board Preparation',
        textTwo: `SSB with ISV is a mentoring platform dedicated to helping defence aspirants understand and prepare for the Services Selection Board (SSB) interview through authentic guidance, leadership development, and behavioural insight.
What makes SSB with ISV different from conventional coaching institutes is that the mentoring is delivered by DIPR certified ex-SSB assessors who have had direct experience with the SSB selection system itself. Candidates receive SSB coaching by an Ex Group Testing Officer (GTO), an Ex Interviewing Officer (IO) and an Ex Psychologist (Psych) along with guidance from former regular armed forces officers (veterans), providing insights that go far beyond theoretical preparation. This unique perspective helps aspirants understand how candidates are evaluated during the SSB interview and how officer-like qualities are observed in real situations.
`,
        banner: '/assets/website/about_us_banner.webp',

        heading: "About SSB with ISV ",
        // preragraph: "SSB Coaching & Mentoring for Services Selection Board Preparation"



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
                        // `Xperiencein mentorship, career guidance, and personality assessment`,
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
                        `21+ years of Xperiencein strategic operations across broad theaters`,


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
                    {/* <div className="col-lg-10"> */}







                    <div className="mvk-benefits">

                        <h3> Learning the SSB process from those who have assessed it</h3>

                        <p >
                            The Services Selection Board interview is one of the most comprehensive leadership selection systems used anywhere in the world. The process evaluates personality traits such as decision-making ability, initiative, cooperation, emotional stability, and leadership potential.



                        </p>

                        <p className={styles.aboutIntroText}>
                            At SSB with ISV, candidates learn the SSB process from the perspective of of ex-SSB assessors rather than from guesswork or second-hand coaching methods. Through mentoring by an ex-GTO, an ex-IO and an ex-Psychologist and experienced armed forces professionals, aspirants gain a deeper understanding of:
                        </p>

                        <ul>
                            <li>
                                How psychologists interpret responses in psychological tests
                            </li>
                            <li>
                                How GTOs observe behaviour during group tasks
                            </li>
                            <li>
                                How interviewing officers evaluate personality and motivation
                            </li>
                            <li>
                                How consistency of behaviour influences the final recommendation
                            </li>








                        </ul>

                        <p style={{ marginTop: '20px' }}>
                            This assessor-led guidance helps candidates approach the SSB interview with clarity and authenticity.

                        </p>

                    </div>


                    <div className="mvk-benefits">

                        <h3>A Unique Advantage: The Virtual Training Xperience( VTX™)</h3>

                        <p className={'aboutIntroText'}>

                            One of the biggest challenges for many defence aspirants preparing for the SSB interview is the lack of exposure to the Group Testing Officer (GTO) ground. To bridge this gap, SSB with ISV has developed the Virtual Training Xperience (VTX™) - a one-of-a-kind platform that provides aspirants with a virtual representation of the SSB/ AFSB GTO ground and task environment from any part of the globe.


                            Through VTX™, candidates can:


                        </p>

                        <ul>
                            <li>
                                Understand how GTO tasks (PGT, HGT, CT, FGT) are structured and conducted
                            </li>
                            <li>
                                Visualize obstacle layouts and task strategies
                            </li>
                            <li>
                                Develop clarity about group planning exercises and group discussions
                            </li>
                            <li>
                                Experience the logic behind different group testing activities
                            </li>
                            <li>
                                Understand group effectiveness, team dynamics, group movement and group theory
                            </li>








                        </ul>

                        <p className={'aboutIntroText'}>
                            This innovative platform helps candidates gain exposure to the GTO task environment even before appearing for the actual SSB interview, making it a powerful tool for SSB preparation.



                        </p>

                    </div>

                    <div className="mvk-benefits">

                        <h3>Our Philosophy: Manasa, Vacha, Karmana</h3>

                        <p className={styles.aboutIntroText}>
                            The mentoring philosophy at SSB with ISV is rooted in the concept of Manasa, Vacha, Karmana — the alignment of thought, speech, and action.
                            In the context of the SSB interview, this principle reflects the importance of authentic behaviour and internal consistency.
                            Candidates who demonstrate alignment between what they think, what they say, and how they act are more likely to display the natural leadership traits expected from officers in the Armed Forces. Rather than teaching scripted responses or shortcuts, SSB with ISV focuses on helping aspirants develop self-awareness, clarity of thought, and confidence, enabling them to approach the SSB interview with authenticity.



                        </p>



                    </div>


                    <div className="mvk-benefits">

                        <h3>Understanding Officer Like Qualities</h3>

                        <p className={styles.aboutIntroText}>
                            The SSB interview is designed to identify individuals who demonstrate Officer Like Qualities (OLQs) — the leadership attributes required to serve in the Armed Forces.

                            <p>

                                These include qualities such as:
                            </p>




                        </p>

                        <ul>
                            <li>
                                Effective intelligence, Reasoning ability

                            </li>


                            <li>
                                Social adaptability, Cooperation and Sense of responsibility

                            </li>


                            <li>
                                Communication skills, Ability to influence the group

                            </li>


                            <li>
                                Initiative, Self-confidence and Speed of decision

                            </li>


                            <li>
                                Determination and Courage

                            </li>


                            <li>
                                Emotional stability, Liveliness and Stamina

                            </li>



                        </ul>


                        <p className={styles.aboutIntroText}>
                            Through mentoring sessions, practical discussions, and guided exercises, candidates learn how these qualities are evaluated across psychological tests, GTO tasks, and personal interviews. The goal is not to artificially display these traits, but to develop the self awareness and behaviour that naturally reflect them.

                        </p>



                    </div>

                    {/* ===== Bridging Gap ===== */}
                    <div className="mvk-benefits">

                        <h3>Bridging the Gap Between Preparation and Understanding</h3>

                        <p className={styles.aboutIntroText}>
                            Many aspirants approach the SSB interview with limited clarity about how the selection system actually works.
                            SSB with ISV focuses on bridging this gap by helping candidates understand the logic behind the evaluation process.
                        </p>

                        <p className={styles.aboutIntroText}>
                            {/* Through guidance from an actual GTO and former armed forces officers, aspirants gain insight into: */}
                            Through guidance from an an ex-GTO, an ex-IO and an ex-Psychologist and experienced former armed forces officers (veterans), aspirants gain insight into:
                        </p>

                        <ul>
                            {/* <li>The philosophy behind the SSB selection system</li>
                            <li>Behavioural indicators assessors observe during tasks</li>
                            <li>How different tests contribute to the final recommendation</li>
                            <li>Importance of consistency across psychology, GTO, and interview</li> */}

                            <li>
                                The philosophy behind the SSB selection system
                            </li>
                            <li>
                                Behavioural indicators assessors observe during tasks
                            </li>
                            <li>
                                How different tests contribute to the final recommendation
                            </li>
                            <li>
                                The importance of consistency across psychology, GTO, and interview assessments
                            </li>




                        </ul>

                        <p className={styles.aboutIntroText}>
                            This understanding enables candidates to approach the interview with confidence, awareness, and authenticity.
                        </p>

                    </div>


                    {/* ===== Platform ===== */}
                    <div className="mvk-benefits">

                        <h3>A Platform for Defence Aspirants</h3>

                        <p className={styles.aboutIntroText}>
                            SSB with ISV is more than a training program. It is a learning platform for defence aspirants who want to understand leadership,
                            develop perspective, and build the mindset required for military service.
                        </p>

                        <p className={styles.aboutIntroText}>
                            Through mentoring sessions, structured courses, the Virtual Training Xperience (VTX™)  platform, and initiatives like Roger That Magazine,
                            aspirants expand their awareness of global issues, leadership principles, and responsibilities of military officers.
                        </p>

                        <p className={styles.aboutIntroText}>
                            These initiatives help candidates prepare not only for the SSB interview but also for their larger journey as future leadership in the Indian Armed Forces.
                        </p>

                    </div>


                    {/* ===== Preparing Officers ===== */}
                    <div className="mvk-benefits">

                        <h3>Preparing Future Officers</h3>

                        <p className={styles.aboutIntroText}>
                            The objective of SSB with ISV is not simply to help candidates clear the SSB interview, but to develop the qualities,
                            mindset, and leadership awareness expected from future officers in the Indian Armed Forces.
                        </p>

                        <p className={styles.aboutIntroText}>
                            By combining assessor-led mentoring, armed forces experience, and innovative platforms like VTX™,
                            aspirants gain a deeper understanding of the SSB selection process and behavioural expectations.
                        </p>

                        <p className={styles.aboutIntroText}>
                            Preparing for SSB is not about shortcuts — it is about developing character and leadership qualities that define an officer.
                        </p>

                    </div>


                    {/* </div> */}
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




            <From />
            <Footer />


        </>
    )
}

export default About