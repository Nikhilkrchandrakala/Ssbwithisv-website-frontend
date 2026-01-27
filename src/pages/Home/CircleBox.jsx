import React, { useEffect, useState } from 'react'
import styles from '../../style/Navbar.module.css'
import CircularCard from "../../components/CircularCard";
import CustomButton from "../../components/CustomButton";
import HeadingTwo from '../../components/HeadingTwo';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CircleBox() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchNumberMonitors = async () => {
        try {
            const res = await axios.get("https://api.ssbwithisv.in/api/allNumberMonitors");

            if (res.data && res.data.length > 0) {
                setData(res.data[0]);   // safe
            }

        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNumberMonitors();
    }, []);

    const array = [
        { number: data?.officerSelection || 0, title: "Candidates Recommended", timeDel: "2" },
        { number: data?.facultyExperience || 0, title: "Years of Proven Track Record", timeDel: "4" },
        { number: data?.yearService || 0, title: "Years of Domain Expertise", timeDel: "6" },
    ];

    const navigate = useNavigate();

    const handelLogin = () => {
        navigate('/ContactUS');
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>;
    }

    return (
        <section className={styles.circleSection}>
            <div className={styles.circleSectionCenterCon}>

                <div className={styles.circleSectionContainer}>
                    {array.map((e, index) => (
                        <CircularCard
                            key={index}
                            index={index}
                            number={e.number}
                            title={e.title}
                            timeDel={e.timeDel}
                        />
                    ))}
                </div>

                <div>
                    <div className='headingOfMargin'>
                        <HeadingTwo h1='What is' t1='SSB with ISV?' />
                    </div>

                    <p className={styles.titleOfSecondSection}>
                        India’s first online SSB mentoring platform with a proprietary virtual training experience (VTX™).
                        Led by veterans of the Indian Armed Forces, SSB with ISV is a venture that comes with a promise to
                        guide and prepare aspiring officers for success in the Services Selection Board.
                    </p>

                    <p className={styles.titleOfThirdSection}>
                        <span className={styles.text}>Handholding till recommendation</span>
                        <span className={styles.divider}>/</span>
                        <span className={styles.text}>Over 50% candidates recommended</span>
                        <span className={styles.divider}>/</span>
                        <span className={styles.text}>Virtual GTO Training Experience</span>
                    </p>

                    <div style={{ marginTop: '30px' }}>
                        <CustomButton text="Sign Up Now" onClick={handelLogin} />
                    </div>
                </div>

            </div>
        </section>
    )
}

export default CircleBox;
