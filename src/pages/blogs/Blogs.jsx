import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CustomHeader from '../../components/CustomHeader'
import styles from '../../style/Blog.module.css'
import { useNavigate } from 'react-router-dom'

function Blogs() {
    const data = {
        heading: 'Blogs',
        text: 'SSB with ISV blogs bring you practical tips, real insights, and current topics to help you prepare smarter for the SSB.',

        banner: '/assets/website/blogs_banner.png',
    }

    const navigate = useNavigate()

    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    /* ================= FETCH BLOGS ================= */
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axios.get(
                    'https://api.ssbwithisv.in/api/allBlogs'
                )
                setBlogs(res.data)
            } catch (err) {
                console.error(err)
                setError('Failed to load blogs')
            } finally {
                setLoading(false)
            }
        }

        fetchBlogs()
    }, [])

    /* ================= UI STATES ================= */
    // if (loading) {
    //     return <p className="text-center mt-5">Loading blogs...</p>
    // }

    // if (error) {
    //     return <p className="text-center mt-5 text-danger">{error}</p>
    // }

    console.log(blogs)


    const handelNavigate = (path) => {
        navigate('/blogsDetails', { state: { path } })
    }

    return (
        <>
            <CustomHeader heading={data.heading} text={data.text} banner={data.banner} />

            <section className={styles.blogSection}>
                <div className="container">
                    {blogs.map((blog) => (
                        <div
                            key={blog._id}
                            onClick={() => handelNavigate(blog)}
                            className={styles.blogCard}
                        >
                            <div className={styles.imageWrapper}>
                                <img
                                    src={
                                        blog.images?.[0] ||
                                        'https://via.placeholder.com/400x250?text=No+Image'
                                    }
                                    alt={blog.title}
                                />
                                <div className={styles.imageOverlay}></div>
                            </div>

                            <div className={styles.contentWrapper}>


                                <span className={styles.topicTag}>TOPIC CRITERIA</span>


                                <h3 className={styles.blogTitle}>
                                    {blog.title}
                                </h3>

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
