import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Force HTTPS redirect
if (window.location.protocol === 'http:' && !window.location.hostname.includes('localhost')) {
}

// Disable copy/cut/selectstart/contextmenu globally (except on input/textarea elements)
if (typeof window !== 'undefined') {
    const isInputField = (el) => {
        if (!el) return false;
        const tagName = el.tagName;
        return tagName === 'INPUT' || tagName === 'TEXTAREA' || el.isContentEditable;
    };

    document.addEventListener('copy', (e) => {
        if (!isInputField(e.target)) {
            e.preventDefault();
        }
    });

    document.addEventListener('cut', (e) => {
        if (!isInputField(e.target)) {
            e.preventDefault();
        }
    });

    document.addEventListener('contextmenu', (e) => {
        if (!isInputField(e.target)) {
            e.preventDefault();
        }
    });

    document.addEventListener('selectstart', (e) => {
        if (!isInputField(e.target)) {
            e.preventDefault();
        }
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HelmetProvider>
    <Provider store={store}>
      < App />
    </Provider>
  </HelmetProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
