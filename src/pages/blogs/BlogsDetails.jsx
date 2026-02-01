

// const location

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CustomHeader from '../../components/CustomHeader'
import styles from '../../style/BlogDetails.module.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Footer from '../Footer'
import { BiArrowBack } from "react-icons/bi";


function BlogsDetails() {
    const { id } = useParams()
    // const [blog, setBlog] = useState(null)
    // const [loading, setLoading] = useState(true)

    // useEffect(() => {
    //     const fetchBlog = async () => {
    //         try {
    //             const res = await axios.get(
    //                 `https://api.ssbwithisv.in/api/blog/${id}`
    //             )
    //             setBlog(res.data)
    //         } catch (err) {
    //             console.error(err)
    //         } finally {
    //             setLoading(false)
    //         }
    //     }

    //     fetchBlog()
    // }, [id])



    const location = useLocation()
    const { path } = location.state
    const blog = path

    const navigate = useNavigate()
    // console.log(blog)

    // if (loading) return <p className="text-center mt-5">Loading...</p>
    // if (!blog) return <p className="text-center mt-5">Blog not found</p>

    return (
        <>
            <CustomHeader
                heading="Blog Details"
                text="Detailed view of the selected blog post."
                banner={'/assets/website/blogs_banner.png'}

            />

            <section className={styles.blogDetail}>

                <div className={styles.container}>

                    {/* META */}
                    <p className={styles.meta}>
                        {new Date(blog.createdAt).toDateString()}
                    </p>

                    {/* TITLE */}

                    <div className={styles.arrowBackBtn}>

                        <div className={styles.arrowBackBtn}>
                            <BiArrowBack style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
                        </div>
                        <h1 className={styles.title}>
                            {blog.title}
                        </h1>
                    </div>



                    {/* TAG */}


                    {/* INTRO / SHORT DESC */}
                    <p className={styles.intro}>
                        {blog.shortDescription}
                    </p>

                    {/*TIME DURATION */}
                    <p className={styles.intro}>
                        Time: {blog?.timeDuration}
                    </p>

                    {/* IMAGE SLIDER */}
                    {blog.images?.length > 0 && (
                        <div className={styles.sliderWrapper}>
                            <Swiper spaceBetween={20}>
                                {blog.images.map((img, i) => (
                                    <SwiperSlide key={i}>
                                        <div className={styles.BlogImageWrapper}>
                                            <img src={img} alt={blog.title} />
                                            <div className={styles.imageOverlay}></div>
                                            <p className={styles.TextImage}>{blog?.imageText}</p>
                                        </div>
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




