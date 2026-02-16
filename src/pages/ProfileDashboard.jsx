import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    BiUser,
    BiHistory,
    BiCreditCard,
    BiLogOut,
    BiEdit,
    BiSave,
    BiArrowBack,
    BiPackage,
    BiMoney,
    BiCalendar,
    BiMap,
    BiPhone,
    BiEnvelope,
    BiChevronRight,
    BiDownload,
    BiShow,
    BiHeart,
    BiStar,
    BiGift
} from "react-icons/bi";
import {
    FaCamera,
    FaCheckCircle,
    FaClock,
    FaShippingFast,
    FaWallet,
    FaMedal,
    FaFire,
    FaBolt,
    FaGem
} from "react-icons/fa";
import { MdLocalShipping, MdPayment } from "react-icons/md";
import { IoMdPricetag } from "react-icons/io";
import { RiVipCrownFill, RiDiscountPercentFill } from "react-icons/ri";
import CustomButton from "../components/CustomButton";
import '../style/custom-theme.css';
import styles from "../style/ProfileDashboard.module.css";
import { IoMenu } from "react-icons/io5";
import NavStyles from "../style/Navbar.module.css";
import Sidebar from "../components/Sidebar";


const ProfileDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);

    // User data
    const [previewData, setPreviewData] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+91 98765 43210",
        address: "123 Gold Street, Apt 4B, York, 1001, USA",
        avatar: "/assets/profile_image.png",
        memberSince: "January 2024",
        totalOrders: 12,
        totalSpent: "₹24,500",
        loyaltyPoints: 1250,
        membershipTier: "Gold",
        wishlistCount: 8
    });

    const [formData, setFormData] = useState({ ...previewData });

    // Enhanced order history data
    const orders = [
        {
            id: "ORD001",
            date: "2024-02-15",
            amount: "₹5,999",
            status: "Delivered",
            items: 3,
            products: [
                { name: "Product 1", price: "₹2,499", quantity: 1 },
                { name: "Product 2", price: "₹1,999", quantity: 2 }
            ],
            tracking: "TRK123456",
            estimatedDelivery: "2024-02-18"
        },
        {
            id: "ORD002",
            date: "2024-02-10",
            amount: "₹3,499",
            status: "Processing",
            items: 2,
            products: [
                { name: "Product 3", price: "₹3,499", quantity: 1 }
            ],
            tracking: "TRK789012",
            estimatedDelivery: "2024-02-20"
        },
        {
            id: "ORD003",
            date: "2024-02-05",
            amount: "₹8,999",
            status: "Delivered",
            items: 5,
            products: [
                { name: "Product 4", price: "₹4,999", quantity: 1 },
                { name: "Product 5", price: "₹2,000", quantity: 2 },
                { name: "Product 6", price: "₹2,000", quantity: 2 }
            ],
            tracking: "TRK345678",
            estimatedDelivery: "2024-02-08"
        },
        {
            id: "ORD004",
            date: "2024-01-28",
            amount: "₹2,499",
            status: "Shipped",
            items: 1,
            products: [
                { name: "Product 7", price: "₹2,499", quantity: 1 }
            ],
            tracking: "TRK901234",
            estimatedDelivery: "2024-02-02"
        },
    ];

    // Payment history data
    const payments = [
        { id: "PAY001", date: "2024-02-15", amount: "₹5,999", method: "Credit Card", status: "Success", cardLast4: "4242" },
        { id: "PAY002", date: "2024-02-10", amount: "₹3,499", method: "UPI", status: "Success", upiId: "john@okhdfc" },
        { id: "PAY003", date: "2024-02-05", amount: "₹8,999", method: "Debit Card", status: "Success", cardLast4: "1234" },
        { id: "PAY004", date: "2024-01-28", amount: "₹2,499", method: "Net Banking", status: "Success", bank: "HDFC" },
    ];

    // Detect mobile view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setPreviewData({ ...formData });
        setIsEditMode(false);
    };

    const handleCancel = () => {
        setFormData({ ...previewData });
        setIsEditMode(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        navigate('/');
        window.location.reload();
    };

    const getStatusBadge = (status) => {
        const statusClass = status.toLowerCase();
        const statusConfig = {
            success: { icon: FaCheckCircle, color: '#28a745' },
            delivered: { icon: FaCheckCircle, color: '#28a745' },
            processing: { icon: FaClock, color: '#ffc107' },
            shipped: { icon: FaShippingFast, color: '#17a2b8' }
        };

        const config = statusConfig[statusClass] || { icon: FaClock, color: '#6c757d' };
        const Icon = config.icon;

        return (
            <span className={`${styles.statusBadge} ${styles[statusClass]}`}>
                <Icon size={12} />
                {status}
            </span>
        );
    };

    const getTierBadge = (tier) => {
        const tierConfig = {
            Gold: { icon: FaMedal, color: '#FFD700' },
            Silver: { icon: FaMedal, color: '#C0C0C0' },
            Platinum: { icon: FaGem, color: '#E5E4E2' }
        };
        const Icon = tierConfig[tier]?.icon || FaMedal;

        return (
            <span className={styles.tierBadge} style={{ backgroundColor: tierConfig[tier]?.color + '20', color: tierConfig[tier]?.color }}>
                <Icon size={14} />
                {tier}
            </span>
        );
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const sidebarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
                setOpen(false); // agar upper wala sidebar bhi close karna ho
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    return (
        <>
            <section className={NavStyles.heroSection}>
                <div className={NavStyles.topBar}>
                    <img
                        src="/assets/logo/ISV.webp"
                        alt="Logo"
                        className={NavStyles.logo}
                    />
                    <IoMenu
                        className={NavStyles.menuIcon}
                        onClick={() => setOpen(true)}
                    />

                </div>

                <Sidebar open={open} onClose={() => setOpen(false)} />

                <div className="">
                    {/* <div className="thm-con2tent-bg"></div> */}
                    {/* <div onClick={() => navigate(-1)} className='arrow_button'>
                <BiArrowBack />
            </div> */}

                    <div className="container position-relative">
                        {/* <h1 className="thm-big-title">My Dashboard</h1> */}

                        {/* Mobile Menu Toggle */}
                        <button
                            className={styles.mobileMenuToggle}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <BiUser style={{ color: 'white' }} />
                            <span>Menu</span>
                        </button>

                        <div className={styles.dashboardContainer}>
                            {/* Sidebar */}
                            {/* <div className={`${styles.sidebar} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}> */}
                                <div
                                    ref={sidebarRef}
                                    className={`${styles.sidebar} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}
                                >

                                    {/* Profile Summary with Enhanced Design */}
                                    <div className={styles.profileSummary}>
                                        <div className={styles.profileHeader}>
                                            <div className={styles.avatarWrapper}>
                                                <img src={previewData.avatar} alt="profile" />
                                                <button className={styles.changeAvatarBtn}>
                                                    <FaCamera />
                                                </button>
                                                <div className={styles.onlineIndicator}></div>
                                            </div>
                                            <div className={styles.profileTitle}>
                                                <h3>{previewData.name}</h3>
                                                <p className={styles.memberSince}>
                                                    <BiCalendar /> Member since
                                                </p>
                                            </div>
                                        </div>

                                        {/* Enhanced Stats Cards */}


                                        {/* Membership Tier */}
                                        <div className={styles.membershipCard}>
                                            <div className={styles.membershipHeader}>
                                                <RiVipCrownFill className={styles.crownIcon} />
                                                <span>Membership Tier</span>
                                            </div>
                                            <div className={styles.membershipBody}>
                                                {getTierBadge(previewData.membershipTier)}
                                                <div className={styles.pointsProgress}>
                                                    <div className={styles.progressBar} style={{ width: '75%' }}></div>
                                                </div>
                                                <span className={styles.nextTier}>750 points to Platinum</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation Tabs with Icons */}
                                    <nav className={styles.navTabs}>
                                        <button
                                            className={`${styles.navTab} ${activeTab === 'profile' ? styles.active : ''}`}
                                            onClick={() => {
                                                setActiveTab('profile');
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <BiUser />
                                            <span>Profile</span>
                                            <BiChevronRight className={styles.chevron} />
                                        </button>
                                        <button
                                            className={`${styles.navTab} ${activeTab === 'orders' ? styles.active : ''}`}
                                            onClick={() => {
                                                setActiveTab('orders');
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <BiHistory />
                                            <span>Order History</span>
                                            <BiChevronRight className={styles.chevron} />
                                        </button>
                                        <button
                                            className={`${styles.navTab} ${activeTab === 'payments' ? styles.active : ''}`}
                                            onClick={() => {
                                                setActiveTab('payments');
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            <BiCreditCard />
                                            <span>Payment History</span>
                                            <BiChevronRight className={styles.chevron} />
                                        </button>
                                    </nav>

                                    {/* Quick Actions */}
                                    {/* <div className={styles.quickActions}>
                                    <h4>Quick Actions</h4>
                                    <button className={styles.quickActionBtn}>
                                        <BiGift /> Redeem Points
                                    </button>
                                    <button className={styles.quickActionBtn}>
                                        <RiDiscountPercentFill /> Special Offers
                                    </button>
                                </div> */}

                                    {/* Logout Button */}
                                    <button className={styles.logoutBtn} onClick={handleLogout}>
                                        <BiLogOut /> Logout
                                    </button>
                                </div>

                                {/* Main Content Area */}
                                <div className={styles.mainContent}>
                                    {/* Profile Tab */}
                                    {activeTab === 'profile' && (
                                        <div className={styles.tabContent}>
                                            <div className={styles.tabHeader}>
                                                <h2>
                                                    <BiUser className={styles.tabIcon} />
                                                    Profile Information
                                                </h2>
                                                {!isEditMode && (
                                                    <CustomButton
                                                        className={styles.editBtn}
                                                        onClick={() => setIsEditMode(true)}

                                                        text="Edit Profile"
                                                    />
                                                )}
                                            </div>

                                            <div className={styles.profileContent}>
                                                {!isEditMode ? (
                                                    // Enhanced Preview Mode
                                                    <div className={styles.infoCards}>
                                                        <div className={styles.infoCard}>
                                                            <div className={styles.cardIcon}>
                                                                <BiUser />
                                                            </div>
                                                            <div className={styles.cardContent}>
                                                                <label>Full Name</label>
                                                                <p>{previewData.name}</p>
                                                            </div>
                                                        </div>
                                                        <div className={styles.infoCard}>
                                                            <div className={styles.cardIcon}>
                                                                <BiEnvelope />
                                                            </div>
                                                            <div className={styles.cardContent}>
                                                                <label>Email Address</label>
                                                                <p>{previewData.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className={styles.infoCard}>
                                                            <div className={styles.cardIcon}>
                                                                <BiPhone />
                                                            </div>
                                                            <div className={styles.cardContent}>
                                                                <label>Phone Number</label>
                                                                <p>{previewData.phone}</p>
                                                            </div>
                                                        </div>
                                                        <div className={styles.infoCard}>
                                                            <div className={styles.cardIcon}>
                                                                <BiMap />
                                                            </div>
                                                            <div className={styles.cardContent}>
                                                                <label>Address</label>
                                                                <p>{previewData.address}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Edit Mode
                                                    <div className={styles.editForm}>
                                                        <div className={styles.formGroup}>
                                                            <label>Full Name</label>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                className="form-control thm-input"
                                                                value={formData.name}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter your full name"
                                                            />
                                                        </div>
                                                        <div className={styles.formGroup}>
                                                            <label>Email Address</label>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                className="form-control thm-input"
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter your email"
                                                            />
                                                        </div>
                                                        <div className={styles.formGroup}>
                                                            <label>Phone Number</label>
                                                            <input
                                                                type="text"
                                                                name="phone"
                                                                className="form-control thm-input"
                                                                value={formData.phone}
                                                                onChange={handleInputChange}
                                                                placeholder="Enter your phone number"
                                                            />
                                                        </div>
                                                        <div className={styles.formGroup}>
                                                            <label>Address</label>
                                                            <textarea
                                                                name="address"
                                                                className="form-control thm-input"
                                                                value={formData.address}
                                                                onChange={handleInputChange}
                                                                rows="3"
                                                                placeholder="Enter your address"
                                                            />
                                                        </div>
                                                        <div className={styles.formActions}>
                                                            <button
                                                                className={styles.cancelBtn}
                                                                onClick={handleCancel}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                className={styles.saveBtn}
                                                                onClick={handleSave}
                                                            >
                                                                <BiSave /> Save Changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Orders Tab - Mobile Optimized */}
                                    {activeTab === 'orders' && (
                                        <div className={styles.tabContent}>
                                            <div className={styles.tabHeader}>
                                                <h2>
                                                    <BiHistory className={styles.tabIcon} />
                                                    Order History
                                                </h2>
                                                <span className={styles.totalCount}>{orders.length} orders</span>
                                            </div>

                                            {showOrderDetails && selectedOrder ? (
                                                <div className={styles.orderDetails}>
                                                    <button
                                                        className={styles.backBtn}
                                                        onClick={() => setShowOrderDetails(false)}
                                                    >
                                                        <BiArrowBack /> Back to Orders
                                                    </button>
                                                    <h3>Order #{selectedOrder.id}</h3>
                                                    <div className={styles.orderDetailsCard}>
                                                        <div className={styles.detailRow}>
                                                            <span>Status:</span>
                                                            {getStatusBadge(selectedOrder.status)}
                                                        </div>
                                                        <div className={styles.detailRow}>
                                                            <span>Date:</span>
                                                            <span>{selectedOrder.date}</span>
                                                        </div>
                                                        <div className={styles.detailRow}>
                                                            <span>Total Amount:</span>
                                                            <span className={styles.amount}>{selectedOrder.amount}</span>
                                                        </div>
                                                        <div className={styles.detailRow}>
                                                            <span>Tracking:</span>
                                                            <span>{selectedOrder.tracking}</span>
                                                        </div>
                                                        <div className={styles.detailRow}>
                                                            <span>Estimated Delivery:</span>
                                                            <span>{selectedOrder.estimatedDelivery}</span>
                                                        </div>

                                                        <h4>Products</h4>
                                                        {selectedOrder.products.map((product, index) => (
                                                            <div key={index} className={styles.productItem}>
                                                                <span>{product.name}</span>
                                                                <span>{product.quantity}x {product.price}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={styles.orderCards}>
                                                    {orders.map((order) => (
                                                        <div key={order.id} className={styles.orderCard}>
                                                            <div className={styles.orderHeader}>
                                                                <div>
                                                                    <span className={styles.orderId}>{order.id}</span>
                                                                    {getStatusBadge(order.status)}
                                                                </div>
                                                                <BiChevronRight className={styles.cardArrow} />
                                                            </div>
                                                            <div className={styles.orderBody}>
                                                                <div className={styles.orderInfo}>
                                                                    <BiCalendar />
                                                                    <span>{order.date}</span>
                                                                </div>
                                                                <div className={styles.orderInfo}>
                                                                    <BiPackage />
                                                                    <span>{order.items} items</span>
                                                                </div>
                                                                <div className={styles.orderInfo}>
                                                                    <IoMdPricetag />
                                                                    <span className={styles.amount}>{order.amount}</span>
                                                                </div>
                                                            </div>
                                                            <div className={styles.orderFooter}>
                                                                <button
                                                                    className={styles.viewDetailsBtn}
                                                                    onClick={() => handleOrderClick(order)}
                                                                >
                                                                    <BiShow /> View Details
                                                                </button>
                                                                {order.status === 'Shipped' && (
                                                                    <button className={styles.trackBtn}>
                                                                        <MdLocalShipping /> Track
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Payments Tab - Mobile Optimized */}
                                    {activeTab === 'payments' && (
                                        <div className={styles.tabContent}>
                                            <div className={styles.tabHeader}>
                                                <h2>
                                                    <BiCreditCard className={styles.tabIcon} />
                                                    Payment History
                                                </h2>
                                                <span className={styles.totalCount}>{payments.length} transactions</span>
                                            </div>

                                            <div className={styles.paymentCards}>
                                                {payments.map((payment) => (
                                                    <div key={payment.id} className={styles.paymentCard}>
                                                        <div className={styles.paymentHeader}>
                                                            <span className={styles.paymentId}>{payment.id}</span>
                                                            {getStatusBadge(payment.status)}
                                                        </div>
                                                        <div className={styles.paymentBody}>
                                                            <div className={styles.paymentInfo}>
                                                                <BiCalendar />
                                                                <span>{payment.date}</span>
                                                            </div>
                                                            <div className={styles.paymentInfo}>
                                                                <MdPayment />
                                                                <span>{payment.method}</span>
                                                                {payment.cardLast4 && <span> •••• {payment.cardLast4}</span>}
                                                                {payment.upiId && <span> ({payment.upiId})</span>}
                                                                {payment.bank && <span> ({payment.bank})</span>}
                                                            </div>
                                                            <div className={styles.paymentAmount}>
                                                                <span>Amount:</span>
                                                                <span className={styles.amount}>{payment.amount}</span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.paymentFooter}>
                                                            <button className={styles.downloadBtn}>
                                                                <BiDownload /> Receipt
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <span style={{ zIndex: '654' }} className="thm-glow"></span>
                        </div>
                    </div>
            </section>
        </>
    );
};

export default ProfileDashboard;