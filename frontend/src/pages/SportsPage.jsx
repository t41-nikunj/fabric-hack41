import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSports } from "../api/sports";

const SPORT_IMAGES = {
  Football: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&h=400&fit=crop",
  Badminton: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&h=400&fit=crop",
  Cricket: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop",
  Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop",
  Tennis: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop",
  Swimming: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop",
};

const SPORT_DESCRIPTIONS = {
  Football: "Book football turfs and pitches for your next match",
  Badminton: "Play indoor badminton at premium courts across the city",
  Cricket: "Cricket grounds and nets for practice and matches",
  Basketball: "Professional basketball courts for casual and competitive play",
  Tennis: "Clay, grass, and hard courts available for booking",
  Swimming: "Olympic-size pools for training and recreation",
};

const SPORT_CITIES = {
  Football: 4,
  Badminton: 3,
  Cricket: 4,
  Basketball: 3,
  Tennis: 3,
  Swimming: 3,
};

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

  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading sports...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-400">{error}</p>;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-8 pt-12 pb-16">
        {/* Decorative gradient blurs */}
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left - Text Content */}
          <div className="flex-1 max-w-xl">
            <span className="inline-block px-4 py-1.5 rounded-full border border-slate-700 text-xs text-gray-400 mb-6 tracking-wide">
              Unified Sports Ecosystem
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Where Sports</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Comes Alive
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              One platform connecting athletes, communities, and moments.
              Experience the future of how sports is played, shared, and
              celebrated.
            </p>
            <div className="flex gap-4 mb-10">
              <Link
                to="/"
                className="px-6 py-3 bg-[#155dfc] text-white font-semibold rounded-full hover:bg-[#1249d6] transition text-sm"
              >
                Get Started
              </Link>
              <a
                href="#sports"
                className="px-6 py-3 border border-[#45556c] text-[#155dfc] font-semibold rounded-full hover:bg-slate-800 transition text-sm"
              >
                Explore Platform
              </a>
            </div>
            <div className="flex items-center gap-6 text-white">
              <div>
                <div className="text-2xl font-bold">2M+</div>
                <div className="text-xs text-gray-500">Active Athletes</div>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div>
                <div className="text-2xl font-bold">500K+</div>
                <div className="text-xs text-gray-500">Communities</div>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-xs text-gray-500">Sports</div>
              </div>
            </div>
          </div>

          {/* Right - Image Collage */}
          <div className="flex-1 relative hidden lg:block h-[500px]">
            <div className="absolute right-0 top-0 w-[320px] h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1461896836934-bd45ba7a7e3a?w=400&h=500&fit=crop"
                alt="Athlete"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
            <div className="absolute left-0 top-[120px] w-[260px] h-[320px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=320&h=380&fit=crop"
                alt="Basketball"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Find Your Game Section */}
      <section id="sports" className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-2">
            Find Your Game
          </h2>
          <div className="w-20 h-1 bg-emerald-500 rounded mb-4" />
          <p className="text-gray-400 text-lg mb-12 max-w-2xl">
            Browse through a variety of sports and discover venues near you.
            Your next game is just a click away.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sports.map((sport) => (
              <Link
                key={sport.id}
                to={`/sports/${sport.id}/turfs`}
                className="group rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-800/50 hover:border-slate-600 transition-all"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={SPORT_IMAGES[sport.name] || SPORT_IMAGES.Football}
                    alt={sport.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {sport.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    {SPORT_DESCRIPTIONS[sport.name] || "Book your next game"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>
                      {SPORT_CITIES[sport.name] || 3} cities
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
