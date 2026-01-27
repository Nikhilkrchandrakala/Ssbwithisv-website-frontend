import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton";
import Heading from "../../components/Heading";
import styles from "../../style/UniquePedagogy.module.css";
import HeadingTwo from "../../components/HeadingTwo";
import { useRef, useState } from "react";

import { IoVolumeMuteSharp } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";

const UniquePedagogy = () => {


    const navigate = useNavigate()

    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);



    return (
        <section className={styles.wrapper}>
            {/* TOP CONTENT */}

            {/* <div className={styles.top}> */}
            {/* <div className={styles.left}> */}
            <div className="pl mb">


                <HeadingTwo h1={'Unique pedagogy:'} t1='VTX™' />
            </div>
            {/* </div> */}
            {/* </div> */}
            <div className={styles.top}>
                <div className={styles.left}>

                    <p >
                        Our pedagogy includes VTX™ (Virtual Training Xperience); a first-of-its-kind virtual GTO ground, created to replicate the outdoor group tasks of a real GTO ground as they exist across Services Selection Boards and Air Force Selection Boards. This approach represents a capability not seen in conventional SSB preparation.
                    </p>
                </div>



                <div className={styles.topLine}>
                    <span className={styles.line}></span>
                    <span className={`${styles.dot} ${styles.dotLeftToRight}`}></span>
                </div>

                <div className={styles.right}>
                    <p>
                        VTX allows aspirants to see, understand, and mentally experience the structure of GTO tasks before they step onto the physical ground — how tasks are laid out, how groups move, how time pressure unfolds, and how observation happens in real conditions. It brings the unseen into view.
                    </p>
                </div>
            </div>

            {/* IMAGE SECTION */}
            {/* <div className={styles.imageSection}></div> */}

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
                <source src="/assets/video/vtx.mp4" type="video/mp4" />

            </video>

            <div className='d-flex justify-content-end  '>
                <button className={styles.MuteBtn} onClick={() => {
                    setIsMuted(!isMuted);
                    videoRef.current.muted = !isMuted;
                }}>
                    {!isMuted ? <VscUnmute /> : <IoVolumeMuteSharp />}
                </button>
            </div>

            <div className={styles.KnowMoreBtn}>
                <CustomButton text='KNOW MORE' onClick={() => navigate('/GtoTrain')} />
            </div>
        </section >
    );
};

export default UniquePedagogy;
