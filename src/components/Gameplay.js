import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001'); 

function Gameplay() {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server'); 
    });

    socket.on('updateGameState', (state) => {
      setGameState(state);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server'); 
    });

    return () => {
      socket.off('connect');
      socket.off('updateGameState');
      socket.off('disconnect');
    };
  }, []); 

  return (
    <div>
      {/* ... rest of your component code ... */}
    </div>
  );
}

export default Gameplay;