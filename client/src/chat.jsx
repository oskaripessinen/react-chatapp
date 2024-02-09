import React, { useState, useEffect } from 'react';
import './chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup, faPlus, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';

const Chat = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  console.log(username);

  

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains('modal-overlay')) {
      handleModalClose();
    }
  };

  const [isModal2Open, setIsModal2Open] = useState(false);

  const openModal2 = () => {
    setIsModal2Open(true);
  };

  const handleModal2Close = () => {
    setIsModal2Open(false);
  };

  const handleOverlayClick2 = (event) => {
    if (event.target.classList.contains('modal-overlay')) {
      handleModal2Close();
    }
  };

  const handleLogout = () => {
    const socket = io('http://localhost:5000');
    socket.emit('logoff', username);
    navigate('/login');
  };

  useEffect(() => {
    const logoutTimer = setTimeout(() => {
      const socket = io('http://localhost:5000');
      socket.emit('logoff', username);
      navigate('/login');
    }, 600000); 
  
    return () => {
      clearTimeout(logoutTimer);
    };
  }, [username, navigate]);

  return (
    <div>
      <nav className="navbar">
        
        <div className='nowUsing'>
        <div className="userSquare">
          <div className='userLetter'>
            {username.charAt(0)}
          </div>
        </div>
        <div className='userFont'>
          {username}
        </div>
        <button className='addFriends' onClick={openModal}>
          <FontAwesomeIcon icon={faPlus} className='addFriends_symbol'/>
        </button>
      </div>
        <button className='fq_button' onClick={openModal2}>
          <FontAwesomeIcon icon={faUserGroup} className='fq_symbol'/>
        </button>
        <button className='logout' onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className='logoutSymbol' />
        </button>
      </nav>
      <div className='searchBox'>
        <input placeholder='Search' className='searchInput' />
      </div>
      <div className='usersBox'></div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal">
            <span className="close-button" onClick={handleModalClose}>
              &times;
            </span>
            <input type="text" className='requestInput' placeholder='send a friend request'/>
            <button className='requestButton'>
              <FontAwesomeIcon icon={faUserPlus} className='sq_symbol'/>
            </button>
          </div>
        </div>
      )}

      {isModal2Open && (
        <div className="modal-overlay" onClick={handleOverlayClick2}>
          <div className="modal">
            <span className="close-button" onClick={handleModal2Close}>
              &times;
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;



