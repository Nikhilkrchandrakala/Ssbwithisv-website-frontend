import React, { useEffect, useRef } from 'react';

const ZOHO_FORM_SCRIPT_ID = 'formScript736128000000759294';
const ZOHO_FORM_SCRIPT_SRC =
    'https://crm.zoho.in/crm/WebFormServeServlet?rid=6987d7742a353b015b69a41ae9965bff493903b4ab42341aa65bd269fbd4bc815f9a43ab1e1c4c020f049a77e737012bgidad8a1a0c225db57c3a990efdd4794766bfeb2c4007edf20a539643722f56d051&script=$sYG';

function Form() {
    const containerRef = useRef(null);

    useEffect(() => {
        // Remove any previously injected instance
        const stale = document.getElementById(ZOHO_FORM_SCRIPT_ID);
        if (stale) stale.remove();

        if (containerRef.current) {
            containerRef.current.innerHTML = '';
        }

        const script = document.createElement('script');
        script.id = ZOHO_FORM_SCRIPT_ID;
        script.src = ZOHO_FORM_SCRIPT_SRC;
        script.async = true;

        if (containerRef.current) {
            containerRef.current.appendChild(script);
        }

        return () => {
            const s = document.getElementById(ZOHO_FORM_SCRIPT_ID);
            if (s) s.remove();
        };
    }, []);

    return (
        <section
            style={{
                width: '100%',
                maxWidth: '900px',
                margin: '0 auto',
                padding: '60px 20px 80px',
            }}
        >
            <div
                ref={containerRef}
                id="zoho-crm-form-container-page"
                style={{ width: '100%', minHeight: '400px' }}
            />
        </section>
    );
}

export default Form;