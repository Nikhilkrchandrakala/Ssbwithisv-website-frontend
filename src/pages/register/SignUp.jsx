import React, { useEffect, useState, useRef } from 'react'
import '../../style/custom-theme.css'
import { useNavigate } from 'react-router-dom'
import CustomButton from '../../components/CustomButton'
import { BiArrowBack } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
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

function SignUp() {
    const navigate = useNavigate()

    // ─── Step state (1=Info, 2=Email OTP, 3=Phone OTP) ───
    const [step, setStep] = useState(1);

    // ─── Form states ───
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

            // Register user
            const regResult = await register({
                name, email, phone, password,
                emailVerifyToken,
                phoneVerifyToken: pToken,
            }).unwrap();

            if (regResult) {
                // Add lead
                try {
                    await addLeadStudent({ name, email, phoneNumber: phone }).unwrap();
                } catch (leadErr) {
                    console.error("Add lead error:", leadErr);
                }
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
            <div className="thm-content-layer">
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
                        ].map((s, i) => (
                            <React.Fragment key={s.num}>
                                <div className={`step-item ${step >= s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}>
                                    <div className="step-circle">
                                        {step > s.num ? '✓' : s.num}
                                    </div>
                                    <div className="step-label">{s.label}</div>
                                </div>
                                {i < 2 && <div className={`step-line ${step > s.num ? 'active' : ''}`}></div>}
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
                                        text={loading ? "Creating Account..." : "VERIFY & SIGN UP"}
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
                    </div>

                    <span style={{ zIndex: '654' }} className="thm-glow"></span>
                </div>
            </div>
        </>
    )
}

export default SignUp;