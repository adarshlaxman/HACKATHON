// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const testScreen = document.getElementById('test-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const retakeBtn = document.getElementById('retake-btn');
const ageInput = document.getElementById('age');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionCounter = document.getElementById('question-counter');
const timerElement = document.getElementById('timer');
const stressLevel = document.getElementById('stress-level');
const container = document.getElementById('container');
const stressPulse = document.querySelector('.stress-pulse');

// Test Variables
let currentQuestionIndex = 0;
let testQuestions = [];
let userResponses = [];
let testStartTime;
let questionStartTime;
let totalStressLevel = 0;
let timerInterval;
let stressInterval;
let questionTimer;
let questionTimeLimit;
let typingInterval;
let checkTimeInterval;

// Event Listeners
startBtn.addEventListener('click', startTest);
retakeBtn.addEventListener('click', retakeTest);

// Start the test
function startTest() {
    const age = parseInt(ageInput.value);
    if (isNaN(age) || age < 14 || age > 100) {
        alert('Please enter a valid age between 14 and 100');
        return;
    }
    
    testQuestions = getQuestionsForAge(age);
    userResponses = [];
    currentQuestionIndex = 0;
    totalStressLevel = 0;
    
    welcomeScreen.style.display = 'none';
    testScreen.style.display = 'flex';
    resultsScreen.style.display = 'none';
    
    testStartTime = new Date();
    displayQuestion();
    startTimer();
    updateStressMeter();
}

// Get questions based on age group with proper shuffling
function getQuestionsForAge(age) {
    let ageGroup;
    if (age >= 14 && age <= 20) ageGroup = "teenager";
    else if (age >= 21 && age <= 35) ageGroup = "youngAdult";
    else ageGroup = "adult";
    
    const allQuestions = {
        teenager: {
            emotional: [
                {
                    question: "Your friend shares a secret but later tells someone else your secret. How do you react?",
                    options: [
                        "Confront them angrily immediately",
                        "Feel hurt but talk to them calmly",
                        "Pretend it doesn't bother you",
                        "Tell others about their behavior"
                    ],
                    stressLevel: 3,
                    type: 'emotional'
                },
                {
                    question: "You receive a bad grade on a test you studied hard for. What's your response?",
                    options: [
                        "Blame the teacher for unfair grading",
                        "Review mistakes and ask for help",
                        "Give up on the subject entirely",
                        "Ignore it and hope the next test is better"
                    ],
                    stressLevel: 2,
                    type: 'emotional'
                },
                {
                    question: "Your parents cancel plans you were looking forward to. How do you react?",
                    options: [
                        "Yell at them and storm off",
                        "Express disappointment but understand",
                        "Sulk silently for days",
                        "Guilt-trip them about it"
                    ],
                    stressLevel: 2,
                    type: 'emotional'
                },
                {
                    question: "Someone spreads a rumor about you at school. What do you do?",
                    options: [
                        "Confront them aggressively",
                        "Address it calmly with the person",
                        "Spread worse rumors about them",
                        "Ignore it completely"
                    ],
                    stressLevel: 4,
                    type: 'emotional'
                },
                {
                    question: "You're left out of a group activity with friends. How does this make you feel?",
                    options: [
                        "Furious and betrayed",
                        "Hurt but willing to talk about it",
                        "Like you don't care at all",
                        "Vengeful toward your friends"
                    ],
                    stressLevel: 3,
                    type: 'emotional'
                },
                {
                    question: "A teacher accuses you of cheating when you didn't. What's your response?",
                    options: [
                        "Get defensive and angry",
                        "Calmly explain your side",
                        "Accept the accusation silently",
                        "Complain to other students"
                    ],
                    stressLevel: 4,
                    type: 'emotional'
                },
                {
                    question: "You're being teased about your appearance. How do you handle it?",
                    options: [
                        "Retaliate with insults",
                        "Confidently ignore it",
                        "Report it to an authority",
                        "Withdraw and avoid people"
                    ],
                    stressLevel: 3,
                    type: 'emotional'
                },
                {
                    question: "Your best friend starts hanging out with someone else more. How do you feel?",
                    options: [
                        "Jealous and possessive",
                        "Happy they made a new friend",
                        "Insecure about your friendship",
                        "Angry and confrontational"
                    ],
                    stressLevel: 2,
                    type: 'emotional'
                }
            ],
            decision: [
                {
                    question: "You have a big exam but friends invite you out. What do you do?",
                    options: [
                        "Go out and cram last minute",
                        "Politely decline and study",
                        "Go out but feel guilty",
                        "Skip both and procrastinate"
                    ],
                    stressLevel: 2,
                    timeLimit: 25,
                    type: 'decision'
                },
                {
                    question: "You see someone being bullied at school. How do you respond?",
                    options: [
                        "Join in to avoid being targeted",
                        "Report it to a teacher",
                        "Ignore it and walk away",
                        "Confront the bully directly"
                    ],
                    stressLevel: 3,
                    timeLimit: 30,
                    type: 'decision'
                },
                {
                    question: "You're offered alcohol at a party. What's your decision?",
                    options: [
                        "Accept to fit in",
                        "Politely decline",
                        "Take it but don't drink",
                        "Leave the party"
                    ],
                    stressLevel: 4,
                    timeLimit: 20,
                    type: 'decision'
                },
                {
                    question: "You forgot about a major assignment due tomorrow. What do you do?",
                    options: [
                        "Copy a friend's work",
                        "Stay up late to complete it",
                        "Make an excuse to the teacher",
                        "Just not turn it in"
                    ],
                    stressLevel: 3,
                    timeLimit: 25,
                    type: 'decision'
                },
                {
                    question: "Your crush asks you to ditch class with them. How do you respond?",
                    options: [
                        "Say yes immediately",
                        "Suggest hanging out after school",
                        "Say no and report them",
                        "Agree but feel nervous"
                    ],
                    stressLevel: 2,
                    timeLimit: 20,
                    type: 'decision'
                },
                {
                    question: "You find money in the hallway at school. What do you do?",
                    options: [
                        "Keep it without telling anyone",
                        "Turn it in to the office",
                        "Ask around if anyone lost money",
                        "Split it with friends"
                    ],
                    stressLevel: 1,
                    timeLimit: 30,
                    type: 'decision'
                },
                {
                    question: "You witness someone cheating on a test. What action do you take?",
                    options: [
                        "Join them in cheating",
                        "Report it to the teacher",
                        "Ignore it completely",
                        "Blackmail them later"
                    ],
                    stressLevel: 3,
                    timeLimit: 25,
                    type: 'decision'
                },
                {
                    question: "You're pressured to try vaping. How do you respond?",
                    options: [
                        "Give in to peer pressure",
                        "Firmly say no",
                        "Take it but don't use it",
                        "Leave the situation"
                    ],
                    stressLevel: 4,
                    timeLimit: 20,
                    type: 'decision'
                }
            ]
        },
        youngAdult: {
            emotional: [
                {
                    question: "Your romantic partner forgets an important anniversary. How do you react?",
                    options: [
                        "Get angry and give them the silent treatment",
                        "Express your disappointment calmly",
                        "Pretend you forgot too to avoid conflict",
                        "Plan revenge by forgetting their birthday"
                    ],
                    stressLevel: 3,
                    type: 'emotional'
                },
                {
                    question: "Your boss criticizes your work in front of colleagues. What's your response?",
                    options: [
                        "Defend yourself aggressively",
                        "Ask for specific feedback privately",
                        "Quit your job immediately",
                        "Criticize their leadership in return"
                    ],
                    stressLevel: 4,
                    type: 'emotional'
                },
                {
                    question: "A friend cancels plans last minute for the third time. How do you feel?",
                    options: [
                        "Cut them off completely",
                        "Express your frustration but remain friends",
                        "Make excuses for them",
                        "Start canceling on them intentionally"
                    ],
                    stressLevel: 2,
                    type: 'emotional'
                },
                {
                    question: "You're passed over for a promotion you expected. What's your reaction?",
                    options: [
                        "Complain to HR about unfairness",
                        "Request feedback and improve",
                        "Start looking for another job",
                        "Sabotage the promoted colleague"
                    ],
                    stressLevel: 4,
                    type: 'emotional'
                },
                {
                    question: "Your roommate keeps eating your food without asking. How do you respond?",
                    options: [
                        "Eat theirs without asking",
                        "Have a calm discussion about boundaries",
                        "Label all your food aggressively",
                        "Move out without notice"
                    ],
                    stressLevel: 2,
                    type: 'emotional'
                },
                {
                    question: "A family member makes an insensitive comment. What do you do?",
                    options: [
                        "Yell at them and leave",
                        "Explain why it hurt your feelings",
                        "Make a worse comment back",
                        "Hold a grudge for months"
                    ],
                    stressLevel: 3,
                    type: 'emotional'
                },
                {
                    question: "Your significant other forgets your birthday. How do you react?",
                    options: [
                        "Break up with them immediately",
                        "Express your feelings calmly",
                        "Pretend you don't care",
                        "Get revenge by ignoring theirs"
                    ],
                    stressLevel: 3,
                    type: 'emotional'
                },
                {
                    question: "You're given unfair criticism at work. What's your response?",
                    options: [
                        "Quit on the spot",
                        "Request a meeting to discuss",
                        "Complain to coworkers",
                        "Ignore it but feel resentful"
                    ],
                    stressLevel: 4,
                    type: 'emotional'
                }
            ],
            decision: [
                {
                    question: "You're offered an exciting job in another city. What do you do?",
                    options: [
                        "Accept immediately without thinking",
                        "Weigh pros and cons carefully",
                        "Reject due to fear of change",
                        "Accept but panic later"
                    ],
                    stressLevel: 4,
                    timeLimit: 45,
                    type: 'decision'
                },
                {
                    question: "Your credit card is stolen with fraudulent charges. What's your first step?",
                    options: [
                        "Post about it on social media",
                        "Call the bank to report it",
                        "Ignore it hoping it resolves",
                        "Cancel all your cards"
                    ],
                    stressLevel: 3,
                    timeLimit: 30,
                    type: 'decision'
                },
                {
                    question: "You suspect a coworker is taking credit for your ideas. How do you handle it?",
                    options: [
                        "Confront them angrily in public",
                        "Document your work and talk to your manager",
                        "Start taking credit for their work",
                        "Quit your job immediately"
                    ],
                    stressLevel: 3,
                    timeLimit: 35,
                    type: 'decision'
                },
                {
                    question: "You're invited to two important events at the same time. What do you do?",
                    options: [
                        "Choose randomly at the last minute",
                        "Assess which is more important",
                        "Try to attend both and be late",
                        "Cancel on both to avoid choosing"
                    ],
                    stressLevel: 2,
                    timeLimit: 25,
                    type: 'decision'
                },
                {
                    question: "Your car breaks down before an important meeting. What's your plan?",
                    options: [
                        "Panic and miss the meeting",
                        "Call a ride share immediately",
                        "Blame others for your situation",
                        "Reschedule the meeting"
                    ],
                    stressLevel: 4,
                    timeLimit: 20,
                    type: 'decision'
                },
                {
                    question: "You accidentally send an embarrassing text to the wrong person. What do you do?",
                    options: [
                        "Block the recipient",
                        "Apologize and explain the mistake",
                        "Pretend it never happened",
                        "Send more messages to cover it up"
                    ],
                    stressLevel: 3,
                    timeLimit: 25,
                    type: 'decision'
                },
                {
                    question: "You're offered a promotion with more pay but longer hours. What do you do?",
                    options: [
                        "Accept without considering consequences",
                        "Negotiate for better terms",
                        "Reject due to work-life balance concerns",
                        "Accept but resent the extra work"
                    ],
                    stressLevel: 3,
                    timeLimit: 30,
                    type: 'decision'
                },
                {
                    question: "You discover a colleague is being treated unfairly. How do you respond?",
                    options: [
                        "Ignore it to avoid trouble",
                        "Document evidence and report it",
                        "Confront the perpetrator directly",
                        "Spread rumors about the situation"
                    ],
                    stressLevel: 4,
                    timeLimit: 35,
                    type: 'decision'
                }
            ]
        },
        adult: {
            emotional: [
                {
                    question: "Your adult child makes a life choice you disagree with. How do you react?",
                    options: [
                        "Give them an ultimatum",
                        "Express concerns but support them",
                        "Cut off communication",
                        "Guilt-trip them constantly"
                    ],
                    stressLevel: 3,
                    type: 'emotional'
                },
                {
                    question: "Your parent's health is declining. How does this make you feel?",
                    options: [
                        "Angry at them for getting old",
                        "Concerned but proactive",
                        "Completely overwhelmed",
                        "Indifferent to the situation"
                    ],
                    stressLevel: 4,
                    type: 'emotional'
                },
                {
                    question: "Your spouse forgets to do something important. What's your response?",
                    options: [
                        "Bring up all their past mistakes",
                        "Remind them calmly",
                        "Do it yourself while fuming",
                        "Give them the silent treatment"
                    ],
                    stressLevel: 2,
                    type: 'emotional'
                },
                {
                    question: "A younger colleague gets promoted over you. How do you feel?",
                    options: [
                        "Resentful and bitter",
                        "Motivated to improve",
                        "Like quitting immediately",
                        "Determined to undermine them"
                    ],
                    stressLevel: 4,
                    type: 'emotional'
                },
                {
                    question: "Your friend makes an insensitive political comment. What do you do?",
                    options: [
                        "End the friendship immediately",
                        "Have a respectful discussion",
                        "Make an even worse comment",
                        "Avoid them indefinitely"
                    ],
                    stressLevel: 3,
                    type: 'emotional'
                },
                {
                    question: "You're overlooked in a family decision. How do you react?",
                    options: [
                        "Make a scene at the gathering",
                        "Express your feelings appropriately",
                        "Hold a grudge for years",
                        "Boycott future family events"
                    ],
                    stressLevel: 3,
                    type: 'emotional'
                },
                {
                    question: "Your child rebels against your rules. How do you handle it?",
                    options: [
                        "Punish them severely",
                        "Have an open discussion",
                        "Give in to avoid conflict",
                        "Ignore the behavior"
                    ],
                    stressLevel: 4,
                    type: 'emotional'
                },
                {
                    question: "You're excluded from a work social event. How does this make you feel?",
                    options: [
                        "Furious and vengeful",
                        "Slightly hurt but understanding",
                        "Completely indifferent",
                        "Insecure about your position"
                    ],
                    stressLevel: 3,
                    type: 'emotional'
                }
            ],
            decision: [
                {
                    question: "You discover a financial mistake that cost you thousands. What's your first step?",
                    options: [
                        "Blame others immediately",
                        "Contact a financial advisor",
                        "Ignore it hoping it fixes itself",
                        "Make rash financial changes"
                    ],
                    stressLevel: 5,
                    timeLimit: 40,
                    type: 'decision'
                },
                {
                    question: "Your child is being bullied at school. How do you respond?",
                    options: [
                        "Confront the bully's parents aggressively",
                        "Schedule a meeting with school officials",
                        "Tell your child to fight back",
                        "Pull them out of school immediately"
                    ],
                    stressLevel: 4,
                    timeLimit: 35,
                    type: 'decision'
                },
                {
                    question: "You're caring for an aging parent and feeling overwhelmed. What do you do?",
                    options: [
                        "Resent your parent for needing help",
                        "Research professional care options",
                        "Ignore your own needs completely",
                        "Refuse to help altogether"
                    ],
                    stressLevel: 4,
                    timeLimit: 45,
                    type: 'decision'
                },
                {
                    question: "You're offered early retirement but with reduced benefits. What do you do?",
                    options: [
                        "Accept immediately without planning",
                        "Consult a financial planner",
                        "Reject due to fear of change",
                        "Make the decision based on emotion"
                    ],
                    stressLevel: 5,
                    timeLimit: 50,
                    type: 'decision'
                },
                {
                    question: "Your doctor recommends a major lifestyle change. How do you respond?",
                    options: [
                        "Ignore the advice completely",
                        "Research and implement changes gradually",
                        "Make extreme changes immediately",
                        "Find a new doctor who agrees with you"
                    ],
                    stressLevel: 3,
                    timeLimit: 30,
                    type: 'decision'
                },
                {
                    question: "You inherit a significant amount of money. What's your first step?",
                    options: [
                        "Spend it all immediately",
                        "Consult a financial advisor",
                        "Give it all away to avoid responsibility",
                        "Hide it from family members"
                    ],
                    stressLevel: 4,
                    timeLimit: 40,
                    type: 'decision'
                },
                {
                    question: "Your spouse wants to move to a different city. What do you do?",
                    options: [
                        "Refuse outright",
                        "Discuss pros and cons together",
                        "Agree but secretly resent it",
                        "Make them go alone"
                    ],
                    stressLevel: 4,
                    timeLimit: 45,
                    type: 'decision'
                },
                {
                    question: "You're asked to care for your grandchildren unexpectedly. How do you respond?",
                    options: [
                        "Refuse angrily",
                        "Discuss arrangements with parents",
                        "Agree but complain constantly",
                        "Resent your children for asking"
                    ],
                    stressLevel: 3,
                    timeLimit: 35,
                    type: 'decision'
                }
            ]
        }
    };

    // Randomize correct answers for all questions
    for (const group in allQuestions) {
        for (const type in allQuestions[group]) {
            allQuestions[group][type].forEach(question => {
                question.correct = Math.floor(Math.random() * question.options.length);
            });
        }
    }

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Get exactly 6 emotional and 6 decision questions
    const emotionalQs = shuffleArray(allQuestions[ageGroup].emotional).slice(0, 6);
    const decisionQs = shuffleArray(allQuestions[ageGroup].decision).slice(0, 6);
    
    // Combine and shuffle the final set
    const combinedQuestions = shuffleArray([...emotionalQs, ...decisionQs]);
    
    // Add question IDs
    return combinedQuestions.map((q, i) => ({ ...q, id: i + 1 }));
}

// Display current question
function displayQuestion() {
    // Clean up previous question effects
    clearInterval(typingInterval);
    clearInterval(checkTimeInterval);
    clearTimeout(questionTimer);
    container.classList.remove('shake');
    
    if (currentQuestionIndex >= testQuestions.length) {
        endTest();
        return;
    }
    
    const currentQuestion = testQuestions[currentQuestionIndex];
    questionCounter.textContent = `${currentQuestion.id}/${testQuestions.length}`;
    
    // Clear question text and options
    questionText.textContent = "";
    questionText.style.borderRight = "3px solid var(--primary-color)";
    optionsContainer.innerHTML = "";
    
    // Typewriter effect for question
    let i = 0;
    typingInterval = setInterval(() => {
        if (i < currentQuestion.question.length) {
            questionText.textContent += currentQuestion.question.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            questionText.style.borderRight = "none";
            displayOptions(currentQuestion.options);
        }
    }, 30);
    
    // Start timing for this question
    questionStartTime = new Date();
    questionTimeLimit = currentQuestion.timeLimit || 0;
    
    // Start question timer if it's a decision question
    if (currentQuestion.timeLimit) {
        startQuestionTimer(currentQuestion.timeLimit);
    }
    
    // Update stress meter
    updateStressLevel(currentQuestion.stressLevel);
    
    // Start checking time spent on question
    checkQuestionTime();
}

// Display options with animation
function displayOptions(options) {
    options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.style.opacity = '0';
        optionElement.style.transform = 'translateY(20px)';
        optionElement.innerHTML = `
            <span class="option-key">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
        `;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
        
        // Animate option appearance
        setTimeout(() => {
            optionElement.style.transition = 'all 0.3s ease-out';
            optionElement.style.opacity = '1';
            optionElement.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Select an option
function selectOption(optionIndex) {
    clearInterval(typingInterval);
    clearInterval(checkTimeInterval);
    clearTimeout(questionTimer);
    container.classList.remove('shake');
    
    const currentQuestion = testQuestions[currentQuestionIndex];
    const responseTime = (new Date() - questionStartTime) / 1000;
    
    // Calculate points based on correctness and response time
    const isCorrect = optionIndex === currentQuestion.correct;
    const timePercentage = currentQuestion.timeLimit 
        ? Math.max(0, 1 - (responseTime / currentQuestion.timeLimit)) 
        : 1;
    const points = isCorrect 
        ? Math.floor(100 * timePercentage * (currentQuestion.type === 'emotional' ? 0.7 : 1))
        : 0;
    
    // Store response
    userResponses.push({
        questionId: currentQuestion.id,
        questionType: currentQuestion.type,
        selectedOption: optionIndex,
        correctOption: currentQuestion.correct,
        responseTime: responseTime,
        stressLevel: currentQuestion.stressLevel,
        isCorrect: isCorrect,
        points: points
    });
    
    // Visual feedback
    const options = document.querySelectorAll('.option');
    options.forEach((opt, idx) => {
        if (idx === optionIndex) {
            opt.classList.add('selected');
            opt.style.borderColor = isCorrect ? 'var(--success-color)' : 'var(--danger-color)';
        } else if (idx === currentQuestion.correct) {
            opt.style.borderColor = 'var(--success-color)';
        }
    });
    
    // Calculate stress from response time
    const timeStress = calculateTimeStress(responseTime, currentQuestion.timeLimit);
    totalStressLevel = Math.min(totalStressLevel + timeStress, 100);
    updateStressMeter();
    
    // Move to next question
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1000);
}

// Calculate stress based on response time
function calculateTimeStress(responseTime, timeLimit) {
    if (!timeLimit) return 0;
    const normalizedTime = Math.min(responseTime / timeLimit, 1);
    return Math.pow(normalizedTime, 2) * 10;
}

// Start the overall test timer
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((new Date() - testStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// Start question timer (for decision questions)
function startQuestionTimer(timeLimit) {
    let timeLeft = timeLimit;
    updateQuestionTimer(timeLeft);
    
    questionTimer = setInterval(() => {
        timeLeft--;
        updateQuestionTimer(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(questionTimer);
            const randomOption = Math.floor(Math.random() * testQuestions[currentQuestionIndex].options.length);
            selectOption(randomOption);
        }
    }, 1000);
}

function updateQuestionTimer(timeLeft) {
    const timerElement = document.querySelector('.question-terminal .terminal-header');
    if (timerElement) {
        const timerDisplay = timerElement.querySelector('.timer-display');
        if (!timerDisplay) {
            const newTimer = document.createElement('span');
            newTimer.className = 'timer-display';
            newTimer.style.marginLeft = '10px';
            newTimer.style.color = timeLeft <= 5 ? 'var(--danger-color)' : 'var(--warning-color)';
            newTimer.textContent = `Time: ${timeLeft}s`;
            timerElement.appendChild(newTimer);
        } else {
            timerDisplay.style.color = timeLeft <= 5 ? 'var(--danger-color)' : 'var(--warning-color)';
            timerDisplay.textContent = `Time: ${timeLeft}s`;
        }
    }
}

// Update stress meter
function updateStressLevel(newStress) {
    totalStressLevel = Math.min(totalStressLevel + newStress, 100);
    updateStressMeter();
}

function updateStressMeter() {
    stressLevel.style.width = `${totalStressLevel}%`;
    
    if (totalStressLevel > 70) {
        stressLevel.style.background = 'linear-gradient(90deg, var(--warning-color), var(--danger-color))';
    } else if (totalStressLevel > 30) {
        stressLevel.style.background = 'linear-gradient(90deg, var(--success-color), var(--warning-color))';
    } else {
        stressLevel.style.background = 'var(--success-color)';
    }
    
    if (totalStressLevel > 70) {
        stressPulse.classList.add('stress-pulse-animate');
        stressInterval = setInterval(() => {
            container.classList.add('shake');
            setTimeout(() => container.classList.remove('shake'), 500);
        }, 3000);
    } else {
        stressPulse.classList.remove('stress-pulse-animate');
        clearInterval(stressInterval);
    }
}

// Check time spent on current question
function checkQuestionTime() {
    checkTimeInterval = setInterval(() => {
        const timeSpent = (new Date() - questionStartTime) / 1000;
        if (timeSpent > 11 && currentQuestionIndex < testQuestions.length) {
            container.classList.add('shake');
        } else {
            container.classList.remove('shake');
        }
    }, 1000);
}

// End the test and show results
function endTest() {
    clearInterval(timerInterval);
    clearInterval(stressInterval);
    clearInterval(typingInterval);
    clearInterval(checkTimeInterval);
    clearTimeout(questionTimer);
    container.classList.remove('shake');
    
    testScreen.style.display = 'none';
    resultsScreen.style.display = 'flex';
    
    // Calculate scores and metrics
    const emotionalResponses = userResponses.filter(r => r.questionType === 'emotional');
    const decisionResponses = userResponses.filter(r => r.questionType === 'decision');
    
    const emotionalScore = calculateScore(emotionalResponses);
    const decisionScore = calculateScore(decisionResponses);
    const stressScore = calculateStressScore();
    
    const avgResponseTime = calculateAverageResponseTime();
    const accuracy = calculateOverallAccuracy();
    const consistency = calculateConsistency();
    
    // Calculate total score (weighted average)
    const totalScore = Math.round((emotionalScore * 0.4 + decisionScore * 0.4 + stressScore * 0.2));
    
    // Display enhanced results
    displayEnhancedResults({
        emotionalScore,
        decisionScore,
        stressScore,
        totalScore,
        avgResponseTime,
        accuracy,
        consistency,
        emotionalResponses,
        decisionResponses
    });
}

// New helper functions for enhanced results
function calculateAverageResponseTime() {
    const totalTime = userResponses.reduce((sum, r) => sum + r.responseTime, 0);
    return (totalTime / userResponses.length).toFixed(1);
}

function calculateOverallAccuracy() {
    const correct = userResponses.filter(r => r.isCorrect).length;
    return Math.round((correct / userResponses.length) * 100);
}

function calculateConsistency() {
    // Calculate standard deviation of response times
    const times = userResponses.map(r => r.responseTime);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const squareDiffs = times.map(t => Math.pow(t - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    const stdDev = Math.sqrt(avgSquareDiff);
    
    // Normalize to 0-100 scale (lower std dev = higher consistency)
    const maxExpectedDeviation = 15; // Based on our time limits
    return Math.max(0, 100 - (stdDev / maxExpectedDeviation * 100));
}

function displayEnhancedResults(metrics) {
    // Update the gauge visuals
    displayResult('emotion', metrics.emotionalScore, metrics.emotionalResponses);
    displayResult('decision', metrics.decisionScore, metrics.decisionResponses);
    displayResult('stress', metrics.stressScore);
    
    // Create score cards HTML
    const scoreCardsHTML = `
        <div class="score-card">
            <div class="score-label">Total Performance</div>
            <div class="score-value">${metrics.totalScore}<span class="score-percent">%</span></div>
            <div class="performance-tag">${getPerformanceTag(metrics.totalScore)}</div>
            <div class="score-details">Overall test score</div>
        </div>
        <div class="score-card">
            <div class="score-label">Accuracy</div>
            <div class="score-value">${metrics.accuracy}<span class="score-percent">%</span></div>
            <div class="score-details">Correct answers</div>
        </div>
        <div class="score-card">
            <div class="score-label">Avg Time</div>
            <div class="score-value">${metrics.avgResponseTime}<span class="score-percent">s</span></div>
            <div class="score-details">Per question</div>
        </div>
        <div class="score-card">
            <div class="score-label">Consistency</div>
            <div class="score-value">${Math.round(metrics.consistency)}<span class="score-percent">%</span></div>
            <div class="score-details">Response pattern</div>
        </div>
    `;
    
    // Create breakdown HTML
    const breakdownHTML = `
        <div class="breakdown-header">
            <div class="breakdown-title">PERFORMANCE BREAKDOWN</div>
        </div>
        <div class="breakdown-content">
            <div class="breakdown-column">
                <div class="breakdown-item">
                    <div class="breakdown-item-title">
                        <span>Emotional Control</span>
                        <span>${metrics.emotionalScore}%</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: ${metrics.emotionalScore}%"></div>
                    </div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-item-title">
                        <span>Decision Making</span>
                        <span>${metrics.decisionScore}%</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: ${metrics.decisionScore}%"></div>
                    </div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-item-title">
                        <span>Stress Resilience</span>
                        <span>${metrics.stressScore}%</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: ${metrics.stressScore}%"></div>
                    </div>
                </div>
            </div>
            <div class="breakdown-column">
                <div class="breakdown-item">
                    <div class="breakdown-item-title">
                        <span>Fastest Response</span>
                        <span>${Math.min(...userResponses.map(r => r.responseTime)).toFixed(1)}s</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: ${100 - (Math.min(...userResponses.map(r => r.responseTime)) / 30 * 100)}%"></div>
                    </div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-item-title">
                        <span>Slowest Response</span>
                        <span>${Math.max(...userResponses.map(r => r.responseTime)).toFixed(1)}s</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: ${100 - (Math.max(...userResponses.map(r => r.responseTime)) / 30 * 100)}%"></div>
                    </div>
                </div>
                <div class="breakdown-item">
                    <div class="breakdown-item-title">
                        <span>High Stress Accuracy</span>
                        <span>${calculateHighStressAccuracy()}%</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: ${calculateHighStressAccuracy()}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create final assessment
    const assessmentHTML = `
        <h3>FINAL ASSESSMENT</h3>
        <p>${generateFinalAssessment(metrics.totalScore)}</p>
        <div class="performance-tag">${getPerformanceTag(metrics.totalScore)}</div>
    `;
    
    // Insert into DOM
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-container';
    resultsContainer.innerHTML = `
        ${resultsScreen.innerHTML}
        <div class="results-scores">${scoreCardsHTML}</div>
        <div class="results-breakdown">${breakdownHTML}</div>
        <div class="final-assessment">${assessmentHTML}</div>
    `;
    
    resultsScreen.innerHTML = '';
    resultsScreen.appendChild(resultsContainer);
    
    // Animate the breakdown bars
    setTimeout(() => {
        document.querySelectorAll('.breakdown-fill').forEach(fill => {
            fill.style.width = fill.style.width;
        });
    }, 100);
}

function calculateHighStressAccuracy() {
    const highStressResponses = userResponses.filter(r => r.stressLevel >= 4);
    if (highStressResponses.length === 0) return 0;
    const correct = highStressResponses.filter(r => r.isCorrect).length;
    return Math.round((correct / highStressResponses.length) * 100);
}

function getPerformanceTag(score) {
    if (score >= 90) return 'ELITE PERFORMANCE';
    if (score >= 75) return 'STRONG PERFORMANCE';
    if (score >= 60) return 'AVERAGE PERFORMANCE';
    if (score >= 40) return 'DEVELOPING SKILLS';
    return 'NEEDS IMPROVEMENT';
}

function generateFinalAssessment(score) {
    const assessments = [
        {
            range: [90, 100],
            text: "Your performance demonstrates exceptional stress resilience and cognitive control. You maintain composure and make effective decisions even under significant pressure, placing you in the top tier of performers. This level of emotional regulation and decision-making ability is characteristic of elite professionals in high-stress fields."
        },
        {
            range: [75, 89],
            text: "You show strong stress management capabilities with generally good emotional control and decision-making. While occasional stressors may impact your performance, you typically recover quickly and maintain effectiveness. With targeted practice in specific challenging scenarios, you could reach elite performance levels."
        },
        {
            range: [60, 74],
            text: "Your results indicate average stress resilience with room for improvement. You handle moderate stress reasonably well but may struggle with extreme pressure situations. Developing specific coping strategies and decision-making frameworks could significantly enhance your performance under stress."
        },
        {
            range: [40, 59],
            text: "Your performance suggests developing stress management skills that require attention. Stress significantly impacts your emotional control and decision quality. Focused training in mindfulness techniques and stress recognition could help improve your resilience in challenging situations."
        },
        {
            range: [0, 39],
            text: "The results indicate significant difficulties with stress management that affect your cognitive performance. You may benefit from comprehensive stress reduction techniques and structured decision-making practice. Consider exploring professional resources to build foundational stress resilience skills."
        }
    ];
    
    const matchedAssessment = assessments.find(a => score >= a.range[0] && score <= a.range[1]);
    return matchedAssessment ? matchedAssessment.text : "Performance assessment unavailable.";
}

// Calculate score for a category
function calculateScore(responses) {
    if (responses.length === 0) return 0;
    const totalPoints = responses.reduce((sum, r) => sum + r.points, 0);
    const maxPossible = responses.length * 100;
    return Math.round((totalPoints / maxPossible) * 100);
}

// Calculate stress management score
function calculateStressScore() {
    return 100 - Math.min(totalStressLevel, 100);
}

// Display a result with percentage and points
function displayResult(type, score, responses = []) {
    const scoreElement = document.getElementById(`${type}-score`);
    const feedbackElement = document.getElementById(`${type}-feedback`);
    const percentageElement = document.getElementById(`${type}-percentage`);
    const pointsElement = document.getElementById(`${type}-points`);
    
    // Calculate total points if responses are provided
    const totalPoints = responses.reduce((sum, r) => sum + r.points, 0);
    const maxPossible = responses.length * 100;
    
    // Update percentage and points display
    if (percentageElement) {
        percentageElement.textContent = `${score}%`;
    }
    if (pointsElement) {
        pointsElement.textContent = `${totalPoints}/${maxPossible} points`;
    }
    
    // Animate gauge fill
    let currentFill = 0;
    const gaugeFill = setInterval(() => {
        if (currentFill >= score) {
            clearInterval(gaugeFill);
        } else {
            currentFill++;
            scoreElement.style.transform = `rotate(${(currentFill * 3.6) - 90}deg)`;
        }
    }, 20);
    
    // Set feedback text based on score and type
    let feedback = '';
    if (type === 'emotion') {
        if (score >= 85) feedback = "Exceptional emotional regulation (Top 10%) - You handle emotional challenges with remarkable composure";
        else if (score >= 70) feedback = "Strong emotional control (Top 30%) - You manage most emotional situations effectively";
        else if (score >= 50) feedback = "Average emotional regulation (Top 60%) - You cope well with typical emotional challenges";
        else if (score >= 30) feedback = "Developing emotional control (Needs improvement) - Stress sometimes affects your reactions";
        else feedback = "Poor emotional regulation (Consider stress management) - Emotional situations often overwhelm you";
    } 
    else if (type === 'decision') {
        if (score >= 85) feedback = "Excellent decision-making (Top 10%) - You make quick, accurate choices under pressure";
        else if (score >= 70) feedback = "Good decision skills (Top 30%) - You generally make sound choices in stressful situations";
        else if (score >= 50) feedback = "Average decision ability (Top 60%) - You make reasonable decisions most of the time";
        else if (score >= 30) feedback = "Inconsistent decisions (Needs practice) - Stress sometimes impairs your judgment";
        else feedback = "Poor decision-making (Consider training) - You struggle to make effective choices when stressed";
    }
    else {
        if (score >= 85) feedback = "Exceptional stress resilience (Top 10%) - You remain calm and effective in highly stressful situations";
        else if (score >= 70) feedback = "Strong stress tolerance (Top 30%) - You handle pressure well with minimal performance impact";
        else if (score >= 50) feedback = "Average stress management (Top 60%) - You cope reasonably well with typical stressors";
        else if (score >= 30) feedback = "Developing tolerance (Needs strategies) - You become overwhelmed but show some coping ability";
        else feedback = "Poor stress tolerance (Seek support) - Stress significantly impacts your functioning";
    }
    
    feedbackElement.textContent = feedback;
}

// Retake the test
function retakeTest() {
    welcomeScreen.style.display = 'flex';
    testScreen.style.display = 'none';
    resultsScreen.style.display = 'none';
    ageInput.value = '';
}