import React, { useState, useEffect } from 'react';
import './login.css';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('login_response', (data) => {
      console.log(data);

      if (data.status === 'error') {
        setError(data.message);
      } else {
        setError('');
        setIsAuthenticated(true);
        navigate(`/chat/${username}`);
      }

      setIsLoggingIn(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate, setIsAuthenticated, username]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (isLoggingIn) {
      return;
    }

    try {
      setIsLoggingIn(true);

      const socket = io('http://localhost:5000');

      
      setIsLoggingIn(true);

      
      socket.emit('logoff', username);

      const userData = {
        username: username,
        password: password,
      };

      
      socket.emit('login', userData);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <label className='title'>Log in</label>
        <input type="text" id="username" name="username" placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input type="password" id="password" name="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/>

        {error && <p className="error-message">{error}</p>}

        <button className='button_login' type="submit">Log In</button>

        <Link to="/signup">
          <button className='text-button'>sign up</button>
        </Link>
      </form>
    </div>
  );
};

export default Login;


