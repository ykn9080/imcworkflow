import { HomePage } from "./pages/HomePage";
import Completed from "./pages/Completed";
import Ongoing from "./pages/Ongoing";
import Setting from "./pages/Setting";
import Form from "./pages/Form";
import FormEdit from "./pages/FormEdit";
import FormList from "./pages/FormList";
import Process from "./pages/Process";
import ProcessList from "./pages/ProcessList";
import Organization from "./pages/Organization";
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
        <Route path="form/edit/:formId" element={<FormEdit />} />
        <Route path="form/list" element={<FormList />} />
        <Route exact path="form/:formId" element={<Form />} />
        <Route path="process/list" element={<ProcessList />} />
        <Route exact path="process/:processId" element={<Process />} />
        <Route path="organization" element={<Organization />} />
        <Route path="setting" element={<Setting />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
