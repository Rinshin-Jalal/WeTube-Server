import "./App.css";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUpAndSignIn/SignUp";
import Watch from "./pages/Watch/Watch";

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/watch/:_id" element={<Watch />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
