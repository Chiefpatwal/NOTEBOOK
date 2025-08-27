import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import api from "./api";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await api.get("/api/visitors"); 
        setCount(res.data.count);
      } catch (err) {
        console.error("Error fetching visitor count", err);
      }
    };

    fetchVisitors();
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Visitor Counter */}
      <div className="absolute top-4 right-4 bg-inherit-600 text-green-500 px-5 py-2 rounded-md shadow">
        Visitors: {count}
      </div>

      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
