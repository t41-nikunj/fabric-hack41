import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSports } from "../api/sports";

export default function SportsPage() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSports()
      .then((data) => setSports(data.sports))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading sports...</p>;
  if (error) return <p className="text-center mt-10 text-red-400">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Book a Sport</h1>
      <div className="grid gap-4">
        {sports.map((sport) => (
          <Link
            key={sport.id}
            to={`/sports/${sport.id}/turfs`}
            className="flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{sport.icon}</span>
              <span className="text-lg font-medium">{sport.name}</span>
            </div>
            <span className="text-sm text-gray-400">
              {sport.available_turfs_count} turf{sport.available_turfs_count !== 1 ? "s" : ""} available
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}