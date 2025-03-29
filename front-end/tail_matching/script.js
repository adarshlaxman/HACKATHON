// Constants with expanded emoji set
const EMOJIS = ['🌌', '🌠', '🎆', '🎇', '🌃', '🌉', '🌙', '🪐',
    '🚀', '👽', '🛸', '🌍', '🔭', '⭐', '⚡', '🌀',
    '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘',
    '☄️', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑'];

const MODES = {
easy: 3,   // 24 cards (8 pairs × 3)
normal: 2,  // 16 cards (8 pairs × 2)
hard: 1     // 32 cards (16 pairs × 2) - Now using 16 unique pairs
};

// Game state
let state = {
cards: [],
flipped: [],
matched: 0,
moves: 0,
canFlip: true,
timer: 0,
score: 0,
mode: 'normal',
interval: null,
paused: false,
started: false,
lastCard: null
};

// DOM elements
const elements = {
game: document.getElementById('game'),
moves: document.getElementById('moves'),
pairs: document.getElementById('pairs'),
time: document.getElementById('time'),
score: document.getElementById('score'),
reset: document.getElementById('reset'),
pause: document.getElementById('pause'),
easy: document.getElementById('easy'),
normal: document.getElementById('normal'),
hard: document.getElementById('hard'),
win: document.getElementById('winMessage'),
finalMoves: document.getElementById('finalMoves'),
finalScore: document.getElementById('finalScore'),
finalTime: document.getElementById('finalTime'),
playAgain: document.getElementById('playAgain')
};

// Initialize game
const initGame = () => {
// Clear existing game
clearInterval(state.interval);
elements.game.innerHTML = '';
elements.game.classList.remove('hard-mode');

// Reset state
state = {
...state,
cards: [],
flipped: [],
matched: 0,
moves: 0,
canFlip: true,
timer: 0,
score: 0,
interval: null,
paused: false,
started: false,
lastCard: null
};

// Update UI
updateStats();
elements.win.style.display = 'none';
elements.pause.textContent = 'Pause';

// Create cards based on mode
if (state.mode === 'hard') {
elements.game.classList.add('hard-mode');
// For hard mode, use first 16 unique emojis (32 cards total)
const selectedEmojis = EMOJIS.slice(0, 16);
state.cards = [...selectedEmojis, ...selectedEmojis];
} else {
// For easy/normal, use first 8 emojis with duplicates
const selectedEmojis = EMOJIS.slice(0, 8);
state.cards = Array(MODES[state.mode]).fill(selectedEmojis).flat();
}

state.cards.sort(() => Math.random() - 0.5);

// Render cards
state.cards.forEach((emoji, i) => {
const card = document.createElement('div');
card.className = 'card';
card.dataset.index = i;
card.dataset.value = emoji;
card.addEventListener('click', flipCard);
elements.game.appendChild(card);
});
};

// Flip card handler
const flipCard = function() {
if (!state.canFlip || this.classList.contains('flipped') || this.classList.contains('matched')) return;

this.classList.add('flipped');
this.textContent = this.dataset.value;
state.flipped.push(this);

// Start timer on first move
if (!state.started) {
state.started = true;
state.interval = setInterval(updateTimer, 1000);
}

// Check for consecutive same emoji (penalty)
if (state.lastCard && this.dataset.value === state.lastCard.dataset.value && 
!state.lastCard.classList.contains('matched')) {
state.score = Math.max(0, state.score - 5);
updateStats();
}

state.lastCard = this;

// Check for match if two cards flipped
if (state.flipped.length === 2) {
state.canFlip = false;
state.moves++;
updateStats();
setTimeout(checkMatch, 500);
}
};

// Check for matches
const checkMatch = () => {
const [card1, card2] = state.flipped;

if (card1.dataset.value === card2.dataset.value) {
card1.classList.add('matched');
card2.classList.add('matched');
state.matched++;
state.score += 10;

// Update win condition based on mode
const pairsToWin = state.mode === 'hard' ? 16 : 8;
if (state.matched === pairsToWin) {
clearInterval(state.interval);
setTimeout(showWinMessage, 500);
}
} else {
card1.classList.remove('flipped');
card2.classList.remove('flipped');
card1.textContent = '';
card2.textContent = '';
}

state.flipped = [];
state.canFlip = true;
updateStats();
};

// Update game stats display
const updateStats = () => {
elements.moves.textContent = state.moves;
const pairsToWin = state.mode === 'hard' ? 16 : 8;
elements.pairs.textContent = `${state.matched}/${pairsToWin}`;
elements.time.textContent = `${state.timer}s`;
elements.score.textContent = state.score;
};

// Update timer
const updateTimer = () => {
if (!state.paused) {
state.timer++;
elements.time.textContent = `${state.timer}s`;
}
};

// Show win message
const showWinMessage = () => {
elements.finalMoves.textContent = state.moves;
elements.finalScore.textContent = state.score;
elements.finalTime.textContent = `${state.timer}s`;
elements.win.style.display = 'block';
};

// Toggle pause
const togglePause = () => {
state.paused = !state.paused;
elements.pause.textContent = state.paused ? 'Resume' : 'Pause';
};

// Set game mode
const setMode = (mode) => {
state.mode = mode;
initGame();
};

// Event listeners
elements.reset.addEventListener('click', initGame);
elements.pause.addEventListener('click', togglePause);
elements.easy.addEventListener('click', () => setMode('easy'));
elements.normal.addEventListener('click', () => setMode('normal'));
elements.hard.addEventListener('click', () => setMode('hard'));
elements.playAgain.addEventListener('click', initGame);

// Initialize first game
initGame();