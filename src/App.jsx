import React, { useState } from "react"; 
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Gallary from "./Components/Gallary";
import Home from "./Home";
import BasicForm from "./Components/BasicForm";
import SplitWise from "./SplitWiseApp/SplitWiseHomePage";
import Login from "./Components/Login";

function ProtectedRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/gallery" element={<Gallary></Gallary>} />
          <Route path="/form" element={<BasicForm></BasicForm>} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route
          path="/splitwise"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <SplitWise />
            </ProtectedRoute>
          }
        />
        </Routes>
      </Router>
    </>
  );
}

export default App;
