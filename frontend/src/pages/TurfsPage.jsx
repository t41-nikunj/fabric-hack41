import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTurfs } from "../api/sports";

const SPORT_IMAGES = {
  Football: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1400&h=400&fit=crop",
  Badminton: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1400&h=400&fit=crop",
  Cricket: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1400&h=400&fit=crop",
  Basketball: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1400&h=400&fit=crop",
  Tennis: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&h=400&fit=crop",
};

const SPORT_DESCRIPTIONS = {
  Football: "Book football turfs and pitches for your next match",
  Badminton: "Play indoor badminton at premium courts across the city",
  Cricket: "Cricket grounds and nets for practice and matches",
  Basketball: "Professional basketball courts for casual and competitive play",
  Tennis: "Clay, grass, and hard courts available for booking",
};

const CITIES = ["Mumbai", "Delhi", "Bangalore"];

const VENUE_RATINGS = {};

function getVenueRating(name) {
  if (!VENUE_RATINGS[name]) {
    VENUE_RATINGS[name] = (3.5 + Math.random() * 1.5).toFixed(1);
  }
  return VENUE_RATINGS[name];
}

export default function TurfsPage() {
  const { sportId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    fetchTurfs(sportId)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sportId]);

  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading turfs...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-400">{error}</p>;

  const filteredTurfs = selectedCity
    ? data.turfs.filter((t) => t.location.includes(selectedCity))
    : data.turfs;

  // Venue detail view
  if (selectedVenue) {
    return <VenueDetail venue={selectedVenue} sport={data.sport} sportId={sportId} onBack={() => setSelectedVenue(null)} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[360px] overflow-hidden">
        <img
          src={SPORT_IMAGES[data.sport] || SPORT_IMAGES.Football}
          alt={data.sport}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <Link
          to="/"
          className="absolute top-8 left-8 w-11 h-11 rounded-full bg-slate-900/60 backdrop-blur flex items-center justify-center hover:bg-slate-900/80 transition"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
            {data.sport}
          </h1>
          <p className="text-gray-300 text-lg">
            {SPORT_DESCRIPTIONS[data.sport] || "Find the best venues near you"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* City Filter */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">Select City</h2>
          <div className="flex gap-3">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() =>
                  setSelectedCity(selectedCity === city ? null : city)
                }
                className={`px-6 py-3 rounded-full text-sm font-medium transition ${
                  selectedCity === city
                    ? "bg-[#155dfc] text-white border-2 border-[#2b7fff]"
                    : "bg-slate-800 text-gray-300 border border-slate-700 hover:bg-slate-700"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Venues */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">
            Venues{selectedCity ? ` in ${selectedCity}` : ""}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTurfs.map((turf) => {
              const rating = getVenueRating(turf.name);
              return (
                <div
                  key={turf.id}
                  className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {turf.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {turf.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white">{rating}</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-gray-500">Starting from</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">
                          ₹{turf.price_per_hour}
                        </span>
                        <span className="text-sm text-gray-500">/hour</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedVenue(turf)}
                      className="px-5 py-2 bg-[#155dfc] hover:bg-[#1249d6] text-white text-sm font-medium rounded-full transition"
                    >
                      View Slots
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredTurfs.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No venues found{selectedCity ? ` in ${selectedCity}` : ""}.
              Try selecting a different city.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function VenueDetail({ venue, sport, onBack }) {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slots = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM",
  ];

  function getDateLabel(d, idx) {
    if (idx === 0) return "Today";
    if (idx === 1) return "Tomorrow";
    return dayLabels[d.getDay()];
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[360px] overflow-hidden">
        <img
          src={SPORT_IMAGES[sport] || SPORT_IMAGES.Football}
          alt={sport}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-8 left-8 w-11 h-11 rounded-full bg-slate-900/60 backdrop-blur flex items-center justify-center hover:bg-slate-900/80 transition"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
            {sport}
          </h1>
          <p className="text-gray-300 text-lg">
            {SPORT_DESCRIPTIONS[sport] || "Find the best venues near you"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Back to venues */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-sm text-gray-400 hover:text-white hover:border-slate-500 transition mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to venues
        </button>

        {/* Venue Card */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-1">{venue.name}</h2>
          <p className="text-gray-400 mb-8">{venue.location}</p>

          {/* Date Picker */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#155dfc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Select Date</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {dates.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedDate(idx); setSelectedSlot(null); }}
                  className={`flex-shrink-0 w-24 py-4 rounded-xl text-center transition ${
                    selectedDate === idx
                      ? "bg-[#155dfc] text-white"
                      : "bg-slate-700/50 text-gray-300 border border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  <div className="text-xs mb-1 uppercase">{getDateLabel(d, idx)}</div>
                  <div className="text-lg font-semibold">
                    {d.getDate()} {monthNames[d.getMonth()]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#155dfc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-white">Available Slots</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 rounded-lg text-sm font-medium transition ${
                    selectedSlot === slot
                      ? "bg-[#155dfc] text-white"
                      : "bg-slate-700/50 text-gray-300 border border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
