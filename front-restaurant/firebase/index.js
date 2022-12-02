// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByUh-CS9jh40e-Q2WZOtjPCMCifxmtZL8",
  authDomain: "cshinfra.firebaseapp.com",
  projectId: "cshinfra",
  storageBucket: "cshinfra.appspot.com",
  messagingSenderId: "1062738666160",
  appId: "1:1062738666160:web:e01db5ee32bd0725dad175",
  measurementId: "G-YK88NXE0HS"
};

// Initialize Firebase
const __app = initializeApp(firebaseConfig);

export default __app;