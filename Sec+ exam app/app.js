let questions = [];

// Function to display questions dynamically
function displayQuestions() {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = ''; // Clear the container

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionText = document.createElement('p');
        questionText.innerText = question.text;

        questionDiv.appendChild(questionText);

        question.answers.forEach((answer, i) => {
            const answerDiv = document.createElement('div');
            const radioInput = document.createElement('input');
            radioInput.setAttribute('type', 'radio');
            radioInput.setAttribute('name', `question${index}`);
            radioInput.setAttribute('value', i);
            const label = document.createElement('label');
            label.innerText = answer;

            answerDiv.appendChild(radioInput);
            answerDiv.appendChild(label);
            questionDiv.appendChild(answerDiv);
        });

        questionContainer.appendChild(questionDiv);
    });
}

// Function to add a new question
function addQuestion(questionText, answers) {
    questions.push({ text: questionText, answers: answers, correctAnswer: 0 }); // Default correct answer is the first one (this can be changed later)
    displayQuestions();
}

// Submit button functionality to calculate score
document.getElementById('submitBtn').addEventListener('click', function() {
    let score = 0;
    questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedAnswer && parseInt(selectedAnswer.value) === question.correctAnswer) {
            score++;
        }
    });
    document.getElementById('scoreDisplay').innerText = `You scored ${score} out of ${questions.length}`;
});

// Modal functionality to add questions
document.getElementById('addQuestionBtn').addEventListener('click', function() {
    document.getElementById('addQuestionModal').style.display = 'block';
});

document.getElementById('closeModalBtn').addEventListener('click', function() {
    document.getElementById('addQuestionModal').style.display = 'none';
});

document.getElementById('saveQuestionBtn').addEventListener('click', function() {
    const questionText = document.getElementById('newQuestion').value;
    const answers = [];
    const answerElements = document.querySelectorAll('#answersContainer input');
    answerElements.forEach(answerInput => {
        answers.push(answerInput.value);
    });

    addQuestion(questionText, answers);

    // Close modal after saving
    document.getElementById('addQuestionModal').style.display = 'none';
    document.getElementById('newQuestion').value = '';
    document.getElementById('answersContainer').innerHTML = ''; // Clear answers for next question
});
// Fetch question bank from questions.json
function loadQuestionBank() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            randomizeQuestions();
            displayQuestions();
        })
        .catch(error => console.error('Error loading question bank:', error));
}

// Call this function when the page loads
window.addEventListener('load', loadQuestionBank);

// Add answer dynamically in modal
document.getElementById('addAnswerBtn').addEventListener('click', function() {
    const answerInput = document.createElement('input');
    answerInput.setAttribute('type', 'text');
    document.getElementById('answersContainer').appendChild(answerInput);
});
document.getElementById('submitBtn').addEventListener('click', function() {
    let score = 0;
    const totalQuestions = questions.length;
    const maxScore = 800; // Max possible score (900-100)
    const passingScore = 750;

    questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedAnswer && parseInt(selectedAnswer.value) === question.correctAnswer) {
            score++;
        }
    });

    // Calculate the scaled score (between 100 to 900)
    const scaledScore = Math.floor(100 + (score / totalQuestions) * maxScore);

    // Display result
    const resultMessage = scaledScore >= passingScore
        ? `Congratulations! You passed with a score of ${scaledScore}.`
        : `Unfortunately, you failed with a score of ${scaledScore}.`;

    document.getElementById('scoreDisplay').innerText = resultMessage;
});
// Load saved progress from localStorage
function loadProgress() {
    const savedQuestions = localStorage.getItem('questions');
    const savedAnswers = localStorage.getItem('answers');

    if (savedQuestions) {
        questions = JSON.parse(savedQuestions);
        displayQuestions();

        if (savedAnswers) {
            const answers = JSON.parse(savedAnswers);
            questions.forEach((question, index) => {
                if (answers[index] !== null) {
                    document.querySelector(`input[name="question${index}"][value="${answers[index]}"]`).checked = true;
                }
            });
        }
    }
}

// Save progress to localStorage
function saveProgress() {
    const answers = [];
    questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
        answers.push(selectedAnswer ? parseInt(selectedAnswer.value) : null);
    });
    localStorage.setItem('questions', JSON.stringify(questions));
    localStorage.setItem('answers', JSON.stringify(answers));
}

// Clear progress when test is completed
function clearProgress() {
    localStorage.removeItem('questions');
    localStorage.removeItem('answers');
}

// Call `saveProgress` whenever an answer is selected
document.getElementById('testForm').addEventListener('change', saveProgress);

// Call `loadProgress` when the page loads
window.addEventListener('load', loadProgress);

// Shuffle the questions array
function randomizeQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}
// Submit button functionality to calculate score
document.getElementById('submitBtn').addEventListener('click', function() {
    let score = 0;
    const totalQuestions = questions.length;
    const maxScore = 800; // Max possible score (900-100)
    const passingScore = 750;

    questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedAnswer && parseInt(selectedAnswer.value) === question.correctAnswer) {
            score++;
        }
    });

    // Calculate the scaled score (between 100 to 900)
    const scaledScore = Math.floor(100 + (score / totalQuestions) * maxScore);

    // Display result
    const resultMessage = scaledScore >= passingScore
        ? `Congratulations! You passed with a score of ${scaledScore}.`
        : `Unfortunately, you failed with a score of ${scaledScore}.`;

    document.getElementById('scoreDisplay').innerText = resultMessage;

    // Clear progress once the test is finished
    clearProgress();
});
