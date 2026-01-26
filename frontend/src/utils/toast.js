import React from 'react';
import ReactDOM from 'react-dom/client';
import Toast from '../components/common/Toast.jsx';

let container = null;
let root = null;

const initContainer = () => {
    if (!container) {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = ReactDOM.createRoot(container);
    }
};

const showToast = (message, type) => {
    initContainer();

    const handleClose = () => {
        root.render(null);
    };

    root.render(
        React.createElement(Toast, { message, type, onClose: handleClose })
    );
};

const toast = {
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    warning: (message) => showToast(message, 'warning'),
    info: (message) => showToast(message, 'info'),
};

export default toast;

