import React from "react";
import styles from "../../style/OurMentor.module.css";
import { mentorsData } from '../../util/data'
import Heading from "../../components/Heading";

const Mentors = () => {
    return (
        <section className={styles.mentorsSection}>
            <div className="">
                <div className={styles.headingContainer}>
                    <Heading h1='Our mentors' />
                    <div className={styles.headingContainerImg}>
                        <img src="/assets/Group16.png" alt="Decoration" />
                    </div>
                </div>

                <div className={styles.cardsWrapper}>
                    {mentorsData.map((mentor) => (
                        <div key={mentor.id} className={styles.mentorCard}>

                            <div className={styles.imageWrapper}>
                                <div className={styles.imageMask}>
                                    <img
                                        src={mentor.image}
                                        alt={mentor.role}
                                        className={styles.mentorImage}
                                    />
                                </div>
                            </div>

                            <p className={styles.role}>{mentor.role}</p>
                            <h2 className={styles.name}>{mentor.name}</h2>

                            <p className={styles.description}>
                                {mentor.description.map((line, i) => (
                                    <span key={i}>{line}<br /></span>
                                ))}
                            </p>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Mentors;
