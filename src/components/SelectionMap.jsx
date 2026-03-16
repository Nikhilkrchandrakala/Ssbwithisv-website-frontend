import { useState } from "react";
import styles from "../style/SelectionMap.module.css";
import IndiaSVG from "./IndiaSVG";
import { style } from "framer-motion/client";
import { faqData } from "../util/data";
import Faq from "./Faq";

export default function SelectionMap() {
    const [activeTab, setActiveTab] = useState("army");
    const [hoveredRegion, setHoveredRegion] = useState(null);


    //   {faqData}


    const selectionCenters = {
        army: [
            "31 | 32 – Selection Centre North, Jalandhar",
            "11 | 14 | 18 | 19 | 34 – Selection Centre East, Prayagraj",
            "20 | 21 | 22 – Selection Centre Central, Bhopal",
            "17 | 24 – Selection Centre South, Bangalore",
        ],

        airforce: [
            "1 AFSB – Dehradun",
            "2 AFSB – Mysore",
            "3 AFSB – Gandhinagar",
            "4 AFSB – Varanasi",
            "5 AFSB – Guwahati",
        ],

        navy: [
            // "NSB I – Visakhapatnam",
            "NSB Vizag",
            "33 SSB, Bhopal",
            // "NSB II – Bhopal",
            "SSB (Kolkata)",
            "12 SSB, Bangalore",
            // "NSB III – Kolkata",
            // // "NSB IV – Visakhapatnam",
            // "NSB V – Bangalore",
        ],
    };


    return (
        <>
            <section className={styles.section}>
                <h2 className={styles.title}>
                    Services Selection Boards & <br />
                    Air Force Selection Boards of India
                </h2>

                {/* TABS */}
                <div className={styles.tabs}>
                    {["army", "navy", "airforce"].map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.active : ""}`}
                            onClick={() => {
                                setActiveTab(tab);
                                setHoveredRegion(null);
                            }}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className={styles.content}>
                    {/* MAP */}
                    <div className={styles.mapWrapper}>
                        <div className={styles.mapContainer}>
                            <IndiaSVG
                                activeTab={activeTab}
                                hoveredRegion={hoveredRegion}
                                setHoveredRegion={setHoveredRegion}
                            // text={'kjhgf'}
                            />
                        </div>
                    </div>

                    {/* <div className={styles.SelectionMapCon}>
                        <h2>Index</h2> */}

                    <div className={styles.SelectionMapCon}>
                        {/* <h2>Index</h2> */}

                        {selectionCenters[activeTab]?.map((item, index) => (
                            <p style={{ marginTop: '5px' }} key={index} className={styles.indexItem}>
                                {item}
                            </p>
                        ))}
                    </div>

                    {/* </div> */}



                </div>
            </section>

          



        </>



    );
}
