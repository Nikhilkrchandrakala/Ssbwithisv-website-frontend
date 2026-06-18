import React, { useState } from 'react'
import CustomButton from '../components/CustomButton'
import Background from '../components/Background'
import axios from "axios";
import toast from 'react-hot-toast';

function Form() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        ssbExperience: '',
        nextSsb: '',
        ssbCenter: '',
        ssbPreparation: '',
        ssbEntry: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [touched, setTouched] = useState({});

    // Validation rules
    const validate = () => {
        const newErrors = {};

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]*$/.test(formData.firstName)) {
            newErrors.firstName = 'First name can only contain letters and spaces';
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]*$/.test(formData.lastName)) {
            newErrors.lastName = 'Last name can only contain letters and spaces';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        if (!formData.phone.trim()) {
            newErrors.phone = 'Mobile number is required';
        } else if (formData.phone.length !== 10) {
            newErrors.phone = 'Mobile number must be exactly 10 digits';
        }

        // SSB Experience validation
        if (!formData.ssbExperience) {
            newErrors.ssbExperience = 'Please select your SSB experience';
        }

        // Next SSB validation
        if (!formData.nextSsb.trim()) {
            newErrors.nextSsb = 'Next SSB details are required';
        }

        // SSB Center validation
        if (!formData.ssbCenter.trim()) {
            newErrors.ssbCenter = 'Board / Selection Center is required';
        }

        // SSB Preparation validation
        if (!formData.ssbPreparation.trim()) {
            newErrors.ssbPreparation = 'Preparation details are required';
        }

        // SSB Entry validation
        if (!formData.ssbEntry.trim()) {
            newErrors.ssbEntry = 'SSB Entry is required';
        }

        // Message validation
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        return newErrors;
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });

        // Validate the specific field on blur
        const newErrors = validate();
        if (newErrors[field]) {
            setErrors({ ...errors, [field]: newErrors[field] });
        } else {
            const updatedErrors = { ...errors };
            delete updatedErrors[field];
            setErrors(updatedErrors);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error for this field if user starts typing
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    const validateForm = () => {
        const validationErrors = validate();
        setErrors(validationErrors);

        // Mark all fields as touched
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            ssbExperience: true,
            nextSsb: true,
            ssbCenter: true,
            ssbPreparation: true,
            ssbEntry: true,
            message: true
        });

        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(false);

        try {
            const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
                ? "http://localhost:5001"
                : "https://api.ssbwithisv.in";
            const response = await axios.post(
                `${baseUrl}/api/send-email`,
                {
                    name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
                    email: formData.email.trim(),
                    phone: formData.phone,
                    subject: "New Website Enquiry",
                    message: `Enquiry Form Details:
- First Name: ${formData.firstName.trim()}
- Last Name: ${formData.lastName.trim()}
- Mobile Number: ${formData.phone}
- Email Address: ${formData.email.trim()}
- SSB Experience: ${formData.ssbExperience}
- Next SSB Date: ${formData.nextSsb.trim()}
- Board / Selection Center: ${formData.ssbCenter.trim()}
- How preparing: ${formData.ssbPreparation.trim()}
- Which entry: ${formData.ssbEntry.trim()}
- Message: ${formData.message.trim()}`,
                    replyTo: formData.email.trim(),
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'form_submit',
                'formName': 'Contact Form'
            });

            toast.success("Thank you for your enquiry. We will reach out to you soon");

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                ssbExperience: '',
                nextSsb: '',
                ssbCenter: '',
                ssbPreparation: '',
                ssbEntry: '',
                message: ''
            });

            // Reset errors and touched states
            setErrors({});
            setTouched({});

            setLoading(true);

        } catch (error) {
            console.error(error);
            if (error.response) {
                toast.error(`Error: ${error.response.data.message || 'Failed to send email'}`);
            } else if (error.request) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error('Failed to send email');
            }
        } finally {
            setLoading(true);
        }
    };

    // Helper function to check if field has error
    const hasError = (field) => {
        return touched[field] && errors[field];
    };

    return (
        <section className="enquiry-form-section sectionspace80">
            <Background />
            <div className="container">
                <div className="sct-title">
                    <h2>Enquire with us</h2>
                </div>

                <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
                    <div className="row g-4">

                        {/* First Name Field */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('firstName')}
                                    value={formData.firstName}
                                    className={hasError('firstName') ? 'error' : ''}
                                    required
                                />
                                {hasError('firstName') && (
                                    <div className="error-message">{errors.firstName}</div>
                                )}
                            </div>
                        </div>

                        {/* Last Name Field */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('lastName')}
                                    value={formData.lastName}
                                    className={hasError('lastName') ? 'error' : ''}
                                    required
                                />
                                {hasError('lastName') && (
                                    <div className="error-message">{errors.lastName}</div>
                                )}
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Mobile Number (10 digits)"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
                                        if (value.length <= 10) {
                                            setFormData({ ...formData, phone: value });
                                            if (errors.phone) {
                                                const newErrors = { ...errors };
                                                delete newErrors.phone;
                                                setErrors(newErrors);
                                            }
                                        }
                                    }}
                                    onBlur={() => handleBlur("phone")}
                                    className={hasError("phone") ? "error" : ""}
                                    inputMode="numeric"
                                    maxLength={10}
                                    required
                                />
                                {hasError('phone') && (
                                    <div className="error-message">{errors.phone}</div>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('email')}
                                    value={formData.email}
                                    className={hasError('email') ? 'error' : ''}
                                    required
                                />
                                {hasError('email') && (
                                    <div className="error-message">{errors.email}</div>
                                )}
                            </div>
                        </div>

                        {/* SSB Experience Radio Buttons */}
                        <div className="col-12">
                            <div className="form-group">
                                <label className="form-label-custom">What is your SSB experience?</label>
                                <div className="radio-group-custom">
                                    <label className={`radio-label-custom ${formData.ssbExperience === 'Fresher' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="ssbExperience"
                                            value="Fresher"
                                            checked={formData.ssbExperience === 'Fresher'}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('ssbExperience')}
                                        />
                                        Fresher
                                    </label>
                                    <label className={`radio-label-custom ${formData.ssbExperience === 'Screened Out' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="ssbExperience"
                                            value="Screened Out"
                                            checked={formData.ssbExperience === 'Screened Out'}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('ssbExperience')}
                                        />
                                        Screened Out
                                    </label>
                                    <label className={`radio-label-custom ${formData.ssbExperience === 'Conference Out' ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="ssbExperience"
                                            value="Conference Out"
                                            checked={formData.ssbExperience === 'Conference Out'}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('ssbExperience')}
                                        />
                                        Conference Out
                                    </label>
                                </div>
                                {hasError('ssbExperience') && (
                                    <div className="error-message">{errors.ssbExperience}</div>
                                )}
                            </div>
                        </div>

                        {/* Next SSB Field */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="nextSsb"
                                    placeholder="When is your next SSB? (Please mention month & date)"
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('nextSsb')}
                                    value={formData.nextSsb}
                                    className={hasError('nextSsb') ? 'error' : ''}
                                    required
                                />
                                {hasError('nextSsb') && (
                                    <div className="error-message">{errors.nextSsb}</div>
                                )}
                            </div>
                        </div>

                        {/* Board / Selection Center Field */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="ssbCenter"
                                    placeholder="In which board/selection center is your next SSB/AFSB?"
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('ssbCenter')}
                                    value={formData.ssbCenter}
                                    className={hasError('ssbCenter') ? 'error' : ''}
                                    required
                                />
                                {hasError('ssbCenter') && (
                                    <div className="error-message">{errors.ssbCenter}</div>
                                )}
                            </div>
                        </div>

                        {/* Which SSB Entry Field */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="ssbEntry"
                                    placeholder="Which entry of SSB are you going for?"
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('ssbEntry')}
                                    value={formData.ssbEntry}
                                    className={hasError('ssbEntry') ? 'error' : ''}
                                    required
                                />
                                {hasError('ssbEntry') && (
                                    <div className="error-message">{errors.ssbEntry}</div>
                                )}
                            </div>
                        </div>

                        {/* How are you preparing Field */}
                        <div className="col-12">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="ssbPreparation"
                                    placeholder="How are you preparing for SSB?"
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('ssbPreparation')}
                                    value={formData.ssbPreparation}
                                    className={hasError('ssbPreparation') ? 'error' : ''}
                                    required
                                />
                                {hasError('ssbPreparation') && (
                                    <div className="error-message">{errors.ssbPreparation}</div>
                                )}
                            </div>
                        </div>

                        {/* Message Field */}
                        <div className="col-12">
                            <div className="form-group">
                                <textarea
                                    name="message"
                                    placeholder="Write your message? (minimum 10 characters)"
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('message')}
                                    value={formData.message}
                                    className={hasError('message') ? 'error' : ''}
                                    rows="5"
                                    required
                                ></textarea>
                                {hasError('message') && (
                                    <div className="error-message">{errors.message}</div>
                                )}
                            </div>
                        </div>

                        <div className="col-12 text-center d-flex justify-content-center mb-4">
                            <CustomButton
                                text={loading ? "SUBMIT" : "SENDING..."}
                                type="submit"
                                disabled={!loading || Object.keys(errors).length > 0}
                            />
                        </div>

                    </div>
                </form>
            </div>
        </section>
    );
}

export default Form;