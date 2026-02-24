import React, { useEffect, useRef } from 'react';
import { BiX, BiSend, BiCheck } from 'react-icons/bi';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import styles from '../style/ProfileDashboard.module.css';


const OtpVerificationPopup = ({
    isOpen,
    onClose,
    field,
    newValue,
    onSendOtp,
    onVerify,
    otp,
    setOtp,
    isVerifying,
    otpSent
}) => {
    const popupRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            // Auto-focus OTP input when sent
            if (otpSent && inputRef.current) {
                inputRef.current.focus();
            }
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, otpSent, onClose]);

    if (!isOpen) return null;

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!otpSent) {
            onSendOtp();
        } else {
            onVerify();
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup} ref={popupRef}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <BiX />
                </button>

                <div className={styles.header}>
                    <div className={styles.icon}>
                        {field === 'phone' ? <FaPhone /> : <FaEnvelope />}
                    </div>
                    <h3>Verify {field === 'phone' ? 'Phone Number' : 'Email Address'}</h3>
                </div>

                <div className={styles.content}>
                    <p className={styles.message}>
                        {!otpSent ? (
                            `We'll send a verification code to your new ${field === 'phone' ? 'phone number' : 'email address'}`
                        ) : (
                            `Enter the 6-digit code sent to ${newValue}`
                        )}
                    </p>

                    <div className={styles.valueDisplay}>
                        <span className={styles.label}>New {field === 'phone' ? 'Number' : 'Email'}:</span>
                        <span className={styles.value}>{newValue}</span>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {otpSent && (
                            <div className={styles.otpInputGroup}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className={styles.otpInput}
                                    value={otp}
                                    onChange={handleOtpChange}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    disabled={isVerifying}
                                />
                                <button
                                    type="button"
                                    className={styles.resendBtn}
                                    onClick={onSendOtp}
                                    disabled={isVerifying}
                                >
                                    Resend
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isVerifying || (otpSent && otp.length !== 6)}
                        >
                            {isVerifying ? (
                                'Please wait...'
                            ) : !otpSent ? (
                                <>
                                    <BiSend /> Send OTP
                                </>
                            ) : (
                                <>
                                    <BiCheck /> Verify & Update
                                </>
                            )}
                        </button>
                    </form>

                    {!otpSent && (
                        <p className={styles.note}>
                            Note: You'll need to verify this change with a one-time password
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpVerificationPopup;