import React, { useState, useEffect } from 'react'
import CustomHeader from '../components/CustomHeader'
import From from './From'
import Footer from './Footer'
import CustomButton from '../components/CustomButton'
import { Helmet } from 'react-helmet-async'
import { hallOfFameFaqData } from '../util/data'
import Faq from '../components/Faq'

function HalfOfFame() {

    const data = {
        heading: 'Hall of Fame',
        text: `At SSB with ISV, we celebrate candidates who didn’t just prepare, they evolved...`,
        banner: '/assets/website/halloffame_banner.webp',
        color2: true
    }



    /* ================= STATE ================= */
    const [candidates, setCandidates] = useState([])
    const [loading, setLoading] = useState(true)
    const [columnCount, setColumnCount] = useState(3)

    useEffect(() => {
        const updateColumns = () => {
            if (window.innerWidth < 768) {
                setColumnCount(1)       // Mobile
            } else if (window.innerWidth < 992) {
                setColumnCount(2)       // Tablet
            } else {
                setColumnCount(3)       // Desktop
            }
        }

        updateColumns()
        window.addEventListener("resize", updateColumns)

        return () => window.removeEventListener("resize", updateColumns)
    }, [])

    /* ================= API CALL ================= */
    useEffect(() => {
        fetch("https://api.ssbwithisv.in/api/allCandidates")
            .then(res => res.json())
            .then(data => {
                setCandidates(data)   // API returns array
                setLoading(false)
            })
            .catch(err => {
                console.error("API Error:", err)
                setLoading(false)
            })
    }, [])

    /* ================= HELPERS ================= */
    const splitIntoColumns = (data, columns = 3) => {
        const result = Array.from({ length: columns }, () => [])
        data.forEach((item, index) => {
            result[index % columns].push(item)
        })
        return result
    }

    const patterns = {
        0: ['small', 'small', 'large', 'small', 'small', 'large'],
        1: ['large', 'small', 'small', 'large', 'small', 'small'],
        2: ['small', 'large', 'small', 'small', 'large', 'small'],
    }

    /* ================= PAGINATION ================= */
    const ITEMS_PER_PAGE = 6
    const [page, setPage] = useState(1)

    const visibleCandidates = candidates.slice(0, page * ITEMS_PER_PAGE)
    // const columns = splitIntoColumns(visibleCandidates, 3)

    const columns = splitIntoColumns(visibleCandidates, columnCount)

    const handleLoadMore = () => {
        if (page * ITEMS_PER_PAGE < candidates.length) {
            setPage(prev => prev + 1)
        }
    }

    /* ================= RENDER ================= */

    if (loading) {
        return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>
    }

    return (
        <>
            <Helmet >
                <title>
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    Hall of Fame | SSB With ISV
                </title>

                <meta
                    name="description"
                    content=" Explore success stories of candidates recommended by the Services Selection Board after mentoring with SSB with ISV. Real journeys of defence aspirants who demonstrated officer-like qualities and leadership."
                />

                {/* *HALL OF FAME* */}

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
                                "name": "Hall of Fame",
                                "item": "https://ssbwithisv.in/HalfOfFame"
                            }
                        ]
                    })}
                </script>
                {/* <link rel="canonical" href="https://ssbwithisv.in/magazine" /> */}
                <link rel="canonical" href="https://ssbwithisv.in/HalfOfFame" />
            </Helmet>
            <CustomHeader heading={data.heading} text={data.text} banner={data.banner} color2={data.color2} />




            <section className="GTO-what-is-not-section sectionspace80">

                <div className="container">

                    <p className="hall-intro-text">
                        The SSB interview is one of the most demanding leadership selection systems,
                        evaluating a candidate’s personality, decision-making ability, teamwork,
                        communication, and officer-like qualities through a structured five-day
                        assessment process.
                    </p>

                    <p className="hall-intro-text">
                        Candidates featured in this Hall of Fame have demonstrated the behavioural
                        traits and leadership potential expected from officers in the Armed Forces.
                        Their success stories reflect the importance of self-awareness, preparation,
                        and consistent effort during SSB interview preparation.
                    </p>

                    <p className="hall-intro-text">
                        Through structured mentoring, personality development training, and guidance
                        on psychology tests, GTO tasks, and personal interview preparation, these
                        aspirants prepared themselves to face the SSB selection process with clarity
                        and confidence.
                    </p>

                    <p className="hall-intro-text">
                        The Hall of Fame serves as an inspiration for future candidates preparing
                        for NDA, CDS, AFCAT, and other defence entry schemes, showing that dedication
                        and authentic preparation can lead to success in the SSB interview.
                    </p>

                </div>


                <div className="container what-is-not-text-box px-0 mt-5">
                    <div className="row g-0">

                        <div className="col-lg-12 px-0">
                            <div style={{ padding: '0' }} className="what-is-not-text">
                                <div className="sct-title-section-gtx ">

                                    <h1 className="sct-title_Sec_gtx ">


                                        <span className='title-gtx shimmerText_sec'>
                                            करम वही करो जो करना ही फल लगे, क्युकी करम ही धर्म ।
                                        </span>
                                    </h1>
                                </div>




                            </div>
                        </div>
                    </div>
                </div>
            </section >

            <section style={{ paddingTop: '0' }} className="container sectionspace80">
                <div className="hall-of-fame-section">
                    <div className="row g-4 col-12 mx-auto">

                        {columns.map((column, colIndex) => (
                            // <div key={colIndex} className="col-lg-4 col-md-6">

                            <div
                                key={colIndex}
                                className={
                                    columnCount === 1
                                        ? "col-12"
                                        : columnCount === 2
                                            ? "col-md-6 col-12"
                                            : "col-lg-4 col-md-6 col-12"
                                }
                            >
                                <div className={`hof-column pattern-${colIndex + 1}`}>

                                    {column.map((candidate, index) => (
                                        <div
                                            key={candidate._id}
                                            className={`Hall-of-fame-card `}
                                        >
                                            <img
                                                src={candidate?.img}
                                                alt={candidate?.name}
                                            />
                                            <div className="hof-content">
                                                <h2>{candidate.name}</h2>
                                                <span>{candidate?.board}</span>
                                                <br />
                                                <span>{candidate?.entry}</span>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {/* ================= PAGINATION FOOTER ================= */}

                <div className="col-12 row mx-auto mt-5 text-center align-items-center">
                    <div className="col-sm-4 col-3"></div>

                    <div className="col-sm-4 col-6 mx-auto d-flex justify-content-center">
                        {page * ITEMS_PER_PAGE < candidates.length && (
                            <CustomButton
                                text="Load More"
                                onClick={handleLoadMore}
                            />
                        )}
                    </div>

                    <div className="col-sm-4 col-3 text-end">
                        <span className="bottom-paginate">
                            {Math.min(page * ITEMS_PER_PAGE, candidates.length)} of {candidates.length}
                        </span>
                    </div>
                </div>
            </section>


            <Faq data={hallOfFameFaqData} />
            <From />
            <Footer />
        </>
    )
}

export default HalfOfFame
