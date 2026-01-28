import React, { useState } from 'react'
import styles from '../style/Navbar.module.css';
import { IoMenu } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';


function CustomHeader({ heading, text, textTwo, span, textThree, color, banner, color2 }) {

    const navigate = useNavigate()

    const [open, setOpen] = useState(false);
    return (
        <>


            {/* <section className="breed-section" style={{ backgroundImage: 'url(/assets/img/about/about-breed.webp)' }}> */}
            <section
                className="breed-section"
                style={{
                    backgroundImage: `url(${banner ? banner : "/assets/img/about/about-breed.webp"})`,
                }}
            >

                <div className=''>
                    <div className={styles.topBar}>
                        <img
                            src="/assets/logo/ISV.png"
                            alt="Logo"
                            className={styles.logo}
                            onClick={() => navigate('/')}
                        />
                        <IoMenu className={styles.menuIcon} onClick={() => setOpen(true)} />
                    </div>
                </div>

                <Sidebar open={open} onClose={() => setOpen(false)} />


                <div className="breed-overlay"></div>

                <div className="breed-content container">
                    <div className="col-12 row mx-auto">
                        {color && <img src='/assets/logo/VTXlogo.png' style={{ width: '250px' }} />}

                        <div className='col-xl-12'>
                            {color && heading && <h1 style={{ color: 'var(--secondary-color)' }} className="breed-big-title">{heading}{span && <span className="sup-text">{span}</span>}</h1>}
                            {!color && heading && <h1 className="breed-big-title">{heading}{span && <sup>{span}</sup>}</h1>}

                        </div>

                        <div className="col-xl-7">
                            {textThree && <h1 className="breed-title">{textThree}</h1>}

                            {text && <p className="breed-subtitle">
                                {text}
                            </p>}
                            {textTwo && <div className="breed-text">
                                <p>
                                    {textTwo}
                                </p>
                            </div>}
                        </div>

                        {color2 && <div className="col-xl-7">
                            <img src='/assets/karam.jpeg' style={{ width: '200px' }} />
                        </div>}


                    </div>
                </div>
                <div className="decor-shape1">
                    <img src="assets/img/shape/Group_11.png" alt="Shape1" />
                </div>
            </section>
        </>
    )
}

export default CustomHeader