import React from 'react'
import CustomHeader from '../components/CustomHeader'
import Methodology from '../components/Methodology'
import TipsToExcel from '../components/TipsToExcel'
import SelectionMap from '../components/SelectionMap'
import DaySchedule from '../components/DaySchedule'
// import From from './From'
import Footer from './Footer'
import Faq from '../components/Faq'
import { Helmet } from 'react-helmet-async'
import { faqData } from '../util/data'

function SsbPage() {

    const data = {
        heading: 'What is SSB?',
        textTwo: `The Services Selection Board (SSB) is not an exam. It is a five-day personality assessment board designed to identify shades of officer-like qualities in candidates aspiring to join the Indian Armed Forces in the officer cadre. From psychological tests and group tasks to personal interviews, the SSB process evaluates how you think, act, decide, and lead under pressure.`,
        banner: '/assets/website/Whatisssb_banner.webp'
    }

    return (
        <>
            <Helmet>
                <title>
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    What is Services Selection Board? | Complete SSB Selection Explained
                </title>

                <meta
                    name="description"
                    content=" Learn how the Services Selection Board (SSB) interview works, including screening tests, psychology assessments, GTO tasks, personal interview and officer-like qualities evaluation."
                />

                {/* *ABOUT SSB PAGE* */}

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
                                "name": "About SSB",
                                "item": "https://ssbwithisv.in/aboutSSB"
                            }
                        ]
                    })}
                </script>
                <link rel="canonical" href="https://ssbwithisv.in/aboutSSB" />
            </Helmet>

            <CustomHeader heading={data.heading} textTwo={data.textTwo} banner={data?.banner} />


            <section className="ssb-philosophy-section sectionspace80">
                <div className="container">

                    <div className="row justify-content-center">
                        <div className="col-lg-10">

                            <div className="sct-title mb-4 text-center">
                                <h2>Philosophy of SSB</h2>
                            </div>

                            <p className="ssb-philosophy-text">
                                The SSB selection system is based on behavioural assessment rather than theoretical testing.
                                The philosophy behind the process is that leadership potential cannot be accurately measured
                                through written examinations alone.
                            </p>

                            <p className="ssb-philosophy-text">
                                Instead, the SSB evaluates how candidates think, act, communicate, and interact with others
                                in different situations. By observing candidates across multiple activities, the board gains
                                a comprehensive understanding of their personality and suitability for military leadership.
                            </p>

                            <p className="ssb-philosophy-text">
                                The selection process focuses on identifying individuals who demonstrate initiative,
                                responsibility, cooperation, determination, and clarity of thought, which together form
                                the foundation of officer-like qualities in the Armed Forces.
                            </p>

                        </div>
                    </div>

                    {/* SECOND PART */}



                </div>
            </section>



            <Methodology />
            <DaySchedule />
            <TipsToExcel />
            <SelectionMap />

            <section className="ssb-philosophy-section sectionspace80">
                <div className="container">

                    <div className="row justify-content-center mt-5">
                        <div className="col-lg-10">

                            <div className="sct-title mb-4 text-center">
                                <h2>The Five-Day SSB Interview Process</h2>
                            </div>

                            <p className="ssb-philosophy-text">
                                The SSB interview process typically spans five days, during which candidates are assessed
                                through multiple evaluation methods. Each stage is designed to observe different aspects
                                of a candidate’s personality and behaviour.
                            </p>

                            <p className="ssb-philosophy-text">
                                Candidates are evaluated by three independent assessors:
                            </p>

                            <ul className="ssb-assessor-list">
                                <li>Psychologist</li>
                                <li>Group Testing Officer (GTO)</li>
                                <li>Interviewing Officer (IO)</li>
                            </ul>

                            <p className="ssb-philosophy-text">
                                This multi-dimensional evaluation system ensures that a candidate’s personality is
                                assessed from different perspectives before the final recommendation is made.
                            </p>

                            <p className="ssb-methodology-link">
                                Methodology of Selection of Officers at Services Selection Board
                            </p>

                        </div>
                    </div>
                </div>

            </section>

            <Faq data={faqData} />

            {/* <Faq /> */}
            <Footer />



        </>
    )
}

export default SsbPage

// remov index
// hover on any index section and
// then glow state
// NSB Vishakhapatnam
// 33 SSB Bhopal
// 12 SSB Bangalore
// SSB (Kolkata)