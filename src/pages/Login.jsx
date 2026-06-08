import React, { useEffect, useState } from "react";
import "../style/Login.css";
import Heading from "../components/Heading";
import CustomButton from "../components/CustomButton";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { number } from "framer-motion";
import toast from "react-hot-toast";

const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5001"
    : "https://api.ssbwithisv.in";

function Login() {
    const navigate = useNavigate();

    // ================= STATES =================
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);
    const [btnSent, setBtnSent] = useState(false);
    const [timer, setTimer] = useState(30);
    const [errorMsg, setErrorMsg] = useState("");
    // const [errorMsg, setErrorMsg] = useState("");
    const [reqId, setReqId] = useState();
    const [token, setToken] = useState();

    const [serviceConsent, setServiceConsent] = useState(false);
    const [marketingConsent, setMarketingConsent] = useState(false);


    const [submit, setSubmit] = useState(true)

    // ================= HELPERS =================
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // ================= SEND OTP =================

    let tokenAuth = "432663TzWGndK2N7sR6710de92P1"
    let widgetId = "346a776c5749333834363239"

    // console.log(reqId)
    useEffect(() => {
        if (submit === false) {
            setTimeout(() => {
                setSubmit(true)
            }, 3000)

        }

    }, [submit])





    // ================= TIMER =================
    useEffect(() => {
        if (!otpSent) return;

        if (timer === 0) {
            // setOtpSent(false);
            setBtnSent(false)
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [otpSent, timer]);

    // ================= GLOW EFFECT =================
    useEffect(() => {
        const glow = document.querySelector(".otpglow-circle");
        if (glow) {
            glow.classList.add("animate-glow");
        }
    }, []);

    // ================= SUBMIT OTP =================
    // import axios from "axios";

    // https://api.msg91.com/api/v5/widget/sendOtp
    // https://api.msg91.com/api/v5/widget/verifyOtp


    const handleSendOtp = async () => {
        console.log("SEND OTP clicked");

        // Validation
        if (!name || !email || !phone) {
            setErrorMsg("Please fill in all fields.");
            return;
        }

        if (!isValidEmail(email)) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }

        if (phone.length !== 10) {
            setErrorMsg("Please enter a valid 10-digit phone number.");
            return;
        }

        setErrorMsg("");

        const formattedPhone = "91" + phone;



        try {
            const res = await axios.post(
                "https://api.msg91.com/api/v5/widget/sendOtp",
                {
                    identifier: formattedPhone,
                    widgetId,
                    tokenAuth
                }
            );

            console.log("OTP SENT:", res.data);

            if (res.data.type === "success") {
                setOtpSent(true);
                setBtnSent(true)
                setTimer(30);
                setReqId(res.data.message)
            } else {
                setErrorMsg("Failed to send OTP.");
            }
        } catch (error) {
            console.error("OTP ERROR:", error);
            setErrorMsg("Failed to send OTP. Try again.");
        }
    };

    const handleSubmit = async () => {
        if (!serviceConsent) {
            setErrorMsg("Please accept the mandatory consent to proceed.");
            return;
        }
        // if (!marketingConsent) {
        //     setErrorMsg("Please accept the mandatory consent to proceed.");
        //     return;
        // }

        setSubmit(false);

        // setSubmit(false)
        if (!name || !email || !phone) {
            setErrorMsg("Please fill in all fields.");
            return;
        }

        if (!isValidEmail(email)) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }

        if (phone.length !== 10) {
            setErrorMsg("Please enter a valid 10-digit phone number.");
            return;
        }

        if (!otp) {
            setErrorMsg("Please enter OTP.");
            return;
        }

        setErrorMsg("");

        try {
            const res = await axios.post(
                "https://api.msg91.com/api/v5/widget/verifyOtp",
                {
                    otp: otp,
                    reqId: reqId,        // save this from sendOtp response
                    widgetId,
                    tokenAuth // save this from sendOtp response
                }
            );

            // console.log("VERIFY RESPONSE:", res.data);

            if (res.data.type === "success") {
                setToken(res.data.message)
                localStorage.setItem("accessToken", res.data.message);
                await addLead();
                // await getToken();
                await axios.post(
                    `${API_BASE_URL}/api/verifyOtpWithAccessToken`, {
                    accessToken: res.data.message
                });
                toast.success("OTP Verified Successfully ")
                // alert("✅");
                navigate(-1)

            } else {
                setErrorMsg("Invalid OTP. Please try again.");
            }

        } catch (error) {
            console.error("VERIFY ERROR:", error);
            setErrorMsg("OTP verification failed.");
        }
    };


    const addLead = async () => {
        await axios.post(`${API_BASE_URL}/api/addLead`, {
            email,
            name,
            phoneNumber: phone
        });
    };



   


    return (
        <div className="screen-wrapper">
            <div className="content-bg"></div>

            <div className="container position-relative">
                <div className="otp-box mx-auto">
                    <div onClick={() => navigate(-1)} className="otp-close-btn">
                        <RxCross2 />
                    </div>

                    <div className="d-flex justify-content-center mb-5">
                        <Heading h1="OTP Verification" />
                    </div>

                    <div className="row g-4 justify-content-center">
                        <div className="col-lg-12">
                            <input
                                type="text"
                                className="form-control custom-input"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="col-lg-12">
                            <input
                                type="email"
                                className="form-control custom-input"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="col-lg-12">
                            <div className="input-with-btn">
                                <input
                                    type="text"
                                    className="form-control custom-input"
                                    placeholder="Your Contact Number"
                                    value={phone}
                                    maxLength={10}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ""); // only digits
                                        setPhone(value);
                                    }}
                                />


                                <button
                                    className="otp-btn"
                                    onClick={() => handleSendOtp()}

                                    disabled={btnSent}
                                >
                                    {btnSent ? `00:${timer}` : "SEND OTP"}
                                </button>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <input
                                type="Password"
                                className="form-control custom-input"
                                placeholder="Your Password"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="col-lg-12">
                            <input
                                type="Re Password"
                                className="form-control custom-input"
                                placeholder="Your Re Password"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {otpSent && (
                            <div className="col-lg-12">
                                <input
                                    type="text"
                                    className="form-control custom-input"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    maxLength={6}
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    onChange={(e) => {
                                        const digitsOnly = e.target.value.replace(/\D/g, "");
                                        setOtp(digitsOnly);
                                    }}
                                />

                            </div>
                        )}

                        {errorMsg && (
                            <p className="text-danger text-center">
                                {errorMsg}
                            </p>
                        )}

                        {/* ================= DPDP CONSENT ================= */}
                        <div className="col-lg-12 mt-4 consent-wrapper">

                            <label className="consent-item">
                                {/* <input
                                    type="checkbox"
                                    checked={marketingConsent}
                                    onChange={(e) => setMarketingConsent(e.target.checked)}
                                /> */}
                                <span style={{ textAlign: 'center' }}>
                                    By submitting this from I agree to receive calls, WhatsApp messages, emails, and updates
                                    related to courses, mentoring programs, events, and relevant
                                    information from <strong>SSB with ISV</strong>. I understand that I
                                    may opt out of promotional communication at any time.
                                </span>
                            </label>

                            {/* Mandatory Consent */}
                            <label className="consent-item">
                                <input
                                    type="checkbox"
                                    checked={serviceConsent}
                                    onChange={(e) => setServiceConsent(e.target.checked)}
                                />
                                <span>
                                    I hereby consent to <strong>SSB with ISV</strong> collecting, storing,
                                    processing, and using my personal data in accordance with the{" "}
                                    <span
                                        className="policy-link"
                                        onClick={() => navigate("/privacy-policy")}
                                    >
                                        Privacy Policy
                                    </span>,
                                    for the purpose of counselling, mentoring, admissions,
                                    communication, and related services. I understand that I may
                                    withdraw my consent at any time by contacting the Grievance Officer.
                                </span>
                            </label>

                            {/* Optional Marketing Consent */}


                        </div>


                        <div className="col-lg-12 text-center mt-5 d-flex justify-content-center">
                            <CustomButton text={submit ? "SUBMIT" : "LOADING..."} onClick={handleSubmit} />
                        </div>
                    </div>

                    <span className="otpglow-circle"></span>
                </div>
            </div>
        </div>
    );
}

export default Login;
