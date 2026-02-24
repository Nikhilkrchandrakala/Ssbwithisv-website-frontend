import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    BiUser,
    BiHistory,
    BiCreditCard,
    BiLogOut,
    BiSave,
    BiCalendar,
    BiMap,
    BiPhone,
    BiEnvelope,
    BiChevronRight,
    BiX,
} from "react-icons/bi";
import {
    FaCamera,
    FaMedal,
    FaGem
} from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import CustomButton from "../components/CustomButton";
import '../style/custom-theme.css';
import styles from "../style/ProfileDashboard.module.css";
import { IoMenu } from "react-icons/io5";
import NavStyles from "../style/Navbar.module.css";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useUpdateUserProfileMutation, useUserProfileQuery } from "../redux/api";
import toast from "react-hot-toast";

const ProfileDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);

    // Image upload states
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const fileInputRef = useRef(null);
    const popupRef = useRef(null);

    const { data } = useUserProfileQuery();
    const [updaterProfile] = useUpdateUserProfileMutation();

    // User data
    const [previewData, setPreviewData] = useState(data?.user);
    const [formData, setFormData] = useState({ ...previewData });

    // Handle click outside popup
    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                handleCancelImage();
            }
        }

        if (showImagePopup) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showImagePopup]);

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

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPEG, JPG, PNG, GIF, WEBP)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }

            setSelectedImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImage) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('profileImage', selectedImage);

        try {
            const response = await updaterProfile(formData).unwrap();
            setPreviewData(prev => ({ ...prev, profileImage: response.profileImage }));

            // Close popup and reset states after successful upload
            setShowImagePopup(false);
            setSelectedImage(null);
            setImagePreview(null);

            toast.success('Profile image updated successfully!');
        } catch (error) {
            // console.error('Error uploading image:', error);
            toast.error('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancelImage = () => {
        setShowImagePopup(false);
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openImagePopup = () => {
        setShowImagePopup(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setPreviewData({ ...formData });
        await updaterProfile(formData)
        toast.success('Profile updated successfully!');
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

    const sidebarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
                setOpen(false);
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
                    <div className="container position-relative z-1">
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
                            <div
                                ref={sidebarRef}
                                className={`${styles.sidebar} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}
                            >
                                {/* Profile Summary with Enhanced Design */}
                                <div className={styles.profileSummary}>
                                    <div className={styles.profileHeader}>
                                        <div
                                            className={styles.avatarWrapper}
                                            onClick={openImagePopup}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img
                                                src={previewData?.profileImage || '/default-avatar.png'}
                                                alt="profile"
                                            />
                                            <div className={styles.avatarOverlay}>
                                                <FaCamera />
                                                <span>Change Photo</span>
                                            </div>
                                            {/* <div className={styles.onlineIndicator}></div> */}
                                        </div>

                                        <div className={styles.profileTitle}>
                                            <h3>{previewData?.name}</h3>
                                            <p className={styles.memberSince}>
                                                <BiCalendar /> Member since
                                            </p>
                                        </div>
                                    </div>

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
                                    {/* <button
                                        className={`${styles.navTab} ${activeTab === 'orders' ? styles.active : ''}`}
                                        onClick={() => {
                                            setActiveTab('orders');
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <BiHistory />
                                        <span>Order History</span>
                                        <BiChevronRight className={styles.chevron} />
                                    </button> */}
                                    {/* <button
                                        className={`${styles.navTab} ${activeTab === 'payments' ? styles.active : ''}`}
                                        onClick={() => {
                                            setActiveTab('payments');
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <BiCreditCard />
                                        <span>Payment History</span>
                                        <BiChevronRight className={styles.chevron} />
                                    </button> */}
                                </nav>

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
                                                            <p>{previewData?.Address}</p>
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
                                                            type="tel"
                                                            name="phone"
                                                            className="form-control thm-input"
                                                            value={formData.phone}
                                                            onChange={(e) => {
                                                                // 👇 Allow only numbers & max 10 digits
                                                                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                                handleInputChange({
                                                                    target: { name: "phone", value }
                                                                });
                                                            }}
                                                            placeholder="Enter 10 digit phone number"
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                    <div className={styles.formGroup}>
                                                        <label>Address</label>
                                                        <textarea
                                                            name="Address"
                                                            className="form-control thm-input"
                                                            value={formData.Address}
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

                                {/* Orders Tab */}
                                {activeTab === 'orders' && (
                                    <>
                                    </>
                                )}

                                {/* Payments Tab */}
                                {activeTab === 'payments' && (
                                    <>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Image Upload Popup */}
                        {showImagePopup && (
                            <div className={styles.popupOverlay}>
                                <div ref={popupRef} className={styles.popupContent}>
                                    <div className={styles.popupHeader}>
                                        <h3>Change Profile Photo</h3>
                                        <button
                                            className={styles.closePopupBtn}
                                            onClick={handleCancelImage}
                                        >
                                            <BiX />
                                        </button>
                                    </div>

                                    <div className={styles.popupBody}>
                                        {/* Current Image Preview */}
                                        <div className={styles.currentImageContainer}>
                                            <img
                                                src={imagePreview || previewData?.profileImage || '/default-avatar.png'}
                                                alt="Profile Preview"
                                                className={styles.previewImage}
                                            />
                                        </div>

                                        {/* Hidden File Input */}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />

                                        {/* Image Selection Area */}
                                        {!selectedImage ? (
                                            <div className={styles.imageSelectionArea}>
                                                <button
                                                    className={styles.selectImageBtn}
                                                    onClick={handleImageClick}
                                                >
                                                    <FaCamera />
                                                    Select Image
                                                </button>
                                                <p className={styles.imageHint}>
                                                    Supported formats: JPG, PNG, GIF, WEBP (Max 5MB)
                                                </p>
                                            </div>
                                        ) : (
                                            <div className={styles.imagePreviewArea}>
                                                {/* <div className={styles.selectedImageContainer}>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Selected"
                                                        className={styles.selectedImage}
                                                    />
                                                </div> */}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        {selectedImage && (
                                            <div className={styles.popupActions}>
                                                <button
                                                    className={styles.cancelPopupBtn}
                                                    onClick={handleCancelImage}
                                                    disabled={isUploading}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className={styles.savePopupBtn}
                                                    onClick={handleImageUpload}
                                                    disabled={isUploading}
                                                >
                                                    {isUploading ? 'Uploading...' : 'Save Photo'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <span style={{ zIndex: '654' }} className="thm-glow"></span>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProfileDashboard;