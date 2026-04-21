// SuccessPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiCheckCircle, BiHome, BiDownload, BiReceipt, BiTime } from "react-icons/bi";
import { FaRegClock } from "react-icons/fa";
import styles from "../style/SuccessPage.module.css";
import confetti from 'canvas-confetti';
import toast from "react-hot-toast";

const SuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [countdown, setCountdown] = useState(150); // 2.5 minutes (150 seconds)
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Get payment details from location state or localStorage
    const paymentDetails = location.state || JSON.parse(localStorage.getItem('lastPaymentDetails') || '{}');

    useEffect(() => {

        setTimeout(() => {
            navigate('/')
        }, 3000)

    }, [])




    useEffect(() => {
        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d2a100', '#ffd700', '#ffed4a']
        });

        // Store payment details if not already stored
        if (paymentDetails.orderId) {
            localStorage.setItem('lastPaymentDetails', JSON.stringify(paymentDetails));
        }

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleRedirect();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleRedirect = () => {
        if (isRedirecting) return;
        setIsRedirecting(true);
        navigate('/');
        // Clear stored payment details after redirect
        setTimeout(() => {
            localStorage.removeItem('lastPaymentDetails');
        }, 1000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleDownloadInvoice = () => {
        // Implement invoice download logic
        toast.success("Invoice downloading...");
    };

    const handleViewOrder = () => {
        navigate('/profile?tab=orders');
    };

    return (
        <div className={styles.successPage}>
            <div className={styles.successContainer}>
                {/* Animated Checkmark */}
                <div className={styles.checkmarkWrapper}>
                    <div className={styles.checkmarkCircle}>
                        <BiCheckCircle className={styles.checkmarkIcon} />
                    </div>
                </div>

                {/* Success Message */}
                <h1 className={styles.successTitle}>Payment Successful!</h1>
                <p className={styles.successMessage}>
                    Thank you for your purchase. Your transaction has been completed successfully.
                </p>




                {/* Action Buttons */}


                {/* Countdown Timer */}

            </div>
        </div>
    );
};

export default SuccessPage;