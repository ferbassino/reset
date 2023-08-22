import "./App.css";
import FormComponent from "./components/Form";
import { Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <Routes>
      <Route path="/reset-password" element={<FormComponent />} exact></Route>
    </Routes>
  );
}

export default App;
