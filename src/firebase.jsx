// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore, doc, setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGMqoNeYmyb1jTL4NfeOLiGgzCSsZ1pHc",
  authDomain: "financely-78e17.firebaseapp.com",
  projectId: "financely-78e17",
  storageBucket: "financely-78e17.appspot.com",
  messagingSenderId: "353963822702",
  appId: "1:353963822702:web:8ee1ad728eb23680ce607f",
  measurementId: "G-6BDWLMMDT0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc};