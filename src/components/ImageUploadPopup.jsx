
import React, { useRef } from "react";
import { BiX } from "react-icons/bi";
import { FaCamera } from "react-icons/fa";
import styles from "../style/ProfileDashboard.module.css";


const ImageUploadPopup = ({
    isOpen,
    onClose,
    onSave,
    previewImage,
    existingImage,
    selectedImage,
    onImageChange,
    onImageClick,
    isUploading
}) => {

    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
                <div className={styles.popupHeader}>
                    <h3>Change Profile Photo</h3>
                    <button className={styles.closePopupBtn} onClick={onClose}>
                        <BiX />
                    </button>
                </div>

                <div className={styles.popupBody}>

                    {/* Image Preview */}
                    <div className={styles.currentImageContainer}>
                        <img
                            src={previewImage || existingImage || "/default-avatar.png"}
                            alt="Profile Preview"
                            className={styles.previewImage}
                        />
                    </div>

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={onImageChange}
                        accept="image/*"
                        style={{ display: "none" }}
                    />

                    {/* Select Image */}
                    {!selectedImage && (
                        <div className={styles.imageSelectionArea}>
                            <button
                                className={styles.selectImageBtn}
                                onClick={() => fileInputRef.current.click()}
                            >
                                <FaCamera />
                                Select Image
                            </button>
                            <p className={styles.imageHint}>
                                Supported formats: JPG, PNG, GIF, WEBP (Max 5MB)
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {selectedImage && (
                        <div className={styles.popupActions}>
                            <button
                                className={styles.cancelPopupBtn}
                                onClick={onClose}
                                disabled={isUploading}
                            >
                                Cancel
                            </button>

                            <button
                                className={styles.savePopupBtn}
                                onClick={onSave}
                                disabled={isUploading}
                            >
                                {isUploading ? "Uploading..." : "Save Photo"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUploadPopup;