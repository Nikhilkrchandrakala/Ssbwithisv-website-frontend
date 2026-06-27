import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../style/custom-theme.css';

/**
 * /auth/callback
 * Landing page after OAuth login for EXISTING users (have phone).
 * Reads ?token=...&user=... from URL, stores in localStorage, then navigates home.
 */
function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userRaw = params.get('user');
        const oauthError = params.get('oauthError');

        if (oauthError) {
            setError('Sign in was cancelled or failed. Please try again.');
            setTimeout(() => navigate('/SignIn'), 3000);
            return;
        }

        if (!token) {
            setError('Authentication failed. No token received.');
            setTimeout(() => navigate('/SignIn'), 3000);
            return;
        }

        try {
            // Store JWT using same keys as normal SignIn
            localStorage.setItem('authToken', token);
            localStorage.setItem('rememberMe', 'true');

            if (userRaw) {
                const user = JSON.parse(decodeURIComponent(userRaw));
                localStorage.setItem('userData', JSON.stringify(user));
                sessionStorage.setItem('userData', JSON.stringify(user));
            }

            // Clean the URL
            window.history.replaceState({}, document.title, '/auth/callback');

            toast.success('Logged in successfully!');

            // Redirect to pending batch or home
            const pendingBatch = localStorage.getItem('pendingBatch');
            navigate(pendingBatch ? '/batches' : '/', { replace: true });
        } catch (err) {
            console.error('[AuthCallback] Error:', err);
            setError('Something went wrong. Please try again.');
            setTimeout(() => navigate('/SignIn'), 3000);
        }
    }, [navigate]);

    return (
        <div className="thm-content-layer">
            <div className="thm-content-bg"></div>
            <div className="container position-relative d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                {error ? (
                    <div className="text-center">
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                        <p className="field-error" style={{ fontSize: '18px' }}>{error}</p>
                        <p style={{ color: '#c6c5af', marginTop: '12px' }}>Redirecting you back...</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="oauth-spinner"></div>
                        <p style={{ color: '#f4c430', fontSize: '20px', fontWeight: 600, marginTop: '24px' }}>
                            Signing you in...
                        </p>
                        <p style={{ color: '#c6c5af', fontSize: '14px', marginTop: '8px' }}>
                            Please wait a moment
                        </p>
                    </div>
                )}
                <span className="thm-glow"></span>
            </div>
        </div>
    );
}

export default AuthCallback;
