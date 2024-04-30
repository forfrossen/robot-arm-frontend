/* SPDX-FileCopyrightText: 2014-present Kriasoft */

/* SPDX-License-Identifier: MIT */
/*

import { useState } from "react";

import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  signInAnonymously,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { app } from "./firebase";

export function useSignIn(signInMethod: SignInMethod): [signIn: () => void, inFlight: boolean] {
  const navigate = useNavigate();
  const [inFlight, setInFlight] = useState(false);

  const signIn = () => {
    let p: Promise<UserCredential | void> | null = null;

    if (signInMethod === "anonymous") {
      const auth = getAuth(app);
      p = signInAnonymously(auth);
    }

    if (signInMethod === "google.com") {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      provider.setCustomParameters({
        // login_hint: ...
        prompt: "select_account",
      });

      p = setPersistence(auth, browserLocalPersistence)
        .then(() => {
          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.
          // ...
          // New sign-in will be persisted with session persistence.
          return signInWithPopup(auth, provider);
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
        });
    }

    if (!p) throw new Error(`Not supported: ${signInMethod}`);

    setInFlight(true);
    p.then(() => navigate("/")).finally(() => setInFlight(false));
  };

  return [signIn, inFlight] as const;
}


*/
export type SignInMethod = "google.com" | "anonymous";