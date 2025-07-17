import { app, db } from "./firebase";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const auth = getAuth(app);

export const getCurrentUser = async () => {
  const getAuthStateChanged = (auth: Auth): Promise<string> => {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user.uid);
        } else {
          resolve("");
        }
      }, reject);
    });
  };
  const uid = await getAuthStateChanged(auth);
  return uid;
};

export const signUpUser = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const userRef = doc(db, "Users", userCredential.user.uid);
    await setDoc(userRef, {
      username: username,
      uid: userCredential.user.uid,
    });
    return userCredential;
  } catch (error) {
    console.log(error);
  }
};

export const signInUser = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential;
  } catch (error) {
    console.log(error);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth).then(() => {
      window.location.reload();
    });
  } catch (error) {
    console.log(error);
  }
};
