import React, { useState, useEffect, useRef } from 'react'
import '../../style/custom-theme.css'
import CustomButton from '../../components/CustomButton'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BiArrowBack } from 'react-icons/bi'

function AccountRecovery() {
    const navigate = useNavigate()

    // State for form data
    const [formData, setFormData] = useState({
        identifier: '', // Email or phone
        otp: '',
        newPassword: '',
        confirmPassword: ''
    })

    // State for UI control
    const [step, setStep] = useState(1) // 1: Enter identifier, 2: Enter OTP, 3: Set password
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [timer, setTimer] = useState(0)
    const [otpSent, setOtpSent] = useState(false)
    const [reqID, setReqID] = useState('')
    const [inputType, setInputType] = useState('text') // For dynamic input type

    // Refs
    const timerRef = useRef(null)
    const otpInputRef = useRef(null)

    // Timer effect
    useEffect(() => {
        if (timer > 0) {
            timerRef.current = setTimeout(() => {
                setTimer(timer - 1)
            }, 1000)
        } else if (timer === 0 && otpSent) {
            // OTP expired
            setError('OTP has expired. Please request a new one.')
            setOtpSent(false)
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [timer, otpSent])

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target

        let newValue = value

        // For identifier field
        if (name === 'identifier') {
            // If user starts typing numbers, switch to number mode
            if (/^\d+$/.test(value)) {
                // Only allow digits and limit to 10
                newValue = value.replace(/\D/g, '').slice(0, 10)
                setInputType('tel')
            } else if (value === '') {
                // Reset to text when empty
                setInputType('text')
            } else if (value.includes('@')) {
                // If contains @, it's an email
                setInputType('email')
            }
        }

        // For OTP field - only digits, max 6
        if (name === 'otp') {
            newValue = value.replace(/\D/g, '').slice(0, 6)
        }

        setFormData({
            ...formData,
            [name]: newValue
        })

        // Clear errors when user types
        if (error) setError('')
    }

    // Validate identifier (email or phone)
    const validateIdentifier = () => {
        const identifier = formData.identifier.trim()

        if (!identifier) {
            setError('Please enter your email or phone number')
            return false
        }

        // Check if it's a phone number (all digits)
        if (/^\d+$/.test(identifier)) {
            if (identifier.length !== 10) {
                setError('Phone number must be exactly 10 digits')
                return false
            }
        }
        // Check if it's an email
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
            setError('Please enter a valid email address')
            return false
        }

        return true
    }

    // Validate OTP
    const validateOtp = () => {
        if (!formData.otp.trim()) {
            setError('Please enter the OTP')
            return false
        }

        if (formData.otp.length !== 6) {
            setError('OTP must be 6 digits')
            return false
        }

        return true
    }

    // Validate password
    const validatePassword = () => {
        if (!formData.newPassword.trim()) {
            setError('Please enter new password')
            return false
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return false
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match')
            return false
        }
        if (!formData.identifier) {
            setError('please fill phone or email')
            return false
        }

        return true
    }


    let tokenAuth = "432663TzWGndK2N7sR6710de92P1"
    let widgetId = "346a776c5749333834363239"

    // Step 1: Send OTP
    const handleSendOtp = async () => {

        if (!formData.identifier) {
            setError('please fill phone or email')

            return
        }

        console.log(formData.identifier)
        if (!validateIdentifier()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const identifier = formData.identifier.trim();

            // ✅ CASE 1: PHONE NUMBER → MSG91
            if (/^\d+$/.test(identifier)) {
                const requestData = {
                    widgetId: widgetId,
                    tokenAuth: tokenAuth,
                    identifier: `91${identifier}`, // country code
                };

                const response = await axios.post(
                    "https://api.msg91.com/api/v5/widget/sendOtp",
                    requestData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.data.success || response.data.message) {
                    setReqID(response.data.message);
                    setSuccess('OTP sent successfully! Please check your phone.');
                    setOtpSent(true);
                    setTimer(300);
                    setStep(2);
                } else {
                    setError(response.data.message || 'Failed to send OTP');
                }
            }

            // ✅ CASE 2: EMAIL → YOUR BACKEND API
            else {
                const response = await axios.post(
                    "https://api.ssbwithisv.in/api/send-otp",
                    {
                        email: identifier.toLowerCase(),
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.data.success) {
                    setSuccess('OTP sent successfully! Please check your email.');
                    setOtpSent(true);
                    setTimer(300);
                    setStep(2);
                } else {
                    setError(response.data.message || 'Failed to send OTP');
                }
            }

            // Auto-focus OTP input
            setTimeout(() => {
                if (otpInputRef.current) {
                    otpInputRef.current.focus();
                }
            }, 100);

        } catch (err) {
            console.error('Send OTP error:', err);

            if (err.response) {
                switch (err.response.status) {
                    case 404:
                        setError('Account not found. Please check your email/phone');
                        break;
                    case 429:
                        setError('Too many attempts. Please try again later');
                        break;
                    case 500:
                        setError('Server error. Please try again later');
                        break;
                    default:
                        setError(err.response.data?.message || 'Failed to send OTP');
                }
            } else if (err.request) {
                setError('Network error. Please check your connection');
            } else {
                setError('An error occurred. Please try again');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async () => {
        if (!validateOtp()) {
            return;
        }

        // OTP expiry check
        if (timer === 0) {
            setError('OTP has expired. Please request a new one.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const identifier = formData.identifier.trim();

            // ✅ CASE 1: PHONE → MSG91 VERIFY
            if (/^\d+$/.test(identifier)) {
                const requestData = {
                    otp: formData.otp,
                    reqId: reqID,
                    widgetId,
                    tokenAuth,
                };

                const response = await axios.post(
                    'https://api.msg91.com/api/v5/widget/verifyOtp',
                    requestData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.status === 200) {
                    setSuccess('OTP verified successfully!');
                    setStep(3);
                } else {
                    setError('Invalid OTP. Please try again.');
                }
            }

            // ✅ CASE 2: EMAIL → YOUR BACKEND VERIFY
            else {
                const response = await axios.post(
                    'https://api.ssbwithisv.in/api/verify-otp',
                    {
                        email: identifier.toLowerCase(),
                        otp: formData.otp,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data.success) {
                    setSuccess('OTP verified successfully!');
                    setStep(3);
                } else {
                    setError(response.data.message || 'Invalid OTP');
                }
            }

        } catch (err) {
            console.error('Verify OTP error:', err);

            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        setError(err.response.data?.message || 'Invalid OTP');
                        break;
                    case 404:
                        setError('OTP not found');
                        break;
                    case 410:
                        setError('OTP expired');
                        break;
                    default:
                        setError(err.response.data?.message || 'Failed to verify OTP');
                }
            } else if (err.request) {
                setError('Network error. Please check your connection');
            } else {
                setError('An error occurred. Please try again');
            }
        } finally {
            setIsLoading(false);
        }
    };


    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!validatePassword()) return;

        setIsLoading(true);
        setError('');

        try {
            const identifier = formData.identifier.trim();
            let requestData = {};

            // ✅ CASE 1: PHONE
            if (/^\d+$/.test(identifier)) {
                requestData = {
                    phone: identifier,
                    newPassword: formData.newPassword,
                };
            }
            // ✅ CASE 2: EMAIL
            else {
                requestData = {
                    email: identifier.toLowerCase(),
                    newPassword: formData.newPassword,
                };
            }

            const response = await axios.post(
                'https://api.ssbwithisv.in/api/forgot-password',
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                setSuccess('Password reset successfully! Redirecting to login...');

                setTimeout(() => {
                    navigate('/SignIn');
                }, 2000);
            } else {
                setError(response.data.message || 'Failed to reset password');
            }

        } catch (err) {
            console.error('Reset password error:', err);

            if (err.response) {
                const errorData = err.response.data;

                switch (err.response.status) {
                    case 400:
                        setError(errorData.message || 'Invalid request');
                        break;
                    case 410:
                        setError('OTP session expired. Please start over');
                        setStep(1);
                        break;
                    case 500:
                        setError('Server error. Please try again later');
                        break;
                    default:
                        setError(errorData.message || 'Failed to reset password');
                }
            } else if (err.request) {
                setError('Network error. Please check your connection');
            } else {
                setError('An error occurred. Please try again');
            }
        } finally {
            setIsLoading(false);
        }
    };


    // Resend OTP
    const handleResendOtp = async () => {
        if (timer > 0) {
            setError(`Please wait ${timer} seconds before resending OTP`)
            return
        }

        await handleSendOtp()
    }

    // Format timer display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // Handle Enter key press
    const handleKeyPress = (e, action) => {
        if (e.key === 'Enter' && !isLoading) {
            e.preventDefault()
            if (action === 'sendOtp' && step === 1) {
                handleSendOtp()
            } else if (action === 'verifyOtp' && step === 2) {
                handleVerifyOtp()
            } else if (action === 'resetPassword' && step === 3) {
                handleResetPassword(e)
            }
        }
    }

    // Determine placeholder text
    const getPlaceholderText = () => {
        if (inputType === 'tel') {
            return 'Enter Your 10-digit Phone Number'
        } else if (inputType === 'email') {
            return 'Enter Your Email Address'
        }
        return 'Enter Your Email or Phone Number'
    }

    return (
        <div className="thm-content-layer">
            <div className="thm-content-bg"></div>
            <div onClick={() => navigate(-1)} className='arrow_button'>
                <BiArrowBack />
            </div>

            <div className="container position-relative">
                <h1 className="thm-big-title">Account Recovery</h1>

                {/* Success Message */}
                {success && (
                    <div className="alert alert-success col-xl-7 col-lg-9 mx-auto" role="alert">
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger col-xl-7 col-lg-9 mx-auto" role="alert">
                        {error}
                    </div>
                )}

                {/* Step 1: Enter Email/Phone */}
                {step === 1 && (
                    <div
                        className="row col-xl-7 g-4 g-md-2 col-lg-9 mx-auto justify-content-center"
                        // onKeyPress={(e) => handleKeyPress(e, 'sendOtp')}
                    >
                        <div className="col-lg-12">
                            <input
                                type={inputType}
                                name="identifier"
                                className="form-control thm-input"
                                placeholder={getPlaceholderText()}
                                value={formData.identifier}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                autoComplete="username"
                                inputMode={inputType === 'tel' ? 'numeric' : 'text'}
                                maxLength={inputType === 'tel' ? 10 : undefined}
                            />
                            <small className="form-text text-muted mt-1">
                                {inputType === 'tel'
                                    ? 'Enter 10-digit phone number'
                                    : 'Enter email address or start typing phone number'
                                }
                            </small>
                        </div>

                        <div className="col-12 text-center mt-4">
                            <div className='d-flex justify-content-center'>
                                <CustomButton
                                    text={isLoading ? "SENDING..." : "SEND OTP"}
                                    onClick={handleSendOtp}
                                    disabled={isLoading}
                                    loading={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Enter OTP */}
                {step === 2 && (
                    <div
                        className="row col-xl-7 g-4 g-md-2 mt-5 pt-5 col-lg-9 mx-auto justify-content-center"
                        // onKeyPress={(e) => handleKeyPress(e, 'verifyOtp')}
                    >
                        <div className="col-lg-12">
                            <input
                                ref={otpInputRef}
                                type="text"
                                name="otp"
                                className="form-control thm-input"
                                placeholder="Enter 6-digit OTP"
                                value={formData.otp}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                inputMode="numeric"
                                maxLength={6}
                            />
                        </div>

                        <div className="col-lg-12 text-end mt-2">
                            {timer > 0 ? (
                                <div className="thm-account-link">
                                    OTP expires in: {formatTime(timer)}
                                </div>
                            ) : (
                                <div
                                    className="thm-account-link"
                                    onClick={handleResendOtp}
                                    style={{ cursor: 'pointer', color: '#007bff' }}
                                >
                                    Resend OTP
                                </div>
                            )}
                        </div>

                        <div className="col-12 text-center mt-4">
                            <div className='d-flex justify-content-center'>
                                <CustomButton
                                    text={isLoading ? "VERIFYING..." : "VERIFY OTP"}
                                    onClick={handleVerifyOtp}
                                    disabled={isLoading}
                                    loading={isLoading}
                                />
                            </div>
                        </div>

                        <div className="col-12 text-center mt-3">
                            <div
                                className="thm-account-link"
                                onClick={() => setStep(1)}
                                style={{ cursor: 'pointer' }}
                            >
                                ← Back to change email/phone
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Set New Password */}
                {step === 3 && (
                    <div
                        className="row col-xl-7 g-4 g-md-2 mt-5 pt-5 col-lg-9 mx-auto justify-content-center"
                        onKeyPress={(e) => handleKeyPress(e, 'resetPassword')}
                    >
                        <div className="col-lg-12">
                            <input
                                type="password"
                                name="newPassword"
                                className="form-control thm-input"
                                placeholder="Enter New Password"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="col-lg-12 mt-3">
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control thm-input"
                                placeholder="Confirm New Password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="col-lg-12 mt-2">
                            <small className="form-text text-muted">
                                Password must be at least 6 characters long
                            </small>
                        </div>

                        <div className="col-12 text-center mt-4">
                            <div className='d-flex justify-content-center'>
                                <CustomButton
                                    text={isLoading ? "RESETTING..." : "RESET PASSWORD"}
                                    onClick={(e) => handleResetPassword(e)}
                                    disabled={isLoading}
                                    loading={isLoading}
                                />
                            </div>
                        </div>

                        <div className="col-12 text-center mt-3">
                            <div
                                className="thm-account-link"
                                onClick={() => setStep(2)}
                                style={{ cursor: 'pointer' }}
                            >
                                ← Back to OTP verification
                            </div>
                        </div>
                    </div>
                )}

                <span className="thm-glow"></span>
            </div>
        </div>
    )
}

export default AccountRecovery