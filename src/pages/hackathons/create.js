import { useState } from "react";
import { auth,db } from "@/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";

export default function CreateHackathon() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);

    if (!auth.currentUser) {
      setError("You must be logged in to create a hackathon.");
      return;
    }

    try {
      await addDoc(collection(db, "hackathons"), {
        name,
        description,
        startDate,
        endDate,
        createdBy: auth.currentUser.uid,
        participants: [],
        createdAt: new Date(),
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h1>Create Hackathon</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Hackathon Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button type="submit" style={{ marginTop: "1rem" }}>
          Create Hackathon
        </button>
      </form>
    </div>
  );
}
