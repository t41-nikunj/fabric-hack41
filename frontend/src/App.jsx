import { BrowserRouter, Routes, Route } from "react-router-dom";
import SportsPage from "./pages/SportsPage";
import TurfsPage from "./pages/TurfsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          <Route path="/" element={<SportsPage />} />
          <Route path="/sports/:sportId/turfs" element={<TurfsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}