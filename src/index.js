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
    window.location.replace(`https://${window.location.hostname}${window.location.pathname}${window.location.search}`);
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
