import React from 'react'
import CustomHeader from '../components/CustomHeader'
import Methodology from '../components/Methodology'
import TipsToExcel from '../components/TipsToExcel'
import SelectionMap from '../components/SelectionMap'
import DaySchedule from '../components/DaySchedule'
import From from './From'
import Footer from './Footer'
import Faq from '../components/Faq'
import { Helmet } from 'react-helmet-async'

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
                    content="Understand the Services Selection Board process, tests, OLQs and assessment system explained clearly by experienced SSB mentors."
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
            <Methodology />
            <DaySchedule />
            <TipsToExcel />
            <SelectionMap />
            <Faq />
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