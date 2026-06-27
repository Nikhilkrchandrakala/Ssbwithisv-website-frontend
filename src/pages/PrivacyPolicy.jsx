import React from 'react'
import CustomHeader from '../components/CustomHeader'
import "../style/PrivacyPolicy.css"
import Footer from './Footer'
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
    const data = {
        heading: 'Privacy & Policy',
        text: ` SSB with ISV (“we”, “us”, “our”) is committed to protecting the privacy
                            and personal data of all users, aspirants, students, parents, and
                            visitors (“you”, “your”) who access or use our website, services,
                            courses, content, and communication channels.`
    }

    const navigate = useNavigate()
    return (
        <>
            {/* <CustomHeader heading={data.heading} text={data.text} /> */}


            <section className="privacy-root">
                <div onClick={() => navigate(-1)} className='BackBtn'>
                    <IoMdArrowBack />
                </div>

                <div className="privacy-container">

                    <h1 className="privacy-title">Privacy Policy</h1>

                    <p className="privacy-meta">
                        (Compliant with IT Act, 2000 | SPDI Rules, 2011 | DPDP Act, 2023)
                        <br />
                        <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                    </p>

                    <div className="privacy-content">
                        <p>PLEASE READ THIS PRIVACY STATEMENT CAREFULLY. BY CLICKING “I AGREE” OR BY CONTINUING TO USE THE WEBSITE, PROVIDING US PERSONAL INFORMATION, YOU CONSENT TO OUR USE OF YOUR PERSONAL INFORMATION IN ACCORDANCE WITH THE TERMS OF THIS PRIVACY STATEMENT. IF YOU DO NOT AGREE TO THIS PRIVACY STATEMENT, YOU MAY WITHDRAW YOUR CONSENT OR ALTERNATIVELY CHOOSE NOT TO PROVIDE YOUR PERSONAL INFORMATION ON THE WEBSITE. SUCH AN INTIMATION TO WITHDRAW YOUR CONSENT CAN BE PROVIDED BY EMAIL TO *info@ssbwithisv.in*.
                            IF YOU ARE ACCESSING THE WEBSITE ON BEHALF OF A THIRD PARTY, YOU REPRESENT THAT YOU HAVE THE AUTHORITY TO BIND SUCH THIRD-PARTY TO THE TERMS AND CONDITIONS OF THIS PRIVACY STATEMENT AND, IN SUCH AN EVENT YOUR USE OF THE WEBSITE SHALL REFER TO USE BY SUCH THIRD PARTY. IF YOU DO NOT HAVE SUCH AN AUTHORITY (TO PROVIDE ANY PERSONAL INFORMATION OF A THIRD PARTY) OR DO NOT AGREE TO THE TERMS OF THIS PRIVACY STATEMENT, THEN YOU SHOULD REFRAIN FROM USING THE WEBSITE.</p>

                        <p>
                            SSB with ISV (“we”, “us”, “our”) is committed to protecting the privacy
                            and personal data of all users, aspirants, students, parents, and
                            visitors (“you”, “your”) who access or use our website, services,
                            courses, content, and communication channels.
                        </p>

                        <p>This Privacy Policy is issued in accordance with:</p>
                        <ul>
                            <li>The Information Technology Act, 2000</li>
                            <li>The Information Technology (SPDI) Rules, 2011</li>
                            <li>The Digital Personal Data Protection Act, 2023 (DPDP Act)</li>
                        </ul>

                        <p>
                            By accessing or using our website or services, you consent to the
                            collection, use, processing, storage, and disclosure of your personal
                            data as described below.
                        </p>

                        <h2>1. Information We Collect</h2>

                        <h3>{`a) Personal Data`}</h3>
                        <ul>
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Mobile / WhatsApp number</li>
                            <li>Date of birth</li>
                            <li>Educational details</li>
                            <li>SSB entry details (eligibility, attempts, board details)</li>
                            <li>Payment and transaction details (processed via third-party gateways)</li>
                            <li>Communication records (calls, emails, WhatsApp messages)</li>
                        </ul>

                        <h3>{`b) Automatically Collected Data`}</h3>
                        <ul>
                            <li>IP address</li>
                            <li>Device and browser details</li>
                            <li>Website navigation behaviour</li>
                            <li>Cookies and tracking data</li>
                        </ul>

                        <h3>{`c) Data from Third-Party Sources`}</h3>
                        <ul>
                            <li>Google Ads, Meta (Instagram/Facebook) lead forms</li>
                            <li>Website enquiry forms</li>
                            <li>Magazine downloads, webinars, registrations, referrals</li>
                        </ul>

                        <h2>2. Purpose of Data Collection</h2>
                        <ul>
                            <li>Responding to enquiries and counselling</li>
                            <li>Admissions, onboarding, scheduling</li>
                            <li>Payment processing and record keeping</li>
                            <li>Analytics and service improvement</li>
                            <li>Marketing communication (subject to consent)</li>
                            <li>Legal and regulatory compliance</li>
                        </ul>

                        <h2>3. Legal Basis for Processing (DPDP Act, 2023)</h2>
                        <ul>
                            <li>User consent</li>
                            <li>Legitimate educational use</li>
                            <li>Legal obligations</li>
                        </ul>

                        <h2>4. Cookies and Tracking</h2>
                        <p>
                            Cookies are used for functionality, analytics, and advertising
                            attribution. You may disable cookies via browser settings.
                        </p>

                        <h2>5. Data Sharing & Disclosure</h2>
                        <p>
                            We do not sell personal data. Data may be shared with internal staff,
                            trusted service providers, or legal authorities if required.
                        </p>

                        <h2>6. Data Security</h2>
                        <p>
                            Reasonable security practices are implemented including access
                            controls, encrypted platforms, and secure servers.
                        </p>

                        <h2>7. Data Retention</h2>
                        <p>
                            Data is retained only as long as necessary for services, compliance,
                            or dispute resolution.
                        </p>

                        <h2>8. Communication & Marketing</h2>
                        <p>
                            Users may opt out of promotional communication at any time.
                            Transactional messages may continue.
                        </p>

                        <h2>9. Testimonials & Media</h2>
                        <p>
                            Testimonials are used only with explicit consent, which may be
                            withdrawn.
                        </p>

                        <h2>10. Children’s Data</h2>
                        <p>
                            For users under 18, parental or guardian consent is required.
                        </p>

                        <h2>11. User Rights</h2>
                        <ul>
                            <li>Access personal data</li>
                            <li>Request correction or erasure</li>
                            <li>Withdraw consent</li>
                            <li>Register grievances</li>
                        </ul>

                        <h2>12. Policy Updates</h2>
                        <p>
                            This policy may be updated periodically. Continued use implies
                            acceptance.
                        </p>

                        {/* <h2>13. Grievance Redressal Officer</h2>
                        <p>
                            <strong>Grievance Officer:</strong> [Name / Designation] <br />
                            <strong>Email:</strong> [Official Email ID] <br />
                            <strong>Response Time:</strong> Within 7 working days
                        </p> */}

                    </div>
                </div>
            </section>


            {/*
            <section className="privacy-root">
                <div className="terms-container">

                    <h1 className="terms-title">Terms & Conditions</h1>

                    <p className="terms-meta">
                        <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
                    </p>

                    <div className="terms-content">

                        <p>
                            By accessing <strong>www.ssbwithisv.in</strong> or enrolling in any
                            course or service, you agree to the following Terms & Conditions.
                        </p>

                        <h2>1. Nature of Services</h2>
                        <p>
                            SSB with ISV provides mentoring, counselling, and training services
                            for SSB preparation. We do not guarantee selection, recommendation,
                            or commission into the Armed Forces.
                        </p>

                        <h2>2. User Responsibility</h2>
                        <p>
                            Users agree to provide accurate information and use services
                            lawfully. Misuse, impersonation, or misrepresentation may result in
                            termination of access without refund.
                        </p>

                        <h2>3. Intellectual Property</h2>
                        <p>
                            All content including videos, PDFs, training material, logos, and
                            branding is the intellectual property of SSB with ISV and may not be
                            copied, distributed, or reused without prior written permission.
                        </p>

                        <h2>4. Payments</h2>
                        <p>
                            All fees must be paid in full as per the course structure. Prices are
                            subject to change without prior notice.
                        </p>

                        <h2>5. Limitation of Liability</h2>
                        <p>
                            SSB with ISV shall not be liable for any indirect, incidental, or
                            consequential damages arising from the use of our services.
                        </p>

                        <h2>6. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate access to services in
                            case of violation of terms, misconduct, or misuse.
                        </p>

                        <h2>7. Governing Law</h2>
                        <p>
                            These Terms & Conditions are governed by the laws of India. Courts at
                            <strong> [City / State]</strong> shall have exclusive jurisdiction.
                        </p>

                    </div>
                </div>
            </section>

            <section className="privacy-root">
                <div className="refund-container">

                    <h1 className="refund-title">Refund & Cancellation Policy</h1>

                    <p className="refund-meta">
                        <strong>Effective Date:</strong>{" "}
                        {new Date().toLocaleDateString()}
                    </p>

                    <div className="refund-content">

                        <h2>1. No Guarantee Clause</h2>
                        <p>
                            SSB with ISV offers mentoring and guidance services for SSB
                            preparation. Selection, recommendation, or commission into the Armed
                            Forces is not guaranteed. Refunds are not linked to outcomes or
                            results.
                        </p>

                        <h2>2. Refund Eligibility</h2>
                        <p>Refunds may be considered only if all of the following conditions are met:</p>
                        <ul>
                            <li>Refund request is made <strong>before course commencement</strong></li>
                            <li>Request is submitted <strong>within 48 hours of payment</strong></li>
                            <li>No content, class, or mentoring session has been accessed</li>
                        </ul>
                        <p>
                            All approved refunds are subject to applicable administrative
                            deductions.
                        </p>

                        <h2>3. Non-Refundable Situations</h2>
                        <p>No refunds shall be issued if:</p>
                        <ul>
                            <li>The course has commenced</li>
                            <li>Any content, class, or mentoring session has been accessed</li>
                            <li>Delay or absence is due to candidate’s personal reasons</li>
                            <li>The candidate withdraws voluntarily</li>
                            <li>The candidate is removed due to misconduct or policy violation</li>
                        </ul>

                        <h2>4. Cancellation by Institute</h2>
                        <p>
                            In the event a batch is cancelled by SSB with ISV, eligible candidates
                            may receive a refund or credit adjustment towards another batch, at
                            the discretion of the institute.
                        </p>

                        <h2>5. Refund Processing</h2>
                        <p>
                            Approved refunds will be processed within <strong>7–14 working
                                days</strong> via the original payment method used at the time of
                            purchase.
                        </p>

                        <h2>6. Final Authority</h2>
                        <p>
                            All refund and cancellation decisions rest solely with the management
                            of SSB with ISV and shall be final and binding.
                        </p>

                        <hr />

                        <h2>Grievance & Contact Details</h2>
                        <p>
                            <strong>Grievance Officer:</strong> Lt Cdr Nikhil Kumar Chandrakala
                            <br />
                            <strong>Email:</strong> info@ssbwithisv.in
                            <br />
                            <strong>Jurisdiction:</strong> Bengaluru, Karnataka
                        </p>

                    </div>
                </div>
            </section>
            */}

            <Footer />

        </>
    )
}

export default PrivacyPolicy

// import "./PrivacyPolicy.css";


