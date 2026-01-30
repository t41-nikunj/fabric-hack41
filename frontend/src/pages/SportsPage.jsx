import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSports } from "../api/sports";
import { createLogger } from "../utils/logger";

const logger = createLogger('SportsPage');

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
    logger.info('SportsPage mounted, fetching sports');
    fetchSports()
      .then((data) => {
        logger.info('Sports data loaded', { count: data.sports?.length });
        setSports(data.sports);
      })
      .catch((err) => {
        logger.error('Failed to load sports', { error: err.message });
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading sports...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-400">{error}</p>;


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden min-h-[956px]"
        style={{
          backgroundImage:
            "linear-gradient(144.5deg, #020618 0%, #0f172b 50%, #020618 100%)",
        }}
      >
        {/* Decorative gradient blurs */}
        <div
          className="absolute right-[-100px] top-[-53px] w-[906px] h-[906px] rounded-full opacity-[0.24] blur-[80px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(59,130,246,0.4) 0%, rgba(30,65,123,0.2) 35%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[-5px] top-[351px] w-[610px] h-[610px] rounded-full opacity-[0.16] blur-[80px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(34,197,94,0.4) 0%, rgba(17,99,47,0.2) 35%, transparent 70%)",
          }}
        />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[128px] bg-gradient-to-t from-[#020618] to-transparent pointer-events-none" />

        <div className="relative max-w-[1277px] mx-auto px-8 pt-[128px] flex flex-col lg:flex-row gap-[64px]">
          {/* Left - Text Content */}
          <div className="flex-1 max-w-[606px] pt-[51px]">
            {/* Badge */}
            <div className="inline-flex items-center px-[17px] py-[9px] rounded-full border border-[rgba(43,127,255,0.2)] bg-[rgba(43,127,255,0.1)] mb-[56px]">
              <span className="text-[14px] font-medium leading-[20px] tracking-[-0.15px] text-[#51a2ff]">
                Unified Sports Ecosystem
              </span>
            </div>

            {/* Heading */}
            <div className="mb-[32px]">
              <h1 className="text-[96px] font-bold leading-[105.6px] tracking-[-2.4px] text-white">
                Where Sports
              </h1>
              <span
                className="text-[96px] font-bold leading-[105.6px] tracking-[-2.4px] bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #51a2ff 0%, #00d3f2 50%, #05df72 100%)",
                }}
              >
                Comes Alive
              </span>
            </div>

            {/* Paragraph */}
            <p className="text-[20px] font-normal leading-[32.5px] tracking-[-0.45px] text-[#90a1b9] max-w-[490px] mb-[32px]">
              One platform connecting athletes, communities, and moments.
              Experience the future of how sports is played, shared, and
              celebrated.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-[16px] mb-[32px]">
              <Link
                to="/"
                className="flex items-center justify-center h-[48px] px-[31px] bg-[#155dfc] text-white text-[18px] font-medium leading-[28px] tracking-[-0.44px] rounded-full hover:bg-[#1249d6] transition"
              >
                Get Started
              </Link>
              <a
                href="#sports"
                className="flex items-center justify-center h-[50px] px-[33px] bg-white border border-[#45556c] text-[#155dfc] text-[18px] font-medium leading-[28px] tracking-[-0.44px] rounded-full hover:bg-gray-100 transition"
              >
                Explore Platform
              </a>
            </div>

            {/* Stats */}
            <div className="flex items-start gap-[32px] pt-[32px]">
              <div>
                <div className="text-[30px] font-bold leading-[36px] tracking-[0.4px] text-white">
                  2M+
                </div>
                <div className="text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[#62748e]">
                  Active Athletes
                </div>
              </div>
              <div className="w-px h-[56px] bg-[#1d293d]" />
              <div>
                <div className="text-[30px] font-bold leading-[36px] tracking-[0.4px] text-white">
                  500K+
                </div>
                <div className="text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[#62748e]">
                  Communities
                </div>
              </div>
              <div className="w-px h-[56px] bg-[#1d293d]" />
              <div>
                <div className="text-[30px] font-bold leading-[36px] tracking-[0.4px] text-white">
                  50+
                </div>
                <div className="text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-[#62748e]">
                  Sports
                </div>
              </div>
            </div>
          </div>

          {/* Right - Image Collage */}
          <div className="flex-1 relative hidden lg:block h-[700px] max-w-[606px]">
            {/* Decorative blur spots */}
            <div
              className="absolute right-0 top-[38px] w-[189px] h-[189px] rounded-full blur-[40px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(59,130,246,0.6) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute left-[38px] top-[448px] w-[132px] h-[132px] rounded-full blur-[30px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(34,197,94,0.5) 0%, transparent 70%)",
              }}
            />

            {/* Main athlete image */}
            <div className="absolute right-0 top-[25px] w-[400px] h-[500px] rounded-[24px] overflow-hidden shadow-[0px_0px_80px_0px_rgba(59,130,246,0.3)]">
              <img
                src="https://images.unsplash.com/photo-1461896836934-bd45ba7a7e3a?w=400&h=500&fit=crop"
                alt="Athlete in motion"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(129deg, rgba(21,93,252,0.3) 0%, transparent 50%, rgba(0,201,80,0.2) 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,43,0.8)] via-transparent to-transparent" />
            </div>

            {/* Basketball player image */}
            <div className="absolute left-0 top-[174px] w-[320px] h-[380px] rounded-[24px] overflow-hidden opacity-60 shadow-[0px_0px_60px_0px_rgba(34,197,94,0.2)]">
              <img
                src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=320&h=380&fit=crop"
                alt="Basketball player"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(130deg, rgba(0,201,80,0.4) 0%, transparent 50%, rgba(43,127,255,0.3) 100%)",
                }}
              />
              <div className="absolute inset-0 bg-[rgba(15,23,43,0.4)]" />
            </div>

            {/* Decorative dots */}
            {[
              { left: 121, top: 59, size: 4.7, opacity: 0.3 },
              { left: 181, top: 97, size: 5.85, opacity: 0.61 },
              { left: 242, top: 152, size: 5.95, opacity: 0.69 },
              { left: 302, top: 215, size: 5.52, opacity: 0.47 },
              { left: 363, top: 280, size: 4.91, opacity: 0.34 },
              { left: 424, top: 343, size: 4.43, opacity: 0.26 },
              { left: 485, top: 404, size: 4.15, opacity: 0.22 },
              { left: 546, top: 462, size: 4.03, opacity: 0.2 },
            ].map((dot, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-[#51a2ff]"
                style={{
                  left: `${dot.left}px`,
                  top: `${dot.top}px`,
                  width: `${dot.size}px`,
                  height: `${dot.size}px`,
                  opacity: dot.opacity,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Find Your Game Section */}
      <section id="sports" className="bg-[#020618] px-8 py-16">
        <div className="max-w-[1277px] mx-auto relative">
          {/* Decorative vertical gradient bar */}
          <div className="absolute left-[-16px] top-0 w-[4px] h-[152px] rounded-full bg-gradient-to-b from-[#2b7fff] via-[#00d3f2] to-[#05df72]" />

          {/* Section header */}
          <div className="mb-[64px]">
            <h2 className="text-[60px] font-bold leading-[60px] tracking-[0.26px] text-white mb-[16px]">
              Find Your Game
            </h2>
            <div className="w-[120px] h-[4px] rounded-full bg-gradient-to-r from-[#2b7fff] via-[#00d3f2] to-transparent mb-[20px]" />
            <p className="text-[20px] font-normal leading-[28px] tracking-[-0.45px] text-[#90a1b9] max-w-[656px]">
              Browse through a variety of sports and discover venues near you.
              Your next game is just a click away.
            </p>
          </div>

          {/* Sports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sports.map((sport) => (
              <Link
                key={sport.id}
                to={`/sports/${sport.id}/turfs`}
                className="group rounded-[24px] overflow-hidden border border-[#1d293d] bg-[#0f172b] hover:border-[#314158] transition-all"
              >
                {/* Image */}
                <div className="relative h-[256px] overflow-hidden">
                  <img
                    src={SPORT_IMAGES[sport.name] || SPORT_IMAGES.Football}
                    alt={sport.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172b] via-[rgba(15,23,43,0.5)] to-transparent" />
                </div>

                {/* Content */}
                <div className="px-[24px] pt-[24px] pb-[24px] flex flex-col gap-[12px]">
                  <h3 className="text-[24px] font-bold leading-[32px] tracking-[0.07px] text-white">
                    {sport.name}
                  </h3>
                  <p className="text-[14px] font-normal leading-[22.75px] tracking-[-0.15px] text-[#90a1b9]">
                    {SPORT_DESCRIPTIONS[sport.name] || "Book your next game"}
                  </p>
                  <div className="flex items-center gap-[8px]">
                    <svg
                      className="w-4 h-4 text-[#62748e]"
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
                    <span className="text-[12px] font-normal leading-[16px] text-[#62748e]">
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
