import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Gallary from "./Components/Gallary";
import Home from "./Home";
import BasicForm from "./Components/BasicForm";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/gallery" element={<Gallary></Gallary>} />
          <Route path="/form" element={<BasicForm></BasicForm>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
