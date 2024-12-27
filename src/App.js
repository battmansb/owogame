import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameLobby from './components/GameLobby';
import Gameplay from './components/Gameplay';

function App() {
    const [screen, setScreen] = useState('start');
    const [gameOptions, setGameOptions] = useState({});

    const goToLobby = () => setScreen('lobby');
    const goToGameplay = (options) => {
        setGameOptions(options);
        setScreen('gameplay');
    };

    return (
        <div>
            {screen === 'start' && <StartScreen onStart={goToLobby} />}
            {screen === 'lobby' && (
                <GameLobby
                    onStartGame={() =>
                        goToGameplay({ rounds: 3, difficulty: 'easy' })
                    }
                />
            )}
            {screen === 'gameplay' && <Gameplay options={gameOptions} />}
        </div>
    );
}

export default App;
