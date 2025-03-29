// ========== COSMIC MEMORY GAME ========== //
const CosmicMemory = {
    // Game Configuration
    config: {
        minPatternLength: 2,
        maxPatternLength: 5,
        neuroScoreWeights: {
            speed: 0.4,
            accuracy: 0.5,
            consistency: 0.1
        },
        audioNotes: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25] // C4 to C5
    },
    
    // Difficulty Settings
    difficulties: {
        beginner: { 
            baseSpeed: 1500, 
            speedDecay: 0.92,
            scoreMultiplier: 1
        },
        intermediate: { 
            baseSpeed: 1000, 
            speedDecay: 0.85,
            scoreMultiplier: 1.5
        },
        pro: { 
            baseSpeed: 600, 
            speedDecay: 0.75,
            scoreMultiplier: 2
        }
    },
    
    // Game State
    state: {
        sessionMinutes: 1,
        mode: '2D',
        difficulty: 'intermediate',
        difficultySettings: null,
        isPlaying: false,
        isShowingPattern: false,
        level: 1,
        streak: 0,
        neuroScore: 0,
        pattern: [],
        playerInput: [],
        cells: [],
        startTime: null,
        endTime: null,
        timer: null,
        progressInterval: null,
        performanceHistory: [],
        audioContext: null,
        audioBuffers: {},
        correctAnswers: 0,
        totalAttempts: 0,
        patternsCompleted: 0,
        audioEnabled: false
    },
    
    // DOM Elements
    elements: {
        grid: null,
        startBtn: null,
        neuroScore: null,
        streak: null,
        level: null,
        progressBar: null,
        timeLeft: null,
        timeBtns: [],
        modeBtns: [],
        difficultyBtns: [],
        resultsModal: null,
        finalScore: null,
        finalLevel: null,
        patternsCompleted: null,
        accuracy: null,
        closeModal: null
    },
    
    // Initialize Game
    init() {
        this.cacheElements();
        this.createDifficultyControls();
        this.state.difficultySettings = this.difficulties[this.state.difficulty];
        this.createGrid();
        this.setupEventListeners();
        this.updateDisplays();
    },
    
    // Cache DOM Elements
    cacheElements() {
        this.elements.grid = document.getElementById('grid');
        this.elements.startBtn = document.getElementById('startBtn');
        this.elements.neuroScore = document.getElementById('neuroScore');
        this.elements.streak = document.getElementById('streak');
        this.elements.level = document.getElementById('level');
        this.elements.progressBar = document.getElementById('progressBar');
        this.elements.timeLeft = document.getElementById('timeLeft');
        this.elements.timeBtns = document.querySelectorAll('.time-btn');
        this.elements.modeBtns = document.querySelectorAll('.mode-btn');
        this.elements.resultsModal = document.getElementById('resultsModal');
        this.elements.finalScore = document.getElementById('finalScore');
        this.elements.finalLevel = document.getElementById('finalLevel');
        this.elements.patternsCompleted = document.getElementById('patternsCompleted');
        this.elements.accuracy = document.getElementById('accuracy');
        this.elements.closeModal = document.getElementById('closeModal');
    },
    
    // Create Difficulty Controls
    createDifficultyControls() {
        const container = document.createElement('div');
        container.className = 'difficulty-controls';
        
        Object.keys(this.difficulties).forEach(diff => {
            const btn = document.createElement('button');
            btn.className = `difficulty-btn ${this.state.difficulty === diff ? 'active' : ''}`;
            btn.dataset.difficulty = diff;
            btn.textContent = diff.toUpperCase();
            container.appendChild(btn);
        });
        
        document.querySelector('.control-panel').prepend(container);
        this.elements.difficultyBtns = document.querySelectorAll('.difficulty-btn');
    },
    
    // Setup Audio System
    setupAudio() {
        try {
            if (this.state.audioContext) {
                this.cleanupAudio();
            }
            
            this.state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            this.config.audioNotes.forEach((note, index) => {
                const oscillator = this.state.audioContext.createOscillator();
                const gainNode = this.state.audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.value = note;
                gainNode.gain.value = 0;
                
                oscillator.connect(gainNode);
                gainNode.connect(this.state.audioContext.destination);
                
                oscillator.start();
                
                this.state.audioBuffers[index] = {
                    oscillator,
                    gainNode,
                    note
                };
            });
            
            const enableAudio = () => {
                if (this.state.audioContext && this.state.audioContext.state === 'suspended') {
                    this.state.audioContext.resume();
                }
                this.state.audioEnabled = true;
                document.removeEventListener('click', enableAudio);
                document.removeEventListener('touchstart', enableAudio);
            };
            
            document.addEventListener('click', enableAudio);
            document.addEventListener('touchstart', enableAudio);
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    },
    
    // Clean up audio resources
    cleanupAudio() {
        if (this.state.audioContext) {
            Object.values(this.state.audioBuffers).forEach(buffer => {
                try {
                    buffer.oscillator.stop();
                    buffer.oscillator.disconnect();
                    buffer.gainNode.disconnect();
                } catch (e) {
                    console.warn('Error cleaning up audio', e);
                }
            });
            
            if (this.state.audioContext.close) {
                this.state.audioContext.close();
            }
            
            this.state.audioContext = null;
            this.state.audioBuffers = {};
            this.state.audioEnabled = false;
        }
    },
    
    // Play Audio Note
    playAudioNote(index) {
        if (this.state.mode !== 'AUDIO' || !this.state.audioContext || !this.state.audioEnabled) return;
        
        try {
            const audio = this.state.audioBuffers[index % 8];
            if (!audio) return;
            
            audio.gainNode.gain.cancelScheduledValues(this.state.audioContext.currentTime);
            audio.gainNode.gain.setValueAtTime(0, this.state.audioContext.currentTime);
            audio.gainNode.gain.linearRampToValueAtTime(0.5, this.state.audioContext.currentTime + 0.1);
            audio.gainNode.gain.exponentialRampToValueAtTime(0.001, this.state.audioContext.currentTime + 0.5);
        } catch (e) {
            console.warn('Audio playback error', e);
        }
    },
    
    // Create Game Grid
    createGrid() {
        this.elements.grid.innerHTML = '';
        this.state.cells = [];
        
        const gridSize = this.getGridSize();
        
        for (let i = 0; i < gridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cosmic-cell';
            
            if (this.state.mode === 'AUDIO') {
                cell.classList.add('audio-cell');
                const noteIndicator = document.createElement('div');
                noteIndicator.className = 'note-indicator';
                noteIndicator.textContent = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'][i % 8];
                cell.appendChild(noteIndicator);
                
                const freqLabel = document.createElement('div');
                freqLabel.className = 'freq-label';
                freqLabel.textContent = `${Math.round(this.config.audioNotes[i % 8])}Hz`;
                cell.appendChild(freqLabel);
            }
            
            cell.dataset.index = i;
            cell.addEventListener('click', () => this.handleCellClick(i));
            this.elements.grid.appendChild(cell);
            this.state.cells.push(cell);
        }
        
        this.updateGridMode();
    },
    
    // Get Grid Size Based on Mode
    getGridSize() {
        switch (this.state.mode) {
            case '3D': return 16;
            case 'AUDIO': return 8;
            default: return 12;
        }
    },
    
    // Update Grid Mode Styling
    updateGridMode() {
        this.elements.grid.className = 'grid-container';
        
        if (this.state.mode === '3D') {
            this.elements.grid.classList.add('three-d');
        } else if (this.state.mode === 'AUDIO') {
            this.elements.grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    },
    
    // Setup Event Listeners
    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.toggleGame());
        
        this.elements.timeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.state.isPlaying) {
                    alert('Please end current training session before changing time');
                    return;
                }
                this.elements.timeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.sessionMinutes = parseInt(btn.dataset.minutes);
                this.updateTimeDisplay();
            });
        });
        
        this.elements.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.state.isPlaying) {
                    alert('Please end current training session before changing mode');
                    return;
                }
                
                this.elements.modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const newMode = btn.textContent;
                
                if (this.state.mode === 'AUDIO' && newMode !== 'AUDIO') {
                    this.cleanupAudio();
                }
                
                this.state.mode = newMode;
                
                if (this.state.mode === 'AUDIO') {
                    this.setupAudio();
                }
                
                this.createGrid();
            });
        });
        
        this.elements.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.state.isPlaying) {
                    alert('Please end current training session before changing difficulty');
                    return;
                }
                
                this.elements.difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.difficulty = btn.dataset.difficulty;
                this.state.difficultySettings = this.difficulties[this.state.difficulty];
            });
        });
        
        document.getElementById('customTimeBtn').addEventListener('click', () => {
            if (this.state.isPlaying) {
                alert('Please end current training session before changing time');
                return;
            }
            
            const minutes = prompt('Enter custom session time (1-60 minutes):', '5');
            if (minutes && !isNaN(minutes)) {
                const mins = parseInt(minutes);
                if (mins >= 1 && mins <= 60) {
                    this.state.sessionMinutes = mins;
                    this.elements.timeBtns.forEach(b => b.classList.remove('active'));
                    this.updateTimeDisplay();
                }
            }
        });
        
        this.elements.closeModal.addEventListener('click', () => {
            this.elements.resultsModal.style.display = 'none';
        });
    },
    
    // Toggle Game State
    toggleGame() {
        if (this.state.isPlaying) {
            this.endGame();
        } else {
            this.startGame();
        }
    },
    
    // Start Game
    startGame() {
        this.state.isPlaying = true;
        this.state.level = 1;
        this.state.streak = 0;
        this.state.neuroScore = 0;
        this.state.performanceHistory = [];
        this.state.correctAnswers = 0;
        this.state.totalAttempts = 0;
        this.state.patternsCompleted = 0;
        this.state.startTime = Date.now();
        this.state.endTime = this.state.startTime + (this.state.sessionMinutes * 60000);
        
        this.elements.startBtn.textContent = 'END TRAINING';
        this.elements.startBtn.style.background = 'var(--plasma-pink)';
        
        this.updateProgressBar();
        this.state.progressInterval = setInterval(() => this.updateProgressBar(), 1000);
        
        this.startRound();
    },
    
    // Start New Round
    startRound() {
        if (!this.state.isPlaying) return;
        
        this.state.pattern = this.generatePattern();
        this.state.playerInput = [];
        this.showPattern();
    },
    
    // Generate Pattern
    generatePattern() {
        const targetLength = Math.min(
            this.config.minPatternLength + Math.floor(this.state.patternsCompleted / 2),
            this.config.maxPatternLength
        );
        
        let pattern = [];
        const availableCells = this.state.cells.length;
        
        if (this.state.mode === 'AUDIO') {
            const notes = [...Array(availableCells).keys()];
            for (let i = 0; i < targetLength; i++) {
                const randomIndex = Math.floor(Math.random() * notes.length);
                pattern.push(notes[randomIndex]);
                notes.splice(randomIndex, 1);
                if (notes.length === 0) {
                    notes.push(...Array(availableCells).keys());
                }
            }
        } else {
            const gridWidth = this.state.mode === '3D' ? 4 : 3;
            let current = Math.floor(Math.random() * availableCells);
            pattern.push(current);
            
            for (let i = 1; i < targetLength; i++) {
                const last = pattern[pattern.length - 1];
                let next;
                
                if (Math.random() > 0.5 && i > 1) {
                    const direction = Math.random() > 0.5 ? 1 : -1;
                    const step = Math.random() > 0.5 ? gridWidth : 1;
                    next = last + (direction * step);
                    
                    if (next < 0 || next >= availableCells || 
                        (step === 1 && Math.floor(next / gridWidth) !== Math.floor(last / gridWidth))) {
                        next = last + (direction * (step === 1 ? gridWidth : 1));
                    }
                } else {
                    do {
                        next = Math.floor(Math.random() * availableCells);
                    } while (next === last);
                }
                
                next = Math.max(0, Math.min(availableCells - 1, next));
                pattern.push(next);
            }
        }
        
        return pattern;
    },
    
    // Show Pattern
    async showPattern(index = 0) {
        if (!this.state.isPlaying || index >= this.state.pattern.length) {
            this.state.isShowingPattern = false;
            return;
        }
        
        this.state.isShowingPattern = true;
        const cellIndex = this.state.pattern[index];
        const cell = this.state.cells[cellIndex];
        
        const displayTime = Math.max(
            300, 
            this.state.difficultySettings.baseSpeed * 
            Math.pow(this.state.difficultySettings.speedDecay, this.state.level - 1)
        );
        
        if (this.state.mode === 'AUDIO') {
            this.playAudioNote(cellIndex);
            cell.classList.add('active-audio');
        } else {
            cell.classList.add('active');
        }
        
        await this.delay(displayTime);
        
        if (this.state.mode === 'AUDIO') {
            cell.classList.remove('active-audio');
        } else {
            cell.classList.remove('active');
        }
        
        await this.delay(displayTime / 3);
        
        await this.showPattern(index + 1);
    },
    
    // Utility Delay Function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Handle Cell Click
    handleCellClick(index) {
        if (!this.state.isPlaying || this.state.isShowingPattern) return;
        
        this.state.totalAttempts++;
        const cell = this.state.cells[index];
        this.state.playerInput.push(index);
        
        if (this.state.mode === 'AUDIO') {
            this.playAudioNote(index);
            cell.classList.add('active-audio');
            setTimeout(() => cell.classList.remove('active-audio'), 200);
        } else {
            cell.classList.add('active');
            setTimeout(() => cell.classList.remove('active'), 200);
        }
        
        if (this.state.playerInput[this.state.playerInput.length - 1] !== 
            this.state.pattern[this.state.playerInput.length - 1]) {
            this.handleIncorrect();
            return;
        }
        
        if (this.state.playerInput.length === this.state.pattern.length) {
            this.handleCorrectSequence();
        }
    },
    
    // Handle Correct Sequence
    handleCorrectSequence() {
        this.state.correctAnswers++;
        this.state.patternsCompleted++;
        
        const roundScore = this.calculateRoundScore();
        this.state.neuroScore += roundScore;
        this.state.streak++;
        
        this.state.pattern.forEach(idx => {
            this.state.cells[idx].classList.add('correct');
            setTimeout(() => this.state.cells[idx].classList.remove('correct'), 500);
        });
        
        if (this.state.streak % 3 === 0) {
            this.state.level++;
        }
        
        this.state.performanceHistory.push({
            level: this.state.level,
            time: Date.now() - this.state.startTime,
            score: roundScore,
            patternLength: this.state.pattern.length
        });
        
        this.updateDisplays();
        
        setTimeout(() => {
            if (this.state.isPlaying) {
                this.startRound();
            }
        }, 800);
    },
    
    // Calculate Round Score
    calculateRoundScore() {
        const baseScore = 10 * this.state.level * this.state.difficultySettings.scoreMultiplier;
        const speedBonus = Math.floor(5 * (this.state.level / 2) * this.state.difficultySettings.scoreMultiplier);
        const streakBonus = this.state.streak >= 5 ? 10 * this.state.difficultySettings.scoreMultiplier : 0;
        const lengthBonus = this.state.pattern.length * 2 * this.state.difficultySettings.scoreMultiplier;
        
        return baseScore + speedBonus + streakBonus + lengthBonus;
    },
    
    // Handle Incorrect Input
    handleIncorrect() {
        this.state.streak = 0;
        this.state.performanceHistory.push({
            level: this.state.level,
            time: Date.now() - this.state.startTime,
            score: 0,
            patternLength: this.state.pattern.length
        });
        
        const lastInput = this.state.playerInput[this.state.playerInput.length - 1];
        this.state.cells[lastInput].classList.add('incorrect');
        setTimeout(() => {
            this.state.cells[lastInput].classList.remove('incorrect');
        }, 500);
        
        setTimeout(() => {
            if (this.state.isPlaying) {
                this.startRound();
            }
        }, 1000);
    },
    
    // Send score to backend
    async sendToBackend(score, accuracy, additionalStats) {
        try {
            const response = await fetch('http://localhost:5003/api/scores/memory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gameType: 'memory',
                    score: score,
                    accuracy: accuracy,
                    additionalStats: additionalStats
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit score');
            }

            const data = await response.json();
            console.log('Score submitted successfully:', data);
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    },
    
    // End Game
    endGame() {
        this.state.isPlaying = false;
        clearInterval(this.state.timer);
        clearInterval(this.state.progressInterval);
        
        const accuracy = this.state.totalAttempts > 0 ? 
            Math.round((this.state.correctAnswers / this.state.totalAttempts) * 100) : 100;
        
        const additionalStats = {
            level: this.state.level,
            streak: this.state.streak,
            patternsCompleted: this.state.patternsCompleted
        };

        // Send score to backend
        this.sendToBackend(this.state.neuroScore, accuracy, additionalStats);
        
        // Show results modal
        this.elements.resultsModal.style.display = 'flex';
        this.elements.finalScore.textContent = this.state.neuroScore;
        this.elements.finalLevel.textContent = this.state.level;
        this.elements.patternsCompleted.textContent = this.state.patternsCompleted;
        this.elements.accuracy.textContent = accuracy + '%';
    },
    
    // Calculate Final Neuro-Score
    calculateFinalNeuroScore() {
        if (this.state.performanceHistory.length === 0) return;
        
        const totalTime = (Date.now() - this.state.startTime) / 1000;
        const avgScore = this.state.performanceHistory.reduce((sum, round) => sum + round.score, 0) / this.state.performanceHistory.length;
        const avgPatternLength = this.state.performanceHistory.reduce((sum, round) => sum + round.patternLength, 0) / this.state.performanceHistory.length;
        const accuracy = this.state.totalAttempts > 0 ? (this.state.correctAnswers / this.state.totalAttempts) * 100 : 100;
        
        const speedComponent = (avgPatternLength / totalTime) * 100;
        const accuracyComponent = accuracy;
        const consistencyComponent = this.state.streak / this.state.performanceHistory.length * 100;
        
        this.state.neuroScore = Math.floor(
            (speedComponent * this.config.neuroScoreWeights.speed) +
            (accuracyComponent * this.config.neuroScoreWeights.accuracy) +
            (consistencyComponent * this.config.neuroScoreWeights.consistency)
        );
        
        this.updateDisplays();
    },
    
    // Show Results Modal
    showResults() {
        this.elements.finalScore.textContent = this.state.neuroScore;
        this.elements.finalLevel.textContent = this.state.level;
        this.elements.patternsCompleted.textContent = this.state.performanceHistory.length;
        
        const accuracy = this.state.totalAttempts > 0 ? 
            Math.round((this.state.correctAnswers / this.state.totalAttempts) * 100) : 100;
        this.elements.accuracy.textContent = `${accuracy}%`;
        
        this.elements.resultsModal.style.display = 'flex';
    },
    
    // Update Progress Bar
    updateProgressBar() {
        if (!this.state.isPlaying) return;
        
        const now = Date.now();
        const elapsed = now - this.state.startTime;
        const total = this.state.endTime - this.state.startTime;
        const percent = Math.min(100, (elapsed / total) * 100);
        
        this.elements.progressBar.style.width = `${percent}%`;
        this.updateTimeDisplay();
        
        if (now >= this.state.endTime) {
            this.endGame();
        }
    },
    
    // Update Time Display
    updateTimeDisplay() {
        if (!this.state.isPlaying) return;
        
        const remainingMs = Math.max(0, this.state.endTime - Date.now());
        const minutes = Math.floor(remainingMs / 60000);
        const seconds = Math.floor((remainingMs % 60000) / 1000);
        
        this.elements.timeLeft.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    
    // Update All Displays
    updateDisplays() {
        this.elements.neuroScore.textContent = this.state.neuroScore;
        this.elements.streak.textContent = this.state.streak;
        this.elements.level.textContent = this.state.level;
    }
};

// Initialize game when DOM loads
document.addEventListener('DOMContentLoaded', () => CosmicMemory.init());