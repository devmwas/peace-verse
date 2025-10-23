import { db } from "./config";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// Syncing user doc after every sign in
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

// Fetching Bills data from db
export const fetchBillsFromFirestore = async () => {
  const billsRef = collection(db, "bills"); // make sure your collection name matches
  const snapshot = await getDocs(billsRef);

  const bills = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return bills;
};

/**
 * Adds a user-proposed bill to Firestore
 * @param {Object} billData - The bill data from the modal form
 * @param {string} uid - The user ID (optional for guests)
 */
export const addUserProposedBill = async (billData, user = null) => {
  try {
    const billsRef = collection(db, "bills");
    const createdByUid = user?.uid || "anonymous";
    const createdByName = user?.displayName || "Anonymous User";

    const newBill = {
      ...billData,
      type: billData.type || "P", // "P" for Public, "B" for Bill
      createdAt: serverTimestamp(),
      createdByUid,
      createdByName,
      status: "open",
      votesFor: 0,
      votesAgainst: 0,
    };

    const docRef = await addDoc(billsRef, newBill);
    console.log("✅ Bill added successfully:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("🔥 Error adding bill:", error);
    throw error;
  }
};

// To make the BillPolling component auto-update whenever a new bill is added
// (without manual refresh), we’ll set up real-time listeners in Firestore using onSnapshot.
// It listens for any new, edited, or deleted bills and triggers the
// callback with fresh data instantly.
export const listenToBills = (callback) => {
  const billsRef = collection(db, "bills");
  const q = query(billsRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const bills = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(bills);
  });

  return unsubscribe;
};
