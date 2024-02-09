import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Chat from './chat';

const PrivateRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/chat/:username"
          element={<PrivateRoute element={<Chat />} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/*"
          element={<Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
