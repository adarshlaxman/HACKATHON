document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.querySelector('.grid-container');
    const movesDisplay = document.querySelector('.moves');
    const timerDisplay = document.querySelector('.time');
    const newGameBtn = document.querySelector('.new-game');
    const solveBtn = document.querySelector('.solve-puzzle');
    const timeBtns = document.querySelectorAll('.time-btn');
    const winPopup = document.querySelector('.win-popup');
    const uploadBtn = document.querySelector('#upload-btn');
    const imageUpload = document.querySelector('#image-upload');
    const useNumbersBtn = document.querySelector('#use-numbers');
    const customMinutesInput = document.querySelector('#custom-minutes');
    const setCustomBtn = document.querySelector('#set-custom');
    const useCustomPhotoBtn = document.querySelector('#use-custom-photo');
    fetch('../navigation.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML('afterbegin', data);
                // Set active link
                const currentPage = window.location.pathname.split('/').pop();
                document.querySelectorAll('.nav-link').forEach(link => {
                    if (link.getAttribute('href').includes(currentPage)) {
                        link.classList.add('active');
                    }
                });
            });
    // document.querySelector('.nav-logo').classList.add('active');
        
    // // Path correction for all navigation
    // document.querySelectorAll('.nav-link').forEach(link => {
    //     const href = link.getAttribute('href');
    //     if (!href.startsWith('..')) {
    //         link.setAttribute('href', '../' + href);
    //     }
    // });
    const SIZE = 4;
    let tiles = [];
    let selectedTile = null;
    let moves = 0;
    let time = 0;
    let timer;
    let timeLimit = 0;
    let isTimedMode = false;
    let isImageMode = false;
    let customImage = null;
    let isAnimating = false;

    // Generate solution
    const solution = [];
    for (let i = 1; i <= SIZE * SIZE; i++) solution.push(i);

    function generatePuzzle() {
        do {
            tiles = solution.slice().sort(() => Math.random() - 0.5);
        } while (isSolved());
    }

    function isSolved() {
        return tiles.every((val, idx) => val === solution[idx]);
    }

    function updateDisplay() {
        gridContainer.innerHTML = '';
        tiles.forEach((num, index) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.index = index;
            tile.dataset.value = num;

            if (isImageMode) {
                const imgCol = (num - 1) % SIZE;
                const imgRow = Math.floor((num - 1) / SIZE);
                tile.style.backgroundImage = `url(${customImage})`;
                tile.style.backgroundPosition = `${imgCol * (100 / (SIZE-1))}% ${imgRow * (100 / (SIZE-1))}%`;
            } else {
                tile.textContent = num;
            }

            if (selectedTile === index) {
                tile.classList.add('selected');
            }

            tile.addEventListener('click', () => handleTileClick(index));
            gridContainer.appendChild(tile);
        });
        
        gridContainer.classList.toggle('image-mode', isImageMode);
    }

    function handleTileClick(index) {
        if (isAnimating) return;
        
        if (selectedTile === null) {
            // First tile selected
            selectedTile = index;
            updateDisplay();
        } else if (selectedTile === index) {
            // Same tile clicked - deselect
            selectedTile = null;
            updateDisplay();
        } else {
            // Second tile selected - check if adjacent
            const firstIndex = selectedTile;
            const secondIndex = index;
            
            if (areAdjacent(firstIndex, secondIndex)) {
                swapTiles(firstIndex, secondIndex);
            } else {
                // Not adjacent - shake animation
                const tile = document.querySelector(`[data-index="${secondIndex}"]`);
                tile.classList.add('invalid-drop');
                setTimeout(() => {
                    tile.classList.remove('invalid-drop');
                }, 500);
            }
            
            // Reset selection
            selectedTile = null;
            updateDisplay();
        }
    }

    function areAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / SIZE);
        const col1 = index1 % SIZE;
        const row2 = Math.floor(index2 / SIZE);
        const col2 = index2 % SIZE;
        
        // Check if adjacent horizontally or vertically
        return (Math.abs(row1 - row2) === 1 && col1 === col2) || 
               (Math.abs(col1 - col2) === 1 && row1 === row2);
    }

    function swapTiles(index1, index2) {
        isAnimating = true;
        moves++;
        movesDisplay.textContent = `Moves: ${moves}`;
        
        // Get tile elements
        const tile1 = document.querySelector(`[data-index="${index1}"]`);
        const tile2 = document.querySelector(`[data-index="${index2}"]`);
        
        // Get positions
        const rect1 = tile1.getBoundingClientRect();
        const rect2 = tile2.getBoundingClientRect();
        
        // Calculate movement vectors
        const dx = rect2.left - rect1.left;
        const dy = rect2.top - rect1.top;
        
        // Animate the swap
        tile1.style.transform = `translate(${dx}px, ${dy}px)`;
        tile2.style.transform = `translate(${-dx}px, ${-dy}px)`;
        tile1.style.transition = 'transform 0.3s ease-out';
        tile2.style.transition = 'transform 0.3s ease-out';
        tile1.classList.add('moving');
        tile2.classList.add('moving');
        
        setTimeout(() => {
            // Update the game state
            [tiles[index1], tiles[index2]] = [tiles[index2], tiles[index1]];
            
            // Reset styles and update display
            tile1.style.transform = '';
            tile2.style.transform = '';
            tile1.style.transition = '';
            tile2.style.transition = '';
            tile1.classList.remove('moving');
            tile2.classList.remove('moving');
            updateDisplay();
            
            isAnimating = false;
            
            if (isSolved()) {
                clearInterval(timer);
                showWinPopup();
                createConfetti();
            }
        }, 300);
    }

    function startNewGame() {
        clearInterval(timer);
        time = 0;
        moves = 0;
        selectedTile = null;
        timerDisplay.textContent = isTimedMode 
            ? `Time Left: ${Math.floor(timeLimit/60).toString().padStart(2,'0')}:${(timeLimit%60).toString().padStart(2,'0')}`
            : '00:00';
        movesDisplay.textContent = 'Moves: 0';
        generatePuzzle();
        updateDisplay();
        startTimer();
    }

    function startTimer() {
        timer = setInterval(() => {
            if (isTimedMode) {
                time++;
                const remaining = timeLimit - time;
                if (remaining <= 0) {
                    clearInterval(timer);
                    alert('Time\'s up! Try again!');
                    startNewGame();
                    return;
                }
                const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
                const seconds = (remaining % 60).toString().padStart(2, '0');
                timerDisplay.innerHTML = remaining <= 10 
                    ? `<span class="time-danger">${minutes}:${seconds}</span>`
                    : `Time Left: ${minutes}:${seconds}`;
            } else {
                const minutes = Math.floor(time / 60).toString().padStart(2, '0');
                const seconds = (time % 60).toString().padStart(2, '0');
                timerDisplay.textContent = `${minutes}:${seconds}`;
                time++;
            }
        }, 1000);
    }

    function showWinPopup() {
        const score = calculateScore();
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        
        winPopup.querySelector('.score-time').textContent = `${minutes}:${seconds}`;
        winPopup.querySelector('.score-moves').textContent = moves;
        winPopup.querySelector('.total-score').textContent = score;
        winPopup.style.display = 'flex';

        // Send score to backend
        sendScoreToBackend(score);
    }

    async function sendScoreToBackend(score) {
        try {
            const response = await fetch('http://localhost:5003/api/scores/critical', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gameType: 'critical',
                    score: score,
                    accuracy: Math.min(100, Math.round((1000 / moves) * 100) / 100),
                    additionalStats: {
                        moves: moves,
                        time: time,
                        solved: 1
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit score');
            }
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    }

    function calculateScore() {
        const timeScore = 1000 - (time * 2);
        const moveScore = 1000 - (moves * 5);
        return Math.max(200, timeScore + moveScore);
    }

    function createConfetti() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                left: ${Math.random() * 100}vw;
                background: hsl(${Math.random() * 360}deg, 100%, 50%);
                animation-delay: ${Math.random() * 2}s;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    // Event Listeners
    newGameBtn.addEventListener('click', startNewGame);
    solveBtn.addEventListener('click', () => {
        tiles = solution.slice();
        updateDisplay();
    });

    timeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timeLimit = parseInt(btn.dataset.time);
            isTimedMode = timeLimit > 0;
            timeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            startNewGame();
        });
    });

    setCustomBtn.addEventListener('click', () => {
        const minutes = parseInt(customMinutesInput.value);
        if (minutes > 0) {
            timeLimit = minutes * 60;
            isTimedMode = true;
            startNewGame();
        }
    });

    winPopup.querySelector('.new-game').addEventListener('click', () => {
        winPopup.style.display = 'none';
        startNewGame();
    });

    useCustomPhotoBtn.addEventListener('click', () => {
        winPopup.style.display = 'none';
        imageUpload.click();
    });

    uploadBtn.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                customImage = e.target.result;
                isImageMode = true;
                useNumbersBtn.style.display = 'inline-block';
                startNewGame();
            };
            reader.readAsDataURL(file);
        }
    });

    useNumbersBtn.addEventListener('click', () => {
        isImageMode = false;
        useNumbersBtn.style.display = 'none';
        startNewGame();
    });

    startNewGame();
});