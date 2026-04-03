import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCJ9AGinTUBq7gjds2StEeZ0fuPcGtQZpY",
  authDomain: "kolda-569cf.firebaseapp.com",
  projectId: "kolda-569cf",
  storageBucket: "kolda-569cf.firebasestorage.app",
  messagingSenderId: "881887738938",
  appId: "1:881887738938:web:3076761d5f93621bddc903"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()