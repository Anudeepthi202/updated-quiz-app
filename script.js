const quizContainer = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        const data = await response.json();
        questions = data.results;
        displayQuestion();
    } catch (error) {
        questionElement.textContent = 'Failed to load questions.';
    }
}

function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = decodeURIComponent(currentQuestion.question);

    const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    options.sort(() => Math.random() - 0.5);

    optionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = decodeURIComponent(option);
        button.addEventListener('click', () => selectAnswer(button, currentQuestion.correct_answer));
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(button, correctAnswer) {
    const selectedAnswer = button.textContent;
    if (selectedAnswer === decodeURIComponent(correctAnswer)) {
        score++;
        button.style.backgroundColor = '#28a745';
    } else {
        button.style.backgroundColor = '#dc3545';
    }
    Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);
    nextButton.classList.remove('hidden');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
        nextButton.classList.add('hidden');
    } else {
        showResult();
    }
});

function showResult() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreElement.textContent = `${score} / ${questions.length}`;
}

restartButton.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    fetchQuestions();
});

fetchQuestions();
