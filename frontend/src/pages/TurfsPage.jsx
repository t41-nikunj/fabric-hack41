import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTurfs } from "../api/sports";
import { createLogger } from "../utils/logger";

const logger = createLogger('TurfsPage');

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
    logger.info('TurfsPage mounted', { sportId });
    fetchTurfs(sportId)
      .then((result) => {
        logger.info('Turfs data loaded', { sportId, sport: result.sport, count: result.turfs?.length });
        setData(result);
      })
      .catch((err) => {
        logger.error('Failed to load turfs', { sportId, error: err.message });
        setError(err.message);
      })
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
    logger.info('Viewing venue details', { venue: selectedVenue.name });
    return <VenueDetail venue={selectedVenue} sport={data.sport} sportId={sportId} onBack={() => setSelectedVenue(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#020618]">
      {/* Hero Banner */}
      <div className="relative h-[374px] overflow-hidden">
        <img
          src={SPORT_IMAGES[data.sport] || SPORT_IMAGES.Football}
          alt={data.sport}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020618] via-[rgba(2,6,24,0.8)] to-transparent" />
        <Link
          to="/"
          className="absolute top-[32px] left-[32px] w-[46px] h-[46px] rounded-full bg-[rgba(15,23,43,0.8)] border border-[#314158] flex items-center justify-center hover:bg-[rgba(15,23,43,0.95)] transition"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="absolute bottom-[32px] left-[32px] right-[32px] flex flex-col gap-[12px]">
          <h1 className="text-[60px] font-bold leading-[60px] tracking-[0.26px] text-white">
            {data.sport}
          </h1>
          <p className="text-[20px] font-normal leading-[28px] tracking-[-0.45px] text-[#cad5e2]">
            {SPORT_DESCRIPTIONS[data.sport] || "Find the best venues near you"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-[32px] pt-[48px] pb-[48px] flex flex-col gap-[48px]">
        {/* City Filter */}
        <div className="flex flex-col gap-[16px]">
          <h2 className="text-[24px] font-bold leading-[32px] tracking-[0.07px] text-white">
            Select City
          </h2>
          <div className="flex gap-[12px]">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() =>
                  setSelectedCity(selectedCity === city ? null : city)
                }
                className={`px-[26px] py-[13px] rounded-full text-[16px] font-medium leading-[24px] tracking-[-0.31px] transition ${selectedCity === city
                    ? "bg-[#155dfc] text-white border-2 border-[#2b7fff]"
                    : "bg-[#0f172b] text-[#cad5e2] border-2 border-[#1d293d] hover:border-[#314158]"
                  }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Venues */}
        <div className="flex flex-col gap-[24px]">
          <h2 className="text-[24px] font-bold leading-[32px] tracking-[0.07px] text-white">
            Venues{selectedCity ? ` in ${selectedCity}` : ""}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            {filteredTurfs.map((turf) => {
              const rating = getVenueRating(turf.name);
              return (
                <div
                  key={turf.id}
                  className="rounded-[16px] border border-[#1d293d] bg-[#0f172b] p-[25px] flex flex-col gap-[16px]"
                >
                  {/* Header row */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-[4px]">
                      <h3 className="text-[20px] font-bold leading-[28px] tracking-[-0.45px] text-white">
                        {turf.name}
                      </h3>
                      <div className="flex items-center gap-[8px]">
                        <svg className="w-4 h-4 text-[#90a1b9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[#90a1b9]">
                          {turf.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[4px]">
                      <svg className="w-4 h-4 text-[#fdc700]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-[14px] font-medium leading-[20px] tracking-[-0.15px] text-[#fdc700]">
                        {rating}
                      </span>
                    </div>
                  </div>

                  {/* Price row */}
                  <div className="flex items-center justify-between border-t border-[#1d293d] pt-[16px]">
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[#62748e]">
                        Starting from
                      </span>
                      <div className="flex items-baseline">
                        <span className="text-[24px] font-bold leading-[32px] tracking-[0.07px] text-white">
                          ₹{turf.price_per_hour}
                        </span>
                        <span className="text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[#90a1b9] ml-[1px]">
                          /hour
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedVenue(turf)}
                      className="px-[24px] py-[8px] bg-[#155dfc] hover:bg-[#1249d6] text-white text-[14px] font-medium leading-[20px] tracking-[-0.15px] rounded-full transition"
                    >
                      View Slots
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredTurfs.length === 0 && (
            <p className="text-[#62748e] text-center py-8">
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

  // Some slots are unavailable (matching Figma: 08:00 AM, 11:00 AM, 03:00 PM, 07:00 PM)
  const unavailableSlots = new Set(["08:00 AM", "11:00 AM", "03:00 PM", "07:00 PM"]);

  function getDateLabel(d, idx) {
    if (idx === 0) return "Today";
    if (idx === 1) return "Tomorrow";
    return dayLabels[d.getDay()];
  }

  return (
    <div className="min-h-screen bg-[#020618]">
      {/* Hero Banner */}
      <div className="relative h-[374px] overflow-hidden">
        <img
          src={SPORT_IMAGES[sport] || SPORT_IMAGES.Football}
          alt={sport}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020618] via-[rgba(2,6,24,0.8)] to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-[32px] left-[32px] w-[46px] h-[46px] rounded-full bg-[rgba(15,23,43,0.8)] border border-[#314158] flex items-center justify-center hover:bg-[rgba(15,23,43,0.95)] transition"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="absolute bottom-[32px] left-[32px] right-[32px] flex flex-col gap-[12px]">
          <h1 className="text-[60px] font-bold leading-[60px] tracking-[0.26px] text-white">
            {sport}
          </h1>
          <p className="text-[20px] font-normal leading-[28px] tracking-[-0.45px] text-[#cad5e2]">
            {SPORT_DESCRIPTIONS[sport] || "Find the best venues near you"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-[32px] pt-[48px] pb-[48px] flex flex-col gap-[48px]">
        {/* City Filter */}
        <div className="flex flex-col gap-[16px]">
          <h2 className="text-[24px] font-bold leading-[32px] tracking-[0.07px] text-white">
            Select City
          </h2>
          <div className="flex gap-[12px]">
            {CITIES.map((city) => (
              <button
                key={city}
                className="px-[26px] py-[13px] rounded-full text-[16px] font-medium leading-[24px] tracking-[-0.31px] bg-[#0f172b] text-[#cad5e2] border-2 border-[#1d293d] cursor-default"
                disabled
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Venue Detail */}
        <div>
          {/* Back to venues */}
          <button
            onClick={onBack}
            className="flex items-center gap-[8px] px-[12px] py-[10px] rounded-[8px] text-[14px] font-medium leading-[20px] tracking-[-0.15px] text-[#90a1b9] hover:text-white transition mb-[24px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to venues
          </button>

          {/* Venue Card */}
          <div className="rounded-[24px] border border-[#1d293d] bg-[#0f172b] p-[33px]">
            <h2 className="text-[30px] font-bold leading-[36px] tracking-[0.4px] text-white mb-[8px]">
              {venue.name}
            </h2>
            <p className="text-[16px] font-normal leading-[24px] tracking-[-0.31px] text-[#90a1b9] mb-[32px]">
              {venue.location}
            </p>

            {/* Date Picker */}
            <div className="mb-[32px]">
              <div className="flex items-center gap-[8px] mb-[16px]">
                <svg className="w-5 h-5 text-[#155dfc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-[18px] font-semibold leading-[28px] tracking-[-0.44px] text-white">
                  Select Date
                </h3>
              </div>
              <div className="flex gap-[12px] overflow-x-auto">
                {dates.map((d, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedDate(idx); setSelectedSlot(null); }}
                    className={`flex-shrink-0 w-[100px] h-[80px] rounded-[14px] flex flex-col items-center justify-center gap-[4px] transition ${selectedDate === idx
                        ? "bg-[#155dfc] text-white"
                        : "bg-[#1d293d] text-[#cad5e2] hover:bg-[#253347]"
                      }`}
                    style={idx === 0 && selectedDate === 0 ? { width: "107px" } : {}}
                  >
                    <span className="text-[12px] font-medium leading-[16px] uppercase">
                      {getDateLabel(d, idx)}
                    </span>
                    <span className="text-[18px] font-bold leading-[28px] tracking-[-0.44px]">
                      {d.getDate()} {monthNames[d.getMonth()]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <div className="flex items-center gap-[8px] mb-[16px]">
                <svg className="w-5 h-5 text-[#155dfc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-[18px] font-semibold leading-[28px] tracking-[-0.44px] text-white">
                  Available Slots
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[12px]">
                {slots.map((slot) => {
                  const isUnavailable = unavailableSlots.has(slot);
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => !isUnavailable && setSelectedSlot(slot)}
                      disabled={isUnavailable}
                      className={`h-[48px] rounded-[14px] text-[14px] font-medium leading-[20px] tracking-[-0.15px] text-center transition ${isUnavailable
                          ? "bg-[rgba(29,41,61,0.5)] text-[#45556c] cursor-not-allowed"
                          : isSelected
                            ? "bg-[#155dfc] text-white border-2 border-[#2b7fff]"
                            : "bg-[#1d293d] text-[#cad5e2] border-2 border-transparent hover:bg-[#253347]"
                        }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
