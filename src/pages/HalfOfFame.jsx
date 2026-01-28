import React, { useState, useEffect } from 'react'
import CustomHeader from '../components/CustomHeader'
import From from './From'
import Footer from './Footer'
import CustomButton from '../components/CustomButton'

function HalfOfFame() {

    const data = {
        heading: 'Hall of Fame',
        text: `At SSB with ISV, we celebrate candidates who didn’t just prepare, they evolved...`,
        banner: '/assets/website/halloffame_banner.png'
    }

    

    /* ================= STATE ================= */
    const [candidates, setCandidates] = useState([])
    const [loading, setLoading] = useState(true)

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
    const columns = splitIntoColumns(visibleCandidates, 3)

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
            <CustomHeader heading={data.heading} text={data.text} banner={data.banner} />

            <section className="container sectionspace80">
                <div className="hall-of-fame-section">
                    <div className="row g-4 col-12 mx-auto">

                        {columns.map((column, colIndex) => (
                            <div key={colIndex} className="col-lg-4 col-md-6">
                                <div className={`hof-column pattern-${colIndex + 1}`}>

                                    {column.map((candidate, index) => (
                                        <div
                                            key={candidate._id}
                                            className={`Hall-of-fame-card `}
                                        >
                                            <img
                                                src={candidate.img}
                                                alt={candidate.name}
                                            />
                                            <div className="hof-content">
                                                <h5>{candidate.name}</h5>
                                                <span>{candidate.board}</span>
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

            <From />
            <Footer />
        </>
    )
}

export default HalfOfFame
