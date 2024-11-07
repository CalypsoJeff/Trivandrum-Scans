import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1fmyi4xW9PZK_4I5pDDT7lPf7IMAQGMo",
  authDomain: "trivandrum-scans.firebaseapp.com",
  projectId: "trivandrum-scans",
  storageBucket: "trivandrum-scans.appspot.com",
  messagingSenderId: "795730523847",
  appId: "1:795730523847:web:781d28803910c5793cf0e2",
  measurementId: "G-VJVDW51DJ8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
export { auth, provider, signInWithPopup , storage};
