import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Substitua pelos dados REAIS do Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_ZTNiWWOD1wk8nnbkIPZXlakr0ezQnrc",
  authDomain: "cuidafasta-hub.firebaseapp.com",
  projectId: "cuidafasta-hub",
  storageBucket: "cuidafasta-hub.firebasestorage.app",
  messagingSenderId: "376865099896",
  appId: "1:376865099896:web:d57765f649efe4fe965d8d",
  measurementId: "G-ENLD00XFD5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
