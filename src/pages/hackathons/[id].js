import { useEffect, useState } from "react";
import { db,auth } from "@/firebaseConfig";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export default function HackathonDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [hackathon, setHackathon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchHackathon();
  }, [id]);

  const fetchHackathon = async () => {
    try {
      const docRef = doc(db, "hackathons", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHackathon({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError("Hackathon not found.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!auth.currentUser) {
      alert("You need to log in to register.");
      return;
    }

    try {
      const docRef = doc(db, "hackathons", id);
      await updateDoc(docRef, {
        participants: arrayUnion(auth.currentUser.uid),
      });
      alert("Registered successfully!");
      fetchHackathon(); // Refresh hackathon data
    } catch (err) {
      alert("Error registering: " + err.message);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>{hackathon.name}</h1>
      <p>{hackathon.description}</p>
      <p>
        <strong>Start Date:</strong> {hackathon.startDate}
      </p>
      <p>
        <strong>End Date:</strong> {hackathon.endDate}
      </p>
      <p>
        <strong>Participants:</strong> {hackathon.participants.length}
      </p>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
