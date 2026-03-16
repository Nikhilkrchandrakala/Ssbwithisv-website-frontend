import React, { useEffect, useRef, useState } from 'react'
import CustomHeader from '../../components/CustomHeader'
import From from '../From'
import Footer from '../Footer'
import { VscUnmute } from 'react-icons/vsc'
import { IoVolumeMuteSharp } from 'react-icons/io5'
import styles from '../../style/UniquePedagogy.module.css'
import { Helmet } from 'react-helmet-async'
import Faq from '../../components/Faq'
import { vtxFaqData } from '../../util/data'

function GtoTrain() {

    const data = {
        heading: 'GTX',
        span: 'TM',
        textTwo: ` VTX™ (Virtual Training Xperience) is a virtual training experience that emulates the outdoor group tasks as they exist on a real GTO ground across SSBs and AFSBs.
         It offers aspirants a first-hand visual and mental experience of the tasks before they encounter them physically — building clarity and confidence. 
         The Virtual Training Experience (VTX™) is an innovative online SSB training platform designed to simulate the outdoor Group Testing Officer’s (GTO) ground used in the Services Selection Board interview process.

         `,

        text: 'India’s first online GTO ground simulation designed to help defence aspirants understand and practice the tasks conducted during the Services Selection Board interview. ',
        textThree: 'Virtual Training Xperience',
        color: true,
        banner: '/assets/website/GTOCourseThumbnail.webp',

        headingTwo: "Pedagogical intent",
        preragraph: "The SSB interview evaluates leadership, teamwork, problem-solving ability, and officer-like qualities through a series of structured group tasks. For many aspirants preparing remotely, access to a real GTO ground is limited. The VTX platform bridges this gap by providing a virtual SSB training environment where candidates can understand how GTO tasks are structured, executed, and evaluated.",
        preragraphTwo: `Through guided training sessions, candidates learn the principles behind tasks such as the Progressive Group Task, Group Planning Exercise, Command Task, and Group Discussions, enabling them to build confidence and clarity before appearing for the actual SSB interview.  

    ${<br />}
        This program is part of the broader SSB mentoring and online coaching program offered by SSB with ISV, led by experienced assessors and defence professionals.

        `

    }

    useEffect(() => {
        const timer = setTimeout(() => {
            document.querySelector(".sct-title-gtx")?.classList.add("sweep-done");
        }, 2000); // match animation duration

        return () => clearTimeout(timer);
    }, []);


    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);



    return (
        <>


            <Helmet>
                <title>
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    Virtual Training Xperience | Virtual GTO Ground by SSB with ISV
                </title>

                <meta
                    name="description"
                    content="Experience India’s first Virtual Training Experience (VTX™) for SSB preparation. Practice GTO tasks, group discussions, and leadership exercises in a simulated SSB environment designed by ex-GTO assessors."
                />

                <link rel="canonical" href="https://ssbwithisv.in/ssbVirtualTrainingXperience" />

            </Helmet>



            <CustomHeader text={data.text} textTwo={data.textTwo} textThree={data.textThree} color={data?.color} banner={data?.banner} headingTwo={data.headingTwo} preragraph={data.preragraph} preragraphTwo={data.preragraphTwo} />

            <section className="GTO-pedagogical-section sectionspace80">
                <div className="container">
                    <div className="sct-title">
                        <h2>The pedagogical intent</h2>
                    </div>

                    <div className="pedagogical-orbit-box">
                        <span className="pedagogical-box-orbit-dot d1"></span>
                        <span className="pedagogical-box-orbit-dot d2"></span>
                        <span className="pedagogical-box-orbit-dot d3"></span>

                        <div className="pedagogical-text-box">
                            <p>
                                For most candidates, the hardest part of the GTO ground isn’t the task — it’s the unknown.
                                Unfamiliar structures, unclear movement, time pressure, and group dynamics often distract capable aspirants from what truly matters: their behaviour under observation.
                            </p>

                            <p>
                                VTX<sup>TM</sup> does not teach shortcuts or rehearsed behaviour.<br />
                                It prepares the mind first — much like chair flying before a sortie or mental navigation before letting go of a ship’s lines. By understanding task structure, group flow, and time pressure in advance, aspirants can approach the physical GTO ground with calm and focus.

                            </p>
                        </div>
                    </div>

                </div>
            </section>


            <section className={`sectionspace80 ${styles.virtualTrainingSection}`}>
                <div className="container">

                    <div className="row align-items-center g-4">

                        {/* CONTENT */}
                        <div className="col-lg-12">

                            <div className="sct-title mb-3">
                                <h2>Why Virtual Training is Important for SSB Preparation</h2>
                            </div>

                            <p className={styles.virtualTrainingText}>
                                Preparing for the SSB interview requires understanding how behaviour is observed
                                during group tasks and leadership exercises. Many candidates focus only on theoretical
                                preparation but lack practical exposure to the group testing environment used by the SSB.
                            </p>

                            <p className={styles.virtualTrainingSubtitle}>
                                Virtual training helps aspirants:
                            </p>

                            <div className={styles.virtualTrainingList}>

                                <div className={styles.virtualItem}>
                                    <span>Understand the structure of GTO tasks</span>
                                </div>

                                <div className={styles.virtualItem}>
                                    <span>Develop clarity in group planning exercises</span>
                                </div>

                                <div className={styles.virtualItem}>
                                    <span>Improve decision making under time pressure</span>
                                </div>

                                <div className={styles.virtualItem}>
                                    <span>Build confidence in group discussions</span>
                                </div>

                                <div className={styles.virtualItem}>
                                    <span>Learn how leadership behaviour is evaluated</span>
                                </div>

                            </div>

                            <p className={`${styles.virtualTrainingText} mt-3`}>
                                This experiential learning approach helps candidates prepare for the real
                                SSB environment even before reaching the board.
                            </p>

                        </div>

                        {/* IMAGE */}

                    </div>

                </div>
            </section>


            <section className="enable-section sectionspace80">
                <div className="container">
                    <div className="row align-items-center g-4">

                        {/* LEFT CONTENT */}
                        <div className="col-lg-5">

                            <div className="sct-title mb-3">
                                <h2>What You Learn in the Virtual Training Xperience (VTX™)</h2>
                            </div>

                            <div className="enable-list">

                                <div className="enable-item">
                                    <i className="fa fa-map"></i>
                                    <span>
                                        <strong>Understanding the GTO Ground</strong><br />
                                        Learn how the GTO ground is structured across different SSB boards and how group tasks are designed to evaluate leadership behaviour.
                                    </span>
                                </div>

                                <div className="enable-item">
                                    <i className="fa fa-users"></i>
                                    <span>
                                        <strong>Progressive Group Task Simulation</strong><br />
                                        Understand how teams collaborate to solve obstacles and how initiative, cooperation, and resourcefulness are assessed.
                                    </span>
                                </div>

                                <div className="enable-item">
                                    <i className="fa fa-sitemap"></i>
                                    <span>
                                        <strong>Group Planning Exercise</strong><br />
                                        Practice analysing complex situations and presenting logical solutions under time pressure.
                                    </span>
                                </div>

                                <div className="enable-item">
                                    <i className="fa fa-bullseye"></i>
                                    <span>
                                        <strong>Command Task Familiarisation</strong><br />
                                        Learn how candidates demonstrate leadership by guiding a small team through obstacle challenges.
                                    </span>
                                </div>

                                <div className="enable-item">
                                    <i className="fa fa-comments"></i>
                                    <span>
                                        <strong>Group Discussion Dynamics</strong><br />
                                        Understand how assessors observe participation, clarity of thought, and influence during discussions.
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* RIGHT IMAGE */}
                        <div className="col-lg-7">
                            <div className="enable-image-wrap">
                                <img src="/assets/vtx1.webp" alt="Virtual Training Experience" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>






            <section className={`sectionspace80 ${styles.vtxAudienceSection}`}>
                <div className="container">
                    <div className="row align-items-center g-4">

                        {/* IMAGE */}
                        <div className="col-lg-6 order-lg-1 order-2">
                            <div className={styles.vtxAudienceImage}>
                                <img src="/assets/Vtxnot.webp" alt="Enable Image" />

                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="col-lg-6 order-lg-2 order-1">

                            <div className="sct-title mb-3">
                                <h2>Who Should Use the VTX™</h2>
                            </div>

                            <p className={styles.vtxAudienceText}>
                                The Virtual Training Experience is designed for defence aspirants preparing
                                for the Services Selection Board interview through different entry schemes.
                            </p>

                            <p className={styles.vtxAudienceSubtitle}>
                                This program is ideal for:
                            </p>

                            <div className={styles.vtxAudienceList}>

                                <div className={styles.vtxAudienceItem}>
                                    <span>NDA aspirants preparing for SSB</span>
                                </div>

                                <div className={styles.vtxAudienceItem}>
                                    <span>CDS aspirants appearing for SSB interviews</span>
                                </div>

                                <div className={styles.vtxAudienceItem}>
                                    <span>AFCAT candidates preparing for AFSB boards</span>
                                </div>

                                <div className={styles.vtxAudienceItem}>
                                    <span>NCC Special Entry candidates</span>
                                </div>

                                <div className={styles.vtxAudienceItem}>
                                    <span>Defence aspirants preparing remotely without access to a physical GTO ground</span>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </section>


            <section className="GTO-img-section">
                <div className="container-fluid px-0">
                    <div className="row g-0">
                        <div className="col-lg-12 img-gradient-wrapper">
                            <video
                                className={styles.imageSection}
                                autoPlay
                                // muted/
                                loop
                                playsInline

                                ref={videoRef}
                                // className={styles.imageSection}
                                // autoPlay
                                // loop
                                // playsInline
                                muted={isMuted}

                            >
                                {/* <source src="/assets/BannerVideo.mp4" type="video/mp4" /> */}
                                <source src="/assets/video/0125(6).mp4" type="video/mp4" />

                            </video>

                            <div className='d-flex justify-content-end  '>
                                <button className={styles.MuteBtn} onClick={() => {
                                    setIsMuted(!isMuted);
                                    videoRef.current.muted = !isMuted;
                                }}>
                                    {!isMuted ? <VscUnmute /> : <IoVolumeMuteSharp />}
                                </button>
                            </div>
                            {/* <img src="/assets/img/about/about-breed.webp" alt="Enable Image" /> */}
                        </div>
                    </div>
                </div>
            </section>



            <section className={`sectionspace80 ${styles.vtxIntegrationSection}`}>
                <div className="container">

                    <div className="row justify-content-center">
                        <div className="col-lg-9">

                            <div className="sct-title text-center mb-4">
                                <h2>Integrating Virtual Training with SSB Coaching</h2>
                            </div>

                            <p className={styles.vtxIntegrationText}>
                                The Virtual Training Experience is integrated with the SSB mentoring
                                program offered by SSB with ISV.
                            </p>

                            <p className={styles.vtxIntegrationSubtitle}>
                                Candidates combine:
                            </p>

                            <div className={styles.vtxIntegrationList}>

                                <div className={styles.vtxIntegrationItem}>
                                    <span>Conceptual learning</span>
                                </div>

                                <div className={styles.vtxIntegrationItem}>
                                    <span>Psychological test preparation</span>
                                </div>

                                <div className={styles.vtxIntegrationItem}>
                                    <span>Group task understanding</span>
                                </div>

                                <div className={styles.vtxIntegrationItem}>
                                    <span>Interview training</span>
                                </div>

                                <div className={styles.vtxIntegrationItem}>
                                    <span>Leadership development</span>
                                </div>

                            </div>

                            <p className={`${styles.vtxIntegrationText} mt-3`}>
                                This holistic approach ensures candidates prepare not just for the interview,
                                but for the development of officer-like qualities expected in the Armed Forces.
                            </p>

                        </div>
                    </div>

                </div>
            </section>


            <section className="GTO-what-is-not-section sectionspace80">
                <div className="container what-is-not-text-box px-0">
                    <div className="row g-0">

                        <div className="col-lg-12 px-0">
                            <div style={{ padding: '0' }} className="what-is-not-text">
                                <div className="sct-title-section-gtx ">
                                    {/* <h1 className='sct-title-gtx' >
                                        <span>
                                            VTX™ is a preparatory bridge —
                                        </span>
                                        <span>designed to support authentic performance.</span>
                                    </h1> */}
                                    <h1 className="sct-title-gtx ">
                                        {/* <span className="highlight first-part">

                                        </span>
                                        <span className="highlight second-part">
                                            designed to support authentic performance.
                                        </span> */}

                                        <span className='title-gtx shimmerText'>
                                            VTX™ is a preparatory bridge —
                                            designed to support authentic performance
                                        </span>
                                    </h1>
                                </div>




                            </div>
                        </div>
                    </div>
                </div>
            </section >



            <section className="GTO-bottom-banner-section sectionspace40 pb-5">
                <div className="container bottom-banner-text-box">
                    <div className="row g-0">

                        <div className="col-lg-9 mx-auto">
                            <div className="bottom-banner-text text-center">
                                <div className="sct-title mb-4">
                                    <h2>Built with experience, used with responsibility</h2>
                                </div>
                                <p className='text-center'>
                                    Created by an ex-GTO, VTX™ blends real assessment insight with modern technology   <br />staying fully aligned with the spirit and integrity of the SSB process.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Faq data={vtxFaqData} />
            <From />
            <Footer />


        </>
    )
}

export default GtoTrain