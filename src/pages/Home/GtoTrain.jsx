import React, { useEffect, useRef, useState } from 'react'
import CustomHeader from '../../components/CustomHeader'
import From from '../From'
import Footer from '../Footer'
import { VscUnmute } from 'react-icons/vsc'
import { IoVolumeMuteSharp } from 'react-icons/io5'
import styles from '../../style/UniquePedagogy.module.css'

function GtoTrain() {

    const data = {
        heading: 'GTX',
        span: 'TM',
        textTwo: ` VTX™ (Virtual Training Xperience) is a virtual training experience that emulates the outdoor group tasks as they exist on a real GTO ground across SSBs and AFSBs.
         It offers aspirants a first-hand visual and mental experience of the tasks before they encounter them physically — building clarity and confidence.`,

        text: ' See the GTO ground before you step onto it.',
        textThree: 'Virtual Training Xperience',
        color: true,
        banner: '/assets/website/GTOCourseThumbnail.png'
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




            <CustomHeader text={data.text} textTwo={data.textTwo} textThree={data.textThree} color={data?.color} banner={data?.banner} />

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
            <section className="enable-section sectionspace80">
                <div className="container">
                    <div className="row align-items-center g-4">


                        <div className="col-lg-5">
                            <div className="sct-title mb-3">
                                <h2>What VTX™  enables</h2>
                            </div>
                            <p className="enable-subtitle"> Helps aspirants:</p>

                            <div className="enable-list">
                                <div className="enable-item">
                                    <i className="fa fa-eye"></i>
                                    <span>VISUALISE TASK LAYOUTS AND SEQUENCING</span>
                                </div>

                                <div className="enable-item">
                                    <i className="fa fa-users"></i>
                                    <span>UNDERSTAND GROUP MOVEMENT AND TIMING</span>
                                </div>

                                <div className="enable-item">
                                    <i className="fa fa-gears"></i>
                                    <span>REDUCE AVOIDABLE ANXIETY FROM UNFAMILIARITY</span>
                                </div>

                                <div className="enable-item">
                                    <i className="fa fa-bullseye"></i>
                                    <span>FOCUS ON NATURAL BEHAVIOUR AND LEADERSHIP</span>
                                </div>
                            </div>



                        </div>


                        <div className="col-lg-7">
                            <div className="enable-image-wrap">
                                <img src="/assets/vtx1.png" alt="Enable Image" />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="enable-section sectionspace80">
                <div className="container">

                    <div className="row align-items-center g-4">

                        {/* IMAGE */}
                        <div className="col-lg-7 order-2 order-lg-1">
                            <div className="enable-image-wrap">
                                <img src="/assets/Vtxnot.png" alt="Enable Image" />
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="col-lg-5 order-1 order-lg-2">
                            <div className="sct-title mb-3 mt-4">
                                <h2>What VTX™ is not</h2>
                            </div>

                            <div className="enable-list">
                                <div className="enable-item">
                                    <i className="fa fa-map-marker"></i>
                                    <span>A replacement for the real GTO ground</span>
                                </div>

                                <div className="enable-item">
                                    <i className="fa fa-graduation-cap"></i>
                                    <span>A coaching shortcut</span>
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


            <From />
            <Footer />


        </>
    )
}

export default GtoTrain