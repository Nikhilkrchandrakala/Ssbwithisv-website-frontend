import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    BiUser,
    BiHistory,
    BiCreditCard,
    BiLogOut,
    // BiEdit,
    BiSave,

    BiCalendar,
    BiMap,
    BiPhone,
    BiEnvelope,
    BiChevronRight,

} from "react-icons/bi";

// 

import {
    FaCamera,
    FaCheckCircle,
    FaClock,
    FaShippingFast,
    FaMedal,

    FaGem
} from "react-icons/fa";
// import { MdLocalShipping, MdPayment } from "react-icons/md";
// import { IoMdPricetag } from "react-icons/io";
import { RiVipCrownFill, RiDiscountPercentFill } from "react-icons/ri";
import CustomButton from "../components/CustomButton";
import '../style/custom-theme.css';
import styles from "../style/ProfileDashboard.module.css";
import { IoMenu } from "react-icons/io5";
import NavStyles from "../style/Navbar.module.css";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useUpdateUserProfileMutation, useUserProfileQuery } from "../redux/api";
// import { orders, payments } from "../util/data";
// import Payment from "./profileDash/Payment";
// import OrderHistory from "./profileDash/OrderHistory";




const ProfileDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const { data } = useUserProfileQuery();

    const [updaterProfile] = useUpdateUserProfileMutation()



    // User data
    const [previewData, setPreviewData] = useState(data?.user);

    const [formData, setFormData] = useState({ ...previewData });

    // Enhanced order history data


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
                        onClick={() => navigate('/')}
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

                    <div className="container position-relative z-1">
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
                                            <img src={previewData?.avatar} alt="profile" />
                                            <button className={styles.changeAvatarBtn}>
                                                <FaCamera />
                                            </button>
                                            <div className={styles.onlineIndicator}></div>
                                        </div>
                                        <div className={styles.profileTitle}>
                                            <h3>{previewData?.name}</h3>
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
                                            {getTierBadge(previewData?.membershipTier)}
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
                                                            <p>{previewData?.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className={styles.infoCard}>
                                                        <div className={styles.cardIcon}>
                                                            <BiEnvelope />
                                                        </div>
                                                        <div className={styles.cardContent}>
                                                            <label>Email Address</label>
                                                            <p>{previewData?.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className={styles.infoCard}>
                                                        <div className={styles.cardIcon}>
                                                            <BiPhone />
                                                        </div>
                                                        <div className={styles.cardContent}>
                                                            <label>Phone Number</label>
                                                            <p>{previewData?.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className={styles.infoCard}>
                                                        <div className={styles.cardIcon}>
                                                            <BiMap />
                                                        </div>
                                                        <div className={styles.cardContent}>
                                                            <label>Address</label>
                                                            <p>{previewData?.address}</p>
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
                                    <>
                                    </>
                                    //    <OrderHistory />

                                )}

                                {/* Payments Tab - Mobile Optimized */}
                                {activeTab === 'payments' && (
                                    <>
                                    </>
                                    //    <Payment />
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