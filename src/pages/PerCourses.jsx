import React, { useState, useEffect } from "react";
import { useCreateOrderMutation, useGetAllCoursesQuery, useUserProfileQuery, useVerifyPaymentMutation, useApplyCouponMutation, useCheckPurchaseQuery } from "../redux/api";
import CustomButton from "../components/CustomButton";
import {
    FaSearch,
    FaTimes,
    FaClock,
    FaArrowRight,
    FaCheckCircle,
    FaCheckDouble,
    FaUsers,
    FaSignal,
    FaBookOpen,
    FaImages,
    FaInfinity,
    FaTicketAlt,
    FaTrash,
    FaPercent
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PerCourses() {
    const { data: coursesData, isLoading, isError } = useGetAllCoursesQuery();
    // const {data} = useCheckPurchaseQuery()


    // states
    const [isCoursesPopupOpen, setIsCoursesPopupOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Coupon states
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);
    const [couponError, setCouponError] = useState("");
    const [couponSuccess, setCouponSuccess] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const [createOrder] = useCreateOrderMutation();
    const [verifyPayment] = useVerifyPaymentMutation();
    const [applyCoupon] = useApplyCouponMutation();

    const { data: user } = useUserProfileQuery()

    const navigate = useNavigate()

    // Get unique categories
    const courses = coursesData || [];
    const categories = ["all", ...new Set(courses.map(course => course.category).filter(Boolean))];

    // Filter courses
    const filteredCourses = courses.filter(course => {
        const matchesCategory = activeCategory === "all" || course.category?.toLowerCase() === activeCategory;
        const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const openModal = (course) => {
        setSelectedCourse(course);
        // Reset coupon states when opening new course modal
        resetCouponState();
        setIsModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCourse(null);
        resetCouponState();
        document.body.style.overflow = "auto";
    };

    // Reset coupon states
    const resetCouponState = () => {
        setCouponCode("");
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setFinalAmount(0);
        setCouponError("");
        setCouponSuccess("");
        setIsApplyingCoupon(false);
    };

    // Calculate total amount with GST
    const getCourseTotalWithGST = (course) => {
        if (!course) return 0;
        const price = course.price || 0;
        const gst = price * 0.18;
        return price + gst;
    };

    // Handle coupon application
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }

        if (!selectedCourse) {
            setCouponError("No course selected");
            return;
        }

        const originalAmount = getCourseTotalWithGST(selectedCourse);

        // If already applied same coupon, don't re-apply
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

            console.log("Coupon response:", response);

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

    // Remove applied coupon
    const handleRemoveCoupon = () => {
        resetCouponState();
    };

    const handlePayment = async () => {
        if (user) {
            try {
                if (!selectedCourse) return alert("No course selected");

                const referralCode = localStorage.getItem("referralCode");

                // Get the base course price (without GST)
                // Backend will add 18% GST automatically
                const basePrice = selectedCourse.price || 0;

                let amountToSend = basePrice; // Send base price, backend adds GST
                let couponCodeToSend = null;

                // If coupon is applied, we still send base price
                // Backend will calculate GST first, then apply discount
                if (appliedCoupon) {
                    couponCodeToSend = appliedCoupon.code;
                }

                console.log("Sending to backend:", {
                    amount: amountToSend,
                    courseId: selectedCourse._id,
                    courseTitle: selectedCourse.title,
                    referralCode,
                    couponCode: couponCodeToSend,
                });

                // ✅ 1. Create order
                const order = await createOrder({
                    amount: amountToSend,
                    courseId: selectedCourse._id,
                    courseTitle: selectedCourse.title,
                    ...(referralCode && { referralCode }),
                    ...(couponCodeToSend && { couponCode: couponCodeToSend })
                }).unwrap();

                // ✅ 2. Load Razorpay script if not loaded
                if (!window.Razorpay) {
                    const script = document.createElement("script");
                    script.src = "https://checkout.razorpay.com/v1/checkout.js";
                    script.async = true;
                    document.body.appendChild(script);

                    await new Promise((resolve) => {
                        script.onload = resolve;
                    });
                }

                // ✅ 3. Razorpay options
                const options = {
                    key: "rzp_live_SdgMS7X9M3RZSi",
                    amount: order.amount,
                    currency: "INR",
                    order_id: order.orderId,

                    name: "SSB Academy",
                    description: selectedCourse.title,

                    handler: async function (response) {
                        try {
                            await verifyPayment(response).unwrap();
                            navigate('/Success')
                            closeModal();
                        } catch (err) {
                            console.error(err);
                            alert("Verification failed ❌");
                        }
                    },

                    prefill: {
                        name: user?.name || "Student",
                        email: user?.email || "test@gmail.com",
                        contact: user?.phone || "9999999999",
                    },

                    theme: {
                        color: "#0f172a",
                    },
                };

                // ✅ 4. Open Razorpay
                const rzp = new window.Razorpay(options);
                rzp.open();

            } catch (err) {
                console.error("Payment error:", err);
                alert(err?.data?.message || err?.message || "Payment failed ❌");
            }

        } else {
            navigate('/SignIn');
        }
    };

    // Get original price with GST for display
    const getOriginalPrice = () => {
        if (!selectedCourse) return 0;
        return getCourseTotalWithGST(selectedCourse);
    };

    const getDisplayAmount = () => {
        if (appliedCoupon && finalAmount > 0) {
            return finalAmount;
        }
        return getOriginalPrice();
    };

    if (isLoading) {
        return (
            <div className="per-courses-loader">
                <div className="spinner"></div>
                <p>Loading amazing courses...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="per-courses-error">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Unable to load courses. Please try again.</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <>
            <CustomButton text="Join US" onClick={() => setIsCoursesPopupOpen(true)} />

            {/* ===================== COURSES POPUP ===================== */}
            {isCoursesPopupOpen && (
                <div className="courses-popup-overlay" onClick={() => setIsCoursesPopupOpen(false)}>
                    <div className="courses-popup-container" onClick={(e) => e.stopPropagation()}>
                        <button className="popup-close" onClick={() => setIsCoursesPopupOpen(false)}>
                            <FaTimes />
                        </button>

                        <div className="popup-header">
                            <h2 className="popup-title">Our Premium Courses</h2>
                        </div>

                        {/* Search Bar */}
                        <div className="popup-search">
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm("")}>
                                    <FaTimes />
                                </button>
                            )}
                        </div>

                        {/* Categories */}
                        {/* <div className="popup-categories">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    className={`category-chip ${activeCategory === category ? "active" : ""}`}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div> */}

                        {/* Courses Grid */}
                        <div className="courses-grid">
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course) => (
                                    <div
                                        key={course._id}
                                        className="course-card-enhanced"
                                        onClick={() => openModal(course)}
                                    >
                                        <div className="course-card-image-wrapper">
                                            <img
                                                src={course.thumbnail || course.images?.[0]?.imageUrl || "/assets/placeholder-course.jpg"}
                                                alt={course.title}
                                                onError={(e) => {
                                                    e.target.src = "/assets/placeholder-course.jpg";
                                                }}
                                            />
                                            <div className="course-card-overlay">
                                                <span className="view-details">View Details</span>
                                            </div>
                                            <div className="course-card-price-tag">
                                                ₹{course.price}
                                                <small>+ GST</small>
                                            </div>
                                        </div>

                                        <div className="course-card-content-enhanced">
                                            {course.category && (
                                                <span className="course-category-badge">{course.category}</span>
                                            )}
                                            <h3 className="course-title">{course.title}</h3>
                                            {course.duration && (
                                                <div className="course-duration">
                                                    <FaClock />
                                                    <span>{course.duration}</span>
                                                </div>
                                            )}
                                            <p className="course-description-preview">
                                                {course.description?.substring(0, 70)}...
                                            </p>
                                            <div className="course-card-footer">
                                                <button className="enroll-preview-btn">
                                                    Learn More <FaArrowRight />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">
                                    <FaSearch />
                                    <p>No courses found matching your criteria</p>
                                    <button onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}>
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Results Count */}
                        {filteredCourses.length > 0 && (
                            <div className="results-count">
                                Showing {filteredCourses.length} of {courses.length} courses
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===================== DETAIL MODAL ENHANCED ===================== */}
            {isModalOpen && selectedCourse && (
                <div className="course-modal-overlay-enhanced" onClick={closeModal}>
                    <div className="course-modal-container-enhanced" onClick={(e) => e.stopPropagation()}>
                        <button className="course-modal-close-enhanced" onClick={closeModal}>
                            <FaTimes />
                        </button>

                        <div className="course-modal-grid">
                            <div className="course-modal-image-section">
                                <img
                                    src={selectedCourse.thumbnail || selectedCourse.images?.[0]?.imageUrl || "/assets/placeholder-course.jpg"}
                                    alt={selectedCourse.title}
                                    onError={(e) => {
                                        e.target.src = "/assets/placeholder-course.jpg";
                                    }}
                                />
                                <div className="course-modal-price-badge-enhanced">
                                    <span className="price-label">Price</span>
                                    <span className="price-value">₹{selectedCourse.price}</span>
                                    <span className="price-gst">+18% GST</span>
                                </div>
                            </div>

                            <div className="course-modal-info-section">
                                <div className="course-modal-header-enhanced">
                                    {selectedCourse.category && (
                                        <span className="modal-category">{selectedCourse.category}</span>
                                    )}
                                    <h2 className="course-modal-title-enhanced">{selectedCourse.title}</h2>

                                    <div className="course-meta-stats">
                                        {selectedCourse.duration && (
                                            <div className="meta-item">
                                                <FaClock />
                                                <span>{selectedCourse.duration}</span>
                                            </div>
                                        )}
                                        {selectedCourse.level && (
                                            <div className="meta-item">
                                                <FaSignal />
                                                <span>{selectedCourse.level}</span>
                                            </div>
                                        )}
                                        {selectedCourse.studentsEnrolled && (
                                            <div className="meta-item">
                                                <FaUsers />
                                                <span>{selectedCourse.studentsEnrolled}+ enrolled</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="course-modal-description-enhanced">
                                    <h4>
                                        <FaBookOpen />
                                        About This Course
                                    </h4>
                                    <p>{selectedCourse.description || "Comprehensive SSB preparation program designed to help you succeed in the Services Selection Board interview."}</p>
                                </div>

                                {/* Coupon Section */}
                                <div className="course-modal-coupon-section">
                                    <h4>
                                        <FaTicketAlt />
                                        Apply Coupon
                                    </h4>
                                    <div className="coupon-input-wrapper">
                                        <div className="coupon-input-group">
                                            <input
                                                type="text"
                                                placeholder="Enter coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                disabled={!!appliedCoupon}
                                                className="coupon-input"
                                            />
                                            {!appliedCoupon ? (
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={isApplyingCoupon || !couponCode.trim()}
                                                    className="apply-coupon-btn"
                                                >
                                                    {isApplyingCoupon ? "Applying..." : "Apply"}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleRemoveCoupon}
                                                    className="remove-coupon-btn"
                                                >
                                                    <FaTrash /> Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {couponError && (
                                        <div className="coupon-error-message">
                                            <FaTimes />
                                            <span>{couponError}</span>
                                        </div>
                                    )}

                                    {couponSuccess && (
                                        <div className="coupon-success-message">
                                            <FaCheckCircle />
                                            <span>{couponSuccess}</span>
                                        </div>
                                    )}

                                    {appliedCoupon && (
                                        <div className="applied-coupon-info">
                                            <div className="applied-coupon-badge">
                                                <FaPercent />
                                                <span>Coupon <strong>{appliedCoupon.code}</strong> applied</span>
                                            </div>
                                            <div className="saved-amount">
                                                You saved <strong>₹{appliedCoupon.discount.toFixed(2)}</strong>!
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Enroll Section */}
                                <div className="course-modal-footer-enhanced">
                                    <div className="price-summary">
                                        {appliedCoupon ? (
                                            <>
                                                <div className="original-price-row">
                                                    <span>Original Price:</span>
                                                    <span className="strikethrough">₹{getOriginalPrice().toFixed(2)}</span>
                                                </div>
                                                <div className="discount-row">
                                                    <span>Discount:</span>
                                                    <span className="discount-amount">- ₹{couponDiscount.toFixed(2)}</span>
                                                </div>
                                                <div className="total-price">
                                                    <span>Total Amount</span>
                                                    <strong>₹{finalAmount.toFixed(2)}</strong>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="total-price">
                                                    <span>Total Amount</span>
                                                    <strong>₹{getOriginalPrice().toFixed(2)}</strong>
                                                </div>
                                                <div className="price-breakdown">
                                                    <span>Course Fee: ₹{selectedCourse.price}</span>
                                                    <span>GST (18%): ₹{(selectedCourse.price * 0.18).toFixed(2)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <button onClick={handlePayment} className="enroll-now-btn">
                                        Enroll Now <FaArrowRight />
                                    </button>
                                    <div className="modal-note">
                                        <FaInfinity />
                                        <span>Lifetime access • Instant delivery</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PerCourses;