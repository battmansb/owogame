const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow requests from the frontend
        methods: ['GET', 'POST'],
    },
});

// Game state
let gameState = {
    players: [],
    clues: [],
    secretPassword: 'password123', // Static secret password for now
    guessHistory: [],
    currentPlayerIndex: 0,
    gameStarted: false,
};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Player joins the game
    socket.on('joinGame', (playerName) => {
        gameState.players.push({ id: socket.id, name: playerName, score: 0 });
        console.log(`${playerName} joined the game.`);
        io.emit('updateGameState', gameState); // Update all clients
    });

    // Start the game
    socket.on('startGame', () => {
        console.log('Game started!');
        gameState.gameStarted = true;
        gameState.clues = ['First clue']; // Add the first hint
        io.emit('gameStarted', { clues: gameState.clues }); // Notify players
        io.emit('updateGameState', gameState); // Broadcast game state
    });

    // Submit a guess
    socket.on('submitGuess', (guess) => {
        console.log(`Guess submitted: ${guess}`);
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];

        // Add guess to history
        gameState.guessHistory.push({ player: currentPlayer.name, guess });

        // Check if guess is correct
        if (guess.toLowerCase() === gameState.secretPassword.toLowerCase()) {
            currentPlayer.score += 1;
            io.emit('correctGuess', { player: currentPlayer.name, score: currentPlayer.score });
            resetGame(); // Reset game after a correct guess
        } else {
            // Move to the next player and provide a new clue
            gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
            gameState.clues.push(`New clue related to "${gameState.secretPassword}"`);
            io.emit('updateGameState', gameState); // Broadcast updated game state
            io.emit('wrongGuess', { guess, player: currentPlayer.name });
        }
    });

    const resetGame = async () => {
        console.log('Resetting game...');
    
        // List of potential secret words
        const words = ['example', 'game', 'program', 'secret'];
        const randomWord = words[Math.floor(Math.random() * words.length)]; // Pick a random word
    
        // Set the secret word in the game state
        gameState.secretPassword = randomWord;
    
        try {
            // Call the Flask API to generate clues
            const response = await axios.post('http://127.0.0.1:5000/generate_clues', {
                secret_word: randomWord,
            });
            gameState.clues = response.data.clues; // Use the fetched clues
        } catch (error) {
            console.error('Error fetching clues from Flask:', error);
            gameState.clues = ['Fallback clue1', 'Fallback clue2']; // Fallback in case of error
        }
    
        // Reset other game state variables
        gameState.guessHistory = [];
        gameState.currentPlayerIndex = 0;
    
        // Notify all players of the updated game state
        io.emit('updateGameState', gameState);
    };    
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
