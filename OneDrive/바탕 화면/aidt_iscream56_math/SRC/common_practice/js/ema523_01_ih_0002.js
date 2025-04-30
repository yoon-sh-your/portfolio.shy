window.addEventListener("DOMContentLoaded", function () {
    const column = 8;
    const row = 10;
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


    const btns = document.querySelectorAll(".select_btn");

    btns.forEach(function (btn) {
        btn.addEventListener("click", () => {
            document.querySelector("#sound_click").play();
            btn.classList.toggle("on");
        });
    });
});