document.addEventListener('DOMContentLoaded', function() {
    const updateInputsByMultiple = () => {
        const multipleInput1 = document.querySelector(".multiple_input1");
        const multipleInput2 = document.querySelector(".multiple_input2");
        
        multipleInput1.addEventListener("input", function() {
            let comboKey = 0;
            
            const inputValue1 = multipleInput1.value.trim();

            if (inputValue1 === "△") {
                comboKey = 1;
            } else if (inputValue1 === "□") {
                comboKey = 2;
            } else {
                comboKey = 0;
            }

            const match = document.querySelector(`.multiple_map [data-multiple="${comboKey}"]`);
            
            if (match) {
                if (multipleInput1) multipleInput1.setAttribute("data-answer-single", match.dataset.input1 || "");
                if (multipleInput2) multipleInput2.setAttribute("data-answer-single", match.dataset.input2 || "");
            } else {
                // 조합이 없을 경우 비우기
                if (multipleInput1) multipleInput1.setAttribute("data-answer-single", "");
                if (multipleInput2) {
                    multipleInput2.classList.add('both');
                    multipleInput2.setAttribute("data-answer-single", "△=□+1 또는 □=△-1");
                }
            }
        });
    };
    
    document.addEventListener("change", updateInputsByMultiple);
    updateInputsByMultiple(); // 초기 실행
});

// 리셋일 떄
function resetCustom () {
    const multipleInput2 = document.querySelector(".multiple_input2")
    multipleInput2.classList.remove('both');
}