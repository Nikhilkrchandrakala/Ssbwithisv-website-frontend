import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CustomHeader from '../../components/CustomHeader'
import styles from '../../style/BlogDetails.module.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Footer from '../Footer'
import { BiArrowBack } from "react-icons/bi";

// import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// import "swiper/css";

function BlogsDetails() {
    const { id } = useParams()
    const location = useLocation()
    const { path } = location.state
    const blog = path
    const navigate = useNavigate()

    // State for controlling arrow visibility
    const [showBackArrow, setShowBackArrow] = useState(false)

    // Handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            // Check if user has scrolled past 100px (adjust as needed)
            if (window.scrollY > 5000) {
                setShowBackArrow(true)
            } else {
                setShowBackArrow(false)
            }
        }

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll)

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    // Alternative: Show arrow when CustomHeader is fully scrolled past
    // You might need to adjust the threshold based on your header height
    useEffect(() => {
        const headerHeight = 500 // Adjust this based on your actual header height
        const handleScroll = () => {
            if (window.scrollY > headerHeight) {
                setShowBackArrow(true)
            } else {
                setShowBackArrow(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <CustomHeader
                heading="Blog Details"
                text="Detailed view of the selected blog post."
                banner={'/assets/website/blogs_banner.webp'}
            />

            {/* Back Arrow - Only shows after scrolling */}
            <div className={`${styles.arrowBackContainer} ${showBackArrow ? styles.visible : styles.hidden}`}>
                <div className={styles.arrowBackBtn}>
                    <BiArrowBack
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(-1)}
                        title="Go back"
                    />
                </div>

                
            </div>

            <section className={styles.blogDetail}>
                <div className={styles.container}>
                    {/* META */}
                    <p className={styles.meta}>
                        {new Date(blog.createdAt).toDateString()}
                    </p>

                    {/* TITLE */}
                    <h1 className={styles.title}>
                        {blog.title}
                    </h1>

                    {/* INTRO / SHORT DESC */}
                    <p className={styles.intro}>
                        {blog.shortDescription}
                    </p>

                    {/*TIME DURATION */}
                    {blog?.timeDuration && (
                        <p className={styles.intro}>
                            Time: {blog.timeDuration}
                        </p>
                    )}

                    {/* IMAGE SLIDER */}
                    {blog.images?.length > 0 && (
                        <div className={styles.sliderWrapper}>
                            <Swiper
                                spaceBetween={20}
                                slidesPerView={1}
                                loop={true}
                                autoplay={{
                                    delay: 2000,       // 2 seconds
                                    disableOnInteraction: false
                                }}
                                modules={[Autoplay]}
                            >
                                {blog.images.map((img, i) => (
                                    <SwiperSlide key={i}>
                                        <div className={styles.BlogImageWrapper}>
                                            <img src={img?.imageUrl} alt={blog.title} />
                                            <div className={styles.imageOverlay}></div>
                                        </div>
                                        <p className={styles.TextImage}>{img?.imageText}</p>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}

                    {/* CONTENT (HTML) */}
                    <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* AUTHOR QUOTE */}
                    {blog.authorQuote && (
                        <blockquote className={styles.quote}>
                            <span className={styles.quoteDot}></span>
                            <div>
                                <p>{blog.authorQuote}</p>
                                <span className={styles.quoteAuthor}>
                                    — {blog.authorName}
                                </span>
                            </div>
                        </blockquote>
                    )}
                </div>
            </section>
            <Footer />
        </>
    )
}

export default BlogsDetails