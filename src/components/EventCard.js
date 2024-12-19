import Link from "next/link";

export default function EventCard({ event }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        margin: "1rem 0",
      }}
    >
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Start:</strong> {event.startDate}
      </p>
      <p>
        <strong>End:</strong> {event.endDate}
      </p>
      <Link href={`/hackathons/${event.id}`}>
        <button style={{ marginTop: "1rem" }}>View Details</button>
      </Link>
    </div>
  );
}
