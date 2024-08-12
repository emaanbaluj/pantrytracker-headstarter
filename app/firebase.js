// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-jBXqItD-Mc_2hm7SEF7GdEDL4YA6RvE",
  authDomain: "pantrytracker-headstarte-178ac.firebaseapp.com",
  projectId: "pantrytracker-headstarte-178ac",
  storageBucket: "pantrytracker-headstarte-178ac.appspot.com",
  messagingSenderId: "269352089403",
  appId: "1:269352089403:web:d3c3724c03b7ff4908291e",
  measurementId: "G-BVJ1G9N2Z6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const firestore = getFirestore(app);

// Export the firestore instance to use it in your app
export { firestore };