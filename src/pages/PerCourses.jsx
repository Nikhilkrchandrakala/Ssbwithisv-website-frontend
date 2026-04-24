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
    FaUserGraduate,
    FaSun,
    FaMoon,
    FaFilter,
    FaChevronLeft,
    FaChevronRight,
    FaArrowLeft
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
        console.log(isoString)
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

    // Check if batch start date is today
    const isStartDateToday = (startTime) => {
        if (!startTime) return false;
        const startDate = new Date(startTime);
        const today = new Date();

        return startDate.getDate() === today.getDate() &&
            startDate.getMonth() === today.getMonth() &&
            startDate.getFullYear() === today.getFullYear();
    };

    // NEW FUNCTION: Check if booking message should be shown (1 day before or on the day)
    const shouldShowBookingMessage = (startTime) => {
        if (!startTime) return false;

        const startDate = new Date(startTime);
        const today = new Date();

        // Reset time to midnight for accurate date comparison
        const startDateMidnight = new Date(startDate);
        startDateMidnight.setHours(0, 0, 0, 0);

        const todayMidnight = new Date(today);
        todayMidnight.setHours(0, 0, 0, 0);

        // Calculate difference in days
        const diffTime = startDateMidnight - todayMidnight;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Show message only if:
        // 1. It's today (diffDays === 0) OR
        // 2. It's exactly 1 day before (diffDays === 1)
        // 3. And booking is not closed yet
        return diffDays === 0 || diffDays === 1;
    };

    // Get cutoff time for same-day batches
    const getSameDayCutoffMessage = (startTime) => {
        if (!startTime) return "";

        const cutoffTime = new Date(startTime);
        cutoffTime.setHours(10, 0, 0, 0); // 10:00 AM cutoff

        const now = new Date();

        if (now > cutoffTime) {
            return "Booking closed for today's batch";
        }

        const hoursLeft = Math.ceil((cutoffTime - now) / (1000 * 60 * 60));
        const minutesLeft = Math.ceil((cutoffTime - now) / (1000 * 60));

        if (hoursLeft < 1) {
            return `Last chance! Only ${minutesLeft} minutes left to book`;
        }

        return `Book before ${cutoffTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} today`;
    };

    // Check if booking is still available for same-day batch
    const isSameDayBookingOpen = (startTime) => {
        if (!isStartDateToday(startTime)) return true;

        const cutoffTime = new Date(startTime);
        cutoffTime.setHours(10, 0, 0, 0); // 10:00 AM cutoff
        const now = new Date();

        return now <= cutoffTime;
    };

    // Check if booking is closed (includes same-day cutoff)
    const isBookingClosed = (startTime) => {
        if (!startTime) return true;

        const startDate = new Date(startTime);
        const now = new Date();

        // Last booking date = same day (aaj)
        const lastBookingDate = new Date(startDate);
        lastBookingDate.setHours(23, 59, 59, 999);

        const isToday =
            startDate.getDate() === now.getDate() &&
            startDate.getMonth() === now.getMonth() &&
            startDate.getFullYear() === now.getFullYear();

        if (isToday) {
            return now > lastBookingDate;
        }

        // Future batch → ek din pehle midnight tak
        const cutoffDate = new Date(startDate);
        cutoffDate.setDate(cutoffDate.getDate() - 1);
        cutoffDate.setHours(23, 59, 59, 999);

        return now > cutoffDate;
    };

    // UPDATED: Get booking message based on date type (only shows 1 day before or on the day)
    const getBookingMessage = (startTime) => {
        if (!shouldShowBookingMessage(startTime)) return null;

        const startDate = new Date(startTime);
        const now = new Date();

        const isToday =
            startDate.getDate() === now.getDate() &&
            startDate.getMonth() === now.getMonth() &&
            startDate.getFullYear() === now.getFullYear();

        if (isToday) {
            return "⏰ Booking is open until midnight today";
        }

        // It's exactly 1 day before
        const tomorrowDate = new Date(startDate);
        const formattedDate = tomorrowDate.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short'
        });

        return `⏰ Booking is open until midnight on ${formattedDate}`;
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
                navigate('/SignIn');
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

            const order = await createOrder({
                amount: selectedBatch.price,
                slotId: selectedBatch._id,
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
        return getBatchTotalWithGST(selectedBatch);
    };

    const getBatchTotalWithGST = (batch) => {
        if (!batch) return 0;
        const price = batch.price || 0;
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

    const resetCouponState = () => {
        setCouponCode("");
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setFinalAmount(0);
        setCouponError("");
        setCouponSuccess("");
        setIsApplyingCoupon(false);
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        if (!selectedBatch) {
            setCouponError("No batch selected");
            return;
        }

        const originalAmount = getBatchTotalWithGST(selectedBatch);

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
                amount: originalAmount
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
                    10 days online SSB Hackathon Courses
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
                        const batchTypeClass = batch.batchType === 'morning' ? styles.morning : styles.evening;
                        const batchIcon = batch.batchType === 'morning' ? <FaSun /> : <FaMoon />;
                        const isClosed = isBookingClosed(batch.startTime);
                        const isToday = isStartDateToday(batch.startTime);
                        const disableBooking = isFull || isClosed;

                        // Get booking message (only shows 1 day before or on the day)
                        const bookingMessage = getBookingMessage(batch.startTime);

                        return (
                            <div
                                key={batch._id}
                                className={`${styles.batchCard} ${isFull ? styles.batchFull : ''} ${isToday && !isClosed ? styles.todayBatch : ''}`}
                                onClick={() => !isFull && !isClosed && openModal(batch)}
                            >
                                <div className={styles.batchHeader}>
                                    <div className={styles.batchTime}>
                                        <FaClock />
                                        <span>{formatDateTime(batch.startTime)}</span>
                                    </div>

                                    <p className={styles.batchTitle}>
                                        {batchIcon} {batch.title}
                                    </p>
                                </div>

                                {/* Show cutoff message for today's batch (always shows for today) */}
                                {isToday && !isClosed && (
                                    <div className={styles.cutoffMessageUrgent}>
                                        {getSameDayCutoffMessage(batch.startTime)}
                                    </div>
                                )}

                                {/* Show regular message only for 1 day before or on the day */}
                                {!isToday && !isClosed && bookingMessage && (
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
                                        <span>Capacity: {batch.maxStudents || '∞'}</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <FaUserGraduate />
                                        <span>Booked: {bookedCount}</span>
                                    </div>
                                    {!isFull && batch.maxStudents && (
                                        <div className={`${styles.stat} ${styles.available}`}>
                                            <FaCheckCircle />
                                            <span>Available: {availableSpots}</span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.batchPrice}>
                                    <FaRupeeSign />
                                    <span>{batch.price || 0}</span>
                                    <small>+ GST</small>
                                </div>

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
                                            : isToday
                                                ? 'Book Now (Today\'s Batch)'
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
                                </div>
                            </div>

                            <div className={styles.modalAvailability}>
                                <h4><FaUsers /> Seat Availability</h4>
                                <div className={styles.availabilityStats}>
                                    <div className={styles.statRow}>
                                        <span>Maximum Capacity:</span>
                                        <strong>{selectedBatch.maxStudents || 'Unlimited'}</strong>
                                    </div>
                                    <div className={styles.statRow}>
                                        <span>Already Booked:</span>
                                        <strong>{selectedBatch.bookedStudents?.length || 0}</strong>
                                    </div>
                                    <div className={`${styles.statRow} ${styles.highlight}`}>
                                        <span>Seats Available:</span>
                                        <strong className={styles.availableCount}>{getAvailableSpots(selectedBatch)}</strong>
                                    </div>
                                </div>
                            </div>

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

                            <div className={styles.modalFooter}>
                                <div className={styles.priceSummary}>
                                    {appliedCoupon ? (
                                        <>
                                            <div className={styles.priceRow}>
                                                <span>Original Price:</span>
                                                <span className={styles.strikethrough}>₹{getOriginalPrice().toFixed(2)}</span>
                                            </div>
                                            <div className={`${styles.priceRow} ${styles.discount}`}>
                                                <span>Discount:</span>
                                                <span className={styles.discountAmount}>- ₹{couponDiscount.toFixed(2)}</span>
                                            </div>
                                            <div className={`${styles.priceRow} ${styles.total}`}>
                                                <span>Total Amount</span>
                                                <strong>₹{finalAmount.toFixed(2)}</strong>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={`${styles.priceRow} ${styles.total}`}>
                                                <span>Total Amount</span>
                                                <strong>₹{getOriginalPrice().toFixed(2)}</strong>
                                            </div>
                                            <div className={styles.priceBreakdown}>
                                                <span>Batch Fee: ₹{selectedBatch.price}</span>
                                                <span>GST (18%): ₹{(selectedBatch.price * 0.18).toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={isPaying}
                                >
                                    {isPaying ? "Processing..." : "Confirm Booking"}
                                </button>

                                <div className={styles.modalNote}>
                                    <FaInfinity />
                                    <span>Secure your seat • Limited slots available</span>
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
