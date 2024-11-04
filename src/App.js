import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Login from "./components/Login.js";
import Signup from "./components/Signup.js";
import Dashboard from "./components/Dashboard.js";

function App() {
  const navigate = useNavigate();

  const handleClickLogin = () => {
    navigate("/login");
  };
  const handleClickSignup = () => {
    navigate("/signup");
  };

  return (
    <div>
      <nav className="main_nav">
        <span>Server Monitoring Service</span>
        <div className="login_btn_con">
          <button onClick={handleClickLogin}>Log In</button>
          <button onClick={handleClickSignup}>Sign Up</button>
        </div>
      </nav>
      <Routes>
        <Route path="/" Component={Dashboard} />
        <Route path="/login" Component={Login} />
        <Route path="/signup" Component={Signup} />
      </Routes>
    </div>
  );
}

export default App;
