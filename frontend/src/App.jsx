import { BrowserRouter, Routes, Route } from "react-router-dom";
import SportsPage from "./pages/SportsPage";
import TurfsPage from "./pages/TurfsPage";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#020618] text-white">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/sports/:sportId/turfs" element={<TurfsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}