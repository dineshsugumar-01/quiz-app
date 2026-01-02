async function generateQuiz() {
    const topic = document.getElementById("topic").value;
    if (!topic) {
        alert("Please enter a topic");
        return;
    }

    const formData = new URLSearchParams();
    formData.append("topic", topic);

    const response = await fetch("http://127.0.0.1:8000/quiz/topic", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    document.getElementById("quizOutput").innerText = data.quiz;
}

async function generateQuizFromPDF() {
    const fileInput = document.getElementById("pdfFile");
    if (fileInput.files.length === 0) {
        alert("Please select a PDF file");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const response = await fetch("http://127.0.0.1:8000/quiz/pdf", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    document.getElementById("quizOutput").innerText = data.quiz;
}
