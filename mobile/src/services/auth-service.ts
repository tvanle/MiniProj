import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase-config';

const googleProvider = new GoogleAuthProvider();

export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  // Save user to Firestore
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    email,
    displayName,
    createdAt: new Date().toISOString(),
  });
  return credential.user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

// Save Google user to Firestore if first time
const saveGoogleUser = async (user: FirebaseUser): Promise<void> => {
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Google User',
      createdAt: new Date().toISOString(),
    });
  }
};

export const loginWithGoogle = async (): Promise<FirebaseUser | null> => {
  if (Platform.OS === 'web') {
    // Use redirect on web to avoid COOP issues
    await signInWithRedirect(auth, googleProvider);
    return null; // Page will redirect, handled by checkGoogleRedirect
  }
  const credential = await signInWithPopup(auth, googleProvider);
  await saveGoogleUser(credential.user);
  return credential.user;
};

// Call on app start to handle Google redirect result
export const checkGoogleRedirect = async (): Promise<void> => {
  if (Platform.OS !== 'web') return;
  const result = await getRedirectResult(auth);
  if (result?.user) {
    await saveGoogleUser(result.user);
  }
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const subscribeAuthState = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
