// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// Firebase Storage is no longer used - migrated to Cloudinary
// import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnj-Zx9HtOuu9RHjeNe0Zn5BzCQgOmM40",
  authDomain: "blogme-42763.firebaseapp.com",
  projectId: "blogme-42763",
  storageBucket: "blogme-42763.appspot.com",
  messagingSenderId: "534596459172",
  appId: "1:534596459172:web:ba509add5a9a57661ea431",
  measurementId: "G-E7KFH70HQ9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firebase Storage is no longer used - migrated to Cloudinary
// export const storage = getStorage(app);

// Initialize Firestore
const db = getFirestore(app);

export { db };