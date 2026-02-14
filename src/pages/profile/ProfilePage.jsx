import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiArrowBack, BiEdit, BiSave } from "react-icons/bi";
import { FaEye, FaCamera } from "react-icons/fa";
import CustomButton from "../../components/CustomButton";
import '../../style/custom-theme.css';
import styles from "../../style/ProfilePage.module.css";

const MyProfile = () => {
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);

    // Only 4 fields as requested
    const [previewData, setPreviewData] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        address: "123 Gold Street, Apt 4B, York, 1001, USA",
        avatar: "/assets/profile_image.png"
    });

    const [formData, setFormData] = useState({ ...previewData });

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

    // const navigate = useNavigate()

    return (
        <div className="thm-content-layer">
            <div className="thm-content-bg"></div>
            <div onClick={() => navigate(-1)} className='arrow_button'>
                <BiArrowBack />
            </div>

            <div className="container position-relative">
                <h1 className="thm-big-title">
                    {isEditMode ? 'Edit Profile' : 'My Profile'}
                </h1>

                {/* Mode Toggle Buttons */}
                {/* <div className={styles.modeToggle}>
                    <button
                        className={`${styles.toggleBtn} ${!isEditMode ? styles.active : ''}`}
                        onClick={() => setIsEditMode(false)}
                    >
                        <FaEye /> Preview
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${isEditMode ? styles.active : ''}`}
                        onClick={() => setIsEditMode(true)}
                    >
                        <BiEdit /> Edit
                    </button>
                </div> */}

                <div className="position-relative" style={{ zIndex: '55555' }}>
                    <div className="row col-xl-7 g-4 g-md-2 col-lg-9 mx-auto justify-content-center">

                        {/* Profile Image */}
                        <div className={styles.profileImageWrapper}>
                            <div className="profile_image">
                                <img src={formData.avatar} alt="profile" />
                            </div>
                            {isEditMode && (
                                <button className={styles.changePhotoBtn}>
                                    <FaCamera />
                                </button>
                            )}
                        </div>

                        {/* ============ PREVIEW MODE ============ */}
                        {!isEditMode ? (
                            <>
                                {/* Name - Field 1 */}
                                <div className="col-lg-12">
                                    <div className={styles.previewItem}>
                                        <label>Full Name</label>
                                        <div className={styles.previewValue}>
                                            {previewData.name}
                                        </div>
                                    </div>
                                </div>

                                {/* Email - Field 2 */}
                                <div className="col-lg-12">
                                    <div className={styles.previewItem}>
                                        <label>Email Address</label>
                                        <div className={styles.previewValue}>
                                            {previewData.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Number - Field 3 */}
                                <div className="col-lg-12">
                                    <div className={styles.previewItem}>
                                        <label>Contact Number</label>
                                        <div className={styles.previewValue}>
                                            {previewData.phone}
                                        </div>
                                    </div>
                                </div>

                                {/* Address - Field 4 */}
                                <div className="col-lg-12">
                                    <div className={styles.previewItem}>
                                        <label>Address</label>
                                        <div className={styles.previewValue}>
                                            {previewData.address}
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Profile Button */}
                                <div className="col-12 d-flex justify-content-center mt-5">
                                    <CustomButton
                                        text={"EDIT PROFILE"}
                                        onClick={() => setIsEditMode(true)}
                                        icon={<BiEdit />}
                                    />
                                </div>

                                <div className={styles.CustomBtnOfHistory}>
                                    <CustomButton text={"Order History"} onClick={() => navigate('/OrderHistory')} />
                                    <CustomButton text={"Payment History"} onClick={() => navigate('/PaymentHistory')} />

                                </div>
                            </>
                        ) : (
                            /* ============ EDIT MODE ============ */
                            <>
                                {/* Name - Field 1 */}
                                <div className="col-lg-12">
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control thm-input"
                                        placeholder="Your Full Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* Email - Field 2 */}
                                <div className="col-lg-12">
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control thm-input"
                                        placeholder="Your Email Address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* Contact Number - Field 3 */}
                                <div className="col-lg-12">
                                    <input
                                        type="text"
                                        name="phone"
                                        className="form-control thm-input"
                                        placeholder="Your Contact Number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        maxLength={10}
                                        required
                                    />
                                </div>

                                {/* Address - Field 4 */}
                                <div className="col-lg-12">
                                    <textarea
                                        name="address"
                                        className="form-control thm-input"
                                        placeholder="Your Complete Address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        required
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="col-12 d-flex justify-content-center gap-3 mt-5">
                                    <CustomButton
                                        text={"CANCEL"}
                                        onClick={handleCancel}
                                    />
                                    <CustomButton
                                        text={"SAVE CHANGES"}
                                        onClick={handleSave}
                                        icon={<BiSave />}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <span style={{ zIndex: '654' }} className="thm-glow"></span>
            </div>
        </div>
    );
};

export default MyProfile;