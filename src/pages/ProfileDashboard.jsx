import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    BiUser,
    BiLogOut,
    BiSave,
    BiMap,
    BiPhone,
    BiEnvelope,
    BiChevronRight,
    BiX,
    BiEdit,
    BiArrowBack,
    BiBook,
    BiRupee,
    BiCalendar,
    BiTime,
    BiDollar,
    BiDownload,
    BiBrain
} from "react-icons/bi";
import {
    FaCamera,
    FaCheckCircle
} from "react-icons/fa";
import '../style/custom-theme.css';
import styles from "../style/ProfileDashboard.module.css";
import NavStyles from "../style/Navbar.module.css";
import {
    useUpdateUserProfileMutation,
    useUserProfileQuery,
    useUserCoursesQuery,
    useGetAllMagazineQuery
} from "../redux/api";
import toast from "react-hot-toast";
import ImageUploadPopup from "../components/ImageUploadPopup";
import axios from "axios";
import ReactDOM from 'react-dom';

const ProfileDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    const timelinePiqInputRef = useRef(null);
    const timelineDossierInputRef = useRef(null);
    const popupRef = useRef(null);

    // OTP Verification states
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otpField, setOtpField] = useState(null);
    const [oldValue, setOldValue] = useState('');
    const [newValue, setNewValue] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [reqId, setReqId] = useState('');
    const [otpError, setOtpError] = useState('');

    // Psyche Test states
    const [psychSubmissions, setPsychSubmissions] = useState([]);
    const [loadingPsych, setLoadingPsych] = useState(false);
    const [psychUploadFiles, setPsychUploadFiles] = useState([]);
    const [isPsychUploading, setIsPsychUploading] = useState(false);
    const [piqUploadFiles, setPiqUploadFiles] = useState([]);
    const [isPiqUploading, setIsPiqUploading] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    // Evaluation Journey tabbed UI states
    const [evalActiveStep, setEvalActiveStep] = useState(1);
    const [piqDownloaded, setPiqDownloaded] = useState(() => localStorage.getItem('evalPiqDownloaded') === 'true');
    const [dossierDownloaded, setDossierDownloaded] = useState(() => localStorage.getItem('evalDossierDownloaded') === 'true');

    const { data: profileData } = useUserProfileQuery();
    const { data: batchesData, isLoading: batchesLoading } = useUserCoursesQuery();
    const { data: magazines, isLoading: isMagazinesLoading } = useGetAllMagazineQuery();
    const [selectedTag, setSelectedTag] = useState("all");

    const filteredMagazines = isMagazinesLoading === false && magazines
        ? [...(selectedTag === "all"
            ? magazines
            : magazines.filter(item => item?.tags === selectedTag)
        )].sort((a, b) => new Date(b?.uploadDate) - new Date(a?.uploadDate))
        : [];

    const [updateProfile] = useUpdateUserProfileMutation();

    // User data
    const [previewData, setPreviewData] = useState(profileData?.user);
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

    // Fetch Psych Submissions
    useEffect(() => {
        if (activeTab === 'psycheTest') {
            fetchPsychSubmissions();
        }
    }, [activeTab]);

    const fetchPsychSubmissions = async () => {
        setLoadingPsych(true);
        try {
            const token = localStorage.getItem("authToken");
            const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
                ? "http://localhost:5173" 
                : "https://psych.ssbwithisv.in";
            const res = await axios.get(`${baseUrl}/api/submissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            let subs = res.data;
            if (profileData && profileData.user) {
                const myId = profileData.user.id || profileData.user._id;
                subs = subs.filter(s => {
                    const sUserId = s.userId?._id || s.userId?.id || s.userId;
                    return sUserId === myId;
                });
            }
            setPsychSubmissions(subs);
        } catch (e) {
            console.error("Failed to fetch psych submissions", e);
        } finally {
            setLoadingPsych(false);
        }
    };

    const handlePsychFileChange = (e) => {
        if (e.target.files) {
            setPsychUploadFiles(Array.from(e.target.files));
        }
    };

    const handlePsychFileUpload = async (submissionId) => {
        if (psychUploadFiles.length === 0) {
            toast.error("Please select files to upload");
            return;
        }
        setIsPsychUploading(true);
        try {
            const formData = new FormData();
            psychUploadFiles.forEach(file => {
                formData.append('files', file);
            });
            
            const token = localStorage.getItem("authToken");
            const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
                ? "http://localhost:5173" 
                : "https://psych.ssbwithisv.in";
                
            await axios.post(`${baseUrl}/api/submissions/${submissionId}/upload`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success("Answers uploaded successfully! Processing with OCR...");
            setPsychUploadFiles([]);
            fetchPsychSubmissions();
        } catch (e) {
            console.error("Upload failed", e);
            toast.error("Failed to upload answers.");
        } finally {
            setIsPsychUploading(false);
        }
    };

    const handlePiqFileChange = (e) => {
        if (e.target.files) {
            setPiqUploadFiles(Array.from(e.target.files));
        }
    };

    const handlePiqFileUpload = async (submissionId) => {
        if (piqUploadFiles.length === 0) {
            toast.error("Please select PIQ files to upload");
            return;
        }
        setIsPiqUploading(true);
        try {
            const formData = new FormData();
            piqUploadFiles.forEach(file => {
                formData.append('files', file);
            });
            
            const token = localStorage.getItem("authToken");
            const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
                ? "http://localhost:5173" 
                : "https://psych.ssbwithisv.in";
                
            await axios.post(`${baseUrl}/api/submissions/${submissionId}/piq`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success("PIQ Form uploaded successfully! Processing with Gemini OCR...");
            setPiqUploadFiles([]);
            fetchPsychSubmissions();
        } catch (e) {
            console.error("PIQ Upload failed", e);
            toast.error("Failed to upload PIQ Form.");
        } finally {
            setIsPiqUploading(false);
        }
    };

    const handleTimelinePiqUpload = async (files) => {
        setIsPiqUploading(true);
        try {
            const token = localStorage.getItem("authToken");
            const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
                ? "http://localhost:5173" 
                : "https://psych.ssbwithisv.in";
                
            const activeSub = psychSubmissions && psychSubmissions.length > 0 ? psychSubmissions[0] : null;
            let submissionId = activeSub?.id || activeSub?._id;
            
            if (submissionId === 'undefined' || (typeof submissionId === 'string' && submissionId.startsWith('pending-'))) {
                submissionId = null;
            }
            
            // 1. If no active submission, create a new one first
            if (!submissionId) {
                // Fetch active assessments to get the first one
                const assessmentsRes = await axios.get(`${baseUrl}/api/assessments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const assessments = assessmentsRes.data;
                const assessmentId = assessments && assessments.length > 0 ? (assessments[0].id || assessments[0]._id) : null;
                
                if (!assessmentId) {
                    toast.error("No active psychological assessments found.");
                    setIsPiqUploading(false);
                    return;
                }
                
                const subRes = await axios.post(`${baseUrl}/api/submissions`, { 
                    assessmentId,
                    status: 'IN_PROGRESS',
                    startedAt: new Date().toISOString()
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                submissionId = subRes.data.id || subRes.data._id;
            }
            
            // 2. Upload the PIQ files
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });
            
            await axios.post(`${baseUrl}/api/submissions/${submissionId}/piq`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success("PIQ Form uploaded successfully! Processing with Gemini OCR...");
            fetchPsychSubmissions();
        } catch (e) {
            console.error("PIQ Upload failed", e);
            toast.error("Failed to upload PIQ Form.");
        } finally {
            setIsPiqUploading(false);
        }
    };

    const handleTimelineDossierUpload = async (files) => {
        const activeSub = psychSubmissions && psychSubmissions.length > 0 ? psychSubmissions[0] : null;
        let submissionId = activeSub?.id || activeSub?._id;
        
        if (!submissionId || submissionId === 'undefined' || submissionId.startsWith('pending-')) {
            toast.error("No active session found to upload dossier.");
            return;
        }
        setIsPsychUploading(true);
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });
            
            const token = localStorage.getItem("authToken");
            const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
                ? "http://localhost:5173" 
                : "https://psych.ssbwithisv.in";
                
            await axios.post(`${baseUrl}/api/submissions/${submissionId}/upload`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success("Dossier uploaded successfully! Processing with OCR...");
            fetchPsychSubmissions();
        } catch (e) {
            console.error("Dossier upload failed", e);
            toast.error("Failed to upload Dossier.");
        } finally {
            setIsPsychUploading(false);
        }
    };

    // Update preview data when profile data changes
    useEffect(() => {
        if (profileData?.user) {
            setPreviewData(profileData.user);
            setFormData(profileData.user);
        }
    }, [profileData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPEG, JPG, PNG, GIF, WEBP)');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }

            setSelectedImage(file);

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

        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFieldClick = (field) => {
        if (field === 'phone' || field === 'email') {
            setTempFormData({ ...formData });
            setOtpField(field);
            setOldValue(previewData?.[field] || '');
            setNewValue('');
            setShowOtpPopup(true);
            setOtpSent(false);
            setOtp('');
            setReqId('');
            setOtpError('');
        }
    };

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
            } else {
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

            setOtpError("Failed to send OTP. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setOtpError('Please enter a valid 6-digit OTP');
            return;
        }

        setIsVerifying(true);
        setOtpError('');

        try {
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
            } else {
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

            setOtpError("OTP verification failed. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleCloseOtpPopup = () => {
        setShowOtpPopup(false);
        setOtpField(null);
        setOldValue('');
        setNewValue('');
        setOtp('');
        setOtpSent(false);
        setReqId('');
        setOtpError('');
        if (tempFormData[otpField]) {
            setFormData(prev => ({ ...prev, [otpField]: tempFormData[otpField] }));
        }
        setTempFormData({});
    };

    const handleSave = async () => {
        if (formData.phone !== previewData?.phone || formData.email !== previewData?.email) {
            toast.error('Please verify phone and email changes before saving');
            return;
        }

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

    const sidebarRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <>
            <section className={NavStyles.heroSection}>
                <div className={NavStyles.topBar}>
                    <div onClick={() => navigate(-1)} className="arrow_button_two">
                        <BiArrowBack />
                    </div>
                </div>

                <div className="">
                    <div className="container position-relative z-1">
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
                                </div>

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
                                        className={`${styles.navTab} ${activeTab === 'batches' ? styles.active : ''}`}
                                        onClick={() => {
                                            setActiveTab('batches');
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <BiBook />
                                        <span>My Batches</span>
                                        <BiChevronRight className={styles.chevron} />
                                    </button>
                                    <button
                                        className={`${styles.navTab} ${activeTab === 'downloads' ? styles.active : ''}`}
                                        onClick={() => {
                                            setActiveTab('downloads');
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <BiDownload />
                                        <span>My Downloads</span>
                                        <BiChevronRight className={styles.chevron} />
                                    </button>
                                    <button
                                        className={`${styles.navTab} ${activeTab === 'psycheTest' ? styles.active : ''}`}
                                        onClick={() => {
                                            setActiveTab('psycheTest');
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        <BiBrain />
                                        <span>Candidate Evaluation</span>
                                        <BiChevronRight className={styles.chevron} />
                                    </button>
                                </nav>

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
                                        </div>

                                        <div className={styles.profileContent}>
                                            {!isEditMode ? (
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

                                {/* Batches Tab */}
                                {activeTab === 'batches' && (
                                    <div className={styles.tabContent}>
                                        <div className={styles.tabHeader}>
                                            <h2>
                                                <BiBook className={styles.tabIcon} />
                                                My Purchased Batches
                                            </h2>
                                        </div>

                                        <div className={styles.coursesContent}>
                                            {batchesLoading ? (
                                                <div className={styles.loadingState}>
                                                    <div className={styles.spinner}></div>
                                                    <p>Loading your batches...</p>
                                                </div>
                                            ) : batchesData?.orders?.length > 0 ? (
                                                <div className={styles.coursesGrid}>
                                                    {batchesData.orders.map((order) => (
                                                        <div key={order._id} className={styles.courseCard}>
                                                            {/* <div className={styles.courseThumbnail}>
                                                                <img
                                                                    src={order.slotId?.thumbnail || '/assets/batch-placeholder.jpg'}
                                                                    alt={order.slotId?.title || 'Batch'}
                                                                    onError={(e) => {
                                                                        e.target.src = '/assets/batch-placeholder.jpg';
                                                                    }}
                                                                />
                                                                <div className={styles.courseStatus}>
                                                                    <FaCheckCircle />
                                                                    <span>{order.status === 'paid' ? 'Paid' : order.status}</span>
                                                                </div>
                                                            </div> */}
                                                            <div className={styles.courseDetails}>
                                                                <div className={styles.courseTitle}>
                                                                    <h3>
                                                                        Start: {formatDate(order?.slotId?.startTime)}
                                                                    </h3>
                                                                    <h3>{order.slotId?.title || 'Batch Session'} {order.slotId?.batchNo ? `(#${order.slotId.batchNo})` : ''}</h3>
                                                                </div>
                                                                <div className={styles.courseMeta}>
                                                                    <div className={styles.coursePrice}>
                                                                        <BiRupee />
                                                                        <span>{order.price}</span>
                                                                    </div>
                                                                    <div className={styles.courseDate}>
                                                                        Purchased on {formatDate(order.createdAt)}
                                                                    </div>
                                                                </div>

                                                                {/* Batch Schedule Information */}


                                                                {order?.orderId &&
                                                                    <div className={styles.courseOrderInfo}>
                                                                        <span className={styles.orderIdLabel}>Order ID:</span>
                                                                        <span className={styles.orderIdValue}>{order.orderId}</span>
                                                                    </div>
                                                                }

                                                                {order.paymentId && (
                                                                    <div className={styles.courseOrderInfo}>
                                                                        <span className={styles.orderIdLabel}>Payment ID:</span>
                                                                        <span className={styles.orderIdValue}>{order.paymentId}</span>
                                                                    </div>
                                                                )}

                                                                {order.referralCode && (
                                                                    <div className={styles.courseOrderInfo}>
                                                                        <span className={styles.orderIdLabel}>Referral Code:</span>
                                                                        <span className={styles.orderIdValue}>{order.referralCode}</span>
                                                                    </div>
                                                                )}

                                                                </div>
                                                            </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className={styles.emptyState}>
                                                    <BiBook className={styles.emptyIcon} />
                                                    <h3>No Batches Purchased Yet</h3>
                                                    <p>You haven't purchased any batches. Browse our batches and start learning today!</p>
                                                    <button
                                                        className={styles.browseCoursesBtn}
                                                        onClick={() => navigate('/batches')}
                                                    >
                                                        Browse Batches
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Downloads Tab */}
                                {activeTab === 'downloads' && (
                                    <div className={styles.tabContent}>
                                        <div className={styles.tabHeader} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h2>
                                                <BiDownload className={styles.tabIcon} />
                                                My Downloads
                                            </h2>
                                            <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
                                                <select
                                                    className="form-select w-100"
                                                    value={selectedTag}
                                                    onChange={(e) => setSelectedTag(e.target.value)}
                                                    style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', border: '1px solid rgba(210, 161, 0, 0.3)', borderRadius: '8px', padding: '10px' }}
                                                >
                                                    <option value="all" style={{ color: '#000' }}>All Resources</option>
                                                    <option value="Magazine" style={{ color: '#000' }}>Current Affairs Magazine</option>
                                                    <option value="Books" style={{ color: '#000' }}>Books</option>
                                                    <option value="SSBPrep" style={{ color: '#000' }}>SSB Prep Material</option>
                                                </select>
                                            </div>
                                        </div>

                                        {isMagazinesLoading ? (
                                            <div className={styles.loadingState}>
                                                <div className="spinner-border text-warning" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        ) : filteredMagazines && filteredMagazines.length > 0 ? (
                                            <div className={styles.downloadsGrid}>
                                                {filteredMagazines.map((mag) => (
                                                    <div key={mag._id} className={styles.downloadCard}>
                                                        <div className={styles.magImage}>
                                                            <img
                                                                src={mag.magazineFrontImage.startsWith('/assets') ? mag.magazineFrontImage : `https://api.ssbwithisv.in/${mag.magazineFrontImage}`}
                                                                alt={mag.pdfTitle}
                                                                onError={(e) => e.target.src = 'https://via.placeholder.com/150x200?text=No+Image'}
                                                            />
                                                        </div>
                                                        <div className={styles.magInfo}>
                                                            <h4>{mag.pdfTitle}</h4>
                                                            <p className={styles.magTags}>{mag.tags}</p>
                                                            <a
                                                                href={mag.pdfFilePath.startsWith('/assets') ? mag.pdfFilePath : `https://api.ssbwithisv.in/${mag.pdfFilePath}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.downloadLink}
                                                                download
                                                            >
                                                                <BiDownload /> Download PDF
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className={styles.emptyState}>
                                                <BiDownload className={styles.emptyIcon} />
                                                <p>No downloads available at the moment.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Psyche Test Tab */}
                                {activeTab === 'psycheTest' && (
                                    <div className={styles.tabContent}>
                                        <div className={styles.tabHeader}>
                                            <h2>
                                                <BiBrain className={styles.tabIcon} />
                                                Candidate Evaluation
                                            </h2>
                                        </div>

                                        <div className={styles.psycheTestPanel}>
                                            {/* Centered Intro Text */}
                                            <p className={styles.evalIntroText}>
                                                Comprehensive timed evaluation simulating real SSB conditions — including TAT, WAT, SRT and SDT modules. Follow the steps below to complete your evaluation journey.
                                            </p>

                                            {/* Feature Boxes — single row */}
                                            <div className={styles.evalFeatureRow}>
                                                <div className={styles.evalFeatureBox}>
                                                    <strong>Timed Automatic Slides</strong>
                                                    <p>Simulates real SSB test conditions with precise timing</p>
                                                </div>
                                                <div className={styles.evalFeatureBox}>
                                                    <strong>Handwritten Answer Upload</strong>
                                                    <p>Write your answers on paper and upload scanned copies</p>
                                                </div>
                                                <div className={styles.evalFeatureBox}>
                                                    <strong>Expert Assessor Review</strong>
                                                    <p>Personalized feedback from qualified psychologists</p>
                                                </div>
                                                <div className={styles.evalFeatureBox}>
                                                    <strong>Detailed Evaluation Report</strong>
                                                    <p>Comprehensive psychological profile & improvement areas</p>
                                                </div>
                                            </div>

                                            {/* Evaluation Journey — Tabbed Steps */}
                                            <div className={styles.psycheTimelineContainer}>
                                                <h4 className={styles.timelineHeader}>Evaluation Journey</h4>

                                                {(() => {
                                                    const activeSub = psychSubmissions && psychSubmissions.length > 0 ? psychSubmissions[0] : null;
                                                    const hasPiq = activeSub?.piqFiles && activeSub.piqFiles.length > 0;
                                                    const piqStatus = activeSub?.piqStatus || 'PENDING';
                                                    const isTestCompleted = activeSub?.status === 'COMPLETED' || activeSub?.status === 'REVIEW_PENDING' || activeSub?.status === 'TEST_COMPLETED' || activeSub?.status === 'PENDING_UPLOAD';
                                                    const hasDossier = activeSub?.uploadedFiles && activeSub.uploadedFiles.length > 0;
                                                    const piqReturned = piqStatus === 'RETURNED';
                                                    const piqApproved = piqStatus === 'APPROVED' || piqStatus === 'PARSED';

                                                    // Determine completion status of each step
                                                    const stepCompleted = {
                                                        1: piqDownloaded,
                                                        2: hasPiq,
                                                        3: isTestCompleted,
                                                        4: dossierDownloaded && hasDossier
                                                    };

                                                    // All steps are accessible at any time
                                                    const stepAccessible = {
                                                        1: true,
                                                        2: true,
                                                        3: true,
                                                        4: true
                                                    };

                                                    const evalSteps = [
                                                        { num: 1, label: 'PIQ Form' },
                                                        { num: 2, label: 'PIQ Upload' },
                                                        { num: 3, label: 'Evaluation' },
                                                        { num: 4, label: 'Dossier' }
                                                    ];

                                                    const piqDoc = magazines?.find(m =>
                                                        m?.pdfTitle?.toLowerCase().includes("personal information")
                                                    ) || magazines?.find(m =>
                                                        m?.pdfTitle?.toLowerCase().includes("piq")
                                                    );
                                                    const piqDownloadUrl = piqDoc
                                                        ? `https://api.ssbwithisv.in/${piqDoc.pdfFilePath}`
                                                        : "#";

                                                    const dossierDoc = magazines?.find(m =>
                                                        m?.pdfTitle?.toLowerCase().includes("psychology dossier") ||
                                                        m?.pdfTitle?.toLowerCase().includes("dossier")
                                                    );
                                                    const dossierDownloadUrl = dossierDoc
                                                        ? `https://api.ssbwithisv.in/${dossierDoc.pdfFilePath}`
                                                        : "#";

                                                    return (
                                                        <>
                                                            {/* Tab Bar */}
                                                            <div className={styles.evalTabBar}>
                                                                {evalSteps.map(step => {
                                                                    const isActive = evalActiveStep === step.num;
                                                                    const isCompleted = stepCompleted[step.num];
                                                                    const isDisabled = !stepAccessible[step.num] && !isCompleted;

                                                                    let tabClass = styles.evalTab;
                                                                    if (isActive) tabClass += ` ${styles.evalTabActive}`;
                                                                    if (isCompleted && !isActive) tabClass += ` ${styles.evalTabCompleted}`;
                                                                    if (isDisabled) tabClass += ` ${styles.evalTabDisabled}`;

                                                                    return (
                                                                        <button
                                                                            key={step.num}
                                                                            className={tabClass}
                                                                            onClick={() => !isDisabled && setEvalActiveStep(step.num)}
                                                                            disabled={isDisabled}
                                                                        >
                                                                            <span className={styles.evalTabNum}>
                                                                                {isCompleted ? <FaCheckCircle style={{ fontSize: '0.7rem' }} /> : step.num}
                                                                            </span>
                                                                            {step.label}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* Tab Content */}
                                                            <div className={styles.evalTabContent} key={evalActiveStep}>

                                                                {/* Step 1: Download PIQ Form */}
                                                                {evalActiveStep === 1 && (
                                                                    <div className={styles.evalStepCard}>
                                                                        <h5>Download PIQ Form</h5>
                                                                        <p>Download and print your empty Personal Information Questionnaire. Fill it out by hand and keep it ready for the next step.</p>
                                                                        <div className={styles.evalStepActions}>
                                                                            <a
                                                                                href={piqDownloadUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className={styles.stepDownloadLink}
                                                                                download="Blank_PIQ_Form.pdf"
                                                                                onClick={() => {
                                                                                    setPiqDownloaded(true);
                                                                                    localStorage.setItem('evalPiqDownloaded', 'true');
                                                                                }}
                                                                            >
                                                                                <BiDownload /> Download PIQ Form
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Step 2: PIQ Upload */}
                                                                {evalActiveStep === 2 && (
                                                                    <div className={styles.evalStepCard}>
                                                                        <h5>PIQ Upload</h5>
                                                                        <p>The IO will peruse the PIQ and if required the PIQ might need to be reuploaded. At which time it will replace your original PIQ Upload.</p>
                                                                        <div className={styles.evalStepActions}>
                                                                            <input
                                                                                type="file"
                                                                                ref={timelinePiqInputRef}
                                                                                style={{ display: 'none' }}
                                                                                accept="image/*,application/pdf"
                                                                                multiple
                                                                                onChange={async (e) => {
                                                                                    if (e.target.files && e.target.files.length > 0) {
                                                                                        const files = Array.from(e.target.files);
                                                                                        await handleTimelinePiqUpload(files);
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <button
                                                                                className={styles.stepActionButton}
                                                                                onClick={() => timelinePiqInputRef.current?.click()}
                                                                                disabled={isPiqUploading}
                                                                            >
                                                                                {isPiqUploading ? "Uploading..." : (hasPiq ? "REUPLOAD PIQ" : "Upload PIQ Form")}
                                                                            </button>
                                                                        </div>
                                                                        {hasPiq && (
                                                                            <div className={styles.evalStepCompleted} style={{ marginTop: '10px' }}>
                                                                                <FaCheckCircle /> PIQ uploaded successfully
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* Step 3: Candidate Evaluation */}
                                                                {evalActiveStep === 3 && (
                                                                    <div className={styles.evalStepCard}>
                                                                        <h5>Candidate Evaluation</h5>
                                                                        <p>Start and complete your timed online psychological test.</p>
                                                                        <div className={styles.evalStepActions}>
                                                                            {isTestCompleted ? (
                                                                                <button
                                                                                    className={styles.stepActionButton}
                                                                                    style={{ backgroundColor: 'green', cursor: 'not-allowed', opacity: 0.8 }}
                                                                                    disabled
                                                                                >
                                                                                    Evaluation Completed
                                                                                </button>
                                                                            ) : (
                                                                                <button
                                                                                    className={styles.stepActionButton}
                                                                                    onClick={() => {
                                                                                        const token = localStorage.getItem("authToken");
                                                                                        const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
                                                                                        const base = isLocal ? "http://localhost:5173" : "https://psychbattery.ssbwithisv.in";
                                                                                        window.location.href = `${base}/auth-sync?token=${encodeURIComponent(token)}`;
                                                                                    }}
                                                                                >
                                                                                    Start Candidate Evaluation
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Step 4: Dossier (Download + Upload) */}
                                                                {evalActiveStep === 4 && (
                                                                    <div className={styles.evalStepCard}>
                                                                        <h5>Dossier Management</h5>
                                                                        <p>Download the blank Psychology Dossier sheet to write your answers during the evaluation. Once the evaluation is completed, upload your handwritten dossier sheets here.</p>
                                                                        <div className={styles.evalStepActions}>
                                                                            <a
                                                                                href={dossierDownloadUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className={styles.stepDownloadLink}
                                                                                download="Blank_Sheet_Psychology.pdf"
                                                                                onClick={() => {
                                                                                    setDossierDownloaded(true);
                                                                                    localStorage.setItem('evalDossierDownloaded', 'true');
                                                                                }}
                                                                            >
                                                                                <BiDownload /> Download Psychology Dossier
                                                                            </a>
                                                                        </div>

                                                                        {isTestCompleted && (
                                                                            <div className={styles.evalStepActions} style={{ marginTop: '20px' }}>
                                                                                {!hasDossier && (
                                                                                    <>
                                                                                        <input
                                                                                            type="file"
                                                                                            ref={timelineDossierInputRef}
                                                                                            style={{ display: 'none' }}
                                                                                            accept="image/*,application/pdf"
                                                                                            multiple
                                                                                            onChange={async (e) => {
                                                                                                if (e.target.files && e.target.files.length > 0) {
                                                                                                    const files = Array.from(e.target.files);
                                                                                                    await handleTimelineDossierUpload(files);
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                        <button
                                                                                            className={styles.stepActionButton}
                                                                                            onClick={() => timelineDossierInputRef.current?.click()}
                                                                                            disabled={isPsychUploading}
                                                                                        >
                                                                                            {isPsychUploading ? "Uploading..." : "Upload Completed Dossier"}
                                                                                        </button>
                                                                                    </>
                                                                                )}
                                                                                {hasDossier && (
                                                                                    <div className={styles.evalStepCompleted}>
                                                                                        <FaCheckCircle /> Dossier uploaded successfully
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        {isTestCompleted && hasDossier && (
                                                                            <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                                                                <h6 style={{ color: '#d2a100', marginBottom: '8px', fontSize: '1.1rem' }}>Assessor Review Status</h6>
                                                                                <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '15px' }}>Your answers are queued for assessor evaluation. You will be notified once your evaluation report is ready.</p>
                                                                                <div className={styles.evalStepActions}>
                                                                                    {(activeSub?.status === 'REPORT_RELEASED') ? (
                                                                                        <div className={styles.evalStepCompleted}>
                                                                                            <FaCheckCircle /> Your evaluation report has been released
                                                                                        </div>
                                                                                    ) : (activeSub?.status === 'COMPLETED' || activeSub?.status === 'REVIEW_PENDING' || activeSub?.status === 'UNDER_REVIEW') ? (
                                                                                        <div className={styles.evalStepPending}>
                                                                                            ⏳ Your submission is being reviewed by the assessor team
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className={styles.evalStepPending}>
                                                                                            ⏳ Waiting for evaluation to complete
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    );
                                                })()}

                                                {/* Dynamic Broadcast Feedback Release Button */}
                                                {(() => {
                                                    const activeSub = psychSubmissions && psychSubmissions.length > 0 ? psychSubmissions[0] : null;
                                                    if (activeSub && activeSub.status === 'REPORT_RELEASED') {
                                                        return (
                                                            <div style={{ marginTop: '35px', textAlign: 'center' }}>
                                                                <button
                                                                    onClick={() => setShowFeedbackModal(true)}
                                                                    style={{
                                                                        background: 'linear-gradient(135deg, #d2a100 0%, #8c6a0f 100%)',
                                                                        color: '#000',
                                                                        border: 'none',
                                                                        padding: '16px 40px',
                                                                        borderRadius: '14px',
                                                                        fontWeight: '900',
                                                                        fontSize: '0.9rem',
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.2em',
                                                                        boxShadow: '0 8px 24px rgba(210, 161, 0, 0.25)',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        gap: '12px'
                                                                    }}
                                                                    className="hover-glow-effect"
                                                                >
                                                                    <BiBrain style={{ fontSize: '1.2rem' }} /> Final Assessment Remarks
                                                                </button>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>


                                            {loadingPsych ? (
                                                <div className={styles.loadingState}>
                                                    <div className="spinner-border text-warning" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            ) : psychSubmissions && psychSubmissions.length > 0 ? (
                                                <div className={styles.psychSubmissionsList}>
                                                    <h4 style={{ color: '#fff', marginBottom: '15px' }}>Your Psych Tests</h4>
                                                    {psychSubmissions.map(sub => (
                                                        <div key={sub._id} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(210, 161, 0, 0.2)' }}>
                                                            <h5 style={{ color: '#d2a100' }}>{sub.assessmentId?.title || 'Psychological Test Battery'}</h5>
                                                            <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '10px' }}>
                                                                Started: {sub.startedAt ? formatDate(sub.startedAt) + ' ' + formatTime(sub.startedAt) : 'N/A'}
                                                            </p>
                                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                                                                <span style={{ 
                                                                    padding: '4px 10px', 
                                                                    borderRadius: '20px', 
                                                                    fontSize: '0.8rem',
                                                                    background: sub.status === 'COMPLETED' || sub.status === 'REVIEW_PENDING' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                                                                    color: sub.status === 'COMPLETED' || sub.status === 'REVIEW_PENDING' ? '#28a745' : '#ffc107',
                                                                    border: `1px solid ${sub.status === 'COMPLETED' || sub.status === 'REVIEW_PENDING' ? '#28a745' : '#ffc107'}`
                                                                }}>
                                                                    Status: {sub.status}
                                                                </span>
                                                            </div>
                                                            
                                                            <div style={{ marginTop: '15px' }}>
                                                                {/* Render specialized meeting links */}
                                                                {(() => {
                                                                    const meetings = [];
                                                                    if (sub.psychMeetingLink && sub.psychMeetingDate) meetings.push({ role: 'Psychologist', date: sub.psychMeetingDate, link: sub.psychMeetingLink });
                                                                    if (sub.ioMeetingLink && sub.ioMeetingDate) meetings.push({ role: 'Interviewing Officer', date: sub.ioMeetingDate, link: sub.ioMeetingLink });
                                                                    if (sub.toMeetingLink && sub.toMeetingDate) meetings.push({ role: 'Technical Officer', date: sub.toMeetingDate, link: sub.toMeetingLink });
                                                                    if (meetings.length === 0 && sub.meetingLink && sub.meetingDate) meetings.push({ role: 'Assessor', date: sub.meetingDate, link: sub.meetingLink });

                                                                        return meetings.map((m, idx) => (
                                                                            <div key={idx} style={{ marginTop: '15px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                                                                <a href={m.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#15803D', color: '#fff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                                                                                    Join {m.role} Meeting
                                                                                </a>
                                                                                {m.date && <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Scheduled: {formatDate(m.date)}</span>}
                                                                            </div>
                                                                        ));
                                                                    })()}
                                                                </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : batchesData?.orders?.length > 0 ? (
                                                null
                                            ) : (
                                                <div className={styles.psycheLocked}>
                                                    <h4>Access Locked</h4>
                                                    <p>Purchase any SSB batch to unlock the Candidate Evaluation</p>
                                                    <button
                                                        className={styles.browseCoursesBtn}
                                                        onClick={() => navigate('/batches')}
                                                    >
                                                        Browse Batches
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Immersive Qualitative Assessor Feedback Modal */}
                        {showFeedbackModal && (() => {
                            const sub = psychSubmissions && psychSubmissions.length > 0 ? psychSubmissions[0] : null;
                            const psychRemarks = sub?.psychRemarks || sub?.assessorRemarks || '';
                            const gtoRemarks = sub?.gtoRemarks || '';
                            const ioRemarks = sub?.ioRemarks || '';
                            const toRemarks = sub?.toRemarks || '';

                            const hasPsych = profileData?.user?.assignedPsych && psychRemarks;
                            const hasGto = profileData?.user?.assignedGTO && gtoRemarks;
                            const hasIo = profileData?.user?.assignedIO && ioRemarks;
                            const hasTo = profileData?.user?.assignedTO && toRemarks;

                            return (
                                <div style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0, 0, 0, 0.85)',
                                    backdropFilter: 'blur(15px)',
                                    zIndex: 99999,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '20px',
                                    animation: 'fadeIn 0.3s ease'
                                }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #16181b 0%, #0d0f11 100%)',
                                        border: '1px solid rgba(210, 161, 0, 0.25)',
                                        borderRadius: '30px',
                                        maxWidth: '850px',
                                        width: '100%',
                                        maxHeight: '85vh',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(210, 161, 0, 0.1)',
                                        animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}>
                                        {/* Modal Header */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                            padding: '25px 35px'
                                        }}>
                                            <div>
                                                <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                                                    Final Assessor Feedback
                                                </h2>
                                                <span style={{ color: '#d2a100', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginTop: '4px' }}>
                                                    SSB Evaluation Portfolio
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setShowFeedbackModal(false)}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '12px',
                                                    color: '#aaa',
                                                    width: '40px',
                                                    height: '40px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                                            >
                                                <BiX style={{ fontSize: '1.5rem' }} />
                                            </button>
                                        </div>

                                        {/* Modal Body */}
                                        <div style={{
                                            padding: '35px',
                                            overflowY: 'auto',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '24px'
                                        }}>
                                            {/* Security Disclaimer Banner */}
                                            <div style={{
                                                background: 'rgba(210, 161, 0, 0.05)',
                                                border: '1px solid rgba(210, 161, 0, 0.15)',
                                                borderRadius: '16px',
                                                padding: '15px 20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px'
                                            }}>
                                                <BiBrain style={{ color: '#d2a100', fontSize: '1.4rem', shrink: 0 }} />
                                                <p style={{ color: '#ccc', fontSize: '0.78rem', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
                                                    Security mandate: Only qualitative written observations and revision guidelines are released. Numerical marks, score sheets, and trait sliders are kept strictly confidential.
                                                </p>
                                            </div>

                                            {/* Remarks stack */}
                                            {hasPsych && (
                                                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
                                                    <h4 style={{ color: '#d2a100', fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 12px 0' }}>
                                                        1. Psychologist Observations & Timeline Analysis
                                                    </h4>
                                                    <p style={{ color: '#eee', margin: 0, fontSize: '0.92rem', fontStyle: 'italic', fontFamily: 'Georgia, serif', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                                        "{psychRemarks}"
                                                    </p>
                                                </div>
                                            )}

                                            {hasGto && (
                                                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
                                                    <h4 style={{ color: '#3b82f6', fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 12px 0' }}>
                                                        2. GTO Group Dynamic & Outdoor Observations
                                                    </h4>
                                                    <p style={{ color: '#eee', margin: 0, fontSize: '0.92rem', fontStyle: 'italic', fontFamily: 'Georgia, serif', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                                        "{gtoRemarks}"
                                                    </p>
                                                </div>
                                            )}

                                            {hasIo && (
                                                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
                                                    <h4 style={{ color: '#f59e0b', fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 12px 0' }}>
                                                        3. Personal Interview (IO) Observations
                                                    </h4>
                                                    <p style={{ color: '#eee', margin: 0, fontSize: '0.92rem', fontStyle: 'italic', fontFamily: 'Georgia, serif', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                                        "{ioRemarks}"
                                                    </p>
                                                </div>
                                            )}

                                            {hasTo && (
                                                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
                                                    <h4 style={{ color: '#10b981', fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 12px 0' }}>
                                                        4. Technical Officer Observations
                                                    </h4>
                                                    <p style={{ color: '#eee', margin: 0, fontSize: '0.92rem', fontStyle: 'italic', fontFamily: 'Georgia, serif', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                                        "{toRemarks}"
                                                    </p>
                                                </div>
                                            )}

                                            {!hasPsych && !hasGto && !hasIo && !hasTo && (
                                                <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
                                                    <p style={{ color: '#ccc', fontStyle: 'italic', fontSize: '0.95rem' }}>No qualitative assessment comments have been released yet.</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Modal Footer */}
                                        <div style={{
                                            background: 'rgba(0, 0, 0, 0.25)',
                                            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                            padding: '25px 35px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '20px'
                                        }}>
                                            {sub?.psychMeetingLink && (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap' }}>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <span style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Psychologist Feedback Slot:</span>
                                                        <p style={{ color: '#fff', margin: '2px 0 0 0', fontSize: '0.88rem', fontWeight: 'bold' }}>
                                                            {sub.psychMeetingDate ? formatDate(sub.psychMeetingDate) + ' at ' + formatTime(sub.psychMeetingDate) : 'Time Pending'}
                                                        </p>
                                                    </div>
                                                    <a href={sub.psychMeetingLink} target="_blank" rel="noopener noreferrer" style={{ background: '#15803D', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: '0 6px 15px rgba(21, 128, 61, 0.2)', transition: 'all 0.2s ease', display: 'inline-block' }}>Join Meet Session</a>
                                                </div>
                                            )}
                                            {sub?.toMeetingLink && (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap' }}>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <span style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TO Feedback Slot:</span>
                                                        <p style={{ color: '#fff', margin: '2px 0 0 0', fontSize: '0.88rem', fontWeight: 'bold' }}>
                                                            {sub.toMeetingDate ? formatDate(sub.toMeetingDate) + ' at ' + formatTime(sub.toMeetingDate) : 'Time Pending'}
                                                        </p>
                                                    </div>
                                                    <a href={sub.toMeetingLink} target="_blank" rel="noopener noreferrer" style={{ background: '#15803D', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: '0 6px 15px rgba(21, 128, 61, 0.2)', transition: 'all 0.2s ease', display: 'inline-block' }}>Join Meet Session</a>
                                                </div>
                                            )}
                                            {sub?.ioMeetingLink && (
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap' }}>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <span style={{ color: '#aaa', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>IO Feedback Slot:</span>
                                                        <p style={{ color: '#fff', margin: '2px 0 0 0', fontSize: '0.88rem', fontWeight: 'bold' }}>
                                                            {sub.ioMeetingDate ? formatDate(sub.ioMeetingDate) + ' at ' + formatTime(sub.ioMeetingDate) : 'Time Pending'}
                                                        </p>
                                                    </div>
                                                    <a href={sub.ioMeetingLink} target="_blank" rel="noopener noreferrer" style={{ background: '#15803D', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: '0 6px 15px rgba(21, 128, 61, 0.2)', transition: 'all 0.2s ease', display: 'inline-block' }}>Join Meet Session</a>
                                                </div>
                                            )}
                                            {!sub?.psychMeetingLink && !sub?.toMeetingLink && !sub?.ioMeetingLink && (
                                                <div style={{ textAlign: 'center', opacity: 0.5, padding: '10px 0' }}>
                                                    <span style={{ color: '#aaa', fontSize: '0.85rem', fontStyle: 'italic' }}>No meeting slots scheduled yet.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

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

                        {/* OTP Verification Popup */}
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

                                        <div className={styles.valueDisplay}>
                                            <span className={styles.label}>Current {otpField === 'phone' ? 'Phone' : 'Email'}</span>
                                            <span className={styles.value}>{oldValue}</span>
                                        </div>

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