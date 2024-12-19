// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpvRQoURk3IOJ1PAkpXpVyzSn7q6BslDE",
  authDomain: "level-d04f6.firebaseapp.com",
  projectId: "level-d04f6",
  storageBucket: "level-d04f6.firebasestorage.app",
  messagingSenderId: "631158287002",
  appId: "1:631158287002:web:ec12a5b325d7ddba574d23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);