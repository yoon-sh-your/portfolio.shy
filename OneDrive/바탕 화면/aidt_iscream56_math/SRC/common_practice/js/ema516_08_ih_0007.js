window.addEventListener("DOMContentLoaded", function () {
    const column = 12;
    const row = 10;
    let html = '';

    for (let i = 0; i < column; i++) {
        html += `<div class="column">`;
        for (let j = 0; j < row; j++) {
            html += `<div class="row"></div>`;
        }
        html += `</div>`;
    }

    document.getElementById("lineArea").innerHTML = html;
});

//정오체크시 예시부분 on/off
function showQuizHint(){
    let quizHint = document.querySelector('.quiz_area.hint');
    quizHint.style.opacity = '1';
}

function HideQuizHint(){
    let quizHint = document.querySelector('.quiz_area.hint');
    quizHint.style.opacity = '0';
}
