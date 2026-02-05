import React from 'react'
import CustomHeader from '../components/CustomHeader'
import From from './From'
import Footer from './Footer'
import { Helmet } from 'react-helmet-async'

function Contact() {
    return (
        <>

            <Helmet>
                <title>
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    Contact SSB with ISV | SSB Coaching & Admissions
                </title>

                <meta
                    name="description"
                    content="Get in touch with SSB with ISV for admissions, counselling and expert guidance for SSB preparation and Armed Forces careers."
                />
            </Helmet>
            <CustomHeader heading={'Contact us'} text={`At CS Joint Services Academy, we believe every aspirant deserves personal guidance and clarity.
                Reach out to us for course details, counselling, or any queries related to SSB preparation.
                Our team is always ready to assist you on your journey to becoming an officer in the Indian Armed Forces.
                `}
                // banner={''}
                banner={'/assets/website/contact_us_banner.png'}

            />
            <From />
            <Footer />
        </>
    )
}

export default Contact