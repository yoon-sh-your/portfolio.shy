// 드롭다운 상태 변경 감지
document.querySelectorAll(".custom_dropdown").forEach(dropdown => {
    dropdown.addEventListener("change", () => {
        const answerValue = dropdown.dataset.answerSingle;
        const userValue = dropdown.value;
        
        if (answerValue === "empty_answer") {
            dropdown.dataset.correction = !userValue ? "true" : "false";
            return;
        }
        
        if (!userValue) {
            delete dropdown.dataset.correction;
            return;
        }
        
        dropdown.dataset.correction = (userValue === answerValue) ? "true" : "false";
    });
});

// 초기 상태 설정
document.addEventListener("DOMContentLoaded", () => {
    setInitialCorrection();
});

// 리셋 시 초기화
window.resetCustom = function() {
    setInitialCorrection();
};

// 초기 correction 설정 함수
function setInitialCorrection() {
    document.querySelectorAll(".custom_dropdown").forEach(dropdown => {
        const answerValue = dropdown.dataset.answerSingle;
        if (answerValue === "empty_answer") {
            dropdown.dataset.correction = "true";
        } else {
            dropdown.dataset.correction = "false";
        }
    });
}
