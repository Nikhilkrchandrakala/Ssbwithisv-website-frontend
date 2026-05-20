import React, { useState, useEffect } from "react";
import {
    FaSearch,
    FaTimes,
    FaClock,
    FaArrowRight,
    FaCheckCircle,
    FaUsers,
    FaBookOpen,
    FaInfinity,
    FaTicketAlt,
    FaTrash,
    FaPercent,
    FaCalendarAlt,
    FaRupeeSign,
    FaSun,
    FaMoon,
    FaFilter,
    FaChevronLeft,
    FaChevronRight,
    FaArrowLeft,
    FaStar
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation, useGetAllSlotesQuery, useUserProfileQuery, useVerifyPaymentMutation, useApplyCouponMutation } from "../redux/api";
import styles from "../style/BatchPage.module.css";

function BatchPage() {
    const { data: slotsData, isLoading, isError } = useGetAllSlotesQuery();
    const [createOrder] = useCreateOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();
    const [applyCoupon] = useApplyCouponMutation();
    const { data: user } = useUserProfileQuery();
    const navigate = useNavigate();

    // States
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBatchType, setSelectedBatchType] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Effect to handle pending bookings after login
    useEffect(() => {
        const pendingBatchData = localStorage.getItem('pendingBatch');
        if (pendingBatchData && user) {
            try {
                const batch = JSON.parse(pendingBatchData);
                const pendingCoupon = localStorage.getItem('pendingCoupon');

                // Clear pending data
                localStorage.removeItem('pendingBatch');
                localStorage.removeItem('pendingCoupon');

                // Set state to open modal
                setSelectedBatch(batch);
                if (pendingCoupon) {
                    setCouponCode(pendingCoupon);
                    // We'll need to trigger the coupon application or just set the code
                    // Since handleApplyCoupon is async and depends on selectedBatch,
                    // it might be better to let the user click apply or call it here
                }
                setIsModalOpen(true);
                document.body.style.overflow = "hidden";
            } catch (e) {
                console.error("Error parsing pending batch", e);
                localStorage.removeItem('pendingBatch');
            }
        }
    }, [user]); // Re-run when user data is loaded

    // Course modules pricing matrix
    const COURSE_MODULES = [
        { id: 'full_course', name: '10 days Services Selection Board Hackathon (Full Course)', price: 12499 },
        { id: 'ssb_ppdt', name: 'Introduction to SSB & PPDT', price: 1999 },
        { id: 'psych', name: 'Psych Theory Course', price: 3499 },
        { id: 'interview', name: 'Interview Theory Course', price: 2499 },
        { id: 'group_testing', name: 'Group Testing Course', price: 7999 }
    ];

    const [selectedModules, setSelectedModules] = useState([]);

    const getCalculatedPrice = () => {
        if (!selectedBatch) return 0;
        if (selectedModules.includes('full_course')) {
            return selectedBatch.price || 12499;
        }
        
        // If all 4 individual modules are selected, apply full course price
        const individualSelectedCount = selectedModules.filter(id => id !== 'full_course').length;
        if (individualSelectedCount === 4) {
            return selectedBatch.price || 12499;
        }
        
        let sum = 0;
        COURSE_MODULES.forEach(mod => {
            if (mod.id !== 'full_course' && selectedModules.includes(mod.id)) {
                sum += mod.price;
            }
        });
        return sum;
    };

    const handleModuleToggle = (moduleId) => {
        let updated;
        if (moduleId === 'full_course') {
            if (selectedModules.includes('full_course')) {
                updated = [];
            } else {
                updated = ['full_course'];
            }
        } else {
            if (selectedModules.includes('full_course')) return; // Safeguard if others are disabled
            
            if (selectedModules.includes(moduleId)) {
                updated = selectedModules.filter(id => id !== moduleId);
            } else {
                updated = [...selectedModules, moduleId];
            }
        }
        setSelectedModules(updated);
        
        // Auto-remove coupon if not all modules are selected (not representing the Full Course)
        const isFullCourseSelected = updated.includes('full_course') || updated.filter(id => id !== 'full_course').length === 4;
        if (!isFullCourseSelected) {
            resetCouponStateOnly();
        }
    };

    // Coupon states
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);
    const [couponError, setCouponError] = useState("");
    const [couponSuccess, setCouponSuccess] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const slots = slotsData || [];

    // Group slots by month
    const groupSlotsByMonth = (slots) => {
        const grouped = {};

        slots.forEach(slot => {
            if (!slot.startTime) return;
            const date = new Date(slot.startTime);
            const month = date.getMonth();
            const year = date.getFullYear();
            const monthKey = `${year}-${month}`;

            if (!grouped[monthKey]) {
                grouped[monthKey] = {
                    year,
                    month,
                    monthName: date.toLocaleString('default', { month: 'long' }),
                    slots: []
                };
            }

            grouped[monthKey].slots.push(slot);
        });

        Object.keys(grouped).forEach(key => {
            grouped[key].slots.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        });

        return grouped;
    };

    // Filter slots
    const filteredSlots = slots?.filter(slot => {
        const matchesSearch = slot.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBatchType = selectedBatchType === "all" || slot.title === selectedBatchType;
        const slotDate = new Date(slot.startTime);
        const matchesMonth = slotDate.getMonth() === selectedMonth && slotDate.getFullYear() === selectedYear;
        return matchesSearch && matchesBatchType && matchesMonth;
    });

    const groupedSlots = groupSlotsByMonth(filteredSlots);
    const currentMonthSlots = groupedSlots[`${selectedYear}-${selectedMonth}`] || { slots: [] };

    // Get unique months from all slots for navigation
    const availableMonths = [...new Set(slots.map(slot => {
        if (!slot.startTime) return null;
        const date = new Date(slot.startTime);
        return `${date.getFullYear()}-${date.getMonth()}`;
    }).filter(Boolean))].sort();

    const canGoPrev = availableMonths.length > 0 &&
        availableMonths.some(m => {
            const [year, month] = m.split('-');
            return parseInt(year) < selectedYear ||
                (parseInt(year) === selectedYear && parseInt(month) < selectedMonth);
        });

    const canGoNext = availableMonths.length > 0 &&
        availableMonths.some(m => {
            const [year, month] = m.split('-');
            return parseInt(year) > selectedYear ||
                (parseInt(year) === selectedYear && parseInt(month) > selectedMonth);
        });

    const goToPrevMonth = () => {
        const prevMonths = availableMonths.filter(m => {
            const [year, month] = m.split('-');
            return parseInt(year) < selectedYear ||
                (parseInt(year) === selectedYear && parseInt(month) < selectedMonth);
        });
        if (prevMonths.length > 0) {
            const lastPrev = prevMonths[prevMonths.length - 1];
            const [year, month] = lastPrev.split('-');
            setSelectedYear(parseInt(year));
            setSelectedMonth(parseInt(month));
        }
    };

    const goToNextMonth = () => {
        const nextMonths = availableMonths.filter(m => {
            const [year, month] = m.split('-');
            return parseInt(year) > selectedYear ||
                (parseInt(year) === selectedYear && parseInt(month) > selectedMonth);
        });
        if (nextMonths.length > 0) {
            const firstNext = nextMonths[0];
            const [year, month] = firstNext.split('-');
            setSelectedYear(parseInt(year));
            setSelectedMonth(parseInt(month));
        }
    };

    const formatDateTime = (isoString) => {

        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const isSlotFull = (slot) => {
        if (!slot.maxStudents) return false;
        const bookedCount = slot.bookedStudents?.length || 0;
        return bookedCount >= slot.maxStudents;
    };

    const getAvailableSpots = (slot) => {
        if (!slot.maxStudents) return "Unlimited";
        const bookedCount = slot.bookedStudents?.length || 0;
        const available = slot.maxStudents - bookedCount;
        return available > 0 ? available : 0;
    };

    // Check if booking is closed (cutoff is 11:59:59 PM the day before)
    const isBookingClosed = (startTime) => {
        if (!startTime) return true;

        const startDate = new Date(startTime);
        const cutoffDate = new Date(startDate);
        cutoffDate.setDate(cutoffDate.getDate() - 1);
        cutoffDate.setHours(23, 59, 59, 999);

        const now = new Date();
        return now > cutoffDate;
    };

    // Get booking message based on date type (only shows 1 day before)
    const getBookingMessage = (startTime) => {
        if (!startTime) return null;

        const startDate = new Date(startTime);
        const cutoffDate = new Date(startDate);
        cutoffDate.setDate(cutoffDate.getDate() - 1);
        cutoffDate.setHours(23, 59, 59, 999);

        const now = new Date();

        // If it's already closed, no message
        if (now > cutoffDate) return null;

        // Reset time to midnight for accurate date comparison
        const cutoffMidnight = new Date(cutoffDate);
        cutoffMidnight.setHours(0, 0, 0, 0);

        const todayMidnight = new Date(now);
        todayMidnight.setHours(0, 0, 0, 0);

        // Calculate difference in days
        const diffDays = Math.ceil((cutoffMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

        // If it is exactly 1 day before the batch (i.e. today is the cutoff day)
        if (diffDays === 0) {
            return "⏰ Booking closes tonight at 11:59 PM";
        }

        return null;
    };

    const getLastBookingDate = (startTime) => {
        const date = new Date(startTime);
        date.setDate(date.getDate());
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            // ✅ already loaded
            if (window.Razorpay) {
                return resolve(true);
            }

            // ✅ prevent duplicate script
            const existingScript = document.getElementById("razorpay-script");
            if (existingScript) {
                existingScript.onload = () => resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.id = "razorpay-script";
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (isPaying) return; // 🛑 STOP multiple calls
        setIsPaying(true);

        try {
            if (!user) {
                // Store selected batch to resume after signup
                localStorage.setItem('pendingBatch', JSON.stringify(selectedBatch));
                if (appliedCoupon) {
                    localStorage.setItem('pendingCoupon', appliedCoupon.code);
                }
                navigate('/SignUp');
                return;
            }

            if (!selectedBatch) return alert("No batch selected");

            if (isSlotFull(selectedBatch)) {
                alert("Batch full");
                return;
            }

            if (isBookingClosed(selectedBatch.startTime)) {
                alert("Booking closed");
                return;
            }

            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert("Razorpay load failed");
                return;
            }

            if (selectedModules.length === 0) {
                alert("Please select at least one module to proceed.");
                setIsPaying(false);
                return;
            }

            const referralCode = localStorage.getItem("referralCode");

            const order = await createOrder({
                amount: getCalculatedPrice(),
                slotId: selectedBatch._id,
                referralCode: referralCode || null,
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                selectedModules: selectedModules,
            }).unwrap();

            const options = {
                key: "rzp_live_SdgMS7X9M3RZSi",
                amount: order.amount,
                currency: "INR",
                order_id: order.orderId,

                handler: async (response) => {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }).unwrap();

                        navigate("/Success");
                        closeModal();
                    } catch (err) {
                        alert("Verification failed");
                    } finally {
                        setIsPaying(false); // ✅ reset
                    }
                },

                modal: {
                    ondismiss: () => {
                        setIsPaying(false); // ✅ user closed popup
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error(err);
            alert("Payment failed");
            setIsPaying(false);
        }
    };

    const getOriginalPrice = () => {
        if (!selectedBatch) return 0;
        const price = getCalculatedPrice();
        const gst = price * 0.18;
        return price + gst;
    };

    const getBatchTotalWithGST = (batch) => {
        if (!batch) return 0;
        const price = getCalculatedPrice();
        const gst = price * 0.18;
        return price + gst;
    };

    const openModal = (slot) => {
        if (isBookingClosed(slot.startTime)) {
            alert("Booking is no longer available for this batch.");
            return;
        }
        setSelectedBatch(slot);
        resetCouponState();
        setIsModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBatch(null);
        resetCouponState();
        document.body.style.overflow = "auto";
    };

    const resetCouponStateOnly = () => {
        setCouponCode("");
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setFinalAmount(0);
        setCouponError("");
        setCouponSuccess("");
        setIsApplyingCoupon(false);
    };

    const resetCouponState = () => {
        resetCouponStateOnly();
        setSelectedModules([]);
    };

    const handleApplyCoupon = async () => {
        if (!user) {
            // Store selected batch to resume after signup
            localStorage.setItem('pendingBatch', JSON.stringify(selectedBatch));
            localStorage.setItem('pendingCoupon', couponCode.toUpperCase());
            navigate('/SignUp');
            return;
        }

        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        if (!selectedBatch) {
            setCouponError("No batch selected");
            return;
        }

        if (!selectedBatch.isFullCourse) {
            setCouponError("Coupons are only valid for the Full Course");
            return;
        }

        const originalAmount = selectedBatch.price; // Use principal amount for discount calculation

        if (appliedCoupon && appliedCoupon.code === couponCode.toUpperCase()) {
            setCouponError("This coupon is already applied");
            return;
        }

        setIsApplyingCoupon(true);
        setCouponError("");
        setCouponSuccess("");

        try {
            const response = await applyCoupon({
                code: couponCode,
                amount: originalAmount,
                slotId: selectedBatch._id
            }).unwrap();

            setAppliedCoupon({
                code: response.couponCode,
                discount: response.discount,
                finalAmount: response.finalAmount
            });
            setCouponDiscount(response.discount);
            setFinalAmount(response.finalAmount);
            setCouponSuccess(`Coupon applied! You saved ₹${response.discount.toFixed(2)}`);
            setCouponCode("");
        } catch (error) {
            console.error("Coupon error:", error);
            setCouponError(error?.data?.message || "Invalid or expired coupon");
            setAppliedCoupon(null);
            setCouponDiscount(0);
            setFinalAmount(0);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        resetCouponState();
    };

    if (isLoading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}></div>
                <p>Loading batches...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.errorContainer}>
                <i className="fas fa-exclamation-triangle"></i>
                <p>Unable to load batches. Please try again.</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <FaArrowLeft />
                </button>
                <h1 className={styles.title}>
                    SSB Online Courses
                </h1>
            </div>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchWrapper}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search batches..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className={styles.clearSearch}>
                            <FaTimes />
                        </button>
                    )}
                </div>

                <div className={styles.filterRight}>
                    <div className={styles.batchTypeFilter}>
                        <FaFilter className={styles.filterIcon} />
                        <select
                            value={selectedBatchType}
                            onChange={(e) => setSelectedBatchType(e.target.value)}
                            className={styles.batchTypeSelect}
                        >
                            <option value="all">All Batches</option>
                            <option value="Morning Batch">Morning Batch</option>
                            <option value="Evening Batch">Evening Batch</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Month Navigation */}
            <div className={styles.monthNavigation}>
                <button
                    onClick={goToPrevMonth}
                    disabled={!canGoPrev}
                    className={styles.navBtn}
                >
                    <FaChevronLeft /> Previous
                </button>
                <h2 className={styles.currentMonth}>
                    {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} {selectedYear}
                </h2>
                <button
                    onClick={goToNextMonth}
                    disabled={!canGoNext}
                    className={styles.navBtn}
                >
                    Next <FaChevronRight />
                </button>
            </div>

            {/* Batches Grid */}
            {currentMonthSlots.slots.length > 0 ? (
                <div className={styles.batchesGrid}>
                    {currentMonthSlots.slots.map((batch) => {
                        const isFull = isSlotFull(batch);
                        const availableSpots = getAvailableSpots(batch);
                        const bookedCount = batch.bookedStudents?.length || 0;

                        const isMorning = batch.title?.toLowerCase().includes("morning");
                        const batchIcon = isMorning ? <FaSun /> : <FaMoon />;
                        const batchClass = isMorning ? styles.morningBatch : styles.eveningBatch;

                        const isClosed = isBookingClosed(batch.startTime);
                        const disableBooking = isFull || isClosed;

                        // Get booking message (only shows 1 day before or on the day)
                        const bookingMessage = getBookingMessage(batch.startTime);

                        return (
                            <div
                                key={batch._id}
                                className={`${styles.batchCard} ${isFull ? styles.batchFull : ''}`}
                                onClick={() => !isFull && !isClosed && openModal(batch)}
                            >
                                <div className={styles.batchHeader}>
                                    <div className={styles.batchTime}>
                                        <FaClock />
                                        <span>{formatDateTime(batch.startTime)}</span>
                                    </div>

                                    <p className={`${styles.batchTitle} ${batchClass}`}>
                                        {batchIcon} {batch.title} {batch.batchNo ? `(#${batch.batchNo})` : ''}
                                    </p>
                                </div>

                                {/* Show regular message only for 1 day before or on the day */}
                                {!isClosed && bookingMessage && (
                                    <div className={styles.cutoffMessageUrgent}>
                                        {bookingMessage}
                                    </div>
                                )}

                                {/* Show closed message */}
                                {isClosed && (
                                    <div className={styles.cutoffMessageClosed}>
                                        ❌ Booking Closed
                                    </div>
                                )}

                                <div className={styles.batchStats}>
                                    <div className={styles.stat}>
                                        <FaUsers />
                                        <span>Limited Seats Available</span>
                                    </div>
                                </div>

                                 {/* <div className={styles.batchPrice}>
                                     <FaRupeeSign />
                                     <span>{batch.price || 0}</span>
                                     <small>+ GST</small>
                                 </div> */}

                                <button
                                    className={`${styles.bookBtn} ${disableBooking ? styles.disabled : ''}`}
                                    disabled={disableBooking}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        !disableBooking && openModal(batch);
                                    }}
                                >
                                    {isFull
                                        ? 'Batch Full'
                                        : isClosed
                                            ? 'Booking Closed'
                                            : 'Book Now'} <FaArrowRight />
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className={styles.noBatches}>
                    <FaCalendarAlt className={styles.noBatchesIcon} />
                    <h3>No batches available</h3>
                    <p>No batches found for {new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} {selectedYear}</p>
                </div>
            )}

            {/* Booking Detail Modal */}
            {isModalOpen && selectedBatch && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.modalClose} onClick={closeModal}>
                            <FaTimes />
                        </button>

                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>{selectedBatch.title}</h2>
                                <div className={styles.modalMeta}>
                                    <div className={styles.metaItem}>
                                        <FaCalendarAlt />
                                        <span>Start: {formatDateTime(selectedBatch.startTime)}</span>
                                    </div>
                                    {selectedBatch.batchNo && (
                                        <div className={styles.metaItem}>
                                            <FaBookOpen />
                                            <span>Batch No: #{selectedBatch.batchNo}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.modalAvailability}>
                                <h4><FaUsers /> Seat Availability</h4>
                                <div className={styles.availabilityStats}>
                                    <div className={`${styles.statRow} ${styles.highlight}`}>
                                        <span>Status:</span>
                                        <strong className={styles.availableCount}>Limited Seats Available</strong>
                                    </div>
                                </div>
                            </div>

                            {selectedBatch.isFullCourse && (
                                <div className={styles.modalModules}>
                                    <h4 style={{ marginBottom: '4px' }}><FaBookOpen /> Choose your Course</h4>
                                    <p style={{ fontSize: '12px', color: '#C5A028', margin: '0 0 15px 0', fontWeight: '500' }}>
                                        Selecting all Modules will unlock the 10 DAY HACKATHON (Full Course) at the special price of Rs 12499
                                    </p>
                                    <ul className={styles.moduleList} style={{ listStyle: 'none', padding: 0 }}>
                                        {COURSE_MODULES.map((mod) => {
                                            const isGreyedOut = mod.id !== 'full_course' && selectedModules.includes('full_course');
                                            return (
                                                <li key={mod.id} style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'space-between', 
                                                    marginBottom: '10px', 
                                                    background: 'rgba(255,255,255,0.03)', 
                                                    padding: '10px 15px', 
                                                    borderRadius: '8px', 
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    opacity: isGreyedOut ? 0.4 : 1,
                                                    transition: 'opacity 0.2s ease-in-out'
                                                }}>
                                                    <label style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        cursor: isGreyedOut ? 'not-allowed' : 'pointer', 
                                                        margin: 0, 
                                                        color: '#fff', 
                                                        fontSize: '14px', 
                                                        width: '100%' 
                                                    }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedModules.includes(mod.id)}
                                                            onChange={() => handleModuleToggle(mod.id)}
                                                            disabled={isGreyedOut}
                                                            style={{ 
                                                                marginRight: '12px', 
                                                                width: '18px', 
                                                                height: '18px', 
                                                                accentColor: '#C5A028', 
                                                                cursor: isGreyedOut ? 'not-allowed' : 'pointer' 
                                                            }}
                                                        />
                                                        {mod.name}
                                                    </label>
                                                    <span style={{ color: '#C5A028', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', marginLeft: '10px' }}>
                                                        ₹{(mod.id === 'full_course' ? (selectedBatch.price || mod.price) : mod.price).toLocaleString('en-IN')}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    {selectedModules.filter(id => id !== 'full_course').length === 4 && (
                                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', background: 'rgba(197, 160, 40, 0.1)', border: '1px solid rgba(197, 160, 40, 0.2)', padding: '8px 12px', borderRadius: '6px', marginTop: '10px' }}>
                                            🎉 <strong>Full Bundle Discount Applied!</strong> Price reduced from ₹15,996 to ₹{(selectedBatch.price || 12499).toLocaleString('en-IN')}.
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedBatch.isFullCourse && (selectedModules.includes('full_course') || selectedModules.filter(id => id !== 'full_course').length === 4) ? (
                                <div className={styles.modalCoupon}>
                                    <h4><FaTicketAlt /> Apply Coupon</h4>
                                    <div className={styles.couponInputGroup}>
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            disabled={!!appliedCoupon}
                                            className={styles.couponInput}
                                        />
                                        {!appliedCoupon ? (
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={isApplyingCoupon || !couponCode.trim()}
                                                className={styles.applyCouponBtn}
                                            >
                                                {isApplyingCoupon ? "Applying..." : "Apply"}
                                            </button>
                                        ) : (
                                            <button onClick={handleRemoveCoupon} className={styles.removeCouponBtn}>
                                                <FaTrash /> Remove
                                            </button>
                                        )}
                                    </div>

                                    {couponError && (
                                        <div className={styles.couponError}>
                                            <FaTimes />
                                            <span>{couponError}</span>
                                        </div>
                                    )}

                                    {couponSuccess && (
                                        <div className={styles.couponSuccess}>
                                            <FaCheckCircle />
                                            <span>{couponSuccess}</span>
                                        </div>
                                    )}

                                    {appliedCoupon && (
                                        <div className={styles.appliedCoupon}>
                                            <div className={styles.couponBadge}>
                                                <FaPercent />
                                                <span>Coupon <strong>{appliedCoupon.code}</strong> applied</span>
                                            </div>
                                            <div className={styles.savedAmount}>
                                                You saved <strong>₹{appliedCoupon.discount.toFixed(2)}</strong>!
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.modalCouponDisabled}>
                                    <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", margin: 0 }}>
                                        <FaTicketAlt style={{ marginRight: "8px" }} />
                                        Coupons are only valid for the Full Course bundle.
                                    </p>
                                </div>
                            )}

                            <div className={styles.modalFooter}>
                                <div className={styles.priceSummary}>
                                    <>
                                        <div className={styles.priceRow}>
                                            <span>Base Price:</span>
                                            <span>₹{getCalculatedPrice().toFixed(2)}</span>
                                        </div>
                                        {appliedCoupon && (
                                            <div className={`${styles.priceRow} ${styles.discount}`}>
                                                <span>Discount:</span>
                                                <span className={styles.discountAmount}>- ₹{couponDiscount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className={styles.priceRow}>
                                            <span>GST (18%):</span>
                                            <span>₹{((getCalculatedPrice() - (appliedCoupon ? couponDiscount : 0)) * 0.18).toFixed(2)}</span>
                                        </div>
                                        <div className={`${styles.priceRow} ${styles.total}`}>
                                            <span>Total Amount</span>
                                            <strong>₹{(appliedCoupon ? finalAmount : getBatchTotalWithGST(selectedBatch)).toFixed(2)}</strong>
                                        </div>
                                    </>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    className={styles.confirmBookBtn}
                                    disabled={isSlotFull(selectedBatch) || isBookingClosed(selectedBatch.startTime)}
                                >
                                    {isSlotFull(selectedBatch)
                                        ? 'Batch Full'
                                        : isBookingClosed(selectedBatch.startTime)
                                            ? 'Booking Closed'
                                            : 'Proceed to Checkout'} <FaArrowRight />
                                </button>

                                <div className={styles.modalNote}>
                                    {/* <FaInfinity /> */}
                                    <span><FaStar /> Proceeding to checkout will prompt you to create an account. Account creation is mandatory to see your course progress, access Psych Test and VTX<sup>TM</sup></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BatchPage;
