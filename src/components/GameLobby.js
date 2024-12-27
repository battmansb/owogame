import React from 'react';

function GameLobby({ onStartGame }) {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Game Lobby</h1>
            <p>Waiting for players to join...</p>
            <button
                onClick={onStartGame}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#2196F3', // Corrected color code
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Start Game
            </button>
        </div>
    );
}

export default GameLobby;
