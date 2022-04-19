// Default imports
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';

// RouteSwitch
import RouteSwitch from './RouteSwitch';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from '@popperjs/core';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Firebase
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from './firebase-config';

// Context
import CurrentUserProvider from './context/CurrentUserContext';

// Initialize Firebase
const app = initializeApp(getFirebaseConfig());

ReactDOM.render(
  <React.StrictMode>
    <CurrentUserProvider>
      <RouteSwitch />
    </CurrentUserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
