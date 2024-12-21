// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjHIf2tkZ1XNF413BelPMjaFML6kfWadU",
  authDomain: "saglik-bitirme-app.firebaseapp.com",
  projectId: "saglik-bitirme-app",
  storageBucket: "saglik-bitirme-app.firebasestorage.app",
  messagingSenderId: "943827895082",
  appId: "1:943827895082:web:4bbc748dd2ae95e4c25453",
  measurementId: "G-DM622J898J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);