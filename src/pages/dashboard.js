import { useEffect, useState } from "react";
import { auth, db } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion, addDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#C07B26",
    padding: "1rem 2rem",
  },
  welcomeText: {
    color: "white",
    fontSize: "1.2rem",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
    fontSize: "1.1rem",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "1rem",
    padding: "5px 10px",
    borderRadius: "4px",
    backgroundColor: "transparent", 
    border: "none",                  
    cursor: "pointer",               
    transition: "background-color 0.3s ease"
  },
  navLinkHover: {
    backgroundColor: "none",
  },
  header: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  dashboard: {
    marginTop: "2rem",
    margin:'auto',
   
  },
  buttondiv:{
    textAlign:'center'
  },

  createButton: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#C07B26",
    border: "1px solid #C07B26",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    minWidth:'400px',
    height:'100px',
    borderRadius:"30px",
    marginBottom: "0.5rem",
    backgroundColor:"none",
    border:'1px solid #C07B26',
    display:'flex',
    alignItems:'center',

    
  },
  linkButton: {
    background: "none",
    color: "#C07B26",
    fontSize:'20px',
    border: "none",
    padding:'10px 20px',
    borderRadius: '10px',
    textDecoration: "none",
    cursor: "pointer",
  },
  formContainer: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#ecf0f1",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  formHeader: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  textarea: {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    minHeight: "100px",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    fontSize: "1rem",
    textAlign: "center",
  },
  detailsContainer: {
    padding: "2rem",
    backgroundColor: "#ecf0f1",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "0 auto",
  },
  detailsHeader: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  registerButton: {
    padding: "10px 20px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default function HackathonPage() {
  const [user, setUser] = useState(null);
  const [createdHackathons, setCreatedHackathons] = useState([]);
  const [participatedHackathons, setParticipatedHackathons] = useState([]);
  const [hackathon, setHackathon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchHackathons(user);
      } else {
        router.push("/auth/login");
      }
    });
    return unsubscribe;
  }, []);

  const fetchHackathons = async (user) => {
    setIsLoading(true);
    try {
      const createdQuery = query(
        collection(db, "hackathons"),
        where("createdBy", "==", user.uid)
      );
      const participatedQuery = query(
        collection(db, "hackathons"),
        where("participants", "array-contains", user.uid)
      );

      const createdSnapshot = await getDocs(createdQuery);
      const participatedSnapshot = await getDocs(participatedQuery);

      setCreatedHackathons(createdSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setParticipatedHackathons(participatedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching hackathons: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  const handleCreateHackathon = async (e) => {
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
      setView("dashboard"); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (id) => {
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
      fetchHackathons(auth.currentUser); 
    } catch (err) {
      alert("Error registering: " + err.message);
    }
  };

  const handleViewHackathonDetails = async (id) => {
    try {
      const docRef = doc(db, "hackathons", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHackathon({ id: docSnap.id, ...docSnap.data() });
        setView("hackathonDetails");
      } else {
        setError("Hackathon not found.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <div style={styles.nav}>
        <div style={styles.welcomeText}>
          Welcome, {user?.displayName || user?.email}
        </div>
        <div style={styles.navLinks}>
          <button onClick={() => router.push("/")} style={styles.navLink}>Home</button>
          <button onClick={() => setView("dashboard")} style={styles.navLink}>Dashboard</button>
          <button onClick={handleLogout} style={styles.navLink}>Logout</button>
        </div>
      </div>

      <h1 style={styles.header}>Hackathon Dashboard</h1>
      {view === "dashboard" && (
        <div style={styles.dashboard}>
          <div style={styles.buttondiv}><button onClick={() => setView("createHackathon")} style={styles.createButton}>
            Create New Hackathon
          </button></div>

          <h2 style={styles.sectionTitle}>Created Hackathons</h2>
          {createdHackathons.length === 0 ? (
            <p>You haven't created any hackathons yet.</p>
          ) : (
            <ul style={styles.list}>
              {createdHackathons.map((hackathon) => (
                <li key={hackathon.id} style={styles.listItem}>
                  <button onClick={() => handleViewHackathonDetails(hackathon.id)} style={styles.linkButton}>
                    {hackathon.name}
                    <p>{hackathon.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <h2 style={styles.sectionTitle}>Participated Hackathons</h2>
          {participatedHackathons.length === 0 ? (
            <p>You haven't participated in any hackathons yet.</p>
          ) : (
            <ul style={styles.list}>
              {participatedHackathons.map((hackathon) => (
                <li key={hackathon.id} style={styles.listItem}>
                  <button onClick={() => handleViewHackathonDetails(hackathon.id)} style={styles.linkButton}>
                    {hackathon.name}
                    <p>{hackathon.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {view === "createHackathon" && (
        <div style={styles.formContainer}>
          <h1 style={styles.formHeader}>Create Hackathon</h1>
          {error && <p style={styles.errorText}>{error}</p>}
          <form onSubmit={handleCreateHackathon} style={styles.form}>
            <input
              type="text"
              placeholder="Hackathon Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={styles.textarea}
            />
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.submitButton}>
              Create Hackathon
            </button>
          </form>
        </div>
      )}

      {view === "hackathonDetails" && hackathon && (
        <div style={styles.detailsContainer}>
          <h1 style={styles.detailsHeader}>{hackathon.name}</h1>
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
          <button onClick={() => handleRegister(hackathon.id)} style={styles.registerButton}>
            Register
          </button>
          <button onClick={() => setView("dashboard")} style={styles.backButton}>
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
