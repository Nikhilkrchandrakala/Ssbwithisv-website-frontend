import React, { useEffect, useState } from 'react'
import CustomHeader from '../components/CustomHeader'
import From from './From'
import Footer from './Footer'
import CustomButton from '../components/CustomButton'
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useGetAllMagazineQuery } from '../redux/api'

function Magnize() {

    const data =
    {
        heading: 'Roger That - Our monthly magazine',
        text: 'Our monthly magazine Roger That is your go- to resource for in-depth insights, real - world perspectives, and expert analysis tailored to the Services Selection Board (SSB) process. Curated with a strong focus on current affairs, the magazine features probable Group Discussion and Lecturette topics, helping aspirants stay informed, articulate, and assessment - ready',
        // textTwo: ` We’re not just an academy, we’re a close-knit mentoring community. At CSJSA, every aspirant is personally guided by Lt Cdr Nikhil, whose experience assessing over 12,500 SSB candidates shapes our focused,
        //                         psychology-driven approach to SSB preparation. Our goal is simple yet powerful: to help every deserving young aspirant realise the dream of becoming a commissioned officer in the Indian Armed Forces.`

        banner: '/assets/website/rogerthat_banner.webp'

    }


    const [magazines, setMagazines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadBtn, setDownloadBtn] = useState(true);
    const [selectedTag, setSelectedTag] = useState("all");


    const { data: allMagazineData = [], isSuccess } = useGetAllMagazineQuery();

    const filteredMagazines = isSuccess
        ? [...(selectedTag === "all"
            ? allMagazineData
            : allMagazineData.filter(item => item?.tags === selectedTag)
        )].sort((a, b) => new Date(b?.uploadDate) - new Date(a?.uploadDate))
        : [];





    // useEffect(() => {
    //     const loadMagazines = async () => {
    //         try {
    //             const data = await allMagazineData;
    //             console.log(data)
    //             setMagazines(data || []); // depending on API structure
    //         } catch (error) {
    //             console.log("Failed to load magazines");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadMagazines();
    // }, []);

    // console.log(magazines)

    // import axios from "axios";

    const token = localStorage.getItem('authToken')
    // console.log(token)

    const navigate = useNavigate()

    const downloadPdf = async (pdfPath) => {
        if (!token) {
            navigate('/SignIn')

        } else {

            setDownloadBtn(false)
            const url = `https://api.ssbwithisv.in/${pdfPath}`;

            const res = await axios.get(url, {
                responseType: "blob",
            });

            if (res) {
                setDownloadBtn(true)
            }

            const blob = new Blob([res.data], { type: "application/pdf" });
            const link = document.createElement("a");

            link.href = window.URL.createObjectURL(blob);
            link.download = "magazine.pdf";
            link.click();
        }
    };

    // const filteredMagazines =
    //     selectedTag === "all"
    //         ? magazines
    //         : magazines.filter((item) => item.tags === selectedTag);





    return (
        <>
            <Helmet >
                <title>
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    SSB Current Affairs & Insights | Defence Aspirants Magazine
                </title>

                <meta
                    name="description"
                    content="Curated current affairscontent to help SSB aspirants excel in interviews, group discussions and lecturette."
                />

                {/* *MAGAZINE PAGE* */}

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
                                "name": "Magazine",
                                "item": "https://ssbwithisv.in/magazine"
                            }
                        ]
                    })}
                </script>
                <link rel="canonical" href="https://ssbwithisv.in/magazine" />
            </Helmet>
            <CustomHeader heading={data?.heading} text={data?.text} banner={data?.banner} />

            <section className="container sectionspace80">
                <div className="row align-items-center justify-content-between g-3">

                    {/* LEFT TEXT */}
                    {!token && <div className="col-12 col-md-8">
                        <p className="d-flex justify-content-start m-0 downloadYourRes">
                            <span onClick={() => navigate('/SignUp')}> Sign up</span> to download your free magazine.

                        </p>
                    </div>}

                    {/* RIGHT SELECT */}
                    <div className="col-12 col-md-4 text-md-end">
                        <form>
                            <div className="form-group">


                                <select
                                    className="form-select thm-select w-100 w-md-auto"
                                    value={selectedTag}
                                    onChange={(e) => setSelectedTag(e.target.value)}
                                >
                                    <option value="all">All Resources</option>
                                    <option value="Magazine">Current Affairs Magazine</option>
                                    <option value="Books">Books</option>
                                    <option value="SSBPrep">SSB Prep Material</option>
                                </select>

                            </div>
                        </form>
                    </div>

                </div>

                <div style={{ marginTop: '0' }} className="col-12 mx-auto row g-4">
                    {filteredMagazines?.map((item, index) => (
                        // <div className="col-lg-4 col-md-6 col-sm-6" key={item._id || index}>
                        <div className="col-lg-4 col-md-6 col-6" key={item._id || index}>

                            <div className="card magazine-card mt-4">

                                {/* HOVER DOWNLOAD BUTTON */}
                                <div className="magazine-hover">


                                    <CustomButton text={downloadBtn ? 'Download PDF' : "LOADING..."} onClick={() => downloadPdf(item.pdfFilePath)} />
                                </div>

                                <div className="card-header magazine-card-head">
                                    <div className="card-title magazine-card-title">
                                        {item?.pdfTitle}
                                    </div>
                                </div>

                                <div className="card-body magazine-card-body">
                                    <img
                                        src={`https://api.ssbwithisv.in/${item?.magazineFrontImage}`}
                                        className="magazine-card-img"
                                        alt="Magazine Image"
                                    />
                                </div>

                            </div>
                        </div>
                    ))}
                </div>



            </section>





            <From />
            <Footer />


        </>
    )
}

export default Magnize