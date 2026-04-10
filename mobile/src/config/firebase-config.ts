import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXCKldec2Jv4xgP1ZLNiW4H1LfSexDa_s",
  authDomain: "movie-ticket-app-1621b.firebaseapp.com",
  projectId: "movie-ticket-app-1621b",
  storageBucket: "movie-ticket-app-1621b.firebasestorage.app",
  messagingSenderId: "836728993167",
  appId: "1:836728993167:web:80a07fd3d5657619b247fa",
  measurementId: "G-QWY9N1W3RL",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
