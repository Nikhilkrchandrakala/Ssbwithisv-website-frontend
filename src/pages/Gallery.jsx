import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import CustomHeader from "../components/CustomHeader";
import Footer from "./Footer";
import From from "./From";
import { useGetGalleryQuery } from "../redux/api";

function Gallery() {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { data } = useGetGalleryQuery();

    // ✅ normalize data (important)
    const images = data?.images || data || [];

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = "auto";
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxOpen, images.length]);

    const headerData = {
        heading: "Our Gallery - Moments of Excellence",
        text: "Explore our journey through images capturing training sessions, successful candidates, and memorable moments.",
        banner: "/assets/website/gallery_banner.webp",
    };

    return (
        <>
            <Helmet>
                <title>Gallery - SSB Training Moments</title>
            </Helmet>

            <CustomHeader {...headerData} />

            <section className="container sectionspace60">

                {/* ✅ Image Grid */}
                <div className="gallery-grid">
                    {images.map((image, index) => (
                        <div
                            key={image._id || index}
                            className="gallery-item"
                            onClick={() => openLightbox(index)}
                        >
                            <div className="gallery-image-wrapper">
                                <img
                                    src={image.imageUrl}
                                    alt="gallery"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ✅ Empty State */}
                {images.length === 0 && (
                    <div className="gallery-empty">
                        <p>No images found.</p>
                    </div>
                )}
            </section>

            {/* ✅ Lightbox */}
            {lightboxOpen && (
                <div className="lightbox-modal" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>×</button>

                    <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                        ◀
                    </button>

                    <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                        ▶
                    </button>

                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[currentImageIndex]?.imageUrl}
                            alt="preview"
                        />

                        <div className="lightbox-counter">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}

            <From />
            <Footer />
        </>
    );
}

export default Gallery;