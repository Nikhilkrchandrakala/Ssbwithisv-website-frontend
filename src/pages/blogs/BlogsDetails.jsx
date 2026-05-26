import  { useEffect, useState } from 'react'
// import axios from 'axios'
import CustomHeader from '../../components/CustomHeader'
import styles from '../../style/BlogDetails.module.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Footer from '../Footer'
import { BiArrowBack } from "react-icons/bi";

// import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useAllBlogsByIdQuery, useAllBlogsQuery } from '../../redux/api'
import { Helmet } from 'react-helmet-async'

// import "swiper/css";

function BlogsDetails() {
    const { slug } = useParams()
    const location = useLocation()
    const path = location?.state?.id

    const { data: blogByIdData } = useAllBlogsByIdQuery(path, { skip: !path })
    const { data: allBlogsData } = useAllBlogsQuery(undefined, { skip: !!path })

    const navigate = useNavigate()

    // Resolve the active blog
    let blog = null
    if (path) {
        blog = blogByIdData
    } else if (allBlogsData && slug) {
        const matchedBlog = allBlogsData.find(b => {
            const computedSlug = b.title
                ?.toLowerCase()
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            return computedSlug === slug;
        });
        if (matchedBlog) {
            blog = { data: matchedBlog };
        }
    }

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

    if (!blog) {
        return (
            <>
                <CustomHeader
                    heading="Blog Details"
                    text="Loading blog post details..."
                    banner={'/assets/website/blogs_banner.webp'}
                />
                <section className={styles.blogDetail}>
                    <div className={styles.container} style={{ textAlign: 'center', padding: '100px 0' }}>
                        <p style={{ color: 'var(--white)', fontSize: '18px' }}>Loading blog details or blog not found...</p>
                        <button 
                            className="thm-btn px-4 py-2 mt-3" 
                            style={{ background: '#d2a100', color: '#1a1a1a', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }} 
                            onClick={() => navigate('/blogs')}
                        >
                            Back to Blogs
                        </button>
                    </div>
                </section>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Helmet>
                <title>{blog?.data?.title ? `${blog?.data?.title} | SSB Preparation Blog | SSB with ISV` : 'Blog Details | SSB with ISV'}</title>
                <meta
                    name="description"
                    content={blog?.data?.shortDescription || "Read expert SSB preparation guides, tips and insights on SSB psychology tests, GTO tasks, and interview preparation."}
                />
                <link rel="canonical" href={`https://ssbwithisv.in/blogs/${blog?.data?._id || ''}`} />
            </Helmet>

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
                        {new Date(blog?.data?.createdAt).toDateString()}
                    </p>

                    {/* TITLE */}
                    <h1 className={styles.title}>
                        {blog?.data?.title}
                    </h1>

                    {/* INTRO / SHORT DESC */}
                    <p className={styles.intro}>
                        {blog?.data?.shortDescription}
                    </p>

                    {/*TIME DURATION */}
                    {blog?.data?.timeDuration && (
                        <p className={styles.intro}>
                            Time: {blog?.data?.timeDuration}
                        </p>
                    )}

                    {/* IMAGE SLIDER */}
                    {blog?.data?.images?.length > 0 && (
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
                                {blog?.data?.images.map((img, i) => (
                                    <SwiperSlide key={i}>
                                        <div className={styles.BlogImageWrapper}>
                                            <img src={img?.imageUrl} alt={blog?.data?.title} />
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
                        dangerouslySetInnerHTML={{ __html: blog?.data?.content }}
                    />

                    {/* AUTHOR QUOTE */}
                    {blog?.data?.authorQuote && (
                        <blockquote className={styles.quote}>
                            <span className={styles.quoteDot}></span>
                            <div>
                                <p>{blog?.data?.authorQuote}</p>
                                <span className={styles.quoteAuthor}>
                                    — {blog?.data?.authorName}
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