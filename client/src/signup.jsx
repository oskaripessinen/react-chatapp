import React, { useState, useEffect } from 'react';
import './signup.css'
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('signup_response', (data) => {
      console.log(data);

      if (data.status === 'error') {
        setError(data.message);
      } else {
        setError('');
        
        navigate('/login');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('The passwords do not match');
      return;
    }

    const userData = {
      username: username,
      password: password,
    };
    console.log('Sending signup data:', userData);

    const socket = io('http://localhost:5000');
    socket.emit('signup', userData);
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <label className='title'>Sign up</label>
        <input type="text" id="username" name="username" placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input type="password" id="password" name="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        <input type="password" id="confirmpassword" name="confirmpassword" placeholder='confirm password' value={confirmPassword} onChange={(e) => setconPassword(e.target.value)}/>

        {error && <p className="error-message">{error}</p>}

        <button className='button_signup' type="submit">Sign up</button>
        
        <Link to="/login">
          <button className='text-button'>Log in</button>
        </Link>
      </form>
    </div>
  );
}

export default Signup;
