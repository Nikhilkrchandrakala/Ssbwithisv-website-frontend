// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
import CustomHeader from '../../components/CustomHeader'
import styles from '../../style/Blog.module.css'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAllBlogsQuery } from '../../redux/api'

function Blogs() {
    const data = {
        heading: 'Blogs',
        text: 'SSB with ISV blogs bring you practical tips, real insights, and current topics to help you prepare smarter for the SSB.',

        banner: '/assets/website/blogs_banner.webp',
    }

    const navigate = useNavigate()


    /* ================= FETCH BLOGS ================= */


    const { data: blogs, isLoading } = useAllBlogsQuery()

    // useEffect(() => {
    //     const fetchBlogs = async () => {
    //         try {
    //             const res = await axios.get(
    //                 'https://api.ssbwithisv.in/api/allBlogs'
    //             )
    //             setBlogs(res.data)
    //         } catch (err) {
    //             console.error(err)
    //             setError('Failed to load blogs')
    //         } finally {
    //             setLoading(false)
    //         }
    //     }

    //     fetchBlogs()
    // }, [])

    /* ================= UI STATES ================= */
    // if (loading) {
    //     return <p className="text-center mt-5">Loading blogs...</p>
    // }

    // if (error) {
    //     return <p className="text-center mt-5 text-danger">{error}</p>
    // }

    // console.log(blogs)


    const handelNavigate = (blog) => {
        const slug = blog?.title
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");

        navigate(`/blogs/${slug}`, {
            state: {
                id: blog?._id
            }
        });
    };

    return (
        <>

            <Helmet>
                <title>
                    SSB Preparation Blog | Expert SSB Interview Tips & Guides | SSB with ISV
                </title>
                <meta
                    name="description"
                    content="Read expert SSB preparation guides, tips and insights on SSB psychology tests, GTO tasks, interview preparation and officer-like qualities. Written by ex-SSB assessors."
                />

                {/* *BLOG PAGE* */}

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
                                "name": "Blogs",
                                "item": "https://ssbwithisv.in/blogs"
                            }
                        ]
                    })}
                </script>
                <link rel="canonical" href="https://ssbwithisv.in/blogs" />
            </Helmet>

            <CustomHeader heading={data.heading} text={data.text} banner={data.banner} />

            <section className={styles.blogSection}>
                <div className="container">
                    {isLoading ? (
                        <p className="text-center mt-5">Loading blogs...</p>
                    ) : blogs?.map((blog) => (
                        <div
                            key={blog._id}
                            onClick={() => handelNavigate(blog)}
                            className={styles.blogCard}
                        >
                            <div className={styles.imageWrapper}>
                                <img
                                    src={
                                        blog.images?.[0]?.imageUrl
                                    }
                                    alt={blog.title}
                                />
                                <div className={styles.imageOverlay}></div>
                            </div>

                            <div className={styles.contentWrapper}>





                                <h2 className={styles.blogTitle}>
                                    {blog.title}
                                </h2>

                                <p className={styles.blogDescription}>
                                    {blog.shortDescription}
                                </p>

                                <p className={styles.blogDate}>
                                    {new Date(blog.createdAt).toDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Blogs
