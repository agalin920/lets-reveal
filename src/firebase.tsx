import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvh-dmXjQpTFNYZ0QulK-3gztiAFNdaKY",
  authDomain: "lets-reveal.firebaseapp.com",
  projectId: "lets-reveal",
  storageBucket: "lets-reveal.appspot.com",
  messagingSenderId: "1086600794508",
  appId: "1:1086600794508:web:a387b46d33f6c1e16a46a9",
  measurementId: "G-336BRZB4C4"
};

export const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const db = getFirestore(app);