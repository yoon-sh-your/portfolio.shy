document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".boolean_wrap").forEach(function (wrapper) {
        wrapper.querySelectorAll("button").forEach(function (button) {
            button.addEventListener("click", function () {
                let clickButton = this;

                wrapper.querySelectorAll("button").forEach(function (btn) {
                    if (btn.classList.contains("selected") && btn !== clickButton) {
                        btn.click();
                    }
                });
                btn.classList.add("selected");
            });
        });
    });
});

function addResult() {
    let booleanWraps = document.querySelectorAll(".boolean_wrap");

    booleanWraps.forEach(function (booleanWrap) {
        booleanWrap.classList.add("result");
    });

    $(".example_box").addClass("on");
}

function removeResult() {
    let booleanWraps = document.querySelectorAll(".boolean_wrap");

    booleanWraps.forEach(function (booleanWrap) {
        booleanWrap.classList.remove("result");
    });
}

// 정답일 때
function onCorrectCustom() {
    addResult();
}

// 리셋일 떄
function resetCustom() {
    removeResult();
}

// 첫번째 틀렸을 때
function onIncorrectCustom() {
    removeResult();
}

// 두번째 틀렸을 때
function onIncorrectTwiceCustom() {
    addResult();
}

// 빈칸일 때
function onEmptyCustom() {
    removeResult();
}

runAfterAppReady(() => {
    window.customCheckCondition = function () {
        const mathField = document.querySelector(".input_wrap math-field.textarea");
        const value = mathField && (typeof mathField.getValue === "function" ? mathField.getValue() : mathField.value || "");
        const isFilled = !!(value && value.trim() !== "");

        let btnCheck = $(".boolean_wrap button").hasClass("selected");
        console.log(isFilled, btnCheck);
        if (!isFilled || !btnCheck) {
            return "empty";
        }
        return $(".boolean_wrap button.selected").attr("data-correction") === "true";
    };
});
