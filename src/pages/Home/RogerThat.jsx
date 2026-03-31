import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from '../../style/RogerThat.module.css'
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useRef, useState } from "react";
import CustomButton from "../../components/CustomButton";
import Heading from "../../components/Heading";
import { Helmet } from "react-helmet-async";

const RogerThat = () => {
    const array = [
        { id: "1", img: "/assets/robot2.webp", link: 'https://youtu.be/NGAHJlsmG7s?si=DT6gxCsC2UTnbkHa' },
        { id: "2", img: "/assets/hq720.webp", link: 'https://youtu.be/_ZFpDTrM60E?si=lmdwDKmC2vs4WT0s' },
        { id: "3", img: "/assets/hq7201.webp", link: 'https://youtu.be/_ZFpDTrM60E?si=T8sWXk7PQ0khT8G0' },
        { id: "4", img: "/assets/hq720.webp", link: 'https://youtu.be/nOqEUXMhAyQ?si=aRfuo9xTFVCJmyZC' },
    ];


    // useRef

    const prevRef = useRef(null);
    const nextRef = useRef(null);


    const swiperRef = useRef(null);
    const [activeVideo, setActiveVideo] = useState(null);

    // const handelSendUrl = () => {
    //     https://www.youtube.com/@rogerthatwithnkc
    // }

    const handelSendUrl = () => {
        window.open("https://www.youtube.com/@rogerthatwithnkc", "_blank");
    };


    const getVideoId = (url) => {
        return url.split("youtu.be/")[1]?.split("?")[0];
    };


    return (
        <>
            
            <section className={styles.section}>
                {/* HEADER */}
                <div className={styles.header}>
                    <div>

                        <div style={{ marginTop: '0' }} className="headingOfMargin">
                            <Heading h1={'Roger That'} t1='with NKC' />
                        </div>
                        <p className={styles.subTitle}>Our Official Podcast channel</p>
                        <p style={{ fontWeight: 'lighter' }} className={styles.description}>
                            Roger That with NKC is Lt. Commander Nikhil Kumar Chandrakala’s military leadership and strategy channel focused on deconstructing real stories from the Indian Armed Forces and unpacking leadership principles with curated Xperiencebased insights from an ex-GTO and Warship Captain.
                        </p>
                    </div>

                    {/* ARROWS */}
                    <div className={styles.arrows}>
                        <div ref={prevRef} className={styles.arrow}><IoIosArrowBack /></div>
                        <div ref={nextRef} className={styles.arrow}><IoIosArrowForward /></div>
                    </div>
                </div>

                {/* SWIPER */}
                <Swiper
                    onSwiper={(swiper) => (swiperRef.current = swiper)}

                    slidesPerView={2}
                    spaceBetween={40}
                    loop={true}

                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
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
                        1024: { slidesPerView: 2 },
                    }}

                    modules={[Navigation, Autoplay, Pagination]}
                    className={styles.mySwiper}
                >



                    {array.map((e) => (
                        <SwiperSlide key={e.id}>
                            <div className={styles.videoCard}>

                                {/* IMAGE */}
                                {activeVideo !== e.id && (
                                    <>
                                        <img src={e.img} alt={e.id} />

                                        {/* HOVER OVERLAY */}
                                        <div
                                            className={styles.overlay}
                                            onClick={() => {
                                                setActiveVideo(e.id);
                                                swiperRef.current?.autoplay.stop(); // 🛑 stop auto scroll
                                            }}
                                        >
                                            <span className={styles.playIcon}>▶</span>
                                        </div>
                                    </>
                                )}

                                {/* VIDEO */}
                                {activeVideo === e.id && (
                                    // <iframe
                                    //     src={`https://www.youtube.com/embed/${getVideoId(e.link)}?autoplay=1`}
                                    //     frameBorder="0"
                                    //     allow="autoplay; encrypted-media"
                                    //     allowFullScreen
                                    // />

                                    <iframe
                                        src={`https://www.youtube.com/embed/${getVideoId(e.link)}?autoplay=1`}
                                        frameBorder="0"
                                        allow="autoplay; encrypted-media"
                                        allowFullScreen
                                    >

                                    </iframe>

                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                    {/* </Swiper> */}

                </Swiper>

                {/* CUSTOM PAGINATION */}
                <div className={styles.paginationWrapper}>
                    <div style={{ width: 'fit-content' }} className="roger-pagination"></div>
                </div>

                {/* CTA */}
                <div className='col-12 text-center d-flex justify-content-center mt-4'>
                    {/* <button className={styles.ctaBtn}></button> */}
                    <CustomButton text={'VISIT OUR CHANNEL'} onClick={handelSendUrl} />
                </div>
            </section >
        </>
    );
};

export default RogerThat;
