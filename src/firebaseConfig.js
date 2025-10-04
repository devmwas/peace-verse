// src/firebaseConfig.js

// IMPORTANT: Read configuration from environment variables (secure method)
// The variables are automatically loaded by React and MUST start with REACT_APP_

export const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// This flag ensures we only attempt initialization if the API key is present
export const isConfigUpdated = !!process.env.REACT_APP_API_KEY;
