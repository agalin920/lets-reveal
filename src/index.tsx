import React from 'react';
import ReactDOM from 'react-dom';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'

import './index.css';
import App from './App';

const firebaseConfig = {
  apiKey: "AIzaSyBvh-dmXjQpTFNYZ0QulK-3gztiAFNdaKY",
  authDomain: "lets-reveal.firebaseapp.com",
  projectId: "lets-reveal",
  storageBucket: "lets-reveal.appspot.com",
  messagingSenderId: "1086600794508",
  appId: "1:1086600794508:web:a387b46d33f6c1e16a46a9",
  measurementId: "G-336BRZB4C4"
};

const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
