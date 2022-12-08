import { HomePage } from "./pages/HomePage";
import Completed from "./pages/Completed";
import Ongoing from "./pages/Ongoing";
import Setting from "./pages/Setting";
import Form from "./pages/Form";
import FormEdit from "./pages/FormEdit";
import Process from "./pages/Process";
import { Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="ongoing/:processtype" element={<Ongoing />} />
        <Route path="ongoing" element={<Ongoing />} />
        <Route path="completed/:id" element={<Completed />} />
        <Route path="completed" element={<Completed />} />
        <Route path="setting/:id" element={<Setting />} />
        <Route path="form/edit/:processId" element={<FormEdit />} />
        <Route exact path="form/:processId" element={<Form />} />
        <Route exact path="process/:processId" element={<Process />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
