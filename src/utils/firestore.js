import { db } from "@/firebaseConfig";
import { collection, addDoc, getDocs, getDoc, doc, query, where, updateDoc, arrayUnion } from "firebase/firestore";
export const createHackathon = async ({ name, description, startDate, endDate, createdBy }) => {
  const hackathonRef = await addDoc(collection(db, "hackathons"), {
    name,
    description,
    startDate,
    endDate,
    createdBy,
    participants: [],
    createdAt: new Date(),
  });
  return hackathonRef.id;
};
export const getHackathonsByUser = async (userId) => {
  const q = query(collection(db, "hackathons"), where("createdBy", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
export const getHackathonsByParticipant = async (userId) => {
  const q = query(collection(db, "hackathons"), where("participants", "array-contains", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
export const getHackathonById = async (hackathonId) => {
  const docRef = doc(db, "hackathons", hackathonId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Hackathon not found");
  }
};
export const registerForHackathon = async (hackathonId, userId) => {
  const hackathonRef = doc(db, "hackathons", hackathonId);
  await updateDoc(hackathonRef, {
    participants: arrayUnion(userId),
  });
};
