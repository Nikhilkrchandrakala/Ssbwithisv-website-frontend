import React, { useState } from 'react'
import '../../style/custom-theme.css'
import { useNavigate, useLocation } from 'react-router-dom'
import CustomButton from '../../components/CustomButton'
import toast from 'react-hot-toast'
import { BiArrowBack } from 'react-icons/bi'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { useLoginMutation } from '../../redux/api'

function SignIn() {
    const navigate = useNavigate()
    const location = useLocation()

    // Show success toast if redirected from signup
    const [shownRegisteredToast, setShownRegisteredToast] = useState(false);
    if (location.state?.registered && !shownRegisteredToast) {
        toast.success('Account created successfully! Please sign in.');
        setShownRegisteredToast(true);
        // Clear the state so it doesn't show again on refresh
        window.history.replaceState({}, document.title);
    }

    // Form state
    const [formData, setFormData] = useState({
        loginId: '',
        password: '',
        rememberMe: true
    })

    // Field-level errors
    const [fieldErrors, setFieldErrors] = useState({ loginId: '', password: '' });
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lockoutTimer, setLockoutTimer] = useState(0);

    const [login, { isLoading: isLoginLoading }] = useLoginMutation()

    // Lockout timer
    React.useEffect(() => {
        let interval;
        if (lockoutTimer > 0) {
            interval = setInterval(() => setLockoutTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [lockoutTimer]);

    // Handle input changes with inline validation
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        let newValue = value

        if (name === 'loginId') {
            if (/^\d+$/.test(value)) {
                newValue = value.slice(0, 10)
            }
        }

        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : newValue })

        // Clear errors on type
        if (error) setError('')
        if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Identify login type
    const identifyLoginType = (loginId) => {
        const digitsOnly = loginId.replace(/\D/g, '')
        if (/^[+]?[0-9\s\-()]+$/.test(loginId) && digitsOnly.length >= 10) return 'phone'
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginId)) return 'email'
        return 'unknown'
    }

    // Validate individual fields
    const validateField = (name, value) => {
        let err = '';
        if (name === 'loginId') {
            if (!value.trim()) err = 'Please enter your email or phone number';
            else {
                const type = identifyLoginType(value);
                if (type === 'unknown') err = 'Please enter a valid email address or 10-digit phone number';
                else if (type === 'phone' && value.replace(/\D/g, '').length < 10) err = 'Phone number must be at least 10 digits';
            }
        }
        if (name === 'password') {
            if (!value.trim()) err = 'Please enter your password';
        }
        setFieldErrors(prev => ({ ...prev, [name]: err }));
        return !err;
    };

    const formatPhoneNumber = (phone) => phone.replace(/\D/g, '')

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Rate limiting
        if (lockoutTimer > 0) {
            setError(`Too many failed attempts. Please try again in ${lockoutTimer} seconds.`);
            return;
        }

        // Validate fields
        const isLoginIdValid = validateField('loginId', formData.loginId);
        const isPasswordValid = validateField('password', formData.password);
        if (!isLoginIdValid || !isPasswordValid) return;

        setError('')

        try {
            const loginType = identifyLoginType(formData.loginId)
            let requestData = { password: formData.password }

            if (loginType === 'email') {
                requestData.email = formData.loginId.trim().toLowerCase()
            } else if (loginType === 'phone') {
                requestData.phone = formatPhoneNumber(formData.loginId)
            }

            const response = await login(requestData).unwrap()

            // Store token
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

            // Store user data
            if (response.user) {
                const userData = JSON.stringify(response.user)
                localStorage.setItem('userData', userData)
                sessionStorage.setItem('userData', userData)
            }

            localStorage.setItem('lastLoginType', loginType)

            // Reset failed attempts on success
            setFailedAttempts(0);

            // Redirect
            if (response) {
                const pendingBatch = localStorage.getItem('pendingBatch');
                if (pendingBatch) {
                    navigate('/batches');
                } else {
                    navigate('/');
                }
                toast.success('Logged in successfully!')
            }

        } catch (err) {
            console.error('Login error:', err?.data?.error)

            // Track failed attempts
            const newAttempts = failedAttempts + 1;
            setFailedAttempts(newAttempts);
            if (newAttempts >= 3) {
                setLockoutTimer(30);
                setFailedAttempts(0);
                setError('Too many failed attempts. Please wait 30 seconds.');
                return;
            }

            if (err?.data?.error) {
                setError(err.data.error)
            } else if (err.request) {
                setError('Network error. Please check your internet connection')
            } else {
                setError('An error occurred. Please try again')
            }
        }
    }

    // Handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isLoginLoading) {
            handleSubmit(e);
        }
    };

    const isDisabled = isLoginLoading || lockoutTimer > 0;

    return (
        <div className="thm-content-layer">
            <div className="thm-content-bg"></div>
            <div onClick={() => navigate(-1)} className='arrow_button'>
                <BiArrowBack />
            </div>

            <div className="container position-relative">
                <h1 className="thm-big-title">Sign In</h1>

                <div className="position-relative" style={{ zIndex: '55555' }}>
                    <div className="row col-xl-7 g-4 g-md-2 col-lg-9 mx-auto justify-content-center"
                        onKeyDown={handleKeyDown}>

                        {/* Login ID */}
                        <div className="col-lg-12">
                            <input type="text" name="loginId"
                                className={`form-control thm-input ${fieldErrors.loginId ? 'is-invalid' : ''}`}
                                placeholder="Enter Your Email or Phone Number"
                                value={formData.loginId} onChange={handleInputChange}
                                onBlur={() => validateField('loginId', formData.loginId)}
                                disabled={isDisabled} autoComplete="username" maxLength={30}
                            />
                            {fieldErrors.loginId && <div className="field-error">{fieldErrors.loginId}</div>}
                        </div>

                        {/* Password */}
                        <div className="col-lg-12 password-wrapper mt-3">
                            <input type={showPassword ? "text" : "password"} name="password"
                                className={`form-control thm-input ${fieldErrors.password ? 'is-invalid' : ''}`}
                                placeholder="Password" value={formData.password}
                                onChange={handleInputChange}
                                onBlur={() => validateField('password', formData.password)}
                                disabled={isDisabled} autoComplete="current-password"
                            />
                            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                            {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
                        </div>

                        {/* Remember me + Forgot password */}
                        <div className="col-6 mt-4">
                            <label className="thm-checkbox">
                                <input type="checkbox" name="rememberMe" checked={formData.rememberMe}
                                    onChange={handleInputChange} disabled={isDisabled} />
                                <span className="thm-checkmark"></span>
                                Remember me
                            </label>
                        </div>

                        <div style={{ zIndex: '999999' }} onClick={() => !isDisabled && navigate('/AccountRecovery')}
                            className="col-6 mt-4 text-end">
                            <div className="thm-account-link"
                                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.6 : 1 }}>
                                Forgot Password?
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="col-lg-12">
                                <p className="field-error text-center" style={{ fontSize: '16px' }}>{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="col-12 d-flex justify-content-center mt-5">
                            <CustomButton
                                text={lockoutTimer > 0 ? `WAIT ${lockoutTimer}s` : isLoginLoading ? "SIGNING IN..." : "SIGN IN"}
                                onClick={handleSubmit}
                                disabled={isDisabled}
                                loading={isLoginLoading}
                            />
                        </div>

                        {/* Signup link */}
                        <div className="col-12 text-center mt-5">
                            <div onClick={() => !isDisabled && navigate('/SignUp')} className="thm-account-link"
                                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.6 : 1 }}>
                                Create a new account.
                            </div>
                        </div>
                    </div>
                </div>

                <span style={{ zIndex: '567' }} className="thm-glow"></span>
            </div>
        </div>
    )
}

export default SignIn