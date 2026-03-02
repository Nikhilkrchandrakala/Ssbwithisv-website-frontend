import React, { useState } from 'react'
import CustomButton from '../components/CustomButton'
import Background from '../components/Background'
import axios from "axios";
import toast from 'react-hot-toast';

function Form() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [touched, setTouched] = useState({});

    // Validation rules
    const validate = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
            newErrors.name = 'Name can only contain letters and spaces';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation (supports various formats)
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        } else if (formData.phone.replace(/[\s\-\(\)]/g, '').length < 10) {
            newErrors.phone = 'Phone number must be at least 10 digits';
        }

        // Subject validation
        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        } else if (formData.subject.length < 3) {
            newErrors.subject = 'Subject must be at least 3 characters';
        }

        // Message validation
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        } else if (formData.message.length > 1000) {
            newErrors.message = 'Message must be less than 1000 characters';
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

        // Format phone number as user types
        let formattedValue = value;
        if (name === 'phone') {
            // Remove all non-numeric characters except plus sign
            const numericValue = value.replace(/[^\d+]/g, '');

            // Format phone number (simple format: XXX-XXX-XXXX)
            if (numericValue.length <= 3) {
                formattedValue = numericValue;
            } else if (numericValue.length <= 6) {
                formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
            } else if (numericValue.length <= 10) {
                formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
            } else {
                formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
            }
        }

        setFormData({
            ...formData,
            [name]: formattedValue
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
            name: true,
            email: true,
            phone: true,
            subject: true,
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
            const response = await axios.post(
                "https://api.ssbwithisv.in/api/send-email",
                {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone,
                    subject: formData.subject.trim(),
                    message: formData.message.trim(),
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            console.log(response.data);

            // ✅ Run Google conversion script here
            // if (window.gtag) {
            //     window.gtag('event', 'conversion', {
            //         send_to: 'AW-16493985261/xmkVCNug_5sZEO37-Lg9'
            //     });
            // }

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'form_submit',
                'formName': 'Contact Form'
            });

            toast.success("Thank you for your enquiry. We will reach out to you soon");

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            // Reset errors and touched states
            setErrors({});
            setTouched({});

            setLoading(true);

        } catch (error) {
            console.error(error);
            if (error.response) {
                // Server responded with error status
                toast.error(`Error: ${error.response.data.message || 'Failed to send email'}`);
            } else if (error.request) {
                // Request was made but no response
                toast.error('Network error. Please check your connection.');
            } else {
                // Something else happened
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

                        {/* Name Field */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('name')}
                                    value={formData.name}
                                    className={hasError('name') ? 'error' : ''}
                                    required
                                />
                                {hasError('name') && (
                                    <div className="error-message">{errors.name}</div>
                                )}
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
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

                        {/* Phone Field */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter 10 digit mobile number"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
                                        if (value.length <= 10) {
                                            setFormData({ ...formData, phone: value });
                                        }
                                    }}
                                    onBlur={() => handleBlur("phone")}
                                    className={hasError("phone") ? "error" : ""}
                                    inputMode="numeric"      // numeric keyboard
                                    pattern="[0-9]{10}"      // exactly 10 digits
                                    maxLength={10}
                                    required
                                />

                                {hasError('phone') && (
                                    <div className="error-message">{errors.phone}</div>
                                )}
                            </div>
                        </div>

                        {/* Subject Field */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Subject"
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('subject')}
                                    value={formData.subject}
                                    className={hasError('subject') ? 'error' : ''}
                                    required
                                />
                                {hasError('subject') && (
                                    <div className="error-message">{errors.subject}</div>
                                )}
                            </div>
                        </div>

                        {/* Message Field */}
                        <div className="col-12">
                            <div className="form-group">
                                <textarea
                                    name="message"
                                    placeholder="Write Your Message (minimum 10 characters)"
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
                                {/* <div className="character-count">
                                    {formData.message.length}/1000 characters
                                </div> */}
                            </div>
                        </div>

                        <div className="col-12 text-center d-flex justify-content-center mb-4">
                            <CustomButton
                                text={loading ? "SUBMIT" : "SENDING..."}
                                type="submit"
                                disabled={!loading || Object.keys(errors).length > 0}
                            />
                        </div>

                        {/* {Object.keys(errors).length > 0 && (
                            <div className="col-12">
                                <div className="form-errors-summary">
                                    <p>Please fix the following errors:</p>
                                    <ul>
                                        {Object.entries(errors).map(([field, error]) => (
                                            <li key={field}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )} */}

                    </div>
                </form>
            </div>
        </section>
    );
}

export default Form;