// src/app/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Keep this line ONLY if you have a measurementId
};

// Validate config before initializing
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId;

let app;
let auth = null;
let db = null;
let storage = null;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase app and services initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase app or services:", error.message);
    // Log the config that caused the error for debugging
    console.error("Firebase config used:", firebaseConfig);
  }
} else {
  console.error("Firebase configuration is incomplete or invalid. Check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_ variables are set correctly.");
  // Log the incomplete config for debugging
  console.error("Incomplete Firebase config:", firebaseConfig);
}

export { auth, db, storage };
