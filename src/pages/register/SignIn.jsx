import React, { useState } from 'react'
import '../../style/custom-theme.css'
import { useNavigate } from 'react-router-dom'
import CustomButton from '../../components/CustomButton'
import axios from 'axios'
import toast from 'react-hot-toast'
import { BiArrowBack } from 'react-icons/bi'

function SignIn() {
    const navigate = useNavigate()

    // State to manage form data
    const [formData, setFormData] = useState({
        loginId: '', // This will accept both email and phone
        password: '',
        rememberMe: true
    })

    // State to manage loading and error states
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

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

        setIsLoading(true)
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
            const response = await axios.post('https://api.ssbwithisv.in/api/login', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other required headers
                }
            })

            // Handle successful login
            console.log('Login successful:', response.data)

            // Store authentication data
            if (response.data.token || response.data.accessToken) {
                const token = response.data.token || response.data.accessToken

                if (formData.rememberMe) {
                    localStorage.setItem('authToken', token)
                    localStorage.setItem('rememberMe', 'true')
                } else {
                    sessionStorage.setItem('authToken', token)
                    localStorage.removeItem('rememberMe')
                }
            }

            // Store user data if returned
            if (response.data.user) {
                const userData = JSON.stringify(response.data.user)
                localStorage.setItem('userData', userData)
                sessionStorage.setItem('userData', userData)
            }

            // Store login type for future reference if needed
            localStorage.setItem('lastLoginType', loginType)

            // Redirect based on user role or default dashboard
            if (response.data) {
                navigate('/')
                toast.success('Logged in successfully!')
            }

        } catch (err) {
            // Handle errors
            console.error('Login error:', err)

            // Set appropriate error message
            if (err.response) {
                // Server responded with error status
                const errorData = err.response.data

                switch (err.response.status) {
                    case 400:
                        setError(errorData.message || 'Invalid input. Please check your credentials')
                        break
                    case 401:
                        setError(errorData.message || 'Invalid email/phone or password')
                        break
                    case 403:
                        setError(errorData.message || 'Account not verified. Please verify your account')
                        break
                    case 404:
                        setError('Account not found. Please check your credentials')
                        break
                    case 429:
                        setError('Too many attempts. Please try again later')
                        break
                    case 500:
                        setError('Server error. Please try again later')
                        break
                    default:
                        setError(errorData.message || 'Login failed. Please try again')
                }
            } else if (err.request) {
                // Request was made but no response
                setError('Network error. Please check your internet connection')
            } else {
                // Other errors
                setError('An error occurred. Please try again')
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Function to handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSubmit(e)
        }
    }

    // Function to handle Google sign in (placeholder)
    const handleGoogleSignIn = () => {
        // Implement Google OAuth logic here
        console.log('Google sign in clicked')
        // You might want to redirect to Google OAuth endpoint
        // or use Firebase/Google Auth SDK
    }

    return (
        <div className="thm-content-layer">
            <div className="thm-content-bg"></div>
            <div onClick={() => navigate(-1)} className='arrow_button'>
                <BiArrowBack />
                
            </div>

            <div className="container position-relative">
                <h1 className="thm-big-title">Sign In</h1>

                {/* Display error message */}


                <form
                    className="row col-xl-7 g-4 g-md-2 col-lg-9 mx-auto justify-content-center"
                    onSubmit={handleSubmit}
                    onKeyPress={handleKeyPress}
                >
                    <div className="col-lg-12">
                        <input
                            type="text"
                            name="loginId"
                            className="form-control thm-input"
                            placeholder="Enter Your Email or Phone Number"
                            value={formData.loginId}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            autoComplete="username"
                            maxLength={30} // Set a reasonable max length for email
                        />
                        {/* <small className="form-text text-muted mt-1">
                            Enter your email address or 10-digit phone number
                        </small> */}
                    </div>

                    <div className="col-lg-12 mt-3">
                        <input
                            type="password"
                            name="password"
                            className="form-control thm-input"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="col-6 mt-4">
                        <label className="thm-checkbox">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                            <span className="thm-checkmark"></span>
                            Remember me
                        </label>
                    </div>

                    <div
                        style={{ zIndex: '999999' }}
                        onClick={() => !isLoading && navigate('/AccountRecovery')}
                        className="col-6 mt-4 text-end"
                    >
                        <div
                            className="thm-account-link"
                            style={{
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1
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
                            text={isLoading ? "SIGNING IN..." : "SIGN IN"}
                            type="submit"
                            disabled={isLoading}
                            loading={isLoading}
                        />
                    </div>

                    <div className="col-12 text-center mt-5">
                        <div
                            onClick={() => !isLoading && navigate('/SignUp')}
                            className="thm-account-link"
                            style={{
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.6 : 1
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
                </form>

                <span className="thm-glow"></span>
            </div>
        </div>
    )
}

export default SignIn