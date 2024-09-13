import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import login from "./components/login";
import signup from "./components/signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" Component={login} />
        <Route path="/signup" Component={signup} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
