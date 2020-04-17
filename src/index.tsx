import React from 'react';
import { render } from 'react-dom';
import WebFont from 'webfontloader';

// Local Modules
import App from './App';

// Styles
import './Styles/main.scss';

// Google Fonts
WebFont.load({
    google: {
        families: ['Roboto', 'Nunito'],
    },
});

// Launch 🚀
const root = document.getElementById('root');
if (root !== null) {
    render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        root,
    );
}
