import React, { useEffect, useState, useCallback, useRef } from 'react'
import CustomHeader from '../components/CustomHeader'
import From from './From'
import MagazineGateForm from './MagazineGateForm'
import Footer from './Footer'
import CustomButton from '../components/CustomButton'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useGetAllMagazineQuery, useTrackDownloadMutation, useUserProfileQuery } from '../redux/api'
import { RxCross1 } from "react-icons/rx";
import { BiX, BiEdit, BiFullscreen } from "react-icons/bi";
import PdfViewer from '../components/PdfViewer'


function Magnize() {

    const data =
    {
        heading: 'Roger That - Our monthly magazine',
        text: 'Our monthly magazine Roger That is your go- to resource for in-depth insights, real - world perspectives, and expert analysis tailored to the Services Selection Board (SSB) process. Curated with a strong focus on current affairs, the magazine features probable Group Discussion and Lecturette topics, helping aspirants stay informed, articulate, and assessment - ready',
        // textTwo: ` We’re not just an academy, we’re a close-knit mentoring community. At CSJSA, every aspirant is personally guided by Lt Cdr Nikhil, whose Xperienceassessing over 12,500 SSB candidates shapes our focused,
        //                         psychology-driven approach to SSB preparation. Our goal is simple yet powerful: to help every deserving young aspirant realise the dream of becoming a commissioned officer in the Indian Armed Forces.`

        textTwo: "",

        banner: '/assets/website/rogerthat_banner.webp'

    }


    const [selectedTag, setSelectedTag] = useState("all");
    const [showFormGate, setShowFormGate] = useState(false);   // Zoho form modal
    const [pendingDownload, setPendingDownload] = useState(null); // Item to download after form fills
    const [viewingPdf, setViewingPdf] = useState(null); // { url, title }
    const [showNotes, setShowNotes] = useState(false);
    const [noteText, setNoteText] = useState("");

    useEffect(() => {
        if (viewingPdf && viewingPdf.id) {
            const savedNote = localStorage.getItem(`resource_note_${viewingPdf.id}`) || "";
            setNoteText(savedNote);
        } else {
            setNoteText("");
        }
    }, [viewingPdf]);

    const modalContainerRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement || !!document.webkitFullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = () => {
        if (!modalContainerRef.current) return;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            const req = modalContainerRef.current.requestFullscreen || modalContainerRef.current.webkitRequestFullscreen;
            if (req) {
                req.call(modalContainerRef.current).catch(err => {
                    console.error("Fullscreen request failed", err);
                });
            }
        } else {
            const exit = document.exitFullscreen || document.webkitExitFullscreen;
            if (exit) {
                exit.call(document);
            }
        }
    };


    const { data: allMagazineData = [], isSuccess } = useGetAllMagazineQuery();
    const [trackDownload] = useTrackDownloadMutation();

    // ─── Fetch profile & sync zohoFormFilled status dynamically ───
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const { data: profileData } = useUserProfileQuery(undefined, { skip: !token });

    useEffect(() => {
        if (profileData?.user) {
            const filled = !!profileData.user.zohoFormFilled;
            localStorage.setItem('zohoFormFilled', String(filled));
        }
    }, [profileData]);


    const filteredMagazines = isSuccess
        ? [...(selectedTag === "all"
            ? allMagazineData
            : allMagazineData.filter(item => item?.tags === selectedTag)
        )].sort((a, b) => new Date(b?.uploadDate) - new Date(a?.uploadDate))
        : [];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTag]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMagazines = filteredMagazines.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMagazines.length / itemsPerPage);

    const defaultCategories = ["Magazine", "Books", "SSBPrep"];
    const uniqueCategories = isSuccess
        ? Array.from(new Set([...defaultCategories, ...allMagazineData.map(item => item?.tags).filter(Boolean)]))
        : defaultCategories;





    // useEffect(() => {
    //     const loadMagazines = async () => {
    //         try {
    //             const data = await allMagazineData;
    //             console.log(data)
    //             setMagazines(data || []); // depending on API structure
    //         } catch (error) {
    //             console.log("Failed to load magazines");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     loadMagazines();
    // }, []);

    // console.log(magazines)

    // import axios from "generics";

    const navigate = useNavigate()


    // ─── Check if user has already filled the Zoho form ───
    const isZohoFormFilled = () => {
        return localStorage.getItem('zohoFormFilled') === 'true';
    };

    // ─── View PDF ───
    const viewPdf = useCallback(async (pdfPath, item) => {
        if (!token) {
            navigate('/SignIn');
            return;
        }

        let url = pdfPath.startsWith('/assets') ? pdfPath : `http://localhost:5001/${pdfPath}`;
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                if (!response.ok) {
                    url = `https://api.ssbwithisv.in/${pdfPath}`;
                }
            } catch (err) {
                url = `https://api.ssbwithisv.in/${pdfPath}`;
            }
        } else {
            url = pdfPath.startsWith('/assets') ? pdfPath : `https://api.ssbwithisv.in/${pdfPath}`;
        }

        setViewingPdf({ id: item?._id || pdfPath, url, title: item?.pdfTitle || "Resource" });

        if (item?._id) {
            trackDownload({ magazineId: item._id }).catch(() => {});
        }
    }, [token, navigate, trackDownload]);

    const downloadNotes = (title, text) => {
        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${title.replace(/\s+/g, "_")}_Notes.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // Listen for zohoFormFilled event so the gate closes & download fires without a reload
    useEffect(() => {
        const checkAndDownload = () => {
            if (pendingDownload && isZohoFormFilled()) {
                const { pdfPath, item } = pendingDownload;
                setPendingDownload(null);
                setShowFormGate(false);
                viewPdf(pdfPath, item);
            }
        };
        const interval = setInterval(checkAndDownload, 800);
        return () => clearInterval(interval);
    }, [pendingDownload, viewPdf]);

    // const filteredMagazines =
    //     selectedTag === "all"
    //         ? magazines
    //         : magazines.filter((item) => item.tags === selectedTag);





    return (
        <>
            {/* ─── Zoho Form Gate Modal ─── */}
            {showFormGate && (
                <div
                    className="mgf-overlay"
                    style={{
                        position: 'fixed', inset: 0, zIndex: 99999,
                        background: 'rgba(0,0,0,0.85)',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px',
                        overflowY: 'auto',
                        animation: 'mgf-overlayIn 0.25s ease',
                    }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowFormGate(false); }}
                >
                    <style>{`
                        @keyframes mgf-overlayIn { from { opacity:0 } to { opacity:1 } }
                        @keyframes mgf-slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
                    `}</style>
                    <div style={{
                        background: 'linear-gradient(160deg, #18181f 0%, #1e1c16 100%)',
                        borderRadius: '20px',
                        maxWidth: '680px',
                        width: '100%',
                        maxHeight: '92vh',
                        overflowY: 'auto',
                        position: 'relative',
                        border: '1px solid rgba(244,196,48,0.25)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
                        animation: 'mgf-slideUp 0.3s ease',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(244,196,48,0.3) transparent',
                    }}>
                        {/* Header bar */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '22px 28px 18px',
                            borderBottom: '1px solid rgba(255,255,255,0.07)',
                            background: 'rgba(244,196,48,0.04)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: 'rgba(244,196,48,0.15)',
                                    border: '1px solid rgba(244,196,48,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '20px',
                                }}>📥</div>
                                <div>
                                    <p style={{ color: '#f4c430', fontSize: '17px', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                                        One quick step before your download
                                    </p>
                                    <p style={{ color: '#6a6660', fontSize: '12px', margin: '3px 0 0', lineHeight: 1 }}>
                                        Your download starts automatically after submission
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowFormGate(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#8a8680', fontSize: '16px', cursor: 'pointer',
                                    width: '34px', height: '34px', borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0, transition: 'background 0.2s, color 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.12)'; e.currentTarget.style.color='#f4c430'; }}
                                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#8a8680'; }}
                                aria-label="Close"
                            >
                                <RxCross1 />
                            </button>
                        </div>

                        {/* The new magazine-specific Zoho form */}
                        <MagazineGateForm
                            onSuccess={() => {
                                setShowFormGate(false);
                                if (pendingDownload) {
                                    const { pdfPath, item } = pendingDownload;
                                    setPendingDownload(null);
                                    viewPdf(pdfPath, item);
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            <Helmet >
                <title>
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    {/* Best online SSB Coaching in India with over 50% recommendation rate */}
                    SSB Current Affairs & Insights | Defence Aspirants Magazine
                </title>

                <meta
                    name="description"
                    content="Roger That Magazine brings curated global news, defence insights, and current affairs to help SSB aspirants build knowledge, perspective, and confidence for group discussions and interviews."
                />

                {/* *MAGAZINE PAGE* */}

                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://ssbwithisv.in/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Magazine",
                                "item": "https://ssbwithisv.in/magazine"
                            }
                        ]
                    })}
                </script>
                <link rel="canonical" href="https://ssbwithisv.in/magazine" />
            </Helmet>
            <CustomHeader heading={data?.heading} text={data?.text} textTwo={data?.textTwo} banner={data?.banner} />



            <section className="container sectionspace80">


                <div className="row justify-content-center">
                    <div className="">


                        <p className="magazine-intro-text">

                            Roger That Magazine is a curated current affairs and perspective platform created to support aspirants preparing for the Services Selection Board (SSB) interview. One of the most important aspects of the SSB selection process is the ability to demonstrate awareness of global developments, clarity of thought, and the ability to articulate informed opinions during group discussions, lecturette and personal interviews. Roger That is your go-to resource for in-depth insights, real-world perspectives and expert analysis tailored to the SSB process.


                        </p>
                        <br/>

                        <p className="magazine-intro-text">
                            Our monthly magazine brings together insights on global news, geopolitics,
                            defence developments, social issues, technology, and leadership, helping
                            candidates build a deeper understanding of the world around them.
                            By engaging with diverse perspectives and analytical viewpoints,
                            aspirants can develop the intellectual awareness and balanced thinking
                            expected from future officers in the Armed Forces.
                        </p>




                        <div className="mvk-benefits">

                            <h3> Through carefully selected articles, opinion pieces, and discussions on contemporary issues, Roger That magazine helps candidates:</h3>

                            <ul>



                                <li>
                                    Stay updated with important global and national developments
                                </li>
                                <li>
                                    Prepare on the latest GD topics
                                </li>
                                <li>
                                    Improve confidence and clarity during SSB group discussions
                                </li>


                                <li>
                                    Build informed viewpoints on current affairs
                                </li>


                                <li>
                                    Develop the ability to analyze complex situations
                                </li>
                                <li>
                                    Express balanced opinions during SSB personal interview
                                </li>
                                <li>
                                    Sharpen knowledge areas on latest lecturette topics
                                </li>
                                <li>
                                    Speak on the lecturette topics with clarity during GTO tasks
                                </li>
                                <li>
                                    Strengthen overall SSB interview preparation
                                </li>

                            </ul>

                        </div>

                        <p className="magazine-intro-text mt-5">
                            Whether you are preparing for NDA, CDS, AFCAT, TES, or other defence
                            entry schemes, staying informed about the world and developing thoughtful
                            perspectives can significantly enhance your presence during group
                            discussions, lecturettes, and personal interviews at the SSB.
                        </p>

                        <p className="magazine-intro-text">
                            Roger That Magazine aims to become a knowledge companion for defence
                            aspirants, helping them cultivate awareness, perspective, and intellectual
                            curiosity—qualities that are essential for leadership in the Armed Forces.
                        </p>

                    </div>
                </div>

                <div className="row align-items-center justify-content-between g-3 mt-5">

                    {/* LEFT TEXT */}
                    {!token && <div className="col-12 col-md-8">
                        <p className="d-flex justify-content-start m-0 downloadYourRes">
                            <span onClick={() => navigate('/SignUp')}> Sign up</span> to download your free magazine.

                        </p>
                    </div>}

                    {/* RIGHT SELECT */}
                    <div className="col-12 col-md-4 text-md-end">
                        <form>
                            <div className="form-group">


                                <select
                                    className="form-select thm-select w-100 w-md-auto"
                                    value={selectedTag}
                                    onChange={(e) => setSelectedTag(e.target.value)}
                                >
                                    <option value="all">All Resources</option>
                                    {uniqueCategories.map(cat => {
                                        let displayName = cat;
                                        if (cat === "Magazine") displayName = "Current Affairs Magazine";
                                        else if (cat === "Books") displayName = "Books";
                                        else if (cat === "SSBPrep") displayName = "SSB Prep Material";
                                        return (
                                            <option key={cat} value={cat}>{displayName}</option>
                                        );
                                    })}
                                </select>

                            </div>
                        </form>
                    </div>

                </div>

                <div style={{ marginTop: '0' }} className="col-12 mx-auto row g-4">
                    {currentMagazines?.map((item, index) => (
                        // <div className="col-lg-4 col-md-6 col-sm-6" key={item._id || index}>
                        <div className="col-lg-3 col-md-4 col-6" key={item._id || index}>

                            <div className="card magazine-card mt-4">

                                {/* HOVER DOWNLOAD BUTTON */}
                                <div className="magazine-hover">


                                    <CustomButton text="Read Online" onClick={() => viewPdf(item.pdfFilePath, item)} />
                                </div>

                                <div className="card-header magazine-card-head">
                                    <div className="card-title magazine-card-title">
                                        {item?.pdfTitle}
                                    </div>
                                </div>

                                <div className="card-body magazine-card-body">
                                    <img
                                        src={window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? `http://localhost:5001/${item?.magazineFrontImage}` : `https://api.ssbwithisv.in/${item?.magazineFrontImage}`}
                                        className="magazine-card-img"
                                        alt="Magazine Image"
                                        onError={(e) => {
                                            if (e.target.src.includes('localhost:5001')) {
                                                e.target.src = `https://api.ssbwithisv.in/${item?.magazineFrontImage}`;
                                            }
                                        }}
                                    />
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="pdf-pagination-container">
                        <button
                            className="pdf-pagination-btn"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                className={`pdf-pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                onClick={() => setCurrentPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ))}
                        <button
                            className="pdf-pagination-btn"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}



            </section >





            <From />
            <Footer />

            {/* PDF Resource Viewer Modal */}
            {viewingPdf && (
                <div className="pdf-modal-overlay" onClick={() => { setViewingPdf(null); setShowNotes(false); }}>
                    <div className="pdf-modal-container" ref={modalContainerRef} onClick={(e) => e.stopPropagation()}>
                        <div className="pdf-modal-header">
                            <h3>{viewingPdf.title}</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    className={`pdf-modal-notes-toggle ${isFullscreen ? 'active' : ''}`}
                                    onClick={toggleFullscreen}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <BiFullscreen /> {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                                </button>
                                <button
                                    className={`pdf-modal-notes-toggle ${showNotes ? 'active' : ''}`}
                                    onClick={() => setShowNotes(!showNotes)}
                                >
                                    <BiEdit /> {showNotes ? "Hide Notes" : "Take Notes"}
                                </button>
                                <button className="pdf-modal-close-btn" onClick={() => { setViewingPdf(null); setShowNotes(false); }}>
                                    <BiX /> Close
                                </button>
                            </div>
                        </div>
                        <div className="pdf-modal-body">
                            <div className="pdf-modal-viewer-split">
                                <div className="pdf-viewer-pane">
                                    <PdfViewer
                                        url={viewingPdf.url}
                                        title={viewingPdf.title}
                                    />
                                </div>
                                {showNotes && (
                                    <div className="pdf-notes-pane">
                                        <div className="pdf-notes-header">
                                            <h4>Notes</h4>
                                            <span className="pdf-notes-status-badge">Auto-saved</span>
                                        </div>
                                        <textarea
                                            placeholder="Write your notes here... They will be automatically saved locally."
                                            value={noteText}
                                            onChange={(e) => {
                                                setNoteText(e.target.value);
                                                localStorage.setItem(`resource_note_${viewingPdf.id}`, e.target.value);
                                            }}
                                        />
                                        <div className="pdf-notes-footer">
                                            <button className="notes-btn-download" onClick={() => downloadNotes(viewingPdf.title, noteText)}>
                                                Download .txt
                                            </button>
                                            <button className="notes-btn-clear" onClick={() => {
                                                if (window.confirm("Are you sure you want to clear these notes?")) {
                                                    setNoteText("");
                                                    localStorage.removeItem(`resource_note_${viewingPdf.id}`);
                                                }
                                            }}>
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Magnize