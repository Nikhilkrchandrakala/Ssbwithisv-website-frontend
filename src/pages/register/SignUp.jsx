import React, { useEffect, useState, useRef } from 'react'
import '../../style/custom-theme.css'
import '../../style/MagazineGateForm.css'
import { useNavigate } from 'react-router-dom'
import CustomButton from '../../components/CustomButton'
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaRegUser, FaRegCalendarAlt } from 'react-icons/fa';
import { GiStarMedal } from 'react-icons/gi';
import toast from "react-hot-toast";
import {
    useRegisterMutation,
    useAddLeadMutation,
    useCheckUserExistsMutation,
    useSendSignupEmailOtpMutation,
    useVerifySignupEmailOtpMutation,
    useSendSignupPhoneOtpMutation,
    useVerifySignupPhoneOtpMutation,
} from '../../redux/api'


// ─── Password strength helpers ───
const passwordRules = [
    { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { key: 'upper', label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { key: 'number', label: 'One number', test: (p) => /[0-9]/.test(p) },
    // eslint-disable-next-line no-useless-escape
    { key: 'special', label: 'One special character (!@#$...)', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
];

const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    const passed = passwordRules.filter(r => r.test(password)).length;
    if (passed <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (passed === 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
    if (passed === 3) return { score: 3, label: 'Good', color: '#3b82f6' };
    return { score: 4, label: 'Strong', color: '#22c55e' };
};

const BOARD_OPTIONS = [
    '1 AFSB', '2 AFSB', '3 AFSB', '4 AFSB', '5 AFSB',
    '33 SSB Bhopal (Navy)', 'NSB Vizag (Navy)', '12 SSB Bangalore (Navy)',
    'SSB (Kolkata) (Navy)', '31 | 32 SSB Selection Center North (Kapurthala)',
    '11 | 14 | 18 | 19 | 34 SSB Selection Center East Prayagraj',
    '20 | 21 | 22 SSB Bhopal', '17 | 24 SSB Bangalore',
    'Not allotted yet', 'Not known right now', 'CGSB (NOIDA)', 'NOT IN THIS LIST'
];

const ENTRY_OPTIONS = [
    '10+2 B. Tech. entry (Navy)', '10+2 TES', 'AFCAT',
    'Army Service entry (PCSL, SCO, ACC, AMC)', 'CDS',
    'Navy Service entry (CW, SD List)', 'NCC special entry', 'NDA',
    'SSC (JAG)', 'SSC (Tech) Army',
    'SSC Navy (Executive, Law, Pilot, Naval Air Operations, Engineering, Electrical, Logistics, Naval Armament, Education)',
    'Territorial Army', 'TGC'
];

function SignUp() {
    const navigate = useNavigate()

    // ─── Step state (1=Info, 2=Email OTP, 3=Phone OTP, 4=SSB Profile) ───
    const [step, setStep] = useState(1);

    // ─── Form states ───
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // ─── Step 4 SSB Profile Form State ───
    const [dob, setDob] = useState("");
    const [ssbAspirant, setSsbAspirant] = useState("-None-");
    const [servingCandidate, setServingCandidate] = useState("-None-");
    const [vtxHeard, setVtxHeard] = useState("-None-");
    const [youtubeSubscribed, setYoutubeSubscribed] = useState("-None-");
    const [podcastSubscribed, setPodcastSubscribed] = useState("-None-");
    const [ssbExperience, setSsbExperience] = useState("-None-");
    const [nextSsbDate, setNextSsbDate] = useState("");
    const [ssbBoards, setSsbBoards] = useState([]);
    const [ssbEntries, setSsbEntries] = useState([]);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    const [serviceConsent, setServiceConsent] = useState(false);

    // OTP states
    const [emailOtp, setEmailOtp] = useState("");
    const [phoneOtp, setPhoneOtp] = useState("");
    const [phoneReqId, setPhoneReqId] = useState("");

    // Verification tokens
    const [emailVerifyToken, setEmailVerifyToken] = useState("");
    const [phoneVerifyToken, setPhoneVerifyToken] = useState(""); // eslint-disable-line no-unused-vars

    // UI states
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Timer states
    const [emailTimer, setEmailTimer] = useState(0);
    const [phoneTimer, setPhoneTimer] = useState(0);

    // Field errors
    const [fieldErrors, setFieldErrors] = useState({
        name: "", email: "", phone: "", password: "", confirmPassword: "", serviceConsent: ""
    });

    // Refs
    const otpInputRef = useRef(null);

    // ─── RTK Query hooks ───
    const [register] = useRegisterMutation();
    const [addLeadStudent] = useAddLeadMutation();
    const [checkUserExists] = useCheckUserExistsMutation();
    const [sendEmailOtp] = useSendSignupEmailOtpMutation();
    const [verifyEmailOtp] = useVerifySignupEmailOtpMutation();
    const [sendPhoneOtp] = useSendSignupPhoneOtpMutation();
    const [verifyPhoneOtp] = useVerifySignupPhoneOtpMutation();

    // ─── Timers ───
    useEffect(() => {
        let interval;
        if (emailTimer > 0) {
            interval = setInterval(() => setEmailTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [emailTimer]);

    useEffect(() => {
        let interval;
        if (phoneTimer > 0) {
            interval = setInterval(() => setPhoneTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [phoneTimer]);

    // ─── Validation ───
    const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    const isValidPhone = (p) => /^[0-9]{10}$/.test(p);
    const isStrongPassword = (p) => passwordRules.every(r => r.test(p));

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
            case "password":
                if (!value) error = "Password is required";
                else if (!isStrongPassword(value)) error = "Password does not meet all requirements";
                break;
            case "confirmPassword":
                if (!value) error = "Please confirm your password";
                else if (value !== password) error = "Passwords do not match";
                break;
            case "serviceConsent":
                if (!value) error = "You must agree to the terms and conditions";
                break;
            default: break;
        }
        setFieldErrors(prev => ({ ...prev, [field]: error }));
        return !error;
    };

    // ─── Field handlers ───
    const handleNameChange = (e) => { const v = e.target.value; setName(v); validateField("name", v); };
    const handleEmailChange = (e) => { const v = e.target.value; setEmail(v); validateField("email", v); };
    const handlePhoneChange = (e) => {
        const v = e.target.value.replace(/\D/g, "");
        if (v.length <= 10) { setPhone(v); validateField("phone", v); }
    };
    const handlePasswordChange = (e) => {
        const v = e.target.value; setPassword(v); validateField("password", v);
        if (confirmPassword) validateField("confirmPassword", confirmPassword);
    };
    const handleConfirmPasswordChange = (e) => { const v = e.target.value; setConfirmPassword(v); validateField("confirmPassword", v); };
    const handleConsentChange = (e) => { const c = e.target.checked; setServiceConsent(c); validateField("serviceConsent", c); };

    // ─── STEP 1: Validate & Check User Exists ───
    const handleStep1Continue = async (e) => {
        e.preventDefault();
        const valid = ["name", "email", "phone", "password", "confirmPassword", "serviceConsent"]
            .map(f => validateField(f, f === "serviceConsent" ? serviceConsent : { name, email, phone, password, confirmPassword }[f]))
            .every(Boolean);

        if (!valid) { setErrorMsg("Please fix all errors before continuing."); return; }

        setErrorMsg(""); setLoading(true);

        try {
            const result = await checkUserExists({ email, phone }).unwrap();
            if (result.exists) {
                setErrorMsg(result.message);
                setLoading(false);
                return;
            }
            // Move to Step 2 — send email OTP
            await handleSendEmailOtp();
            setStep(2);
        } catch (err) {
            setErrorMsg(err?.data?.error || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ─── STEP 2: Email OTP ───
    const handleSendEmailOtp = async () => {
        setErrorMsg(""); setSuccessMsg("");
        try {
            await sendEmailOtp({ email }).unwrap();
            setSuccessMsg("Verification OTP sent to " + email);
            setEmailTimer(300);
            setTimeout(() => otpInputRef.current?.focus(), 100);
        } catch (err) {
            setErrorMsg(err?.data?.message || "Failed to send email OTP");
        }
    };

    const handleVerifyEmailOtp = async (e) => {
        e.preventDefault();
        if (!emailOtp || emailOtp.length < 4 || emailOtp.length > 6) {
            setErrorMsg("Please enter a valid OTP"); return;
        }
        setErrorMsg(""); setLoading(true);
        try {
            const result = await verifyEmailOtp({ email, otp: emailOtp }).unwrap();
            if (result.success) {
                setEmailVerifyToken(result.emailVerifyToken);
                setSuccessMsg("Email verified! Now let's verify your phone.");
                // Move to step 3 — send phone OTP
                await handleSendPhoneOtp();
                setStep(3);
            } else {
                setErrorMsg(result.message || "Invalid OTP");
            }
        } catch (err) {
            setErrorMsg(err?.data?.message || "Email OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    // ─── STEP 3: Phone OTP ───
    const handleSendPhoneOtp = async () => {
        setErrorMsg(""); setSuccessMsg("");
        try {
            const result = await sendPhoneOtp({ phone }).unwrap();
            if (result.success) {
                setPhoneReqId(result.reqId);
                setSuccessMsg("OTP sent to +91 " + phone);
                setPhoneTimer(30);
                setTimeout(() => otpInputRef.current?.focus(), 100);
            } else {
                setErrorMsg("Failed to send phone OTP");
            }
        } catch (err) {
            setErrorMsg(err?.data?.message || "Failed to send phone OTP");
        }
    };

    const handleVerifyPhoneAndRegister = async (e) => {
        e.preventDefault();
        if (!phoneOtp || phoneOtp.length < 4 || phoneOtp.length > 6) {
            setErrorMsg("Please enter a valid OTP"); return;
        }
        setErrorMsg(""); setLoading(true);
        try {
            // Verify phone OTP
            const verifyResult = await verifyPhoneOtp({ phone, otp: phoneOtp, reqId: phoneReqId }).unwrap();
            if (!verifyResult.success) {
                setErrorMsg(verifyResult.message || "Invalid OTP"); setLoading(false); return;
            }
            const pToken = verifyResult.phoneVerifyToken;
            setPhoneVerifyToken(pToken);

            // Successfully verified! Move to Step 4 (SSB Details Profile)
            setStep(4);
            setErrorMsg("");
            setSuccessMsg("Phone verified successfully! Please fill in your SSB profile details to complete registration.");
        } catch (err) {
            console.error("Phone OTP verification error:", err);
            setErrorMsg(err?.data?.message || "Phone OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    // ─── STEP 4: Submit Full Profile and Register ───
    const handleSSBSubmitAndRegister = async (e) => {
        e.preventDefault();
        
        // Basic validations for Step 4
        if (ssbAspirant === "-None-") { setErrorMsg("Please select if you are an SSB Aspirant."); return; }
        if (servingCandidate === "-None-") { setErrorMsg("Please select if you are a serving candidate."); return; }
        
        setErrorMsg(""); setLoading(true);
        try {
            // Register user with all fields (Signup + SSB Details)
            const regResult = await register({
                name, email, phone, password,
                emailVerifyToken,
                phoneVerifyToken,
                dob,
                ssbAspirant,
                servingCandidate,
                vtxHeard,
                youtubeSubscribed,
                podcastSubscribed,
                ssbExperience,
                nextSsbDate,
                ssbBoards,
                ssbEntries,
                city,
                state
            }).unwrap();

            if (regResult) {
                // Add lead locally in DB if needed
                try {
                    await addLeadStudent({ name, email, phoneNumber: phone }).unwrap();
                } catch (leadErr) {
                    console.error("Add lead error:", leadErr);
                }
                toast.success("Registration completed successfully!");
                navigate('/SignIn', { state: { registered: true } });
            }
        } catch (err) {
            console.error("Registration error:", err);
            setErrorMsg(err?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ─── Format timer ───
    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    // ─── Password strength ───
    const strength = getPasswordStrength(password);

    // ─── Render ───
    return (
        <>
            <div className="thm-content-layer signup-compact">
                <div className="thm-content-bg"></div>
                <div onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className='arrow_button'>
                    <BiArrowBack />
                </div>

                <div className="container position-relative">
                    <h1 className="thm-big-title">Sign Up</h1>

                    {/* ═══ Step Progress Indicator ═══ */}
                    <div className="step-indicator" style={{ zIndex: '55556' }}>
                        {[
                            { num: 1, label: 'Your Info' },
                            { num: 2, label: 'Verify Email' },
                            { num: 3, label: 'Verify Phone' },
                            { num: 4, label: 'SSB Profile' },
                        ].map((s, i) => (
                            <React.Fragment key={s.num}>
                                <div className={`step-item ${step >= s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}>
                                    <div className="step-circle">
                                        {step > s.num ? '✓' : s.num}
                                    </div>
                                    <div className="step-label">{s.label}</div>
                                </div>
                                {i < 3 && <div className={`step-line ${step > s.num ? 'active' : ''}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="position-relative" style={{ zIndex: '55555' }}>

                        {/* ═══════════════ STEP 1: BASIC INFO ═══════════════ */}
                        {step === 1 && (
                            <div className="row col-xl-7 g-4 g-md-2 col-lg-9 mx-auto justify-content-center">
                                {/* Name */}
                                <div className="col-lg-12">
                                    <input type="text" className={`form-control thm-input ${fieldErrors.name ? 'is-invalid' : ''}`}
                                        placeholder="Your Full Name" value={name} onChange={handleNameChange}
                                        onBlur={() => validateField("name", name)} required />
                                    {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
                                </div>

                                {/* Email */}
                                <div className="col-lg-12">
                                    <input type="email" className={`form-control thm-input ${fieldErrors.email ? 'is-invalid' : ''}`}
                                        placeholder="Your Email Address" value={email} onChange={handleEmailChange}
                                        onBlur={() => validateField("email", email)} required />
                                    {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
                                </div>

                                {/* Phone */}
                                <div className="col-lg-12">
                                    <input type="text" className={`form-control thm-input ${fieldErrors.phone ? 'is-invalid' : ''}`}
                                        placeholder="Your 10-digit Phone Number" value={phone} onChange={handlePhoneChange}
                                        onBlur={() => validateField("phone", phone)} maxLength={10} inputMode="numeric" required />
                                    {fieldErrors.phone && <div className="field-error">{fieldErrors.phone}</div>}
                                </div>

                                {/* Password */}
                                <div className="col-lg-12">
                                    <div className="password-wrapper">
                                        <input type={showPassword ? "text" : "password"}
                                            className={`form-control thm-input password-input ${fieldErrors.password ? 'is-invalid' : ''}`}
                                            placeholder="Create Password" value={password} onChange={handlePasswordChange}
                                            onBlur={() => validateField("password", password)} required />
                                        <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </span>
                                    </div>

                                    {/* Password strength meter */}
                                    {password && (
                                        <div className="password-strength-section">
                                            <div className="password-strength-bar">
                                                <div className="password-strength-fill"
                                                    style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }}></div>
                                            </div>
                                            <span className="password-strength-label" style={{ color: strength.color }}>
                                                {strength.label}
                                            </span>
                                            <div className="password-rules">
                                                {passwordRules.map(rule => (
                                                    <div key={rule.key} className={`password-rule ${rule.test(password) ? 'passed' : 'failed'}`}>
                                                        <span>{rule.test(password) ? '✓' : '✗'}</span> {rule.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {fieldErrors.password && !password && <div className="field-error">{fieldErrors.password}</div>}
                                </div>

                                {/* Confirm Password */}
                                <div className="col-lg-12 mt-3">
                                    <div className="password-wrapper">
                                        <input type={showConfirmPassword ? "text" : "password"}
                                            className={`form-control thm-input ${fieldErrors.confirmPassword ? 'is-invalid' : ''}`}
                                            placeholder="Repeat Password" value={confirmPassword} onChange={handleConfirmPasswordChange}
                                            onBlur={() => validateField("confirmPassword", confirmPassword)} required />
                                        <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                        </span>
                                    </div>
                                    {fieldErrors.confirmPassword && <div className="field-error">{fieldErrors.confirmPassword}</div>}
                                </div>

                                {/* Error Message */}
                                {errorMsg && (
                                    <div className="col-lg-12">
                                        <p className="field-error text-center" style={{ fontSize: '16px' }}>{errorMsg}</p>
                                    </div>
                                )}

                                {/* Consent */}
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
                                        <input type="checkbox" checked={serviceConsent} onChange={handleConsentChange} required />
                                        <span>
                                            I hereby consent to <strong>SSB with ISV</strong> collecting, storing,
                                            processing, and using my personal data in accordance with the{" "}
                                            <span className="policy-link" onClick={() => navigate("/PrivacyPolicy")}
                                                style={{ cursor: 'pointer', color: 'var(--secondary-color)' }}>
                                                Privacy Policy
                                            </span>,
                                            for the purpose of counselling, mentoring, admissions,
                                            communication, and related services. I understand that I may
                                            withdraw my consent at any time by contacting the Grievance Officer.
                                        </span>
                                    </label>
                                    {fieldErrors.serviceConsent && <div className="field-error">{fieldErrors.serviceConsent}</div>}
                                </div>

                                {/* Continue Button */}
                                <div className="col-12 d-flex justify-content-center mt-5">
                                    <CustomButton
                                        text={loading ? "Checking..." : "CONTINUE"}
                                        onClick={handleStep1Continue}
                                        disabled={loading}
                                    />
                                </div>

                                {/* Login Link */}
                                <div className="col-12 text-center mt-5">
                                    <div onClick={() => navigate('/SignIn')} className="thm-account-link" style={{ cursor: 'pointer' }}>
                                        I already have an account.
                                    </div>
                                </div>

                                {/* Social Login */}
                                {/* <div className="col-12">
                                    <SocialLoginButtons />
                                </div> */}
                            </div>
                        )}

                        {/* ═══════════════ STEP 2: EMAIL OTP ═══════════════ */}
                        {step === 2 && (
                            <div className="row col-xl-7 g-4 g-md-2 col-lg-9 mx-auto justify-content-center">
                                <div className="col-lg-12 text-center mb-3">
                                    <p style={{ color: '#c6c5af', fontSize: '18px', lineHeight: '1.6' }}>
                                        We've sent a verification code to<br />
                                        <strong style={{ color: '#f4c430' }}>{email}</strong>
                                    </p>
                                </div>

                                <div className="col-lg-12">
                                    <input ref={otpInputRef} type="text"
                                        className="form-control thm-input" placeholder="Enter OTP"
                                        value={emailOtp} maxLength={6} inputMode="numeric"
                                        onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); if (v.length <= 6) setEmailOtp(v); }}
                                    />
                                </div>

                                {/* Timer / Resend */}
                                <div className="col-lg-12 text-end">
                                    {emailTimer > 0 ? (
                                        <span className="thm-account-link" style={{ cursor: 'default' }}>
                                            Resend in {formatTime(emailTimer)}
                                        </span>
                                    ) : (
                                        <span className="thm-account-link" onClick={handleSendEmailOtp}
                                            style={{ cursor: 'pointer', color: '#f4c430' }}>
                                            Resend OTP
                                        </span>
                                    )}
                                </div>

                                {/* Messages */}
                                {successMsg && <div className="col-lg-12"><p style={{ color: '#22c55e', textAlign: 'center' }}>{successMsg}</p></div>}
                                {errorMsg && <div className="col-lg-12"><p className="field-error text-center" style={{ fontSize: '16px' }}>{errorMsg}</p></div>}

                                {/* Verify Button */}
                                <div className="col-12 d-flex justify-content-center mt-4">
                                    <CustomButton
                                        text={loading ? "Verifying..." : "VERIFY EMAIL"}
                                        onClick={handleVerifyEmailOtp}
                                        disabled={loading || emailOtp.length < 4 || emailOtp.length > 6}
                                    />
                                </div>

                                {/* Back */}
                                <div className="col-12 text-center mt-3">
                                    <div className="thm-account-link" onClick={() => { setStep(1); setErrorMsg(""); setSuccessMsg(""); }}
                                        style={{ cursor: 'pointer' }}>
                                        ← Back to edit info
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══════════════ STEP 3: PHONE OTP ═══════════════ */}
                        {step === 3 && (
                            <div className="row col-xl-7 g-4 g-md-2 col-lg-9 mx-auto justify-content-center">
                                <div className="col-lg-12 text-center mb-3">
                                    <p style={{ color: '#c6c5af', fontSize: '18px', lineHeight: '1.6' }}>
                                        We've sent a verification code to<br />
                                        <strong style={{ color: '#f4c430' }}>+91 {phone}</strong>
                                    </p>
                                </div>

                                <div className="col-lg-12">
                                    <input ref={otpInputRef} type="text"
                                        className="form-control thm-input" placeholder="Enter OTP"
                                        value={phoneOtp} maxLength={6} inputMode="numeric"
                                        onChange={(e) => { const v = e.target.value.replace(/\D/g, ""); if (v.length <= 6) setPhoneOtp(v); }}
                                    />
                                </div>

                                {/* Timer / Resend */}
                                <div className="col-lg-12 text-end">
                                    {phoneTimer > 0 ? (
                                        <span className="thm-account-link" style={{ cursor: 'default' }}>
                                            Resend in {formatTime(phoneTimer)}
                                        </span>
                                    ) : (
                                        <span className="thm-account-link" onClick={handleSendPhoneOtp}
                                            style={{ cursor: 'pointer', color: '#f4c430' }}>
                                            Resend OTP
                                        </span>
                                    )}
                                </div>

                                {/* Messages */}
                                {successMsg && <div className="col-lg-12"><p style={{ color: '#22c55e', textAlign: 'center' }}>{successMsg}</p></div>}
                                {errorMsg && <div className="col-lg-12"><p className="field-error text-center" style={{ fontSize: '16px' }}>{errorMsg}</p></div>}

                                {/* Register Button */}
                                <div className="col-12 d-flex justify-content-center mt-4">
                                    <CustomButton
                                        text={loading ? "Verifying..." : "VERIFY & CONTINUE"}
                                        onClick={handleVerifyPhoneAndRegister}
                                        disabled={loading || phoneOtp.length < 4 || phoneOtp.length > 6}
                                    />
                                </div>
 
                                {/* Back */}
                                <div className="col-12 text-center mt-3">
                                    <div className="thm-account-link" onClick={() => { setStep(2); setErrorMsg(""); setSuccessMsg(""); }}
                                        style={{ cursor: 'pointer' }}>
                                        ← Back to email verification
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══════════════ STEP 4: SSB PROFILE ═══════════════ */}
                        {step === 4 && (
                            <div className="row col-xl-9 g-3 col-lg-10 mx-auto justify-content-center mgf-wrapper" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                                <div className="col-lg-12 text-center mb-2">
                                    <p style={{ color: '#c6c5af', fontSize: '18px', lineHeight: '1.6' }}>
                                        Complete your <strong style={{ color: '#f4c430' }}>SSB Profile</strong> to finish setup.
                                    </p>
                                </div>

                                <div className="col-lg-6 mgf-field">
                                    <label className="mgf-label">Date of Birth</label>
                                    <input className="mgf-input" type="date"
                                        value={dob}
                                        onChange={e => setDob(e.target.value)} />
                                </div>

                                <div className="col-lg-6 mgf-field">
                                    <label className="mgf-label">Are you an SSB Aspirant? <span className="mgf-required">*</span></label>
                                    <select className="mgf-select"
                                        value={ssbAspirant} onChange={e => setSsbAspirant(e.target.value)}>
                                        <option value="-None-">Select…</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>

                                <div className="col-lg-6 mgf-field">
                                    <label className="mgf-label">Serving candidate? <span className="mgf-required">*</span></label>
                                    <select className="mgf-select"
                                        value={servingCandidate} onChange={e => setServingCandidate(e.target.value)}>
                                        <option value="-None-">Select…</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>

                                <div className="col-lg-6 mgf-field">
                                    <label className="mgf-label">SSB Experience</label>
                                    <select className="mgf-select" value={ssbExperience} onChange={e => setSsbExperience(e.target.value)}>
                                        <option value="-None-">Select…</option>
                                        <option value="Fresher">Fresher</option>
                                        <option value="Screen Out">Screen Out</option>
                                        <option value="Conference Out">Conference Out</option>
                                    </select>
                                </div>

                                <div className="col-lg-6 mgf-field">
                                    <label className="mgf-label">Heard about VTX™?</label>
                                    <select className="mgf-select" value={vtxHeard} onChange={e => setVtxHeard(e.target.value)}>
                                        <option value="-None-">Select…</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>

                                <div className="col-lg-6 mgf-field">
                                    <label className="mgf-label">Subscribed to YouTube?</label>
                                    <select className="mgf-select" value={youtubeSubscribed} onChange={e => setYoutubeSubscribed(e.target.value)}>
                                        <option value="-None-">Select…</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>

                                <div className="col-lg-6 mgf-field">
                                    <label className="mgf-label">Subscribed to Podcast?</label>
                                    <select className="mgf-select" value={podcastSubscribed} onChange={e => setPodcastSubscribed(e.target.value)}>
                                        <option value="-None-">Select…</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>

                                <div className="col-lg-6 mgf-field">
                                    <label className="mgf-label">Next SSB Date</label>
                                    <input className="mgf-input" type="date"
                                        value={nextSsbDate} onChange={e => setNextSsbDate(e.target.value)} />
                                </div>

                                <div className="col-lg-6 mgf-field">
                                    <label className="mgf-label">City</label>
                                    <input className="mgf-input" placeholder="New Delhi"
                                        value={city} onChange={e => setCity(e.target.value)} />
                                </div>

                                <div className="col-lg-6 mgf-field">
                                    <label className="mgf-label">State</label>
                                    <input className="mgf-input" placeholder="Delhi"
                                        value={state} onChange={e => setState(e.target.value)} />
                                </div>

                                <div className="col-lg-12 mgf-field mt-3">
                                    <label className="mgf-label">SSB Board / Centre (Select all that apply)</label>
                                    <div className="mgf-checkbox-grid" style={{ maxHeight: '160px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px' }}>
                                        {BOARD_OPTIONS.map(opt => (
                                            <label key={opt} className="mgf-checkbox-item">
                                                <input type="checkbox"
                                                    checked={ssbBoards.includes(opt)}
                                                    onChange={() => {
                                                        setSsbBoards(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
                                                    }} />
                                                <span style={{ fontSize: '13px', color: '#eae9d4' }}>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-lg-12 mgf-field mt-3">
                                    <label className="mgf-label">SSB Entry (Select all that apply)</label>
                                    <div className="mgf-checkbox-grid" style={{ maxHeight: '160px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px' }}>
                                        {ENTRY_OPTIONS.map(opt => (
                                            <label key={opt} className="mgf-checkbox-item">
                                                <input type="checkbox"
                                                    checked={ssbEntries.includes(opt)}
                                                    onChange={() => {
                                                        setSsbEntries(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
                                                    }} />
                                                <span style={{ fontSize: '13px', color: '#eae9d4' }}>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Messages */}
                                {successMsg && <div className="col-lg-12"><p style={{ color: '#22c55e', textAlign: 'center', margin: 0 }}>{successMsg}</p></div>}
                                {errorMsg && <div className="col-lg-12"><p className="field-error text-center" style={{ fontSize: '16px', margin: 0 }}>{errorMsg}</p></div>}

                                <div className="col-12 d-flex justify-content-center mt-4">
                                    <CustomButton
                                        text={loading ? "COMPLETING REGISTRATION..." : "FINISH & REGISTER"}
                                        onClick={handleSSBSubmitAndRegister}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <span style={{ zIndex: '654' }} className="thm-glow"></span>
                </div>
            </div>
        </>
    )
}

export default SignUp;