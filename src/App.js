import "./App.css";
import FormComponent from "./components/Form";
import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/reset-password" element={<FormComponent />} />
    </Routes>
  );
}

export default App;
