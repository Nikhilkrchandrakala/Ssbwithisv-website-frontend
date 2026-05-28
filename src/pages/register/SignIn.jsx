import React, { useState } from 'react'
import '../../style/custom-theme.css'
import { useNavigate } from 'react-router-dom'
import CustomButton from '../../components/CustomButton'

import toast from 'react-hot-toast'
import { BiArrowBack } from 'react-icons/bi'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useLoginMutation } from '../../redux/api'

function SignIn() {
    const navigate = useNavigate()

    // State to manage form data
    const [formData, setFormData] = useState({
        loginId: '', // This will accept both email and phone
        password: '',
        rememberMe: true
    })

    // State to manage loading and error states

    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const [login, { isLoading: isLoginLoading }] = useLoginMutation()


    // Handle input changes



    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target

        let newValue = value

        // Only for loginId field
        if (name === 'loginId') {
            // If value contains only digits, limit to 10
            if (/^\d+$/.test(value)) {
                newValue = value.slice(0, 10)
            }
            // If it's not digits and not email format, don't restrict
            // (allows typing email normally)
        }

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : newValue
        })

        if (error) setError('')
    }

    // Helper function to determine if input is email or phone
    const identifyLoginType = (loginId) => {
        // Remove all non-digit characters for phone check
        const digitsOnly = loginId.replace(/\D/g, '')

        // Check if it's a phone number (contains only digits and possibly + at start)
        if (/^[\+]?[0-9\s\-\(\)]+$/.test(loginId) && digitsOnly.length >= 10) {
            return 'phone'
        }

        // Check if it's an email (basic email validation)
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginId)) {
            return 'email'
        }

        // If neither, return unknown
        return 'unknown'
    }

    // Validate form inputs
    const validateForm = () => {
        if (!formData.loginId.trim()) {
            setError('Please enter your email or phone number')
            return false
        }

        if (!formData.password.trim()) {
            setError('Please enter your password')
            return false
        }

        const loginType = identifyLoginType(formData.loginId)
        if (loginType === 'unknown') {
            setError('Please enter a valid email address or phone number')
            return false
        }

        if (loginType === 'phone') {
            const digitsOnly = formData.loginId.replace(/\D/g, '')
            if (digitsOnly.length < 10) {
                setError('Phone number must be at least 10 digits')
                return false
            }
        }

        return true
    }

    // Format phone number for API
    const formatPhoneNumber = (phone) => {
        // Remove all non-digit characters
        const digitsOnly = phone.replace(/\D/g, '')

        // If starts with country code, keep as is, otherwise assume local format
        // You may need to adjust this based on your country code requirements
        return digitsOnly
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate form
        if (!validateForm()) {
            return
        }

        setError('')

        try {
            // Identify if loginId is email or phone
            const loginType = identifyLoginType(formData.loginId)

            // Prepare the data for API based on login type
            let requestData = {
                password: formData.password
            }

            // Add either email or phone based on input
            if (loginType === 'email') {
                requestData.email = formData.loginId.trim().toLowerCase()
            } else if (loginType === 'phone') {
                requestData.phone = formatPhoneNumber(formData.loginId)
            }

            // Call the login API
            const response = await login(requestData).unwrap()


            // Handle successful login
            console.log('Login successful:', response)

            // Store authentication data
            if (response.token || response.accessToken) {
                const token = response.token || response.accessToken

                if (formData.rememberMe) {
                    localStorage.setItem('authToken', token)
                    localStorage.setItem('rememberMe', 'true')
                } else {
                    sessionStorage.setItem('authToken', token)
                    localStorage.removeItem('rememberMe')
                }
            }

            // Store user data if returned
            if (response.user) {
                const userData = JSON.stringify(response.user)
                localStorage.setItem('userData', userData)
                sessionStorage.setItem('userData', userData)
            }

            // Store login type for future reference if needed
            localStorage.setItem('lastLoginType', loginType)

            // Redirect based on user role or pending actions
            if (response) {
                const pendingBatch = localStorage.getItem('pendingBatch');
                if (pendingBatch) {
                    navigate('/batches'); // Go back to batches to complete payment
                } else {
                    navigate('/');
                }
                toast.success('Logged in successfully!')
            }

        } catch (err) {
            // Handle errors
            console.error('Login error:', err?.data?.error)

            // Set appropriate error message
            if (err?.data?.error) {
                setError(err.data.error)
            } else if (err.request) {
                // Request was made but no response
                setError('Network error. Please check your internet connection')
            } else {
                // Other errors
                setError('An error occurred. Please try again')
            }
        }
    }




    return (
        <div className="thm-content-layer">
            <div className="thm-content-bg"></div>
            <div onClick={() => navigate(-1)} className='arrow_button'>
                <BiArrowBack />

            </div>

            <div className="container position-relative">
                <h1 className="thm-big-title">Sign In</h1>

                {/* 🛡️ Premium Security & Confidentiality Banner */}
                <div 
                    className="mx-auto col-xl-7 col-lg-9 mb-4 p-4 position-relative"
                    style={{
                        background: "rgba(218, 165, 32, 0.05)",
                        border: "1px solid rgba(218, 165, 32, 0.2)",
                        borderRadius: "12px",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
                        transition: "all 0.3s ease",
                        zIndex: "55556",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.border = "1px solid rgba(218, 165, 32, 0.4)";
                        e.currentTarget.style.background = "rgba(218, 165, 32, 0.08)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.border = "1px solid rgba(218, 165, 32, 0.2)";
                        e.currentTarget.style.background = "rgba(218, 165, 32, 0.05)";
                        e.currentTarget.style.transform = "translateY(0)";
                    }}
                >
                    <div className="d-flex align-items-center gap-3">
                        <div style={{ flexShrink: 0 }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DAA520" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                                <path d="M12 8v4"/>
                                <path d="M12 16h.01"/>
                            </svg>
                        </div>
                        <div>
                            <h5 style={{ color: "#DAA520", fontWeight: "600", fontSize: "1.1rem", margin: "0 0 6px 0", fontFamily: "'Outfit', sans-serif" }}>
                                Security Upgrade & Confidentiality Notice
                            </h5>
                            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.88rem", lineHeight: "1.5", margin: "0", fontFamily: "'Inter', sans-serif" }}>
                                We are pleased to announce that we have successfully revamped our security protocols as we continuously strive towards the highest level of confidentiality and data integrity for all our candidates. As a positive and necessary step in this upgrade, users will need to reset their passwords. If you are unable to log in, please click <strong>Forgot Password</strong> below to instantly reset your password and secure your account.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Display error message */}
                <div className="position-relative" style={{ zIndex: '55555' }}>


                    <div
                        className="row col-xl-7 g-4 g-md-2 col-lg-9 mx-auto justify-content-center"
                    // onSubmit={handleSubmit}
                    // onKeyPress={handleKeyPress}
                    >
                        <div className="col-lg-12">
                            <input
                                type="text"
                                name="loginId"
                                className="form-control thm-input"
                                placeholder="Enter Your Email or Phone Number"
                                value={formData.loginId}
                                onChange={handleInputChange}
                                disabled={isLoginLoading}
                                autoComplete="username"
                                maxLength={30} // Set a reasonable max length for email
                            />
                            {/* <small className="form-text text-muted mt-1">
                            Enter your email address or 10-digit phone number
                        </small> */}
                        </div>

                        {/* <div className="col-lg-12 mt-3">
                        <input
                            type="password"
                            name="password"
                            className="form-control thm-input"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={isLoginLoading}
                            autoComplete="current-password"
                        />
                    </div> */}


                        <div className="col-lg-12 password-wrapper mt-3">
                            <input
                                // type="password"
                                type={showPassword ? "text" : "password"}

                                name="password"
                                className="form-control thm-input"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                disabled={isLoginLoading}
                                autoComplete="current-password"
                            />



                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiOutlineEyeInvisible
                                /> : <AiOutlineEye />}
                            </span>
                        </div>

                        <div className="col-6 mt-4">
                            <label className="thm-checkbox">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                    disabled={isLoginLoading}
                                />
                                <span className="thm-checkmark"></span>
                                Remember me
                            </label>
                        </div>

                        <div
                            style={{ zIndex: '999999' }}
                            onClick={() => !isLoginLoading && navigate('/AccountRecovery')}
                            className="col-6 mt-4 text-end"
                        >
                            <div
                                className="thm-account-link"
                                style={{
                                    cursor: isLoginLoading ? 'not-allowed' : 'pointer',
                                    opacity: isLoginLoading ? 0.6 : 1
                                }}
                            >
                                Forgot Password?
                            </div>
                        </div>

                        {error && (

                            <p className="text-danger text-center">
                                {error}
                            </p>
                        )}

                        <div className="col-12 d-flex justify-content-center mt-5">
                            <CustomButton
                                text={isLoginLoading ? "SIGNING IN..." : "SIGN IN"}
                                onClick={handleSubmit}
                                // type="submit"
                                disabled={isLoginLoading}
                                loading={isLoginLoading}
                            />
                        </div>

                        <div className="col-12 text-center mt-5">
                            <div
                                onClick={() => !isLoginLoading && navigate('/SignUp')}
                                className="thm-account-link"
                                style={{
                                    cursor: isLoginLoading ? 'not-allowed' : 'pointer',
                                    opacity: isLoginLoading ? 0.6 : 1
                                }}
                            >
                                Create a new account.
                            </div>
                        </div>

                        {/* <div className="col-12 text-center mt-3 mb-3">
                        <div className="thm-divider">
                            <span>or</span>
                        </div>
                    </div> */}

                        {/* <div className="col-12 d-flex justify-content-center">
                        <button
                            type="button"
                            className="thm-google-btn"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            style={{ opacity: isLoading ? 0.6 : 1 }}
                        >
                            <span className="thm-google-icon">
                                <img src="/assets/g-icon.png" alt="Google Icon" />
                            </span>
                            Sign in with Google
                        </button>
                    </div> */}
                    </div>
                </div>

                <span style={{ zIndex: '567' }} className="thm-glow"></span>
            </div>
        </div>
    )
}

export default SignIn