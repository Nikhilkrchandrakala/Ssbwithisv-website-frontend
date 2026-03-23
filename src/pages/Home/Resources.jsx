import styles from "../../style/Resources.module.css";
import { resourcesData } from "../../util/data";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules";
import { Autoplay } from "swiper/modules";



import "swiper/css";
import "swiper/css/pagination"
import CustomButton from "../../components/CustomButton";
import Heading from "../../components/Heading";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserProfileQuery } from "../../redux/api";

const Resources = () => {

    const navigate = useNavigate()

    // const [blogs, setBlogs] = useState([])
    // const [loading, setLoading] = useState(true)
    // const [error, setError] = useState(null)


    const { data } = useUserProfileQuery()


    return (
        <section className={styles.resourcesSection}>
            {/* <div className={styles.sectionGlowTwo}></div> */}

            {/* HEADING */}
            {/* <h2 className={styles.heading}>
                Resources for <span>SSB preparation</span>
            </h2> */}

            <div style={{ marginTop: '0' }} className="headingOfMargin  pl">
                <Heading h1='Resources for' t1='SSB preparation' />

            </div>
            {/* SCROLL LIST */}
            <div className={styles.cardsWrapper}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={20}

                    loop={true}
                    autoplay={{
                        delay: 1500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}

                    modules={[Autoplay]}   // ✅ THIS IS REQUIRED

                    breakpoints={{
                        0: { slidesPerView: 1 },
                        560: { slidesPerView: 2 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1420: { slidesPerView: 5 },
                    }}

                    className={styles.mySwiper}
                >


                    {resourcesData?.map((item , index) => (
                        <SwiperSlide>

                            <div key={index} className={styles.card}>
                                <div className={styles.imageBox}>
                                    <img src={item.image} alt="" />
                                    {/* <span className={styles.overlayText}>SSB WITH ISV</span> */}
                                </div>

                                {/* <div className={styles.description}>
                                    <p >{item.title}</p>
                                </div> */}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* <div> */}
            {data ? "" : (<p className='downloadYour'>
                <span onClick={() => navigate('/SignUp')}>Sign up</span> to download your free magazine.
            </p>)}
            {/* </div> */}

            <div className="KnowMoreBtn">
                <CustomButton text='EXPLORE MORE' onClick={() => navigate('/Magazine')} />
            </div>
        </section>
    );
};

export default Resources;




