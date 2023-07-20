// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();