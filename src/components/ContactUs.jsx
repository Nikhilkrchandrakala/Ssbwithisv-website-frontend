import React, { useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { RxCross1 } from "react-icons/rx";

const ZOHO_FORM_SCRIPT_ID = 'formScript736128000000759294';
const ZOHO_FORM_SCRIPT_SRC =
    'https://crm.zoho.in/crm/WebFormServeServlet?rid=6987d7742a353b015b69a41ae9965bff493903b4ab42341aa65bd269fbd0bc815f9a43ab1e1c4c020f049a77e737012bgidad8a1a0c225db57c3a990efdd4794766bfeb2c4007edf20a539643722f56d051&script=$sYG';

export default function ContactUs({ open, setOpen }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        // Small delay to let the dialog DOM mount fully
        const timer = setTimeout(() => {
            // Remove any stale script or form injected previously
            const stale = document.getElementById(ZOHO_FORM_SCRIPT_ID);
            if (stale) stale.remove();

            // Also clear any Zoho-injected form iframes inside our container
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }

            // Inject the Zoho CRM form script fresh
            const script = document.createElement('script');
            script.id = ZOHO_FORM_SCRIPT_ID;
            script.src = ZOHO_FORM_SCRIPT_SRC;
            script.async = true;

            // Zoho writes the form relative to the script tag — append inside container
            if (containerRef.current) {
                containerRef.current.appendChild(script);
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    background:
                        'radial-gradient(circle at top left, rgba(202, 162, 77, 0.15), transparent 45%), radial-gradient(circle at bottom right, rgba(202, 162, 77, 0.12), transparent 45%), #0b0b0b',
                    px: { xs: 1, sm: 2, md: 3 },
                    py: { xs: 1, sm: 2 },
                    overflowY: 'auto',
                },
            }}
        >
            <DialogContent sx={{ position: 'relative', p: { xs: 1, sm: 2 } }}>
                {/* Close button */}
                <RxCross1
                    onClick={() => setOpen(false)}
                    style={{
                        position: 'absolute',
                        top: 15,
                        right: 15,
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '1.5rem',
                        zIndex: 10,
                    }}
                />


                {/* Zoho CRM Web Form container */}
                <div
                    ref={containerRef}
                    id="zoho-crm-form-container"
                    style={{
                        width: '100%',
                        minHeight: '320px',
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}