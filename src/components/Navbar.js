"use client";

import { useRouter } from "next/navigation";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#C07B26",
      }}
    >
      <Link href="/" style={{ fontWeight: "bold", fontSize: "1.5rem", textDecoration: "none", color: "white" }}>
        Hackathon App
      </Link>
      <div>
        {user ? (
          <>
            <Link href="/dashboard" style={{ marginRight: "1rem", textDecoration: "none", color: "white" }}>
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.5rem 1rem",
                border: "none",
                backgroundColor: "none",
                color: "#C07B26",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" style={{ marginRight: "1rem", textDecoration: "none", color: "#0070f3" }}>
              Login
            </Link>
            <Link href="/auth/register" style={{ textDecoration: "none", color: "#0070f3" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
