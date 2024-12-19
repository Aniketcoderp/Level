import Link from "next/link";

export default function Page() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to Hackathon App</h1>
      <p style={styles.description}>
        Manage and participate in hackathons with ease. Create, register, and track events!
      </p>
      <div style={styles.buttonContainer}>
        <Link href="/auth/register" passHref>
          <button style={styles.button}>Get Started</button>
        </Link>
        <Link href="/auth/login" passHref>
          <button style={{ ...styles.button, ...styles.loginButton }}>Login</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "#f5f5f5",
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#C07B26",
    marginBottom: "1.5rem",
  },
  description: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "2rem",
    maxWidth: "600px",
    margin: "0 auto",
    paddingBottom:'20px'
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  button: {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "transparent",
    color: "#C07B26",
    border: "1px solid #C07B26",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  loginButton: {
    backgroundColor: "transparent",
    border: "1px solid gray",
    color:'gray'
     
    
  },
};

const globalStyles = {
  ':hover': {
    backgroundColor: "#005bb5", 
  }
};
