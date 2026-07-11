import React, { useEffect, useRef, useState } from 'react';

const PdfViewer = ({ url, title }) => {
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        let activeRenderTask = null;

        const loadPdfJS = async () => {
            if (window.pdfjsLib) {
                return window.pdfjsLib;
            }

            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                script.async = true;
                script.onload = () => {
                    if (window.pdfjsLib) {
                        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                        resolve(window.pdfjsLib);
                    } else {
                        reject(new Error('PDF.js library loaded but pdfjsLib global not found'));
                    }
                };
                script.onerror = () => reject(new Error('Failed to load PDF viewer library'));
                document.body.appendChild(script);
            });
        };

        const renderPdf = async () => {
            try {
                if (isMounted) {
                    setLoading(true);
                    setError(null);
                    setProgress('Loading reader library...');
                }

                const pdfjs = await loadPdfJS();
                if (!isMounted) return;

                setProgress('Fetching document...');
                const loadingTask = pdfjs.getDocument({
                    url: url,
                    withCredentials: false
                });

                const pdf = await loadingTask.promise;
                if (!isMounted) return;

                const container = containerRef.current;
                if (!container) return;

                // Clear previous canvases/elements (excluding the loader UI)
                const existingCanvases = container.querySelectorAll('.pdf-page-canvas-wrapper');
                existingCanvases.forEach(el => el.remove());

                const totalPages = pdf.numPages;

                // Sequentially render pages to keep memory footprint low and ensure order
                for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                    if (!isMounted) break;
                    setProgress(`Rendering page ${pageNum} of ${totalPages}...`);

                    const page = await pdf.getPage(pageNum);
                    if (!isMounted) break;

                    const pageWrapper = document.createElement('div');
                    pageWrapper.className = 'pdf-page-canvas-wrapper';
                    pageWrapper.style.position = 'relative';
                    pageWrapper.style.margin = '15px auto';
                    pageWrapper.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.4)';
                    pageWrapper.style.backgroundColor = '#ffffff';
                    pageWrapper.style.borderRadius = '4px';
                    pageWrapper.style.maxWidth = '100%';
                    pageWrapper.style.overflow = 'hidden';
                    pageWrapper.style.display = 'block';

                    const canvas = document.createElement('canvas');
                    canvas.className = 'pdf-page-canvas';
                    canvas.style.display = 'block';
                    canvas.style.width = '100%';
                    canvas.style.height = 'auto';
                    
                    // Disable context menu on the canvas itself
                    canvas.oncontextmenu = (e) => e.preventDefault();
                    
                    pageWrapper.appendChild(canvas);
                    container.appendChild(pageWrapper);

                    const context = canvas.getContext('2d');
                    
                    // Scale 1.5 gives good high-density screen clarity while preserving memory
                    const viewport = page.getViewport({ scale: 1.5 });
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    // Set wrapper width and aspect ratio dynamically based on page dimensions
                    pageWrapper.style.width = `${viewport.width / 1.5}px`;
                    
                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };

                    activeRenderTask = page.render(renderContext);
                    await activeRenderTask.promise;
                    activeRenderTask = null;
                }

                if (isMounted) {
                    setLoading(false);
                    setProgress('');
                }
            } catch (err) {
                console.error('Error rendering PDF:', err);
                if (isMounted) {
                    setError('Failed to load PDF. Direct download is disabled, please read online.');
                    setLoading(false);
                }
            }
        };

        renderPdf();

        return () => {
            isMounted = false;
            if (activeRenderTask && activeRenderTask.cancel) {
                activeRenderTask.cancel();
            }
        };
    }, [url]);

    return (
        <div 
            ref={containerRef}
            className="pdf-js-viewer-container"
            style={{
                width: '100%',
                height: '100%',
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch', // Enable momentum scrolling on iOS
                background: '#141416',
                padding: '20px 10px',
                position: 'relative',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                msUserSelect: 'none',
                MozUserSelect: 'none',
            }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {loading && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '250px',
                    height: '100%',
                    color: '#ffd700',
                    gap: '16px',
                    fontFamily: 'inherit',
                    backgroundColor: 'rgba(20, 20, 22, 0.9)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10
                }}>
                    <div 
                        className="spinner-border" 
                        role="status" 
                        style={{ 
                            width: '3rem', 
                            height: '3rem', 
                            color: '#ffd700',
                            borderWidth: '0.25em'
                        }}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                        Please wait while we are loading...
                    </p>
                </div>
            )}
            {error && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#ff4d4d',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#141416'
                }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚠️</div>
                    <p style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: 600 }}>{error}</p>
                </div>
            )}
            
            {/* Inject local style to disable selection, pointer events, and drag behaviors */}
            <style>{`
                .pdf-page-canvas-wrapper {
                    user-select: none !important;
                    -webkit-user-select: none !important;
                    pointer-events: none; /* Prevents dragging the canvas image */
                }
                .pdf-js-viewer-container::-webkit-scrollbar {
                    width: 8px;
                }
                .pdf-js-viewer-container::-webkit-scrollbar-track {
                    background: #141416;
                }
                .pdf-js-viewer-container::-webkit-scrollbar-thumb {
                    background: #2a2a2d;
                    border-radius: 4px;
                }
                .pdf-js-viewer-container::-webkit-scrollbar-thumb:hover {
                    background: #ffd700;
                }
            `}</style>
        </div>
    );
};

export default PdfViewer;
