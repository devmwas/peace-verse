import { db } from "./components/auth/AuthProvider";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const syncUserDocument = async (user, displayNameOverride = null) => {
  if (!db || !user || user.isAnonymous) return;

  const userRef = doc(db, "users", user.uid);
  await setDoc(
    userRef,
    {
      uid: user.uid,
      displayName:
        displayNameOverride || user.displayName || "Authenticated User",
      email: user.email || null,
      phoneNumber: user.phoneNumber || null,
      photoURL: user.photoURL || null,
      createdAt: user.metadata.creationTime
        ? new Date(user.metadata.creationTime)
        : serverTimestamp(),
      lastSignInTime: serverTimestamp(),
    },
    { merge: true }
  );
};
