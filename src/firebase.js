// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "book-store-selva.firebaseapp.com",
  projectId: "book-store-selva",
  storageBucket: "book-store-selva.appspot.com",
  messagingSenderId: "65619568357",
  appId: "1:65619568357:web:dd72032a2a8ca8268bd60c",
  measurementId: "G-CKCNYTWBYS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);