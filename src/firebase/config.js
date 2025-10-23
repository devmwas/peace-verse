import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG } from "../firebaseConfig";

let app, auth, db;

if (FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey) {
  app = initializeApp(FIREBASE_CONFIG);
  auth = getAuth(app);
  db = getFirestore(app);
  setPersistence(auth, browserLocalPersistence);
} else {
  console.error("❌ Firebase config missing or invalid!");
}

export { app, auth, db };
