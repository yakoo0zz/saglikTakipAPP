// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjHIf2tkZ1XNF413BelPMjaFML6kfWadU",
  authDomain: "saglik-bitirme-app.firebaseapp.com",
  projectId: "saglik-bitirme-app",
  storageBucket: "saglik-bitirme-app.firebasestorage.app",
  messagingSenderId: "943827895082",
  appId: "1:943827895082:web:4bbc748dd2ae95e4c25453",
  measurementId: "G-DM622J898J",
  databaseURL: "https://saglik-bitirme-app-default-rtdb.firebaseio.com/",
};

// Check if Firebase app has already been initialized
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Zaten başlatılmış uygulamayı kullan
}

const analytics = getAnalytics(app);
export const db = getDatabase(app);
