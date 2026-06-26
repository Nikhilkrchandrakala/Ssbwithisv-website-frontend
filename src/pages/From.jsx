import React, { useState, useEffect } from 'react';
import CustomButton from '../components/CustomButton';
import Background from '../components/Background';
import toast from 'react-hot-toast';
import { RxCross1 } from "react-icons/rx";

const BOARD_OPTIONS = [
    "1 AFSB",
    "2 AFSB",
    "3 AFSB",
    "4 AFSB",
    "5 AFSB",
    "33 SSB Bhopal (Navy)",
    "NSB Vizag (Navy)",
    "12 SSB Bangalore (Navy)",
    "SSB (Kolkata) (Navy)",
    "31 | 32 SSB Selection Center North (Kapurthala)",
    "11 | 14 | 18 | 19 | 34 SSB Selection Center East Prayagraj",
    "20 | 21 | 22 SSB Bhopal",
    "17 | 24 SSB Bangalore",
    "Not allotted yet",
    "Not known right now",
    "CGSB (NOIDA)",
    "NOT IN THIS LIST"
];

const ENTRY_OPTIONS = [
    "10+2 B. Tech. entry (Navy)",
    "10+2 TES",
    "AFCAT",
    "Army Service entry (PCSL, SCO, ACC, AMC)",
    "CDS",
    "Navy Service entry (CW, SD List)",
    "NCC special entry",
    "NDA",
    "SSC (JAG)",
    "SSC (Tech) Army",
    "SSC Navy (Executive, Law, Pilot, Naval Air Operations, Engineering, Electrical, Logistics, Naval Armament, Education)",
    "Territorial Army",
    "TGC"
];

const parseSplashMessage = (msg) => {
    if (!msg) return { text: '', url: '' };
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = msg.match(urlRegex);
    if (urls && urls.length > 0) {
        const url = urls[0];
        let text = msg.replace(urlRegex, '').trim();
        text = text.replace(/-\s*$/, '').trim();
        return { text, url };
    }
    return { text: msg, url: '' };
};

function Form({ isModal = false }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dob: '',
        aspirant: '-None-',
        vtx: '-None-',
        youtube: '-None-',
        podcast: '-None-',
        experience: '-None-',
        nextSsb: '',
        boards: [],
        ssbEntries: [],
        serving: '-None-',
        city: '',
        state: ''
    });

    const [errors, setErrors] = useState({});
    const [showSplash, setShowSplash] = useState(false);
    const [splashMessage, setSplashMessage] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    // Load Zoho WebForm Analytics script dynamically
    useEffect(() => {
        const formEl = document.getElementById('webform736128000000759294');
        if (formEl) {
            formEl.onsubmit = (e) => {
                // Dummy handler to prevent Zoho script "formObj.wf_sub is not a function" error
                if (e && typeof e.preventDefault === 'function') {
                    e.preventDefault();
                }
            };
        }

        const scriptId = 'wf_anal';
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://crm.zohopublic.in/crm/WebFormAnalyticsServeServlet?rid=6761ef2a5403a9215ee06fd3a91e7f4cf40211c957590bc232cce76d2bcf503ed03cafa8ef35c8aba7edd3bc471b3b45gid552c7037f982366c143556da5744cd14ede9148a77c9eb5c8f8d305912b98787gid388c38d650af4eac878806c83366c1ff12ab610d05c1d1d36b0a42e653d60173gid3a18cd896ad2e659c511803c5af0c5cba63e0e4a5cb6b69806f73a3685480d1e&tw=4a4293a302f61020f9576453bd894ee22143df02420ed7d73f43d1e0fdefaf49';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            const scriptToRemove = document.getElementById(scriptId);
            if (scriptToRemove) {
                scriptToRemove.remove();
            }
        };
    }, []);

    // Format YYYY-MM-DD from native date picker to Zoho's MMM D, YYYY format
    const formatDateToZoho = (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = months[monthIndex];
        return `${m} ${day}, ${year}`;
    };

    const validate = () => {
        const newErrors = {};

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last Name is required';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        // Phone validation (Mandatory in Zoho CRM code, allowing standard 10-15 digit formats)
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else {
            const phoneDigits = formData.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10 || phoneDigits.length > 15) {
                newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
            }
        }

        // SSB Aspirant validation (Mandatory, cannot be -None-)
        if (!formData.aspirant || formData.aspirant === '-None-') {
            newErrors.aspirant = 'Are you an SSB Aspirant selection is required';
        }

        // Serving Candidate validation (Mandatory, cannot be -None-)
        if (!formData.serving || formData.serving === '-None-') {
            newErrors.serving = 'Are you a serving candidate selection is required';
        }

        return newErrors;
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            // Last Name validation
            if (!formData.lastName.trim()) {
                newErrors.lastName = 'Last Name is required';
            }

            // Email validation
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email.trim())) {
                    newErrors.email = 'Please enter a valid email address';
                }
            }

            // Phone validation
            if (!formData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
            } else {
                const phoneDigits = formData.phone.replace(/\D/g, '');
                if (phoneDigits.length < 10 || phoneDigits.length > 15) {
                    newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
                }
            }
        }

        if (step === 2) {
            // Serving Candidate validation
            if (!formData.serving || formData.serving === '-None-') {
                newErrors.serving = 'Are you a serving candidate selection is required';
            }

            // SSB Aspirant validation
            if (!formData.aspirant || formData.aspirant === '-None-') {
                newErrors.aspirant = 'Are you an SSB Aspirant selection is required';
            }
        }

        return newErrors;
    };

    const handleNext = () => {
        const stepErrors = validateStep(currentStep);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            toast.error('Please fill in the required fields correctly before proceeding');
            return;
        }
        setCurrentStep(prev => prev + 1);

        const formEl = document.getElementById('webform736128000000759294');
        if (formEl) {
            formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);

        const formEl = document.getElementById('webform736128000000759294');
        if (formEl) {
            formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleBlur = (field) => {
        const validationErrors = validate();
        if (validationErrors[field]) {
            setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
        } else {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const handleCheckboxChange = (field, option, isChecked) => {
        setFormData(prev => {
            const list = prev[field] || [];
            if (isChecked) {
                return { ...prev, [field]: [...list, option] };
            } else {
                return { ...prev, [field]: list.filter(item => item !== option) };
            }
        });
    };

    const handleSubmit = (e) => {
        // Prevent default React submission handling
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fill in the required fields correctly');
            return;
        }

        // Trigger Zoho Analytics submission tracking to populate hidden tracking inputs
        try {
            if (window._wfa_track && window._wfa_track.wfa_submit) {
                window._wfa_track.wfa_submit(e);
            }
        } catch (error) {
            console.error('Zoho Analytics tracking error:', error);
        }

        // Set Zoho SalesIQ visitor information if widget is available
        let ldtUvidValue = '';
        try {
            if (window.$zoho && window.$zoho.salesiq) {
                const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
                window.$zoho.salesiq.visitor.name(fullName);
                window.$zoho.salesiq.visitor.email(formData.email.trim());
                ldtUvidValue = window.$zoho.salesiq.visitor.uniqueid() || '';
                
                // Directly set value of the input so it gets serialized in FormData
                const ldtUvidInput = document.getElementById('LDTuvid');
                if (ldtUvidInput) {
                    ldtUvidInput.value = ldtUvidValue;
                }
            }
        } catch (error) {
            console.error('Zoho SalesIQ tracking error:', error);
        }

        // Construct FormData from the form element (includes all form fields and Zoho tracking fields)
        const formElement = (e && e.target) || document.getElementById('webform736128000000759294');
        const bodyFormData = new FormData(formElement);

        // Handle service query parameter if present
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('service') && urlParams.get('service') === 'smarturl') {
            bodyFormData.set('service', 'smarturl');
        }

        // Convert FormData to URLSearchParams (application/x-www-form-urlencoded) expected by Zoho Web-to-Lead
        const urlEncodedData = new URLSearchParams(bodyFormData);

        // Disable submit button/loading state via UI indicator
        const submitBtn = document.querySelector('.crmWebToEntityForm .formsubmit');
        if (submitBtn) {
            submitBtn.setAttribute('disabled', 'true');
        }

        toast.promise(
            fetch('https://crm.zoho.in/crm/WebToLeadForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: urlEncodedData.toString(),
                cache: 'no-cache'
            })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Form submission failed');
                }
                const contentType = response.headers.get('Content-Type');
                return contentType && contentType.includes('application/json') 
                    ? response.json() 
                    : response.text();
            })
            .then((data) => {
                // If the response is HTML page (not JSON), or if actionsubmit check passes
                let successMsg = 'Thank you! Your submission has been received.';
                
                if (typeof data === 'object') {
                    if (data.actionsubmit === 'Splash Message') {
                        if (data.invalidCaptcha && data.invalidCaptcha === 'true') {
                            throw new Error(data.actionvalue || 'Invalid Captcha');
                        }
                        successMsg = data.actionvalue || successMsg;
                    }
                } else if (typeof data === 'string') {
                    // Try parsing JSON if Zoho returns it as string with text content-type
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.actionsubmit === 'Splash Message') {
                            successMsg = parsed.actionvalue || successMsg;
                        }
                    } catch (e) {
                        // Keep fallback message if it is plain text/HTML
                    }
                }

                // Show Splash Message
                setSplashMessage(successMsg);
                setShowSplash(true);
                
                // Clear the form fields
                handleReset();

                // Re-enable submit button
                if (submitBtn) {
                    submitBtn.removeAttribute('disabled');
                }

                // Auto-close success message after 5 seconds
                setTimeout(() => {
                    setShowSplash(false);
                }, 5000);
            })
            .catch((err) => {
                if (submitBtn) {
                    submitBtn.removeAttribute('disabled');
                }
                throw err;
            }),
            {
                loading: 'Submitting enquiry...',
                success: 'Submission completed!',
                error: (err) => `Submission error: ${err.message || 'please try again'}`
            }
        );
    };

    const handleReset = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dob: '',
            aspirant: '-None-',
            vtx: '-None-',
            youtube: '-None-',
            podcast: '-None-',
            experience: '-None-',
            nextSsb: '',
            boards: [],
            ssbEntries: [],
            serving: '-None-',
            city: '',
            state: ''
        });
        setErrors({});
        setCurrentStep(1);
    };

    const hasError = (field) => {
        return !!errors[field];
    };

    const { text: parsedText, url: parsedUrl } = parseSplashMessage(splashMessage);

    const formContent = (
        <>
            {showSplash && (
                <div className="wf_success_overlay" onClick={() => setShowSplash(false)}>
                    <div className="wf_success_modal" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="wf_success_close" onClick={() => setShowSplash(false)} aria-label="Close success message">
                            <RxCross1 />
                        </button>
                        <div className="wf_success_icon_container">
                            <div className="wf_success_circle">
                                <div className="wf_success_checkmark"></div>
                            </div>
                        </div>
                        <h3 className="wf_success_title">Enquiry Submitted</h3>
                        <p className="wf_success_text">{parsedText}</p>
                        {parsedUrl && (
                            <a
                                href={parsedUrl}
                                className="wf_success_btn"
                                target="_self"
                            >
                                View Upcoming Batches
                            </a>
                        )}
                    </div>
                </div>
            )}
            <form
                style={isModal ? { padding: '10px 0' } : {}}
                id="webform736128000000759294"
                name="WebToLeads736128000000759294"
                onSubmit={handleSubmit}
                acceptCharset="UTF-8"
                className="enquiry-form"
            >
                {/* Zoho Hidden Configurations */}
                <input type="hidden" name="xnQsjsdp" value="8c28bcc09b520842fc0aa0d49b454af041ef7e37e48cb4552cfe19010da7a14b" />
                <input type="hidden" name="zc_gad" id="zc_gad" value="" />
                <input type="hidden" name="xmIwtLD" value="5a86dfbd0d3b720ee3c25c96e259eba2ebfb3dc84195e873b6ede0e2677835eb006ea6ef495d4c78a5e009c7e7e824bd" />
                <input type="hidden" name="actionType" value="TGVhZHM=" />
                <input type="hidden" name="returnURL" value="null" />
                
                {/* Required Zoho Code Fields */}
                <input type="hidden" id="ldeskuid" name="ldeskuid" />
                <input type="hidden" id="LDTuvid" name="LDTuvid" />
                <input type="text" style={{ display: 'none' }} name="aG9uZXlwb3Q" value="" readOnly />

                    {/* Progressive Step Indicator */}
                    <div className="form-steps-indicator">
                        <div className={`step-indicator-item ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                            <span className="step-indicator-number">{currentStep > 1 ? '✓' : '1'}</span>
                            <span className="step-indicator-label">Personal Details</span>
                        </div>
                        <div className={`step-indicator-line ${currentStep > 1 ? 'active' : ''}`}></div>
                        <div className={`step-indicator-item ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                            <span className="step-indicator-number">{currentStep > 2 ? '✓' : '2'}</span>
                            <span className="step-indicator-label">SSB Details</span>
                        </div>
                        <div className={`step-indicator-line ${currentStep > 2 ? 'active' : ''}`}></div>
                        <div className={`step-indicator-item ${currentStep === 3 ? 'active' : ''}`}>
                            <span className="step-indicator-number">3</span>
                            <span className="step-indicator-label">Familiarity</span>
                        </div>
                    </div>

                    {/* Form Fields Grid */}
                    <div className="row g-4">
                        <div className="col-12">
                            <h4 style={{ color: '#E0C214', marginBottom: '10px', fontSize: '1.25rem', fontFamily: '"Inter", sans-serif' }}>
                                We would be happy to help you
                            </h4>
                        </div>

                        {/* Section 1: Personal Details */}
                        <div className="col-12 form-step-content" style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                                <div className="form-section">
                                    <div className="form-section-header">
                                        <span className="section-number">01</span> Personal Details
                                    </div>
                                    <div className="row g-4">
                                        {/* First Name */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="First_Name">First Name</label>
                                                <input
                                                    type="text"
                                                    id="First_Name"
                                                    name="First Name"
                                                    placeholder="Enter your first name"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                                    maxLength="40"
                                                />
                                            </div>
                                        </div>

                                        {/* Last Name (Required) */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="Last_Name">
                                                    Last Name <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="Last_Name"
                                                    name="Last Name"
                                                    placeholder="Enter your last name"
                                                    value={formData.lastName}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormData(prev => ({ ...prev, lastName: e.target.value }));
                                                    }}
                                                    onBlur={() => handleBlur('lastName')}
                                                    className={hasError('lastName') ? 'error' : ''}
                                                    maxLength="80"
                                                    required
                                                />
                                                {hasError('lastName') && (
                                                    <div className="error-message" style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '5px' }}>
                                                        {errors.lastName}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Email Address (Required) */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="Email">
                                                    Email Address <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="Email"
                                                    name="Email"
                                                    placeholder="Enter your email address"
                                                    value={formData.email}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormData(prev => ({ ...prev, email: e.target.value }));
                                                    }}
                                                    onBlur={() => handleBlur('email')}
                                                    className={hasError('email') ? 'error' : ''}
                                                    maxLength="100"
                                                    required
                                                />
                                                {hasError('email') && (
                                                    <div className="error-message" style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '5px' }}>
                                                        {errors.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Phone (Required) */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="Phone">
                                                    Phone <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="Phone"
                                                    name="Phone"
                                                    placeholder="Enter your phone number"
                                                    value={formData.phone}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({ ...prev, phone: e.target.value }));
                                                        if (errors.phone) {
                                                            setErrors(prev => {
                                                                const updated = { ...prev };
                                                                delete updated.phone;
                                                                return updated;
                                                            });
                                                        }
                                                    }}
                                                    onBlur={() => handleBlur('phone')}
                                                    className={hasError('phone') ? 'error' : ''}
                                                    maxLength="30"
                                                    required
                                                />
                                                {hasError('phone') && (
                                                    <div className="error-message" style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '5px' }}>
                                                        {errors.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Date of Birth */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="dob_picker">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    id="dob_picker"
                                                    value={formData.dob}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                                                />
                                                <input type="hidden" id="LEADCF53" name="LEADCF53" value={formatDateToZoho(formData.dob)} />
                                            </div>
                                        </div>

                                        {/* City */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="City">City</label>
                                                <input
                                                    type="text"
                                                    id="City"
                                                    name="City"
                                                    placeholder="Enter your city"
                                                    value={formData.city}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                                                    maxLength="100"
                                                />
                                            </div>
                                        </div>

                                        {/* State */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="State">State</label>
                                                <input
                                                    type="text"
                                                    id="State"
                                                    name="State"
                                                    placeholder="Enter your state"
                                                    value={formData.state}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                                                    maxLength="100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        {/* Section 2: Your SSB details */}
                        <div className="col-12 form-step-content" style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                                <div className="form-section">
                                    <div className="form-section-header">
                                        <span className="section-number">02</span> Your SSB details
                                    </div>
                                    <div className="row g-4">
                                        {/* Serving Candidate (Required) */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="LEADCF1">
                                                    Are you a serving candidate? <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <select
                                                    id="LEADCF1"
                                                    name="LEADCF1"
                                                    value={formData.serving}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormData(prev => ({ ...prev, serving: e.target.value }));
                                                    }}
                                                    onBlur={() => handleBlur('serving')}
                                                    className={hasError('serving') ? 'error' : ''}
                                                    required
                                                >
                                                    <option value="-None-">-None-</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                                {hasError('serving') && (
                                                    <div className="error-message" style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '5px' }}>
                                                        {errors.serving}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* SSB Aspirant (Required) */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="LEADCF25">
                                                    Are you an SSB Aspirant? <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <select
                                                    id="LEADCF25"
                                                    name="LEADCF25"
                                                    value={formData.aspirant}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        setFormData(prev => ({ ...prev, aspirant: e.target.value }));
                                                    }}
                                                    onBlur={() => handleBlur('aspirant')}
                                                    className={hasError('aspirant') ? 'error' : ''}
                                                    required
                                                >
                                                    <option value="-None-">-None-</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                                {hasError('aspirant') && (
                                                    <div className="error-message" style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '5px' }}>
                                                        {errors.aspirant}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* SSB Experience */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="LEADCF9">What is your SSB Experience?</label>
                                                <select
                                                    id="LEADCF9"
                                                    name="LEADCF9"
                                                    value={formData.experience}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                                                >
                                                    <option value="-None-">-None-</option>
                                                    <option value="Fresher">Fresher</option>
                                                    <option value="Screen Out">Screen Out</option>
                                                    <option value="Conference Out">Conference Out</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* When is your next SSB */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="next_ssb_picker">When is your next SSB?</label>
                                                <input
                                                    type="date"
                                                    id="next_ssb_picker"
                                                    value={formData.nextSsb}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, nextSsb: e.target.value }))}
                                                />
                                                <input type="hidden" id="LEADCF51" name="LEADCF51" value={formatDateToZoho(formData.nextSsb)} />
                                            </div>
                                        </div>

                                        {/* Selection Center / Boards (Checkboxes Container) */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom">
                                                    In which board(s)/ center(s) is your next SSB/AFSB?
                                                    <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                                                        (Select all that apply)
                                                    </span>
                                                </label>
                                                <div style={{
                                                    maxHeight: '180px',
                                                    overflowY: 'auto',
                                                    border: '2px solid rgba(255, 255, 255, 0.35)',
                                                    padding: '12px 16px',
                                                    background: '#0b0b0b',
                                                    borderRadius: '4px',
                                                    marginTop: '8px'
                                                }} className="custom-scrollbar">
                                                    {BOARD_OPTIONS.map(opt => (
                                                        <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                            <input
                                                                type="checkbox"
                                                                name="LEADCF17"
                                                                value={opt}
                                                                checked={formData.boards.includes(opt)}
                                                                onChange={(e) => handleCheckboxChange('boards', opt, e.target.checked)}
                                                                style={{ width: 'auto', height: 'auto', display: 'inline-block', cursor: 'pointer', margin: 0 }}
                                                            />
                                                            <label style={{ margin: 0, fontSize: '14px', color: '#fff', cursor: 'pointer' }}>{opt}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* SSB Entry (Checkboxes Container) */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom">
                                                    Which entry of SSB are you going for?
                                                    <span style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                                                        (Select all that apply)
                                                    </span>
                                                </label>
                                                <div style={{
                                                    maxHeight: '180px',
                                                    overflowY: 'auto',
                                                    border: '2px solid rgba(255, 255, 255, 0.35)',
                                                    padding: '12px 16px',
                                                    background: '#0b0b0b',
                                                    borderRadius: '4px',
                                                    marginTop: '8px'
                                                }} className="custom-scrollbar">
                                                    {ENTRY_OPTIONS.map(opt => (
                                                        <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                            <input
                                                                type="checkbox"
                                                                name="LEADCF15"
                                                                value={opt}
                                                                checked={formData.ssbEntries.includes(opt)}
                                                                onChange={(e) => handleCheckboxChange('ssbEntries', opt, e.target.checked)}
                                                                style={{ width: 'auto', height: 'auto', display: 'inline-block', cursor: 'pointer', margin: 0 }}
                                                            />
                                                            <label style={{ margin: 0, fontSize: '14px', color: '#fff', cursor: 'pointer' }}>{opt}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        {/* Section 3: Are you famaliar with us? */}
                        <div className="col-12 form-step-content" style={{ display: currentStep === 3 ? 'block' : 'none' }}>
                                <div className="form-section">
                                    <div className="form-section-header">
                                        <span className="section-number">03</span> Are you famaliar with us?
                                    </div>
                                    <div className="row g-4">
                                        {/* Heard about VTX */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="LEADCF5">
                                                    Have you heard about VTX™?
                                                </label>
                                                <select
                                                    id="LEADCF5"
                                                    name="LEADCF5"
                                                    value={formData.vtx}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, vtx: e.target.value }))}
                                                >
                                                    <option value="-None-">-None-</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                                <a
                                                    href="https://www.ssbwithisv.in/ssbVirtualTrainingXperience"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="form-help-link"
                                                >
                                                    India's 1st virtual GTO ground
                                                </a>
                                            </div>
                                        </div>

                                        {/* YouTube Channel */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="LEADCF8">Have you subscribed to our YouTube Channel?</label>
                                                <select
                                                    id="LEADCF8"
                                                    name="LEADCF8"
                                                    value={formData.youtube}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, youtube: e.target.value }))}
                                                >
                                                    <option value="-None-">-None-</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                                <a
                                                    href="https://www.youtube.com/@ssbwithisv"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="form-help-link"
                                                >
                                                    SSB with ISV YouTube Channel
                                                </a>
                                            </div>
                                        </div>

                                        {/* Podcast */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label-custom" htmlFor="LEADCF7">Have you subscribed to our Podcast (RTWNKC)?</label>
                                                <select
                                                    id="LEADCF7"
                                                    name="LEADCF7"
                                                    value={formData.podcast}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, podcast: e.target.value }))}
                                                >
                                                    <option value="-None-">-None-</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                                <a
                                                    href="https://www.youtube.com/@rogerthatwithnkc"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="form-help-link"
                                                >
                                                    Roger That with NKC
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        {/* Form Buttons */}
                        <div className="col-12 text-center d-flex justify-content-center gap-3 mb-4 mt-4">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="enquiry-submit-btn"
                                    style={{ marginTop: '0px', padding: '10px 25px', borderRadius: '0px' }}
                                >
                                    BACK
                                </button>
                            )}

                            {currentStep < 3 && (
                                <CustomButton
                                    text="NEXT"
                                    onClick={handleNext}
                                />
                            )}

                            {currentStep === 3 && (
                                <>
                                    <CustomButton
                                        text="SUBMIT"
                                        type="submit"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="enquiry-submit-btn"
                                        style={{ marginTop: '0px', padding: '10px 25px', borderRadius: '0px' }}
                                    >
                                        RESET
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
        </>
    );

    if (isModal) {
        return formContent;
    }

    return (
        <section className="enquiry-form-section sectionspace80">
            <Background />
            <div className="container">
                <div className="sct-title">
                    <h2>Enquire with us</h2>
                </div>
                {formContent}
            </div>
        </section>
    );
}

export default Form;