// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs htmlFor Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDT0nbR0hXoVSQN9241ggKkg2PN1xy4oM",
  authDomain: "sothankstickets.firebaseapp.com",
  projectId: "sothankstickets",
  storageBucket: "sothankstickets.appspot.com",
  messagingSenderId: "834876831237",
  appId: "1:834876831237:web:bc39c47f8e1be3436c0e6c",
  measurementId: "G-MEZ85Y07L9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const db = getFirestore(app);

export default db;