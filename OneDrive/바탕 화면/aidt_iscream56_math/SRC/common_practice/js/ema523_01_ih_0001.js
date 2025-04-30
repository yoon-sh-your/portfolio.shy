window.addEventListener("DOMContentLoaded", function () {
    const column = 4;
    const row = 4;
    let html = '';

    for (let i = 0; i < column; i++) {
        html += `<div class="column column${i}">`;
        for (let j = 0; j < row; j++) {
            html += `<div class="row row${j}"></div>`;
        }
        html += `</div>`;
    }

    document.getElementById("lineArea1").innerHTML = html;
    document.getElementById("lineArea2").innerHTML = html;
    document.getElementById("lineArea3").innerHTML = html;
    document.getElementById("lineArea4").innerHTML = html;
});