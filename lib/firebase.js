import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId
);

// Opens the Google popup and returns a Firebase ID token for our server to verify.
export async function getGoogleIdToken() {
  if (!isFirebaseConfigured) {
    const err = new Error("Google sign-in is not configured yet.");
    err.code = "not-configured";
    throw err;
  }
  const app = getApps().length ? getApp() : initializeApp(config);
  const result = await signInWithPopup(getAuth(app), new GoogleAuthProvider());
  return result.user.getIdToken();
}
