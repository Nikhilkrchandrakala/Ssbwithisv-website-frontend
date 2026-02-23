import React, { useEffect, useState } from 'react'
import '../../style/custom-theme.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import CustomButton from '../../components/CustomButton'
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAddLeadMutation, useRegisterMutation } from '../../redux/api'

function SignUp() {
    const navigate = useNavigate()

    // 🔹 form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [reqId, setReqId] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [serviceConsent, setServiceConsent] = useState(false);

    const [timer, setTimer] = useState(0);
    const [otpSent, setOtpSent] = useState(false);

    // Validation error states
    const [fieldErrors, setFieldErrors] = useState({
        name: "",
        email: "",
        phone: "",
        otp: "",
        password: "",
        confirmPassword: "",
        serviceConsent: ""
    });

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

    // Validation functions
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidPhone = (phone) => {
        return /^[0-9]{10}$/.test(phone);
    };

    const isValidPassword = (password) => {
        return password.length >= 6;
    };

    const validateField = (field, value) => {
        let error = "";

        switch (field) {
            case "name":
                if (!value.trim()) error = "Name is required";
                else if (value.trim().length < 2) error = "Name must be at least 2 characters";
                break;
            case "email":
                if (!value) error = "Email is required";
                else if (!isValidEmail(value)) error = "Please enter a valid email address";
                break;
            case "phone":
                if (!value) error = "Phone number is required";
                else if (!isValidPhone(value)) error = "Please enter a valid 10-digit phone number";
                break;
            case "otp":
                if (otpSent && !value) error = "OTP is required";
                else if (value && !/^[0-9]{6}$/.test(value)) error = "OTP must be exactly 6 digits";
                break;
            case "password":
                if (!value) error = "Password is required";
                else if (!isValidPassword(value)) error = "Password must be at least 6 characters";
                break;
            case "confirmPassword":
                if (!value) error = "Please confirm your password";
                else if (value !== password) error = "Passwords do not match";
                break;
            case "serviceConsent":
                if (!value) error = "You must agree to the terms and conditions";
                break;
            default:
                break;
        }

        setFieldErrors(prev => ({ ...prev, [field]: error }));
        return !error;
    };

    // Handle field changes with validation
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        validateField("name", value);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        validateField("email", value);
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // only numbers
        if (value.length <= 10) {
            setPhone(value);
            validateField("phone", value);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // only numbers
        if (value.length <= 6) {
            setOtp(value);
            validateField("otp", value);
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        validateField("password", value);
        if (confirmPassword) {
            validateField("confirmPassword", confirmPassword);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        validateField("confirmPassword", value);
    };

    const handleConsentChange = (e) => {
        const checked = e.target.checked;
        setServiceConsent(checked);
        validateField("serviceConsent", checked);
    };

    // ================= SEND OTP =================
    let tokenAuth = "432663TzWGndK2N7sR6710de92P1"
    let widgetId = "346a776c5749333834363239"

    const handleSendOtp = async () => {
        console.log("SEND OTP clicked");

        // Validate required fields before sending OTP
        const isNameValid = validateField("name", name);
        const isEmailValid = validateField("email", email);
        const isPhoneValid = validateField("phone", phone);

        if (!isNameValid || !isEmailValid || !isPhoneValid) {
            setErrorMsg("Please fill in all fields correctly.");
            return;
        }

        setErrorMsg("");
        setSuccessMsg("");
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
                setSuccessMsg("OTP sent successfully!");
                setErrorMsg("");
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


    const [register] = useRegisterMutation()
    const [addLeadStudent] = useAddLeadMutation()

    /* ================= VALIDATE FORM ================= */
    const validateForm = () => {
        // Validate all fields
        const isNameValid = validateField("name", name);
        const isEmailValid = validateField("email", email);
        const isPhoneValid = validateField("phone", phone);
        const isOtpValid = validateField("otp", otp);
        const isPasswordValid = validateField("password", password);
        const isConfirmPasswordValid = validateField("confirmPassword", confirmPassword);
        const isConsentValid = validateField("serviceConsent", serviceConsent);

        return isNameValid && isEmailValid && isPhoneValid && isOtpValid &&
            isPasswordValid && isConfirmPasswordValid && isConsentValid;
    };

    /* ================= REGISTER USER ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setErrorMsg("Please fix all errors before submitting.");
            return;
        }

        setErrorMsg("");
        setSuccessMsg("");
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

            // Step 2: Register user
            let body = {
                name,
                email,
                phone,
                password
            }
            const registerResponse = await register(body).unwrap();

            // axios.post("https://api.ssbwithisv.in/api/register", {
            //     name,
            //     email,
            //     phone: phone,
            //     password,
            // });

            if (registerResponse) {
                console.log("User registered successfully:", registerResponse);
                await addLead();
            } else {
                setErrorMsg(registerResponse.message || "Registration failed. Please try again.");
            }

        } catch (error) {
            console.error("Registration ERROR:", error?.data?.error);

            if (error.data) {
                setErrorMsg(error?.data?.error)

            } else if (error.request) {
                setErrorMsg("Network error. Please check your connection.");
            } else {
                setErrorMsg("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    /* ================= ADD LEAD ================= */
    const addLead = async () => {
        try {
            const response = await addLeadStudent({
                name,
                email,
                phoneNumber: phone,
            }).unwrap();

            // axios.post("https://api.ssbwithisv.in/api/addLead", {
            //     name,
            //     email,
            //     phoneNumber: phone,
            // });

            if (response) {
                navigate('/SignIn');
                console.log("Lead added successfully:", response);
                return response;
            } else {
                throw new Error("Failed to add lead");
            }
        } catch (error) {
            console.error("Add Lead ERROR:", error);
            throw error;
        }
    };

    // Check if submit button should be enabled
    const isSubmitDisabled = () => {
        return loading || !otpSent || !serviceConsent ||
            Object.values(fieldErrors).some(error => error !== "") ||
            !name || !email || !phone || !otp || !password || !confirmPassword;
    };

    return (
        <>
            <div className="thm-content-layer">
                <div className="thm-content-bg"></div>
                <div onClick={() => navigate(-1)} className='arrow_button'>
                    <BiArrowBack />
                </div>

                <div className="container position-relative">
                    <h1 className="thm-big-title">Sign Up</h1>

                    <div className="position-relative" style={{ zIndex: '55555' }}>
                        <div className="row col-xl-7 g-4 g-md-2 col-lg-9 mx-auto justify-content-center">
                            {/* Name Field */}
                            <div className="col-lg-12">
                                <input
                                    type="text"
                                    className={`form-control thm-input ${fieldErrors.name ? 'is-invalid' : ''}`}
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={handleNameChange}
                                    onBlur={() => validateField("name", name)}
                                    required
                                />
                                {fieldErrors.name && (
                                    <div className="error-message">{fieldErrors.name}</div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="col-lg-12">
                                <input
                                    type="email"
                                    className={`form-control thm-input ${fieldErrors.email ? 'is-invalid' : ''}`}
                                    placeholder="Your Email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    onBlur={() => validateField("email", email)}
                                    required
                                />
                                {fieldErrors.email && (
                                    <div className="error-message">{fieldErrors.email}</div>
                                )}
                            </div>

                            {/* Phone Field with OTP Button */}
                            <div className="col-lg-12 password-wrapper">
                                <input
                                    type="text"
                                    className={`form-control thm-input ${fieldErrors.phone ? 'is-invalid' : ''}`}
                                    placeholder="Your Contact Number"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    onBlur={() => validateField("phone", phone)}
                                    maxLength={10}
                                    required
                                />
                                <div className="password-toggle-btn">
                                    <button
                                        className='SendOtpBtn'
                                        onClick={handleSendOtp}
                                        disabled={timer > 0 || loading || !isValidPhone(phone) || !name || !email}
                                        style={{
                                            opacity: (timer > 0 || loading || !isValidPhone(phone) || !name || !email) ? 0.6 : 1,
                                            cursor: (timer > 0 || loading || !isValidPhone(phone) || !name || !email) ? 'not-allowed' : 'pointer'
                                        }}>
                                        {timer > 0
                                            ? `Resend ${timer}s`
                                            : loading
                                                ? "Sending..."
                                                : "Send OTP"}
                                    </button>
                                </div>
                                {fieldErrors.phone && (
                                    <div className="error-message">{fieldErrors.phone}</div>
                                )}
                            </div>

                            {/* OTP Field */}
                            <div className="col-lg-12">
                                <input
                                    type="tel"
                                    className={`form-control thm-input ${fieldErrors.otp ? 'is-invalid' : ''}`}
                                    placeholder="Enter 6 digit OTP"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    onBlur={() => validateField("otp", otp)}
                                    maxLength={6}
                                    inputMode="numeric"
                                    pattern="[0-9]{6}"
                                    title="OTP must be exactly 6 digits"
                                    disabled={!otpSent}
                                    required
                                />
                                {fieldErrors.otp && (
                                    <div className="error-message">{fieldErrors.otp}</div>
                                )}
                                {successMsg && otpSent && (
                                    <div className="text-success small mt-1">{successMsg}</div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="col-lg-12 password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control thm-input password-input ${fieldErrors.password ? 'is-invalid' : ''}`}
                                    placeholder="Password (min. 6 characters)"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={() => validateField("password", password)}
                                    required
                                    minLength="6"
                                />
                                <span
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </span>
                                {fieldErrors.password && (
                                    <div className="error-message">{fieldErrors.password}</div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="col-lg-12 password-wrapper mt-3">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`form-control thm-input ${fieldErrors.confirmPassword ? 'is-invalid' : ''}`}
                                    placeholder="Repeat Password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    onBlur={() => validateField("confirmPassword", confirmPassword)}
                                    required
                                />
                                <span
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </span>
                                {fieldErrors.confirmPassword && (
                                    <div className="error-message">{fieldErrors.confirmPassword}</div>
                                )}
                            </div>

                            {/* Error Message Display */}
                            {errorMsg && (
                                <div className="col-lg-12">
                                    <p className="error-message ">{errorMsg}</p>
                                </div>
                            )}

                            {/* Consent Section */}
                            <div className="col-lg-12 mt-4 consent-wrapper">
                                <label className="consent-item">
                                    <span style={{ textAlign: 'center' }}>
                                        By submitting this form I agree to receive calls, WhatsApp messages, emails, and updates
                                        related to courses, mentoring programs, events, and relevant
                                        information from <strong>SSB with ISV</strong>. I understand that I
                                        may opt out of promotional communication at any time.
                                    </span>
                                </label>

                                <label className="consent-item">
                                    <input
                                        type="checkbox"
                                        checked={serviceConsent}
                                        onChange={handleConsentChange}
                                        required
                                    />
                                    <span>
                                        I hereby consent to <strong>SSB with ISV</strong> collecting, storing,
                                        processing, and using my personal data in accordance with the{" "}
                                        <span
                                            className="policy-link"
                                            onClick={() => navigate("/PrivacyPolicy")}
                                            style={{ cursor: 'pointer', color: 'var(--secondary-color)' }}
                                        >
                                            Privacy Policy
                                        </span>,
                                        for the purpose of counselling, mentoring, admissions,
                                        communication, and related services. I understand that I may
                                        withdraw my consent at any time by contacting the Grievance Officer.
                                    </span>
                                </label>
                                {fieldErrors.serviceConsent && (
                                    <div className="error-message ">{fieldErrors.serviceConsent}</div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="col-12 d-flex justify-content-center mt-5">
                                <CustomButton
                                    text={loading ? "Please wait..." : "SIGN UP"}
                                    onClick={handleSubmit}
                                    disabled={isSubmitDisabled()}
                                />
                            </div>

                            {/* Login Link */}
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
                    </div>

                    <span style={{ zIndex: '654' }} className="thm-glow"></span>
                </div>
            </div>
        </>
    )
}

export default SignUp;