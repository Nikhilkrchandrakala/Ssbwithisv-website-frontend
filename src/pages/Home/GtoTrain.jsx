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
        textTwo: `The Virtual Training Xperience(VTX™) is an innovative online SSB training platform designed to simulate the outdoor Group Testing Officer’s (GTO) ground used in the Services Selection Board interview process.
`,

        text: 'India’s first online GTO ground simulation designed to help defence aspirants understand and practice the GTO tasks conducted during the Services Selection Board interview. ',
        textThree: 'Virtual Training Xperience by SSB with ISV',
        color: true,
        banner: '/assets/website/GTOCourseThumbnail.webp',

        //     headingTwo: "Pedagogical intent",
        //     preragraph: "The SSB interview evaluates leadership, teamwork, problem-solving ability, and officer-like qualities through a series of structured group tasks. For many aspirants preparing remotely, access to a real GTO ground is limited. The VTX platform bridges this gap by providing a virtual SSB training environment where candidates can understand how GTO tasks are structured, executed, and evaluated.",
        //     preragraphTwo: `Through guided training sessions, candidates learn the principles behind tasks such as the Progressive Group Task, Group Planning Exercise, Command Task, and Group Discussions, enabling them to build confidence and clarity before appearing for the actual SSB interview.  

        // ${<br />}
        //     This program is part of the broader SSB mentoring and online coaching program offered by SSB with ISV, led by experienced assessors and defence professionals. `

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
                    content="XperienceIndia’s first Virtual Training Xperience(VTX™) for SSB preparation. Practice GTO tasks, group discussions, and leadership exercises in a simulated SSB environment designed by ex-GTO assessors."
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
                                The SSB interview evaluates leadership, teamwork, problem-solving ability, and officer-like qualities through a series of structured group tasks. For many aspirants preparing remotely, access to a real GTO ground is limited. The VTX™ platform bridges this gap by providing a virtual SSB training environment where candidates can understand how GTO tasks are structured, executed, and evaluated.
                                Through guided training sessions, candidates learn the principles behind tasks such as the Progressive Group Task, Half Group Task, Group Planning Exercise, Group Discussions, Command Task, and Final Group Task, enabling them to build confidence and clarity before appearing for the actual SSB interview.
                                This program is part of the broader SSB mentoring and online coaching program offered by SSB with ISV, led by experienced assessors and defence professionals.


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
                                preparation but lack practical exposure to the group testing environment used at the SSB.
                            </p>

                            <div className="mvk-benefits">

                                <h3>  Virtual training helps aspirants:</h3>

                                <ul>
                                    <li>
                                        Understand the structure of GTO tasks
                                    </li>


                                    <li>
                                        Develop clarity in group movement, group effectiveness and team dynamics
                                    </li>


                                    <li>
                                        Improve decision making under time pressure
                                    </li>


                                    <li>
                                        Build confidence in group endeavours and group discussions
                                    </li>


                                    <li>
                                        Learn how leadership behaviour is evaluated
                                    </li>

                                </ul>

                                <p className={`${styles.virtualTrainingText} mt-3`}>
                                    This experiential learning approach helps candidates prepare for the real SSB environment even before reaching the board.
                                </p>

                            </div>



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
                                {/* <h2>What You Learn in the Virtual Training Xperience (VTX™)</h2> */}
                                <h2>
                                    What you learn in the Virtual Training Xperience (VTX™ )
                                </h2>

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
                                        <strong>Progressive Group Task/ Half Group Task/ Final Group Task simulation</strong>
                                        <div className='Phergarph_of_'>

                                            Understand how a team collaborates to solve obstacles and how effective intelligence, social adaptability, initiative, cooperation, ability to influence the group and resourcefulness are assessed.

                                        </div>
                                    </span>
                                </div>

                                <div className="enable-item">
                                    <i className="fa fa-sitemap"></i>
                                    <span>
                                        <strong>Group Planning Exercise</strong>
                                        <div className='Phergarph_of_'>

                                            Practice analysing complex situations and presenting logical solutions under time pressure.
                                        </div>
                                    </span>
                                </div>

                                <div className="enable-item">
                                    <i className="fa fa-bullseye"></i>
                                    <span>
                                        <strong>Command Task Familiarisation</strong>
                                        <div className='Phergarph_of_'>

                                            Learn how candidates demonstrate leadership by guiding a small team through obstacle challenges.
                                        </div>
                                    </span>
                                </div>

                                <div className="enable-item">
                                    <i className="fa fa-comments"></i>
                                    <span>
                                        <strong>Group Discussion Dynamics</strong>
                                        <div className='Phergarph_of_'>

                                            Understand how assessors observe participation, clarity of thought, and influence during discussions.
                                        </div>
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
                                <h2>Who should use  VTX™</h2>
                            </div>

                            <p className={styles.vtxAudienceText}>
                                The Virtual Training Xperience is designed for defence aspirants preparing for the Services Selection Board interview through different entry schemes.

                            </p>

                            <p className={styles.vtxAudienceSubtitle}>
                                This program is ideal for:
                            </p>

                            <div className={styles.vtxAudienceList}>

                                <div className={styles.vtxAudienceItem}>
                                    <span> All defence aspirants preparing remotely without access to a physical GTO ground
                                        NDA, 10+2 Tech, 10+2 B Tech (Navy) aspirants preparing for SSB online</span>
                                </div>

                                <div className={styles.vtxAudienceItem}>
                                    <span>  CDS aspirants appearing for SSB interview online</span>
                                </div>

                                <div className={styles.vtxAudienceItem}>
                                    <span> AFCAT candidates preparing for AFSB online</span>
                                </div>

                                <div className={styles.vtxAudienceItem}>
                                    <span> NCC special entry and JAG entry candidates</span>
                                </div>

                                <div className={styles.vtxAudienceItem}>
                                    <span>  Service entry candidates (CW Scheme candidates,SD list commission candidates, PC-SL entry, SCO entry and ACC candidates) looking for online SSB coaching while in service</span>
                                </div>

                                <div className={styles.vtxAudienceItem}>
                                    <span>   SSC (Tech) and SSC (Non Tech) aspirants who are working and want online SSB preparation with a digital GTO ground</span>
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



            <section className={`enable-section sectionspace80`}>
                <div className="container">

                    <div className="mvk-benefits">

                        <h3> Integrating Virtual Training with SSB coaching</h3>
                        <p className={styles.vtxIntegrationText}>
                          The Virtual Training Xperience (VTX™) is integrated with the SSB mentoring
                            program offered by SSB with ISV.   Candidates combine:
                        </p>



                        <ul>
                            <li>Conceptual learning</li>
                            <li>Psychological test preparation</li>
                            <li>Group task understanding</li>
                            <li>Interview training</li>
                            <li>Leadership development</li>
                            {/* <li>Personalized SSB interview guidance</li> */}
                        </ul>

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