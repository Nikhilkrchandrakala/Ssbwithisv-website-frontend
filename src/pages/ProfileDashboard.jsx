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
    FaCheckCircle,
    FaLock
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

const moduleNames = {
    'full_course': '10 Days SSB Hackathon (Full Course)',
    'ssb_ppdt': 'Intro & PPDT (Stage 1 Process)',
    'psych': 'Psychology Test Preparation Program',
    'interview': 'Interview Theory Course and Mock Interview',
    'group_testing': <span>Group Testing Course on VTX<sup>TM</sup></span>
};

const getFileUrl = (path, activeSub) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (path.startsWith('db://')) {
        const psychBaseUrl = isLocal ? "http://localhost:5173" : "https://psych.ssbwithisv.in";
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        const subId = activeSub?._id || activeSub?.id || "";
        const idx = activeSub?.piqFiles ? activeSub.piqFiles.indexOf(path) : 0;
        const safeIdx = idx !== -1 ? idx : 0;
        return `${psychBaseUrl}/api/submissions/${subId}/piq-file/${safeIdx}?token=${token}`;
    }
    const mainBackendUrl = isLocal ? "http://localhost:5001" : "https://api.ssbwithisv.in";
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${mainBackendUrl}${cleanPath}`;
};

const getFileName = (path) => {
    if (!path) return '';
    return path.substring(path.lastIndexOf('/') + 1);
};

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
    const [hasCompletedTheory, setHasCompletedTheory] = useState(false);
    const [isRegisteringConsent, setIsRegisteringConsent] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    // Evaluation Journey tabbed UI states
    const [evalActiveStep, setEvalActiveStep] = useState(1);
    const [piqDownloaded, setPiqDownloaded] = useState(() => localStorage.getItem('evalPiqDownloaded') === 'true');
    const [dossierDownloaded, setDossierDownloaded] = useState(() => localStorage.getItem('evalDossierDownloaded') === 'true');
    const [uploadPiqType, setUploadPiqType] = useState('piq1');

    const { data: profileData, isLoading: isProfileLoading } = useUserProfileQuery();
    const { data: batchesData, isLoading: batchesLoading } = useUserCoursesQuery();
    const { data: magazines, isLoading: isMagazinesLoading } = useGetAllMagazineQuery();
    const [selectedTag, setSelectedTag] = useState("all");

    const [updateProfile] = useUpdateUserProfileMutation();

    // User data
    const [previewData, setPreviewData] = useState(profileData?.user);
    const [formData, setFormData] = useState({ ...previewData });
    const [tempFormData, setTempFormData] = useState({});

    const userProfile = previewData || profileData?.user;
    const userStages = (userProfile?.clinicalStage || "")
        .split(",")
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
    const hasFullOrPsych = userStages.includes("full_course") || userStages.includes("psych") || userStages.includes("psychology");
    const hasGTO = userStages.includes("group_testing") || userStages.includes("gto");
    const hasInterview = userStages.includes("interview");
    const isGTOOnly = hasGTO && !hasInterview && !hasFullOrPsych;
    const isIOOnly = hasInterview && !hasFullOrPsych;

    const filteredMagazines = isMagazinesLoading === false && magazines
        ? [...(selectedTag === "all"
            ? magazines
            : magazines.filter(item => item?.tags === selectedTag)
        )]
        .filter(mag => {
            const titleLower = mag?.pdfTitle?.toLowerCase() || '';
            if (isGTOOnly) {
                if (titleLower.includes('piq') || titleLower.includes('personal information') || titleLower.includes('dossier')) {
                    return false;
                }
            }
            if (isIOOnly) {
                if (titleLower.includes('dossier') || titleLower.includes('psychology')) {
                    return false;
                }
            }
            return true;
        })
        .sort((a, b) => new Date(b?.uploadDate) - new Date(a?.uploadDate))
        : [];

    const defaultCategories = ["Magazine", "Books", "SSBPrep"];
    const uniqueCategories = isMagazinesLoading === false && magazines
        ? Array.from(new Set([...defaultCategories, ...magazines.map(item => item?.tags).filter(Boolean)]))
        : defaultCategories;

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

    // Set active tab based on URL query parameter on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam) {
            setActiveTab(tabParam);
        }
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
            const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
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
            if (isIOOnly) {
                setEvalActiveStep(2);
            } else if (subs && subs.length > 0) {
                const latestSub = subs[0];
                const isCompleted = latestSub.status === 'COMPLETED' || latestSub.status === 'REVIEW_PENDING' || latestSub.status === 'TEST_COMPLETED' || latestSub.status === 'PENDING_UPLOAD' || latestSub.workflowStage === 'EVALUATION_COMPLETED';
                const hasDossier = latestSub.uploadedFiles && latestSub.uploadedFiles.length > 0;
                if (isCompleted) {
                    setEvalActiveStep(4);
                } else {
                    const hasPiq1 = latestSub.piq1Status === 'VERIFIED' || latestSub.piq1Status === 'PROCESSING' || (latestSub.piqFiles && latestSub.piqFiles.some(f => f.includes('piq1')));
                    const hasPiq2 = latestSub.piq2Status === 'VERIFIED' || latestSub.piq2Status === 'PROCESSING' || (latestSub.piqFiles && latestSub.piqFiles.some(f => f.includes('piq2')));
                    if (hasPiq1 && hasPiq2) {
                        setEvalActiveStep(3);
                    } else {
                        setEvalActiveStep(2);
                    }
                }
            } else {
                if (isIOOnly) {
                    setEvalActiveStep(2);
                } else {
                    setEvalActiveStep(1);
                }
            }
        } catch (e) {
            console.error("Failed to fetch psych submissions", e);
        } finally {
            setLoadingPsych(false);
        }
    };

    const handlePsychFileChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const maxLimit = 2 * 1024 * 1024; // 2 MB
            const oversized = files.filter(f => f.size > maxLimit);
            if (oversized.length > 0) {
                toast.error(`File size exceeds the 2 MB limit for: ${oversized.map(f => f.name).join(', ')}`);
                e.target.value = '';
                return;
            }
            setPsychUploadFiles(files);
        }
    };

    const handlePsychFileUpload = async (submissionId) => {
        if (psychUploadFiles.length === 0) {
            toast.error("Please select files to upload");
            return;
        }
        setIsPsychUploading(true);
        try {
            const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
            const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            const mainBackendUrl = isLocal ? "http://localhost:5001" : "https://api.ssbwithisv.in";
            const psychBackendUrl = isLocal ? "http://localhost:5173" : "https://psych.ssbwithisv.in";

            // Upload files one-by-one to main backend (bypassing Vercel's 4.5MB request limit)
            const fileUrls = [];
            for (const file of psychUploadFiles) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                
                const uploadRes = await axios.post(`${mainBackendUrl}/api/uploadBatteryImage`, uploadFormData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                if (uploadRes.data && uploadRes.data.url) {
                    fileUrls.push(uploadRes.data.url);
                } else {
                    throw new Error("Missing url in upload response");
                }
            }

            // Post the file URLs array as JSON to psych battery backend
            await axios.post(`${psychBackendUrl}/api/submissions/${submissionId}/upload`, { fileUrls }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            toast.success("Answers uploaded successfully!");
            setPsychUploadFiles([]);
            fetchPsychSubmissions();
        } catch (e) {
            console.error("Upload failed", e);
            toast.error("Failed to upload answers. Please try again with smaller or fewer files.");
        } finally {
            setIsPsychUploading(false);
        }
    };

    const handlePiqFileChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const maxLimit = 500 * 1024; // 500 KB
            const oversized = files.filter(f => f.size > maxLimit);
            if (oversized.length > 0) {
                toast.error(`File size exceeds the 500 KB limit for: ${oversized.map(f => f.name).join(', ')}`);
                e.target.value = '';
                return;
            }
            setPiqUploadFiles(files);
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
            
            const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
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

    const handleTimelinePiqUpload = async (files, piqType = 'piq1') => {
        setIsPiqUploading(true);
        try {
            const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
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
                    assessmentId
                    // Note: do NOT pass status here — let the server use its default (NOT_STARTED)
                    // so that we never accidentally overwrite an existing PENDING_UPLOAD or
                    // COMPLETED submission back to IN_PROGRESS
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
            formData.append('piqType', piqType);
            
            await axios.post(`${baseUrl}/api/submissions/${submissionId}/piq?piqType=${piqType}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success(`${isIOOnly ? 'PIQ 1' : (piqType === 'piq2' ? 'PIQ 2 (Final)' : 'PIQ 1 (Initial)')} Form uploaded successfully!`);
            fetchPsychSubmissions();
        } catch (e) {
            console.error("PIQ Upload failed", e);
            toast.error(e.response?.data?.message || "Failed to upload PIQ Form.");
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
            const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
            const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            const mainBackendUrl = isLocal ? "http://localhost:5001" : "https://api.ssbwithisv.in";
            const psychBackendUrl = isLocal ? "http://localhost:5173" : "https://psych.ssbwithisv.in";
            
            // Upload files one-by-one to main backend (bypassing Vercel's 4.5MB request limit)
            const fileUrls = [];
            for (const file of files) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', file);
                
                const uploadRes = await axios.post(`${mainBackendUrl}/api/uploadBatteryImage`, uploadFormData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                if (uploadRes.data && uploadRes.data.url) {
                    fileUrls.push(uploadRes.data.url);
                } else {
                    throw new Error("Missing url in upload response");
                }
            }
            
            // Post the file URLs array as JSON to psych battery backend
            await axios.post(`${psychBackendUrl}/api/submissions/${submissionId}/upload`, { fileUrls }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            toast.success("Dossier uploaded successfully!");
            fetchPsychSubmissions();
        } catch (e) {
            console.error("Dossier upload failed", e);
            toast.error("Failed to upload Dossier. Please try again with smaller or fewer files.");
        } finally {
            setIsPsychUploading(false);
        }
    };

    // Update preview data when profile data changes
    useEffect(() => {
        if (profileData?.user) {
            setPreviewData(profileData.user);
            setFormData(profileData.user);

            const userStagesList = profileData.user.clinicalStage ? profileData.user.clinicalStage.split(",").map(s => s.trim().toLowerCase()) : [];
            const hasFullOrPsychCheck = userStagesList.includes("full_course") || userStagesList.includes("psych") || userStagesList.includes("psychology");
            const hasInterviewCheck = userStagesList.includes("interview");
            if (hasInterviewCheck && !hasFullOrPsychCheck) {
                setEvalActiveStep(2);
            }
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
        sessionStorage.removeItem("authToken");
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
                                                                        <span>{Number(order.price || 0).toFixed(2)}</span>
                                                                    </div>
                                                                    <div className={styles.courseDate}>
                                                                        Purchased on {formatDate(order.createdAt)}
                                                                    </div>
                                                                </div>

                                                                {/* Dynamic Modules/Course Listing */}
                                                                <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                                                                    <span style={{ color: '#d2a100', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                                                                        Enrolled Courses / Modules:
                                                                    </span>
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                                        {order.selectedModules && order.selectedModules.length > 0 ? (
                                                                            order.selectedModules.map(modId => {
                                                                                const name = moduleNames[modId] || modId;
                                                                                return (
                                                                                    <span key={modId} style={{ background: 'rgba(210, 161, 0, 0.1)', color: '#d2a100', border: '1px solid rgba(210, 161, 0, 0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600' }}>
                                                                                        {name}
                                                                                    </span>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <span style={{ background: 'rgba(210, 161, 0, 0.1)', color: '#d2a100', border: '1px solid rgba(210, 161, 0, 0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '600' }}>
                                                                                {order.slotId?.isFullCourse ? '10 Days SSB Hackathon (Full Course)' : 'General Batch Access'}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Batch Timeline & Purchase Details */}
                                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '12px 15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' }}>
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                        <span style={{ color: '#d2a100', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '600' }}>Batch End Date</span>
                                                                        <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '500' }}>{order?.slotId?.endTime ? formatDate(order.slotId.endTime) : '—'}</span>
                                                                    </div>
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                        <span style={{ color: '#d2a100', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '600' }}>Booking Method</span>
                                                                        <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '500', textTransform: 'capitalize' }}>{order.bookingMethod || 'Standard Payment'}</span>
                                                                    </div>
                                                                </div>

                                                                <div className={styles.courseOrderInfo}>
                                                                    <span className={styles.orderIdLabel}>Order ID:</span>
                                                                    <span className={styles.orderIdValue}>{order.orderId || 'Manual booking/System created'}</span>
                                                                </div>

                                                                {order.paymentId && (
                                                                    <div className={styles.courseOrderInfo}>
                                                                        <span className={styles.orderIdLabel}>Payment ID:</span>
                                                                        <span className={styles.orderIdValue}>{order.paymentId}</span>
                                                                    </div>
                                                                )}

                                                                {order.couponCode && (
                                                                    <div className={styles.courseOrderInfo}>
                                                                        <span className={styles.orderIdLabel}>Coupon Used:</span>
                                                                        <span className={styles.orderIdValue}>{order.couponCode}</span>
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
                                                    {uniqueCategories.map(cat => {
                                                        let displayName = cat;
                                                        if (cat === "Magazine") displayName = "Current Affairs Magazine";
                                                        else if (cat === "Books") displayName = "Books";
                                                        else if (cat === "SSBPrep") displayName = "SSB Prep Material";
                                                        return (
                                                            <option key={cat} value={cat} style={{ color: '#000' }}>{displayName}</option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        </div>

                                        {isMagazinesLoading || isProfileLoading ? (
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
                                            {hasFullOrPsych && (
                                                <>
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
                                                </>
                                            )}

                                            {isGTOOnly && (
                                                <p className={styles.evalIntroText}>
                                                    Welcome to your Group Testing (GTO) Portal. Here you can access details of your enrolled Group Testing Course, view scheduled meetings, and check your assessor remarks.
                                                </p>
                                            )}

                                            {isIOOnly && (
                                                <p className={styles.evalIntroText}>
                                                    Welcome to your Mock Interview & Interview Prep Portal. Follow the steps below to download and upload your PIQ form, join your mock interview sessions, and view assessor feedback.
                                                </p>
                                            )}

                                            {/* Evaluation Journey — Tabbed Steps */}
                                            <div className={styles.psycheTimelineContainer}>
                                                <h4 className={styles.timelineHeader}>Evaluation Journey</h4>
                                                {(() => {
                                                    const activeSub = psychSubmissions && psychSubmissions.length > 0 ? psychSubmissions[0] : null;
                                                    const hasPiq1 = activeSub?.piq1Status === 'VERIFIED' || activeSub?.piq1Status === 'PROCESSING' || (activeSub?.piqFiles && activeSub.piqFiles.some(f => f.includes('piq1')));
                                                    const hasPiq2 = activeSub?.piq2Status === 'VERIFIED' || activeSub?.piq2Status === 'PROCESSING' || (activeSub?.piqFiles && activeSub.piqFiles.some(f => f.includes('piq2')));
                                                    const hasPiq = hasPiq1 && hasPiq2;
                                                    const piqStatus = activeSub?.piqStatus || 'PENDING';
                                                    const isTestCompleted = activeSub?.status === 'COMPLETED' || activeSub?.status === 'REVIEW_PENDING' || activeSub?.status === 'TEST_COMPLETED' || activeSub?.status === 'PENDING_UPLOAD' || activeSub?.workflowStage === 'EVALUATION_COMPLETED';
                                                    const hasDossier = activeSub?.uploadedFiles && activeSub.uploadedFiles.length > 0;
                                                    const piqReturned = piqStatus === 'RETURNED';
                                                    const piqApproved = piqStatus === 'APPROVED' || piqStatus === 'PARSED';
                                                    const hasBatch = userProfile?.batch && userProfile.batch.trim() !== "";
                                                    const hasAssessor = !!(userProfile?.assignedPsych || userProfile?.assignedGTO || userProfile?.assignedIO || userProfile?.assignedTO);
                                                    const allowedStagesForEval = ["full_course", "psych", "psychology", "interview", "gto", "group_testing"];
                                                    const hasEligibleCourse = userStages.some(stage => allowedStagesForEval.includes(stage));
                                                    const isEligibleToStart = !!(hasBatch && hasAssessor && hasEligibleCourse);

                                                    // Determine completion status of each step
                                                    const stepCompleted = {
                                                        1: piqDownloaded,
                                                        2: (hasInterview && !hasFullOrPsych) ? hasPiq1 : hasPiq,
                                                        3: isTestCompleted,
                                                        4: hasDossier
                                                    };

                                                    // Step 2 is LOCKED once PIQs are uploaded — user should never re-enter
                                                    const stepAccessible = {
                                                        1: isEligibleToStart,
                                                        2: isEligibleToStart,
                                                        3: isEligibleToStart && hasPiq1,
                                                        4: isEligibleToStart
                                                    };

                                                    // Auto-redirect: if PIQs are already done and user somehow lands on step 2, push them to step 3
                                                    

                                                    // Auto-redirect for IO-only candidate to ensure they are on step 2
                                                    if (isIOOnly && evalActiveStep !== 2) {
                                                        setTimeout(() => setEvalActiveStep(2), 0);
                                                    }

                                                    const evalSteps = [
                                                        { num: 1, label: 'PIQ Form' },
                                                        { num: 2, label: 'PIQ Upload' },
                                                        { num: 3, label: 'Evaluation' },
                                                        { num: 4, label: 'Dossier' }
                                                    ].filter(step => {
                                                        if (hasFullOrPsych) return true;
                                                        if (hasInterview) {
                                                            return step.num === 2;
                                                        }
                                                        return false; // GTO only gets no steps
                                                    });

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

                                                    if (!isEligibleToStart) {
                                                        return (
                                                            <div className={styles.evalLockedContainer}>
                                                                <div className={styles.evalLockedHeader}>
                                                                    <div className={styles.evalLockedIconWrapper}>
                                                                        <FaLock className={styles.evalLockedIcon} />
                                                                    </div>
                                                                    <h3>Evaluation Portal Locked</h3>
                                                                    <p>
                                                                        {isGTOOnly 
                                                                            ? "To access your scheduled GTO meetings and assessor reviews, you must have a batch and an assessor assigned to your profile."
                                                                            : isIOOnly 
                                                                                ? "To access your PIQ upload, scheduled Mock Interviews, and assessor reviews, you must have a batch and an assessor assigned to your profile."
                                                                                : "Your candidate evaluation space is currently restricted. To access your PIQ forms, timed psychological evaluations, and assessor reviews, you must have an eligible course, a batch, and an assessor assigned to your profile."
                                                                        }
                                                                    </p>
                                                                </div>
                                                                
                                                                <div className={styles.evalLockedStatusList}>
                                                                    <div className={`${styles.evalLockedStatusCard} ${hasEligibleCourse ? styles.statusSuccess : styles.statusPending}`}>
                                                                        <div className={styles.statusCardIcon}>
                                                                            {hasEligibleCourse ? <FaCheckCircle /> : <FaLock />}
                                                                        </div>
                                                                        <div className={styles.statusCardDetails}>
                                                                            <h4>Course Eligibility</h4>
                                                                            <p>
                                                                                {hasEligibleCourse 
                                                                                    ? `Eligible course assigned (${userProfile.clinicalStage.split(',').map(s => s.toUpperCase()).join(', ')})` 
                                                                                    : "Requires allocation of Full Course, Psych Course, Interview Course, or Group Testing Course"
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className={`${styles.evalLockedStatusCard} ${hasBatch ? styles.statusSuccess : styles.statusPending}`}>
                                                                        <div className={styles.statusCardIcon}>
                                                                            {hasBatch ? <FaCheckCircle /> : <FaLock />}
                                                                        </div>
                                                                        <div className={styles.statusCardDetails}>
                                                                            <h4>Batch Allocation</h4>
                                                                            <p>{hasBatch ? `Assigned to Batch #${userProfile.batch}` : "Pending batch allocation by administrator"}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className={`${styles.evalLockedStatusCard} ${hasAssessor ? styles.statusSuccess : styles.statusPending}`}>
                                                                        <div className={styles.statusCardIcon}>
                                                                            {hasAssessor ? <FaCheckCircle /> : <FaLock />}
                                                                        </div>
                                                                        <div className={styles.statusCardDetails}>
                                                                            <h4>Assessor Configuration</h4>
                                                                            <p>{hasAssessor ? "Assessors configured on your profile" : "Pending assessor allocation for test review"}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className={styles.evalLockedFooter}>
                                                                    <p>
                                                                        {isGTOOnly 
                                                                            ? "Once your profile is set up, this section will automatically unlock, allowing you to join your scheduled GTO meetings and access your remarks."
                                                                            : isIOOnly 
                                                                                ? "Once your profile is set up, this section will automatically unlock, allowing you to upload your PIQ form and join your scheduled Mock Interviews."
                                                                                : "Once your profile is set up, this section will automatically unlock, allowing you to download your PIQ forms and begin your evaluations."
                                                                        }
                                                                    </p>
                                                                    <span>For assistance, please contact SSB With ISV Support or your administrator.</span>
                                                                    {(isGTOOnly || isIOOnly) && (
                                                                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                                                            <button
                                                                                className={styles.stepActionButton}
                                                                                onClick={() => navigate('/batches')}
                                                                            >
                                                                                Browse More Courses
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <>
                                                            {/* Tab Bar */}
                                                            {evalSteps.length > 0 && (
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
                                                            )}

                                                            {/* Tab Content */}
                                                            <div className={styles.evalTabContent} key={evalActiveStep}>

                                                                {/* GTO Only Message */}
                                                                {hasGTO && !hasInterview && !hasFullOrPsych && (
                                                                    <div className={styles.evalStepCard}>
                                                                        <h5>Group Testing Course</h5>
                                                                        <p>The timed psychological test battery and PIQ forms are not required for your enrolled course (Group Testing Course on VTX<sup>TM</sup>).</p>
                                                                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '10px' }}>
                                                                            You can join your scheduled GTO meetings and access your assessor remarks under the **Final Assessment Remarks** section once they are released.
                                                                        </p>
                                                                        <div className={styles.evalStepActions} style={{ marginTop: '20px' }}>
                                                                            <button
                                                                                className={styles.stepActionButton}
                                                                                onClick={() => navigate('/batches')}
                                                                            >
                                                                                Browse More Courses
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Step 1: Download PIQ Form */}
                                                                {evalActiveStep === 1 && hasFullOrPsych && (
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
                                                                {evalActiveStep === 2 && (hasFullOrPsych || hasInterview) && (() => {
                                                                    const piq1Status = activeSub?.piq1Status || (activeSub?.piqFiles && activeSub.piqFiles.length > 0 ? 'VERIFIED' : 'PENDING');
                                                                    const piq2Status = activeSub?.piq2Status || 'PENDING';
                                                                    const isPiq1Uploaded = piq1Status === 'VERIFIED' || piq1Status === 'PROCESSING';
                                                                    const isPiq2Uploaded = piq2Status === 'VERIFIED' || piq2Status === 'PROCESSING';
                                                                    const isPiq1Verified = piq1Status === 'VERIFIED';
                                                                    const isPiq2Verified = piq2Status === 'VERIFIED';

                                                                    return (
                                                                        <div className={styles.evalStepCard}>
                                                                            <h5>{isIOOnly ? "PIQ Document Upload" : "PIQ Document Uploads"}</h5>
                                                                            {isIOOnly ? (
                                                                                <>
                                                                                    <div style={{ background: 'rgba(210, 161, 0, 0.05)', border: '1px solid rgba(210, 161, 0, 0.2)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                                                                                        <h6 style={{ color: '#d2a100', margin: '0 0 6px 0', fontSize: '0.95rem', fontWeight: 'bold' }}>About PIQ 1 (Initial Assessment PIQ):</h6>
                                                                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#ccc', lineHeight: '1.4' }}>
                                                                                            This form is crucial for your Mock Interview. It helps the Interviewing Officer (IO) understand your educational background, accomplishments, hobbies, and sports activities to formulate highly personalized questions.
                                                                                        </p>
                                                                                    </div>
                                                                                    <p>For your Mock Interview, you must upload your Initial Assessment PIQ (PIQ 1). <strong>(Max size: 500 KB per file)</strong></p>
                                                                                    <div className={styles.evalStepActions} style={{ marginBottom: '15px', marginTop: '10px' }}>
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
                                                                                            <BiDownload /> Download Blank PIQ Form
                                                                                        </a>
                                                                                        <button
                                                                                            className={styles.stepActionButton}
                                                                                            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', marginLeft: '12px' }}
                                                                                            onClick={() => navigate('/batches')}
                                                                                        >
                                                                                            Browse More Courses
                                                                                        </button>
                                                                                    </div>
                                                                                </>
                                                                            ) : hasFullOrPsych ? (
                                                                                <p>Each candidate must upload two PIQs: Initial Assessment (PIQ 1) and Final/Interview Preparation (PIQ 2). <strong>(Max size: 500 KB per file)</strong></p>
                                                                            ) : null}

                                                                            <input
                                                                                type="file"
                                                                                ref={timelinePiqInputRef}
                                                                                style={{ display: 'none' }}
                                                                                accept="image/*,application/pdf"
                                                                                multiple
                                                                                onChange={async (e) => {
                                                                                    if (e.target.files && e.target.files.length > 0) {
                                                                                        const files = Array.from(e.target.files);
                                                                                        const maxLimit = 500 * 1024; // 500 KB
                                                                                        const oversized = files.filter(f => f.size > maxLimit);
                                                                                        if (oversized.length > 0) {
                                                                                            toast.error(`File size exceeds the 500 KB limit for: ${oversized.map(f => f.name).join(', ')}`);
                                                                                            e.target.value = '';
                                                                                            return;
                                                                                        }
                                                                                        await handleTimelinePiqUpload(files, uploadPiqType);
                                                                                    }
                                                                                }}
                                                                            />

                                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '20px' }}>
                                                                                {/* PIQ 1 Slot */}
                                                                                <div style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                                                                                    <h6 style={{ color: '#d2a100', margin: '0 0 8px 0', fontSize: '1rem' }}>PIQ 1: Initial Assessment PIQ</h6>
                                                                                    <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '0 0 12px 0' }}>
                                                                                        {isIOOnly ? "Mandatory upload for personal interview preparation and review." : "Mandatory initial upload for Psychology and TO review."}
                                                                                    </p>
                                                                                    <div className={styles.evalStepActions}>
                                                                                        <button
                                                                                            className={styles.stepActionButton}
                                                                                            onClick={() => {
                                                                                                setUploadPiqType('piq1');
                                                                                                setTimeout(() => timelinePiqInputRef.current?.click(), 50);
                                                                                            }}
                                                                                            disabled={isPiqUploading || isPiq1Uploaded}
                                                                                        >
                                                                                            {isPiqUploading && uploadPiqType === 'piq1' ? "Uploading..." : (isPiq1Uploaded ? "PIQ 1 Uploaded" : "Upload PIQ 1")}
                                                                                        </button>
                                                                                    </div>
                                                                                    {isPiq1Uploaded && (
                                                                                        <div style={{ marginTop: '10px' }}>
                                                                                            <div className={styles.evalStepCompleted}>
                                                                                                <FaCheckCircle style={{ color: isPiq1Verified ? 'green' : 'orange' }} /> 
                                                                                                {isPiq1Verified ? "PIQ 1 Verified & Parsed" : "PIQ 1 Uploaded (Verification Pending)"}
                                                                                            </div>
                                                                                            {(() => {
                                                                                                const piq1Files = (activeSub?.piqFiles || []).filter(f => f.includes('/piq1_') || !f.includes('/piq2_'));
                                                                                                if (piq1Files.length === 0) return null;
                                                                                                return (
                                                                                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                                                        <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 'bold' }}>Uploaded PIQ 1:</span>
                                                                                                        {piq1Files.map((f, i) => (
                                                                                                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                                                                                <span style={{ fontSize: '0.8rem', color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                                                                                                                    {getFileName(f)}
                                                                                                                </span>
                                                                                                                <a href={getFileUrl(f, activeSub)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#d2a100', textDecoration: 'none', fontWeight: 'bold' }}>
                                                                                                                    View File
                                                                                                                </a>
                                                                                                            </div>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                );
                                                                                            })()}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                
                                                                                {/* PIQ 2 Slot */}
                                                                                {!isIOOnly && (
                                                                                    <div style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', opacity: isPiq1Verified ? 1 : 0.5 }}>
                                                                                        <h6 style={{ color: '#d2a100', margin: '0 0 8px 0', fontSize: '1rem' }}>PIQ 2: Final/Interview Preparation PIQ</h6>
                                                                                        <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '0 0 12px 0' }}>
                                                                                            Final preparation PIQ. Enabled only after PIQ 1 is verified.
                                                                                        </p>
                                                                                        <div className={styles.evalStepActions}>
                                                                                            <button
                                                                                                className={styles.stepActionButton}
                                                                                                onClick={() => {
                                                                                                    if (!isPiq1Verified) {
                                                                                                        toast.error("PIQ 2 can only be uploaded after PIQ 1 has been successfully uploaded and verified.");
                                                                                                        return;
                                                                                                    }
                                                                                                    setUploadPiqType('piq2');
                                                                                                    setTimeout(() => timelinePiqInputRef.current?.click(), 50);
                                                                                                }}
                                                                                                disabled={isPiqUploading || !isPiq1Verified || isPiq2Uploaded}
                                                                                            >
                                                                                                {isPiqUploading && uploadPiqType === 'piq2' ? "Uploading..." : (isPiq2Uploaded ? "PIQ 2 Uploaded" : "Upload PIQ 2")}
                                                                                            </button>
                                                                                        </div>
                                                                                        {isPiq2Uploaded && (
                                                                                            <div style={{ marginTop: '10px' }}>
                                                                                                <div className={styles.evalStepCompleted}>
                                                                                                    <FaCheckCircle style={{ color: isPiq2Verified ? 'green' : 'orange' }} />
                                                                                                    {isPiq2Verified ? "PIQ 2 Verified & Parsed" : "PIQ 2 Uploaded"}
                                                                                                </div>
                                                                                                {(() => {
                                                                                                    const piq2Files = (activeSub?.piqFiles || []).filter(f => f.includes('/piq2_'));
                                                                                                    if (piq2Files.length === 0) return null;
                                                                                                    return (
                                                                                                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                                                            <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 'bold' }}>Uploaded PIQ 2:</span>
                                                                                                            {piq2Files.map((f, i) => (
                                                                                                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                                                                                    <span style={{ fontSize: '0.8rem', color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                                                                                                                        {getFileName(f)}
                                                                                                                    </span>
                                                                                                                    <a href={getFileUrl(f, activeSub)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#d2a100', textDecoration: 'none', fontWeight: 'bold' }}>
                                                                                                                        View File
                                                                                                                    </a>
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    );
                                                                                                })()}
                                                                                            </div>
                                                                                        )}
                                                                                        {!isPiq1Verified && (
                                                                                            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#ea580c', fontStyle: 'italic' }}>
                                                                                                ⚠️ Locked until PIQ 1 verification is completed.
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })()}

                                                                {/* Step 3: Candidate Evaluation */}
                                                                {evalActiveStep === 3 && hasFullOrPsych && (
                                                                    <div className={styles.evalStepCard}>
                                                                        <h5>Candidate Evaluation</h5>
                                                                        <p>Download the blank Psychology Dossier sheet to write your answers during the evaluation. Then, start and complete your timed online psychological test.</p>
                                                                        
                                                                        <div className={styles.evalStepActions} style={{ marginBottom: '20px' }}>
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
                                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                                                                                    <div style={{ padding: '15px', background: 'rgba(210, 161, 0, 0.05)', border: '1px solid rgba(210, 161, 0, 0.2)', borderRadius: '12px', textAlign: 'left' }}>
                                                                                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', margin: 0 }}>
                                                                                            <input 
                                                                                                type="checkbox" 
                                                                                                checked={hasCompletedTheory} 
                                                                                                onChange={(e) => setHasCompletedTheory(e.target.checked)}
                                                                                                style={{ marginTop: '5px', cursor: 'pointer', width: '18px', height: '18px' }}
                                                                                            />
                                                                                            <span style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.5' }}>
                                                                                                <strong style={{ color: '#d2a100', display: 'block', marginBottom: '4px' }}>Psychology Test Attempt Confirmation:</strong> 
                                                                                                I confirm that I have completed the theory sessions of Psychology Tests and consent to start my official evaluation. I understand that my mock psych test attempt timestamp will be recorded and no retest request will be allowed.
                                                                                            </span>
                                                                                        </label>
                                                                                    </div>
                                                                                    <div>
                                                                                        <button
                                                                                            className={styles.stepActionButton}
                                                                                            onClick={async () => {
                                                                                                if (!isEligibleToStart) {
                                                                                                    toast.error("Please ensure you have a batch and an assessor assigned before starting.");
                                                                                                    return;
                                                                                                }
                                                                                                if (!hasCompletedTheory) {
                                                                                                    toast.error("Please confirm that you have completed the theory sessions first.");
                                                                                                    return;
                                                                                                }
                                                                                                
                                                                                                const confirmStart = window.confirm("Are you absolutely sure you want to start the Psychology Test Evaluation now? Once started, your attempt will be recorded and cannot be reset.");
                                                                                                if (!confirmStart) return;
                                                                                                
                                                                                                setIsRegisteringConsent(true);
                                                                                                try {
                                                                                                    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
                                                                                                    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
                                                                                                    const mainBackendUrl = isLocal ? "http://localhost:5001" : "https://api.ssbwithisv.in";
                                                                                                    const base = isLocal ? "http://localhost:5173" : "https://psych.ssbwithisv.in";
                                                                                                    
                                                                                                    // Register consent in main backend
                                                                                                    await axios.put(`${mainBackendUrl}/api/user/register-psych-consent`, {}, {
                                                                                                        headers: { Authorization: `Bearer ${token}` }
                                                                                                    });
                                                                                                    
                                                                                                    // Redirect to psych battery
                                                                                                    window.location.href = `${base}/auth-sync?token=${encodeURIComponent(token)}`;
                                                                                                } catch (err) {
                                                                                                    console.error("Failed to register consent:", err);
                                                                                                    toast.error(err?.response?.data?.message || "Failed to record your consent. Please try again.");
                                                                                                } finally {
                                                                                                    setIsRegisteringConsent(false);
                                                                                                }
                                                                                            }}
                                                                                            disabled={!isEligibleToStart || !hasCompletedTheory || isRegisteringConsent}
                                                                                            style={(!isEligibleToStart || !hasCompletedTheory || isRegisteringConsent) ? { opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#4b5563' } : {}}
                                                                                        >
                                                                                            {isRegisteringConsent ? "Starting..." : "Start Candidate Evaluation"}
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
 
                                                                {evalActiveStep === 4 && hasFullOrPsych && (
                                                                    <div className={styles.evalStepCard}>
                                                                        <h5>Dossier Management</h5>
                                                                        <p>Once the evaluation is completed, upload your handwritten dossier sheets here. <strong>(Max size: 2 MB per file)</strong></p>

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
                                                                                                    const maxLimit = 2 * 1024 * 1024; // 2 MB
                                                                                                    const oversized = files.filter(f => f.size > maxLimit);
                                                                                                    if (oversized.length > 0) {
                                                                                                        toast.error(`File size exceeds the 2 MB limit for: ${oversized.map(f => f.name).join(', ')}`);
                                                                                                        e.target.value = '';
                                                                                                        return;
                                                                                                    }
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
                                                    const hasAnyVisible = activeSub && (
                                                        activeSub.status === 'REPORT_RELEASED' ||
                                                        activeSub.reportVisibility?.psych ||
                                                        activeSub.reportVisibility?.gto ||
                                                        activeSub.reportVisibility?.io ||
                                                        activeSub.reportVisibility?.to
                                                    );
                                                    if (hasAnyVisible) {
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
                                                    ) : (psychSubmissions && psychSubmissions.length > 0 && !isGTOOnly) ? (
                                                <div className={styles.psychSubmissionsList}>
                                                    {!isIOOnly && <h4 style={{ color: '#fff', marginBottom: '15px' }}>Your Psych Tests</h4>}
                                                    {psychSubmissions.map(sub => {
                                                        const statusToShow = isIOOnly ? (sub.ioStatus || 'PENDING') : sub.status;
                                                        
                                                        return (
                                                            <div key={sub._id} style={{ 
                                                                background: 'rgba(255, 255, 255, 0.02)', 
                                                                backdropFilter: 'blur(10px)', 
                                                                padding: '24px', 
                                                                borderRadius: '16px', 
                                                                marginBottom: '20px', 
                                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' 
                                                            }}>
                                                                <h5 style={{ 
                                                                    color: '#fff', 
                                                                    fontSize: '1.25rem', 
                                                                    fontWeight: 'bold', 
                                                                    margin: '0', 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    flexWrap: 'wrap', 
                                                                    gap: '12px' 
                                                                }}>
                                                                    <span>{isIOOnly ? 'Mock Interview Status' : (sub.assessmentId?.title || 'Psychological Test Battery')}</span>
                                                                    <span style={{ 
                                                                        color: statusToShow === 'COMPLETED' ? '#22c55e' : '#f59e0b', 
                                                                        background: statusToShow === 'COMPLETED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                                        border: `1px solid ${statusToShow === 'COMPLETED' ? '#22c55e' : '#f59e0b'}`,
                                                                        borderRadius: '6px',
                                                                        padding: '3px 8px',
                                                                        fontSize: '0.78rem',
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.05em',
                                                                        fontWeight: 'bold'
                                                                    }}>
                                                                        {statusToShow}
                                                                    </span>
                                                                </h5>
                                                                
                                                                <div>
                                                                    {/* Render specialized meeting links */}
                                                                    {(() => {
                                                                        const meetings = [];
                                                                        if (sub.psychMeetingLink) meetings.push({ role: 'Psychologist', date: sub.psychMeetingDate, link: sub.psychMeetingLink });
                                                                        if (sub.ioMeetingLink) meetings.push({ role: 'Interviewing Officer', date: sub.ioMeetingDate, link: sub.ioMeetingLink });
                                                                        if (sub.toMeetingLink) meetings.push({ role: 'Technical Officer', date: sub.toMeetingDate, link: sub.toMeetingLink });
                                                                        if (meetings.length === 0 && sub.meetingLink) meetings.push({ role: 'Assessor', date: sub.meetingDate, link: sub.meetingLink });
 
                                                                            return meetings.map((m, idx) => (
                                                                                <div key={idx} style={{ 
                                                                                    marginTop: '20px', 
                                                                                    padding: '16px 20px', 
                                                                                    background: 'rgba(255, 255, 255, 0.03)', 
                                                                                    border: '1px solid rgba(255, 255, 255, 0.06)', 
                                                                                    borderRadius: '12px',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'space-between',
                                                                                    flexWrap: 'wrap',
                                                                                    gap: '15px'
                                                                                }}>
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                                                        <div style={{ 
                                                                                            background: 'rgba(59, 130, 246, 0.1)', 
                                                                                            color: '#3b82f6', 
                                                                                            borderRadius: '10px', 
                                                                                            width: '44px', 
                                                                                            height: '44px', 
                                                                                            display: 'flex', 
                                                                                            alignItems: 'center', 
                                                                                            justifyContent: 'center',
                                                                                            border: '1px solid rgba(59, 130, 246, 0.2)'
                                                                                        }}>
                                                                                            <BiCalendar style={{ fontSize: '1.4rem' }} />
                                                                                        </div>
                                                                                        <div>
                                                                                            <h6 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: '0.98rem', fontWeight: 'bold' }}>
                                                                                                {m.role === 'Interviewing Officer' ? 'Interviewing Officer Mock Interview' : `${m.role} Feedback Session`}
                                                                                            </h6>
                                                                                            {m.date ? (
                                                                                                <p style={{ color: '#aaa', margin: 0, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                                                    <BiTime style={{ color: '#3b82f6' }} /> Scheduled: {formatDate(m.date)} at {formatTime(m.date)}
                                                                                                </p>
                                                                                            ) : (
                                                                                                <p style={{ color: '#888', margin: 0, fontSize: '0.85rem', fontStyle: 'italic' }}>
                                                                                                    Meeting schedule pending
                                                                                                </p>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <a 
                                                                                            href={m.link} 
                                                                                            target="_blank" 
                                                                                            rel="noopener noreferrer" 
                                                                                            style={{ 
                                                                                                display: 'inline-flex', 
                                                                                                alignItems: 'center', 
                                                                                                gap: '8px', 
                                                                                                background: '#16a34a', 
                                                                                                color: '#fff', 
                                                                                                padding: '10px 22px', 
                                                                                                borderRadius: '10px', 
                                                                                                textDecoration: 'none', 
                                                                                                fontWeight: 'bold',
                                                                                                fontSize: '0.88rem',
                                                                                                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                                                                                                transition: 'all 0.2s ease',
                                                                                                cursor: 'pointer'
                                                                                            }}
                                                                                            onMouseOver={(e) => { e.currentTarget.style.background = '#15803d'; }}
                                                                                            onMouseOut={(e) => { e.currentTarget.style.background = '#16a34a'; }}
                                                                                        >
                                                                                            Join Meeting
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                            ));
                                                                        })()}
                                                                    </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (batchesData?.orders?.length > 0 || (profileData?.user?.clinicalStage && ["full_course", "psych", "psychology", "interview", "gto", "group_testing"].some(stage => profileData.user.clinicalStage.toLowerCase().includes(stage))) || profileData?.user?.isManuallyCreated) ? (
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
                            const psychRemarks = sub?.releasedPsychRemarks !== undefined ? sub.releasedPsychRemarks : (sub?.psychRemarks || sub?.assessorRemarks || '');
                            const gtoRemarks = sub?.releasedGtoRemarks !== undefined ? sub.releasedGtoRemarks : (sub?.gtoRemarks || '');
                            const ioRemarks = sub?.releasedIoRemarks !== undefined ? sub.releasedIoRemarks : (sub?.ioRemarks || '');
                            const toRemarks = sub?.releasedToRemarks !== undefined ? sub.releasedToRemarks : (sub?.toRemarks || '');

                            const hasPsych = profileData?.user?.assignedPsych && psychRemarks && (sub?.status === 'REPORT_RELEASED' || sub?.reportVisibility?.psych);
                            const hasGto = profileData?.user?.assignedGTO && gtoRemarks && (sub?.status === 'REPORT_RELEASED' || sub?.reportVisibility?.gto);
                            const hasIo = profileData?.user?.assignedIO && ioRemarks && (sub?.status === 'REPORT_RELEASED' || sub?.reportVisibility?.io);
                            const hasTo = profileData?.user?.assignedTO && toRemarks && (sub?.status === 'REPORT_RELEASED' || sub?.reportVisibility?.to);

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
                                            {(profileData?.user?.role === 'assessor' || profileData?.user?.role === 'admin' || profileData?.user?.role === 'franchise') && (
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
                                            )}

                                            {/* Remarks stack */}
                                            {(() => {
                                                let stepIndex = 1;
                                                return (
                                                    <>
                                                        {hasPsych && (
                                                            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
                                                                <h4 style={{ color: '#d2a100', fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 12px 0' }}>
                                                                    {stepIndex++}. Psychologist Observations & Timeline Analysis
                                                                </h4>
                                                                <p style={{ color: '#eee', margin: 0, fontSize: '0.92rem', fontStyle: 'italic', fontFamily: 'Georgia, serif', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                                                    "{psychRemarks}"
                                                                </p>
                                                            </div>
                                                        )}

                                                        {hasGto && (
                                                            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
                                                                <h4 style={{ color: '#3b82f6', fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 12px 0' }}>
                                                                    {stepIndex++}. GTO Group Dynamic & Outdoor Observations
                                                                </h4>
                                                                <p style={{ color: '#eee', margin: 0, fontSize: '0.92rem', fontStyle: 'italic', fontFamily: 'Georgia, serif', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                                                    "{gtoRemarks}"
                                                                </p>
                                                            </div>
                                                        )}

                                                        {hasIo && (
                                                            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
                                                                <h4 style={{ color: '#f59e0b', fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 12px 0' }}>
                                                                    {stepIndex++}. Personal Interview (IO) Observations
                                                                </h4>
                                                                <p style={{ color: '#eee', margin: 0, fontSize: '0.92rem', fontStyle: 'italic', fontFamily: 'Georgia, serif', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                                                    "{ioRemarks}"
                                                                </p>
                                                            </div>
                                                        )}

                                                        {hasTo && (
                                                            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
                                                                <h4 style={{ color: '#10b981', fontWeight: '900', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 12px 0' }}>
                                                                    {stepIndex++}. Technical Officer Observations
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
                                                    </>
                                                );
                                            })()}
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