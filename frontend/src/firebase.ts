import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCq8QLm96caLTaAyG1r82y0S8hBYT95uNI",
  authDomain: "busi-e5fb0.firebaseapp.com",
  projectId: "busi-e5fb0",
  storageBucket: "busi-e5fb0.firebasestorage.app",
  messagingSenderId: "921103174003",
  appId: "1:921103174003:web:2a6725608aac9fdbdf5d06"
};

const app = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(app)
export const firebaseDb = getFirestore(app)