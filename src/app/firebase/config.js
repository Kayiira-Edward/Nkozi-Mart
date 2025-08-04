// src/app/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9D0J9-54ramNXlonXrWRCuXH9Qjqt-d4",
  authDomain: "shoplink-7ba8f.firebaseapp.com",
  projectId: "shoplink-7ba8f",
  storageBucket: "shoplink-7ba8f.firebasestorage.app",
  messagingSenderId: "196720230323",
  appId: "1:196720230323:web:da0dc7146e2837e02295c6",
  measurementId: "G-8DV4D4WBLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics only if supported on the client-side
let analytics = null;
if (typeof window !== 'undefined' && isSupported()) {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
