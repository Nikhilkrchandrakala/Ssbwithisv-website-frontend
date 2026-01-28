import React, { useEffect, useState } from 'react'
import '../../style/custom-theme.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import CustomButton from '../../components/CustomButton'
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function SignUp() {
    const navigate = useNavigate()

    // 🔹 form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [reqId, setReqId] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [serviceConsent, setServiceConsent] = useState('');

    const [timer, setTimer] = useState(0);
    const [otpSent, setOtpSent] = useState(false);


    // const [seePassword, setSeePassword] = useState("");
    // const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        let interval;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timer]);


   

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // ================= SEND OTP =================
    let tokenAuth = "432663TzWGndK2N7sR6710de92P1"
    let widgetId = "346a776c5749333834363239"

    /* ================= SEND OTP ================= */
    const handleSendOtp = async () => {
        console.log("SEND OTP clicked");

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
        setLoading(true);


        try {
            const res = await axios.post(
                "https://api.msg91.com/api/v5/widget/sendOtp",
                {
                    identifier: `91${phone}`,
                    widgetId,
                    tokenAuth,
                },
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data.type === "success") {
                setOtpSent(true);
                setTimer(30);
                setReqId(res.data.message);
            } else {
                setErrorMsg("Failed to send OTP.");
            }
        } catch (error) {
            console.error("OTP ERROR:", error);
            setErrorMsg("Failed to send OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    /* ================= VALIDATE FORM ================= */
    const validateForm = () => {
        if (!otp) {
            setErrorMsg("Please enter OTP.");
            return false;
        }

        if (password.length < 4) {
            setErrorMsg("Password must be at least 4 characters long.");
            return false;
        }

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return false;
        }

        if (!serviceConsent) {
            setErrorMsg("You must agree to the terms and conditions.");
            return false;
        }

        return true;
    };

    /* ================= REGISTER USER ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!validateForm()) {
            // setErrorMsg("fill all details correctly");
            return;
        }

        setErrorMsg("");
        setLoading(true);

        try {
            // Step 1: Verify OTP

            const otpRes = await axios.post(
                "https://api.msg91.com/api/v5/widget/verifyOtp",
                {
                    otp,
                    reqId,
                    widgetId,
                    tokenAuth,
                },
                { headers: { "Content-Type": "application/json" } }
            );

            if (otpRes.data.type !== "success") {
                setErrorMsg("Invalid OTP. Please try again.");
                setLoading(false);
                return;
            }

            // const accessToken = otpRes.data.message;
            // localStorage.setItem("accessToken", accessToken);

            // Step 2: Register user (main registration)
            const registerResponse = await axios.post("https://api.ssbwithisv.in/api/register", {
                name,
                email,
                phone: phone,
                password,
            });

            // console.log(registerResponse?.message == "User registered successfully")


            // Check if registration was successful
            if (registerResponse) {
                console.log("User registered successfully:", registerResponse.data);
                await addLead();




            } else {
                // Handle registration failure
                setErrorMsg(registerResponse.data.message || "Registration failed. Please try again.");
            }

        } catch (error) {
            console.error("Registration ERROR:", error);

            // Handle specific error cases
            if (error.response) {
                console.log(error)
                // Server responded with error status
                if (error.response.status === 409) {
                    setErrorMsg("User with this email or phone already exists.");
                } else if (error.response.status === 400) {
                    setErrorMsg(error.response.data.error || "Invalid registration data.");
                } else {
                    setErrorMsg("Registration failed. Please try again.");
                }
            } else if (error.request) {
                // Request was made but no response
                setErrorMsg("Network error. Please check your connection.");
            } else {
                // Something else happened
                setErrorMsg("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    /* ================= ADD LEAD (Secondary API) ================= */
    const addLead = async () => {
        try {
            const response = await axios.post("https://api.ssbwithisv.in/api/addLead", {
                name,
                email,
                phoneNumber: phone,
            });

            if (response) {
                navigate('/SignIn')
                console.log("Lead added successfully:", response.data);
                return response.data;
            } else {
                throw new Error("Failed to add lead");
            }
        } catch (error) {
            console.error("Add Lead ERROR:", error);
            throw error; // Re-throw to handle in main flow
        }
    };

    // Optional: You can add more secondary API functions here
    /*
    const sendWelcomeEmail = async () => {
        // Email sending logic
    }

    const createUserProfile = async () => {
        // Profile creation logic
    }
    */

    return (
        <>
            <div className="thm-content-layer">
                <div className="thm-content-bg"></div>
                <div onClick={() => navigate(-1)} className='arrow_button'>
                    <BiArrowBack />
                </div>

                <div className="container position-relative">
                    <h1 className="thm-big-title">Sign Up</h1>

                    <div className="row col-xl-7 g-4 g-md-2 col-lg-9 mx-auto justify-content-center">
                        <div className="col-lg-12">
                            <input
                                type="text"
                                className="form-control thm-input"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-lg-12">
                            <input
                                type="email"
                                className="form-control thm-input"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-lg-9 col-md-9">
                            <input
                                type="text"
                                className="form-control thm-input"
                                placeholder="Your Contact Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-lg-3 col-md-3">
                            <div style={{ zIndex: '9999999' }} className="d-flex justify-content-end align-items-center gap-2">
                                <CustomButton
                                    text={
                                        timer > 0
                                            ? `Resend ${timer}s`
                                            : loading
                                                ? "Sending..."
                                                : "Send OTP"
                                    }
                                    onClick={handleSendOtp}
                                    disabled={timer > 0 || loading}
                                />
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <input
                                type="text"
                                className="form-control thm-input"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-lg-12 password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control thm-input password-input"
                                placeholder="Password (min. 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                            />

                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>



                        {/* Confirm Password */}
                        <div className="col-lg-12  password-wrapper mt-3">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control thm-input"
                                placeholder="Repeat Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <span
                                className="password-toggle"

                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? (
                                    <AiOutlineEyeInvisible />
                                ) : (
                                    <AiOutlineEye />
                                )}
                            </span>
                        </div>
                        {/* </> */}

                        {errorMsg && (
                            <p className="text-danger text-center">
                                {errorMsg}
                            </p>
                        )}

                        <div className="col-lg-12 mt-4 consent-wrapper">
                            <label className="consent-item">
                                <span style={{ textAlign: 'center' }}>
                                    By submitting this from I agree to receive calls, WhatsApp messages, emails, and updates
                                    related to courses, mentoring programs, events, and relevant
                                    information from <strong>SSB with ISV</strong>. I understand that I
                                    may opt out of promotional communication at any time.
                                </span>
                            </label>

                            <label className="consent-item">
                                <input
                                    type="checkbox"
                                    checked={serviceConsent}
                                    onChange={(e) => setServiceConsent(e.target.checked)}
                                    required
                                />
                                <span>
                                    I hereby consent to <strong>SSB with ISV</strong> collecting, storing,
                                    processing, and using my personal data in accordance with the{" "}
                                    <span
                                        className="policy-link"
                                        onClick={() => navigate("/PrivacyPolicy")}
                                        style={{ cursor: 'pointer', color: '#007bff' }}
                                    >
                                        Privacy Policy
                                    </span>,
                                    for the purpose of counselling, mentoring, admissions,
                                    communication, and related services. I understand that I may
                                    withdraw my consent at any time by contacting the Grievance Officer.
                                </span>
                            </label>
                        </div>

                        <div className="col-12 d-flex justify-content-center mt-5">
                            <CustomButton
                                text={loading ? "Please wait..." : "SIGN UP"}
                                onClick={handleSubmit}
                                disabled={loading || !otpSent}
                            />
                        </div>

                        <div className="col-12 text-center mt-5">
                            <div
                                onClick={() => navigate('/SignIn')}
                                className="thm-account-link"
                                style={{ cursor: 'pointer' }}
                            >
                                I already have an account.
                            </div>
                        </div>


                    </div>

                    <span className="thm-glow"></span>
                </div>
            </div >
        </>
    )
}

export default SignUp