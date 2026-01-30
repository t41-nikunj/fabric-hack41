import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTurfs } from "../api/sports";

export default function TurfsPage() {
  const { sportId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTurfs(sportId)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sportId]);

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading turfs...</p>;
  if (error) return <p className="text-center mt-10 text-red-400">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/" className="text-sm text-gray-400 hover:text-white transition">
        ← Back to sports
      </Link>
      <h1 className="text-3xl font-bold mt-4 mb-6">{data.sport} Turfs</h1>
      <div className="grid gap-4">
        {data.turfs.map((turf) => (
          <div
            key={turf.id}
            className={`p-4 rounded-lg border ${
              turf.is_available
                ? "border-green-600 bg-gray-800"
                : "border-gray-600 bg-gray-900 opacity-60"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{turf.name}</h2>
                <p className="text-sm text-gray-400">{turf.location}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{turf.price_per_hour}/hr</p>
                <p className={`text-xs mt-1 ${turf.is_available ? "text-green-400" : "text-red-400"}`}>
                  {turf.is_available ? "Available" : "Unavailable"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}