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

// Check if firebaseConfig is valid before initializing
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId;

let app;
if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    // console.log("Firebase app initialized successfully."); // Removed for cleaner output
  } catch (error) {
    console.error("Error initializing Firebase app:", error.message);
    // This error should ideally not happen if isConfigValid is true and .env is correct
  }
} else {
  console.error("Firebase configuration is incomplete or invalid. Check your .env.local file and ensure all NEXT_PUBLIC_FIREBASE_ variables are set correctly.");
}

// Initialize Firebase services only if the app was successfully initialized
let auth = null;
let db = null;
let storage = null;

if (app) {
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  // This means the app failed to initialize, so auth, db, storage will be null
  console.error("Firebase app not initialized, cannot get auth, db, or storage instances.");
}

// Export the initialized services
export { auth, db, storage };
