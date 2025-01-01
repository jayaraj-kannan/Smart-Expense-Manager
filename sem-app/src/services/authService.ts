// src/services/authService.ts

import { getAuth, signInWithPopup,signInWithRedirect,getRedirectResult, GoogleAuthProvider,createUserWithEmailAndPassword ,signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { googleProvider } from "@/firebase";

export const signUpUser = async (email:string, password:string) => {
    const auth = getAuth();
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInUser = async (email:string, password:string) => {
    const auth = getAuth();
    return await signInWithEmailAndPassword(auth, email, password);
};

// Google Sign-In
export const signInWithGoogle = async () => {
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      return { user, token };
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
};

// Google Sign-In using Redirect (for mobile compatibility)
export const signInWithGoogleRedirect = async () => {
  const auth = getAuth();
  try {
    // Start the sign-in process with redirect
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    alert("Google Sign-In Error:"+ error);
    throw error;
  }
};
export const handleRedirectResult = async () => {
  try {
    const auth = getAuth();
    const result = await getRedirectResult(auth);
    if (result) {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      return { user, token };
    }else{
      console.log("user not signed in");
    }
  } catch (error) {
    console.error("Error during redirect result handling:", error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
      try {
          onAuthStateChanged(auth, (user) => {
              resolve(user); // Resolve with the current user or null if not authenticated
          }, (error) => {
              console.error("Error in onAuthStateChanged:", error);
              reject(error); // Reject if an error occurs
          });
      } catch (error) {
          console.error("getCurrentUser Error:", error);
          reject(error); // Reject if an unexpected error occurs
      }
  });
};

export const logOut = async () => {
  const auth = getAuth();
  return await signOut(auth);
};
