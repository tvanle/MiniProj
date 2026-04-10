import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase-config';

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

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const subscribeAuthState = (
  callback: (user: FirebaseUser | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
