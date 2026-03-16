import React from 'react'
// import {  } from '../util/data'

function Faq({ data }) {
    return (
        <section className="FAQ-section sectionspace80">
            <div className="container">
                <div className="sct-title">
                    <h2>Frequently Asked Questions</h2>
                </div>
                <div className="row g-4">
                    <div className="col-lg-9">
                        <div className="accordion faq-accordion" id="faqAccordion">
                            {data?.map((item, index) => (
                                <div className="accordion-item" key={item.id}>
                                    <h2 className="accordion-header">
                                        <button
                                            className={`accordion-button ${!item.isOpen ? "collapsed" : ""}`}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#${item.id}`}
                                            aria-expanded={item.isOpen}
                                        >
                                            {item.question}
                                        </button>
                                    </h2>

                                    <div
                                        id={item.id}
                                        className={`accordion-collapse collapse ${item.isOpen ? "show" : ""}`}
                                        data-bs-parent="#faqAccordion"
                                    >
                                        <div className="accordion-body">
                                            {item.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>

            </div>

        </section>
    )
}

export default Faq