import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    BiUser,
    BiLogOut,
    BiSave,
    BiCalendar,
    BiMap,
    BiPhone,
    BiEnvelope,
    BiChevronRight,
    BiX,
    BiCheck,
    BiEdit,
    BiArrowBack
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
import OtpVerificationPopup from "../components/OtpVerificationPopup";
import { useUpdateUserProfileMutation, useUserProfileQuery } from "../redux/api";
import toast from "react-hot-toast";
import ImageUploadPopup from "../components/ImageUploadPopup";
import axios from "axios";
import ReactDOM from 'react-dom';

const ProfileDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false);

    // MSG91 Configuration
    const MSG91_CONFIG = {
        tokenAuth: "432663TzWGndK2N7sR6710de92P1",
        widgetId: "346a776c5749333834363239"
    };

    // Image upload states
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showImagePopup, setShowImagePopup] = useState(false);
    const fileInputRef = useRef(null);
    const popupRef = useRef(null);

    // OTP Verification states
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otpField, setOtpField] = useState(null); // 'phone' or 'email'
    const [oldValue, setOldValue] = useState('');
    const [newValue, setNewValue] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [reqId, setReqId] = useState('');
    const [otpError, setOtpError] = useState('');

    const { data } = useUserProfileQuery();
    const [updateProfile] = useUpdateUserProfileMutation();

    // User data
    const [previewData, setPreviewData] = useState(data?.user);
    const [formData, setFormData] = useState({ ...previewData });
    const [tempFormData, setTempFormData] = useState({});

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
            const response = await updateProfile(formData).unwrap();
            setPreviewData(prev => ({ ...prev, profileImage: response.profileImage }));

            // Close popup and reset states after successful upload
            setShowImagePopup(false);
            setSelectedImage(null);
            setImagePreview(null);

            toast.success('Profile image updated successfully!');
        } catch (error) {
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

        // Special handling for phone - only numbers and max 10 digits
        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle field click for OTP verification with old and new values
    const handleFieldClick = (field) => {
        if (field === 'phone' || field === 'email') {
            setTempFormData({ ...formData });
            setOtpField(field);
            setOldValue(previewData?.[field] || ''); // Set the old value from preview data
            setNewValue(''); // Clear new value for input
            setShowOtpPopup(true);
            setOtpSent(false);
            setOtp('');
            setReqId('');
            setOtpError('');
        }
    };

    // Send OTP using MSG91
    const handleSendOtp = async () => {
        if (!newValue) {
            setOtpError(`Please enter a valid ${otpField === 'phone' ? 'phone number' : 'email'}`);
            return;
        }

        if (newValue === oldValue) {
            setOtpError(`New ${otpField === 'phone' ? 'phone number' : 'email'} must be different from current`);
            return;
        }

        if (otpField === 'phone' && newValue.length !== 10) {
            setOtpError('Please enter a valid 10-digit phone number');
            return;
        }

        if (otpField === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newValue)) {
                setOtpError('Please enter a valid email address');
                return;
            }
        }

        setIsVerifying(true);
        setOtpError('');

        try {
            // 🔹 EMAIL OTP (Your Backend API)
            if (otpField === 'email') {

                const res = await axios.post(
                    "https://api.ssbwithisv.in/api/send-otp",
                    { email: newValue }
                );

                if (res.data.success) {
                    setOtpSent(true);
                    toast.success("OTP sent to your new email");
                } else {
                    setOtpError(res.data.message || "Failed to send OTP");
                }

            }
            // 🔹 PHONE OTP (MSG91)
            else {

                const res = await axios.post(
                    "https://api.msg91.com/api/v5/widget/sendOtp",
                    {
                        identifier: `91${newValue}`,
                        widgetId: MSG91_CONFIG.widgetId,
                        tokenAuth: MSG91_CONFIG.tokenAuth,
                    },
                    { headers: { "Content-Type": "application/json" } }
                );

                if (res.data.type === "success") {
                    setOtpSent(true);
                    setReqId(res.data.message);
                    toast.success("OTP sent to your new phone number");
                } else {
                    setOtpError("Failed to send OTP");
                }
            }

        } catch (error) {
            console.error("OTP ERROR:", error);
            setOtpError("Failed to send OTP. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    // Verify OTP and update field
    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setOtpError('Please enter a valid 6-digit OTP');
            return;
        }

        setIsVerifying(true);
        setOtpError('');

        try {

            // 🔹 EMAIL OTP VERIFY (Your Backend)
            if (otpField === 'email') {

                const otpRes = await axios.post(
                    "https://api.ssbwithisv.in/api/verify-otp",
                    {
                        email: newValue,
                        otp: otp
                    }
                );

                if (!otpRes.data.success) {
                    setOtpError(otpRes.data.message || "Invalid OTP");
                    setIsVerifying(false);
                    return;
                }

            }
            // 🔹 PHONE OTP VERIFY (MSG91)
            else {

                const otpRes = await axios.post(
                    "https://api.msg91.com/api/v5/widget/verifyOtp",
                    {
                        otp,
                        reqId,
                        widgetId: MSG91_CONFIG.widgetId,
                        tokenAuth: MSG91_CONFIG.tokenAuth,
                    },
                    { headers: { "Content-Type": "application/json" } }
                );

                if (otpRes.data.type !== "success") {
                    setOtpError("Invalid OTP");
                    setIsVerifying(false);
                    return;
                }
            }

            // ✅ If OTP Verified Successfully
            const updateData = { [otpField]: newValue };

            await updateProfile(updateData).unwrap();

            setPreviewData(prev => ({ ...prev, [otpField]: newValue }));
            setFormData(prev => ({ ...prev, [otpField]: newValue }));

            toast.success(`${otpField === 'phone' ? 'Phone number' : 'Email'} updated successfully!`);

            setShowOtpPopup(false);
            setOtpField(null);
            setOldValue('');
            setNewValue('');
            setOtp('');
            setReqId('');

        } catch (error) {
            console.error("Verification ERROR:", error);
            setOtpError("OTP verification failed. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    // Close OTP popup
    const handleCloseOtpPopup = () => {
        setShowOtpPopup(false);
        setOtpField(null);
        setOldValue('');
        setNewValue('');
        setOtp('');
        setOtpSent(false);
        setReqId('');
        setOtpError('');
        // Revert form data if cancelled
        if (tempFormData[otpField]) {
            setFormData(prev => ({ ...prev, [otpField]: tempFormData[otpField] }));
        }
        setTempFormData({});
    };

    console.log(showOtpPopup)

    const handleSave = async () => {
        // Check if email or phone were changed without verification
        if (formData.phone !== previewData?.phone || formData.email !== previewData?.email) {
            toast.error('Please verify phone and email changes before saving');
            return;
        }

        // Only save name and address without verification
        const updateData = {
            name: formData.name,
            Address: formData.Address
        };

        setPreviewData(prev => ({ ...prev, ...updateData }));
        await updateProfile(updateData);
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

    // const navigate = useNavigate();

    return (
        <>
            <section className={NavStyles.heroSection}>
                <div className={NavStyles.topBar}>
                    <div onClick={() => navigate(-1)} className="arrow_button_two">


                        <BiArrowBack />
                    </div>

                </div>

                {/*  */}

                {/* <Sidebar open={open} onClose={() => setOpen(false)} /> */}

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
                                                src={previewData?.profileImage || '/assets/profileImage.png'}
                                                alt="profile"
                                            />
                                            <div className={styles.avatarOverlay}>
                                                <FaCamera />
                                                <span>Change Photo</span>
                                            </div>
                                        </div>

                                        <div className={styles.profileTitle}>
                                            <h3>{previewData?.name}</h3>
                                            <p>{previewData?.email}</p>
                                        </div>
                                    </div>

                                    {/* Membership Tier */}
                                    {/* <div className={styles.membershipCard}>
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
                                    </div> */}
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

                                            <button
                                                className={styles.editFieldBtn}
                                                onClick={() => setIsEditMode(true)}
                                                title="Edit Profile"
                                            >
                                                <BiEdit />
                                            </button>
                                            {/* {!isEditMode && (
                                                <CustomButton
                                                    className={styles.editBtn}
                                                    onClick={() => setIsEditMode(true)}
                                                    text={<BiEdit />}
                                                />
                                            )} */}
                                        </div>

                                        <div className={styles.profileContent}>
                                            {!isEditMode ? (
                                                // Enhanced Preview Mode with Edit Icons for Phone and Email
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
                                                            <div className={styles.fieldWithEdit}>
                                                                <p>{previewData?.email}</p>
                                                                <button
                                                                    className={styles.editFieldBtn}
                                                                    onClick={() => handleFieldClick('email')}
                                                                    title="Edit Email"
                                                                >
                                                                    <BiEdit />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={styles.infoCard}>
                                                        <div className={styles.cardIcon}>
                                                            <BiPhone />
                                                        </div>
                                                        <div className={styles.cardContent}>
                                                            <label>Phone Number</label>
                                                            <div className={styles.fieldWithEdit}>
                                                                <p>{previewData?.phone}</p>
                                                                <button
                                                                    className={styles.editFieldBtn}
                                                                    onClick={() => handleFieldClick('phone')}
                                                                    title="Edit Phone Number"
                                                                >
                                                                    <BiEdit />
                                                                </button>
                                                            </div>
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
                                                            value={formData.name || ''}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter your full name"
                                                        />
                                                    </div>

                                                    <div className={styles.formGroup}>
                                                        <label>Address</label>
                                                        <textarea
                                                            name="Address"
                                                            className="form-control thm-input"
                                                            value={formData.Address || ''}
                                                            onChange={handleInputChange}
                                                            rows="3"
                                                            placeholder="Enter your address"
                                                        />
                                                    </div>

                                                    <div className={styles.formActions}>
                                                        <button
                                                            className={styles.cancelBtn}
                                                            onClick={handleCancel}
                                                            type="button"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className={styles.saveBtn}
                                                            onClick={handleSave}
                                                            disabled={formData.phone !== previewData?.phone || formData.email !== previewData?.email}
                                                            type="button"
                                                        >
                                                            <BiSave /> Save Changes
                                                        </button>
                                                    </div>
                                                    {(formData.phone !== previewData?.phone || formData.email !== previewData?.email) && (
                                                        <p className={styles.saveWarning}>
                                                            ⚠️ Please verify phone and email changes before saving
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Upload Popup */}
                        {showImagePopup && (
                            <ImageUploadPopup
                                isOpen={showImagePopup}
                                onClose={handleCancelImage}
                                onSave={handleImageUpload}
                                previewImage={imagePreview}
                                existingImage={previewData?.profileImage}
                                selectedImage={selectedImage}
                                onImageChange={handleImageChange}
                                isUploading={isUploading}
                            />
                        )}

                        {/* OTP Verification Popup - Updated with Old and New Value Fields */}
                        {showOtpPopup && ReactDOM.createPortal(
                            <div className={styles.overlay}>
                                <div className={styles.popup}>
                                    <button className={styles.closeBtn} onClick={handleCloseOtpPopup}>
                                        <BiX />
                                    </button>

                                    <div className={styles.header}>
                                        <div className={styles.icon}>
                                            {otpField === 'phone' ? <BiPhone /> : <BiEnvelope />}
                                        </div>
                                        <h3>Verify {otpField === 'phone' ? 'Phone Number' : 'Email'}</h3>
                                    </div>

                                    <div className={styles.content}>
                                        <p className={styles.message}>
                                            Please verify your new {otpField === 'phone' ? 'phone number' : 'email address'}
                                        </p>

                                        {/* Old Value Display */}
                                        <div className={styles.valueDisplay}>
                                            <span className={styles.label}>Current {otpField === 'phone' ? 'Phone' : 'Email'}</span>
                                            <span className={styles.value}>{oldValue}</span>
                                        </div>

                                        {/* New Value Input */}
                                        <div className={styles.formGroup}>
                                            <label>New {otpField === 'phone' ? 'Phone Number' : 'Email Address'}</label>
                                            <input
                                                type={otpField === 'phone' ? 'tel' : 'email'}
                                                className={styles.input}
                                                value={newValue}
                                                onChange={(e) => {
                                                    if (otpField === 'phone') {
                                                        const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                        setNewValue(numericValue);
                                                    } else {
                                                        setNewValue(e.target.value);
                                                    }
                                                }}
                                                placeholder={otpField === 'phone' ? 'Enter 10-digit number' : 'Enter email address'}
                                                disabled={otpSent}
                                            />
                                        </div>

                                        {!otpSent ? (
                                            <button
                                                className={styles.submitBtn}
                                                onClick={handleSendOtp}
                                                disabled={isVerifying || !newValue}
                                            >
                                                {isVerifying ? 'Sending...' : 'Send OTP'}
                                            </button>
                                        ) : (
                                            <>
                                                <div className={styles.formGroup}>
                                                    <label>Enter OTP</label>
                                                    <div className={styles.otpInputGroup}>
                                                        <input
                                                            type="text"
                                                            className={styles.otpInput}
                                                            value={otp}
                                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                            placeholder="Enter 6-digit OTP"
                                                            maxLength="6"
                                                        />
                                                        <button
                                                            className={styles.resendBtn}
                                                            onClick={handleSendOtp}
                                                            disabled={isVerifying}
                                                        >
                                                            Resend
                                                        </button>
                                                    </div>
                                                </div>

                                                <button
                                                    className={styles.submitBtn}
                                                    onClick={handleVerifyOtp}
                                                    disabled={isVerifying || otp.length !== 6}
                                                >
                                                    {isVerifying ? 'Verifying...' : 'Verify & Update'}
                                                </button>
                                            </>
                                        )}

                                        {otpError && (
                                            <p className={styles.errorMessage}>{otpError}</p>
                                        )}

                                        <p className={styles.note}>
                                            We'll send a verification code to your new {otpField === 'phone' ? 'phone number' : 'email'}
                                        </p>
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )}

                        <span style={{ zIndex: '654' }} className="thm-glow"></span>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProfileDashboard;