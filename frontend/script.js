let currentQuiz = [];  // Store structured quiz
let userAnswers = [];  // Store user answers

// Call backend with topic
async function generateQuiz() {
    const topic = document.getElementById("topic").value;
    if (!topic) return alert("Please enter a topic");

    const formData = new URLSearchParams();
    formData.append("topic", topic);

    const response = await fetch("http://127.0.0.1:8000/quiz/topic", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    displayQuiz(parseQuiz(data.quiz));
}

// Call backend with PDF
async function generateQuizFromPDF() {
    const fileInput = document.getElementById("pdfFile");
    if (fileInput.files.length === 0) return alert("Please select a PDF file");

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const response = await fetch("http://127.0.0.1:8000/quiz/pdf", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    displayQuiz(parseQuiz(data.quiz));
}

// Parse AI text into structured quiz
function parseQuiz(text) {
    // Expecting format:
    // Q1: question
    // a) option
    // b) option
    // c) option
    // d) option
    // Answer: x
    const lines = text.split("\n").filter(l => l.trim() !== "");
    const quiz = [];
    let q = {};
    for (let line of lines) {
        if (line.match(/^Q\d+:/)) {
            if (Object.keys(q).length) quiz.push(q);
            q = {question: line.replace(/^Q\d+:\s*/, ""), options: [], answer: ""};
        } else if (line.match(/^[a-d]\)/)) {
            q.options.push(line);
        } else if (line.toLowerCase().includes("answer:")) {
            q.answer = line.split(":")[1].trim();
        }
    }
    if (Object.keys(q).length) quiz.push(q);
    currentQuiz = quiz;
    userAnswers = Array(quiz.length).fill("");
    return quiz;
}

// Display quiz on page
function displayQuiz(quiz) {
    const container = document.getElementById("quizOutput");
    container.innerHTML = "";

    quiz.forEach((q, i) => {
        const div = document.createElement("div");
        div.className = "quiz-question";


        const questionEl = document.createElement("h4");
        questionEl.innerText = `Q${i + 1}: ${q.question}`;
        div.appendChild(questionEl);

        q.options.forEach(opt => {
            const label = document.createElement("label");
            label.style.display = "block";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = `q${i}`;
            radio.value = opt[0];  // a/b/c/d
            radio.onclick = () => userAnswers[i] = radio.value;

            label.appendChild(radio);
            label.appendChild(document.createTextNode(" " + opt));
            div.appendChild(label);
        });

        container.appendChild(div);
    });

    const submitBtn = document.createElement("button");
    submitBtn.innerText = "Submit Quiz";
    submitBtn.onclick = calculateScore;
    container.appendChild(submitBtn);
}

// Calculate score
function calculateScore() {
    let score = 0;
    currentQuiz.forEach((q, i) => {
        if (userAnswers[i].toLowerCase() === q.answer.toLowerCase()) score++;
    });

    const container = document.getElementById("quizOutput");
    const scoreEl = document.getElementById("score");
    if (!scoreEl) {
        const newScoreEl = document.createElement("div");
        newScoreEl.id = "score";
        newScoreEl.innerText = `You scored ${score} out of ${currentQuiz.length}`;
        container.appendChild(newScoreEl);
    } else {
        scoreEl.innerText = `You scored ${score} out of ${currentQuiz.length}`;
    }
}

