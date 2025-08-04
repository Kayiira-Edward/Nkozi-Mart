// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);