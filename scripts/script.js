const questions = [
    { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
    { question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
    // Add more questions here (total 20-30 questions)
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 180; // 3 minutes in seconds
let username = "";
let startTime;
let totalTimeTaken = 0;
let selectedOption = null;  // Track the selected option

// Start the quiz
function startQuiz() {
    username = document.getElementById('username').value;
    if (username.trim() === "") {
        alert("Please enter your name.");
        return;
    }
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    startTime = new Date();  // Record the start time
    startTimer();
    showQuestion();
}

// Start the timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            endQuiz();
        }
    }, 1000);
}

// Update the timer display
function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer').innerText = `Time left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Display the current question
function showQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const currentQuestion = questions[currentQuestionIndex];
    
    questionElement.innerText = currentQuestion.question;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => selectAnswer(option, button);
        optionsElement.appendChild(button);
    });

    selectedOption = null;  // Reset selected option for the new question

    // Disable the next button until an answer is selected
    document.getElementById('next-btn').disabled = true;
}

// Handle option selection (but do not submit yet)
function selectAnswer(option, button) {
    selectedOption = option;  // Track the selected option

    // Highlight the selected option visually
    const buttons = document.getElementById('options').querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');

    // Enable the next button once an option is selected
    document.getElementById('next-btn').disabled = false;
}

// Move to the next question (and submit the selected answer)
function nextQuestion() {
    // Check the selected answer only when the next button is clicked
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
        score++;  // Increment score if the selected option is correct
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }

    // Disable the next button until an answer is selected for the next question
    document.getElementById('next-btn').disabled = true;
}

// End the quiz
function endQuiz() {
    clearInterval(timer);
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
    
    // Calculate total time taken
    const endTime = new Date();
    totalTimeTaken = Math.floor((endTime - startTime) / 1000); // In seconds

    document.getElementById('score-display').innerText = `Your score: ${score}/${questions.length}`;
    updateLeaderboard();
}

// Update the leaderboard
function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ username, score, timeTaken: totalTimeTaken });

    // Sort by score, then by time taken (ascending, faster time is better)
    leaderboard.sort((a, b) => {
        if (b.score === a.score) {
            return a.timeTaken - b.timeTaken;
        }
        return b.score - a.score;
    });

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = "";
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `${entry.username}: ${entry.score}, Time: ${Math.floor(entry.timeTaken / 60)}m ${entry.timeTaken % 60}s`;
        leaderboardElement.appendChild(li);
    });
}