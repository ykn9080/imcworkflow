import { HomePage } from "./pages/HomePage";
import Completed from "./pages/Completed";
import Ongoing from "./pages/Ongoing";
import Setting from "./pages/Setting";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="ongoing" element={<Ongoing />} />
        <Route path="completed" element={<Completed />} />
        <Route path="setting" element={<Setting />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
