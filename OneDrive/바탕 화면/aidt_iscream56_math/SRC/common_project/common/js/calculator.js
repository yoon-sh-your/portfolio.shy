// var audio_click = new Audio("../../common/audio/click.mp3");

// 계산기 팝업 HTML 생성 함수
function createCalculatorHTML() {
    return `
        <div class="cal_popup calculator_wrap ui-draggable ui-draggable-handle" tabindex="-1" style="display: none; position: absolute;">
            <div class="calculator_area">
                <input type="text" placeholder=" " class="cal_display" disabled value="0" />
                <div class="cal_buttons">
                    <button class="cal_btn" data-value="7">7</button>
                    <button class="cal_btn" data-value="8">8</button>
                    <button class="cal_btn" data-value="9">9</button>
                    <button class="cal_btn" data-value="/">÷</button>
                    <button class="cal_btn" data-value="4">4</button>
                    <button class="cal_btn" data-value="5">5</button>
                    <button class="cal_btn" data-value="6">6</button>
                    <button class="cal_btn" data-value="*">×</button>
                    <button class="cal_btn" data-value="1">1</button>
                    <button class="cal_btn" data-value="2">2</button>
                    <button class="cal_btn" data-value="3">3</button>
                    <button class="cal_btn" data-value="-">-</button>
                    <button class="cal_btn" data-value="0">0</button>
                    <button class="cal_btn" data-value=".">.</button>
                    <button class="cal_btn cal_result" data-value="=">=</button>
                    <button class="cal_btn" data-value="+">+</button>
                    <button class="cal_btn clear_btn" data-value="C">C</button>
                </div>
            </div>
            <button class="btn img_close on" tabindex="0" aria-label="계산기 닫기">닫기</button>
        </div>
    `;
}

// 계산기 기능을 초기화하는 함수 정의
function initializeCalculator() {
    // --- 계산기 호출 아이콘 존재 여부 확인 ---
    const calculatorIcon = document.querySelector(".cal_icon");
    if (!calculatorIcon) {
        // console.log("계산기 호출 버튼(.cal_icon)이 없어 초기화를 건너<0xEB><0x9A><0x8D>니다.");
        return; // 아이콘 없으면 함수 종료
    }
    // --- 확인 끝 ---

    // --- HTML 생성 및 삽입 ---
    // 이미 생성되었는지 확인 (중복 생성 방지)
    if (!document.querySelector(".cal_popup.calculator_wrap")) {
        const calculatorHTML = createCalculatorHTML();
        const container = document.getElementById("app_wrap") || document.body; // 삽입할 컨테이너 찾기
        container.insertAdjacentHTML('beforeend', calculatorHTML);
    }
    // --- HTML 생성 및 삽입 끝 ---

    // 아래 변수들이 계산기 외 다른 기능에서도 사용되는지 확인 필요
    var teacher = false;
    var url = document.location.href.split("_t.html");
    if (url.length > 1) teacher = true;
    var count = 1;
    var count_total = 6;
    var reFn = false;
    // var audio = new Audio("../../common/audio/no.mp3"); // 사운드 관련 주석 처리

    // 계산기 script 시작
    var popup = document.querySelector(".cal_popup");
    var wrap = document.getElementById("app_wrap");
    var offsetX,
        offsetY,
        isDragging = false;
    
    // wrap (#app_wrap) 요소가 존재하고 popup이 생성되었을 경우 초기 위치 설정
    if (wrap && popup) {
        var containerRect = wrap.getBoundingClientRect();
        // 초기 위치 설정 (필요에 따라 조정)
        popup.style.left = containerRect.left + 680 + "px";
        popup.style.top = containerRect.top + 170 + "px";
        // display: none 상태이므로 show() 호출 시 위치가 적용됨
    } else if (!popup) {
         console.error("계산기 팝업(.cal_popup) 요소를 찾을 수 없습니다.");
    } else {
        console.warn("#app_wrap 요소가 없어 계산기 초기 위치를 설정할 수 없습니다."); // 경고 메시지 수정
    }

    let click = {
        x: 0,
        y: 0,
    };

    let rotateCalcLeft = 0;
    let rotateCalcTop = 0;
    // ./계산기 script

    // jQuery 사용 시작 - 이 아래 코드는 jQuery 로드 후 실행되어야 함
    if ($(".cal_display")) {
        // 계산기
        let calculatorDisplay = $(".cal_display");
        let calculatorResultArea = $(".textareaGroup textarea");
        let calculatorCurrentInput = "";
        let calculatorLastNumber = "";
        let calculatorFormula = "";
        let calculatorTagType = "input";
        let calculatorIsNumber = false;

        if (calculatorDisplay.prop("tagName")?.toLowerCase() === "input") {
            calculatorTagType = "input";
        } else {
            calculatorTagType = "span";
        }

        function returncalculatorNumber(val) {
            if (calculatorTagType === "input") {
                calculatorDisplay.val(val);
            } else {
                calculatorDisplay.text(val);
            }
        }

        function replacedFormula(val) {
            let string;
            let parts;
            if (val) {
                // 숫자와 연산자를 분리하되, 소수점은 숫자와 함께 유지
                parts = calculatorFormula.match(/([0-9.]+|[+\-*\/])/g) || []; 
                for (var i = 0; i < parts.length; i++) {
                    // 불필요한 선행 0 제거 로직 (개선 필요 시 검토)
                    if (parts[i] == "0" || parts[i] == "00") {
                        if (parts[i+1] !== '.' && !isNumber(parts[i+1])) {
                            parts[i] = "0"; 
                        }
                    }
                }
                string = parts.join("");
                calculatorFormula = string;
                string = string.replace(/\*/g, "×").replace(/\//g, "÷");
            } else {
                string = calculatorFormula.replace(/×/g, "*").replace(/÷/g, "/");
                // console.log(string);
            }

            return string;
        }

        function isNumber(value) {
            // Improved check for numbers including decimals
            return !isNaN(parseFloat(value)) && isFinite(value);
        }

        $(".cal_btn").on("pointerup", function (e) {
            e.stopPropagation();
            // clickSound(); // 사운드 관련 주석 처리
            let value = $(this).data("value");

            if (value === "C") {
                calculatorCurrentInput = "";
                calculatorLastNumber = "";
                calculatorFormula = "";
                calculatorIsNumber = false;
                returncalculatorNumber(0);
            } else if (value === "=") {
                if (isNumber(calculatorLastNumber) || calculatorLastNumber === '0') { // Allow calculation if last input was 0
                    try {
                        let formulaToEval = replacedFormula(false);
                        // 마지막이 연산자면 제거 (EvalError 방지)
                        if (/[+\-*\/]$/.test(formulaToEval.trim())) {
                            formulaToEval = formulaToEval.trim().slice(0, -1);
                        }
                        let result = eval(formulaToEval) || 0;
                        result = Math.round(result * 1000) / 1000;
                        returncalculatorNumber(result);
                        calculatorCurrentInput = String(result); // 결과값을 문자열로 저장
                        calculatorFormula = String(result);
                        calculatorLastNumber = String(result);
                        calculatorIsNumber = true;
                    } catch (error) {
                        console.error("Calculation error:", error);
                        returncalculatorNumber("Error"); // Indicate error
                        calculatorCurrentInput = "";
                        calculatorFormula = "";
                        calculatorLastNumber = "";
                        calculatorIsNumber = false;
                    }
                }
            } else if (
                value === "*" ||
                value === "/" ||
                value === "+" ||
                value === "-"
            ) {
                // 마지막 입력이 숫자거나, 결과값이거나, 0이었을 경우에만 연산자 추가
                if (calculatorIsNumber || calculatorLastNumber === '.') { 
                    // 마지막이 이미 연산자면 교체, 아니면 추가
                    if (/[+\-*\/]$/.test(calculatorFormula.trim())) {
                        calculatorFormula = calculatorFormula.trim().slice(0, -1) + value;
                    } else {
                        calculatorFormula += value;
                    }
                    calculatorIsNumber = false; // 연산자 입력 후엔 숫자가 아님
                    calculatorLastNumber = value; // 마지막 입력은 연산자
                    returncalculatorNumber(replacedFormula(true));
                }
            } else if (value === ".") {
                // 현재 숫자에 소수점이 없고, 마지막 입력이 연산자가 아닐 때만 추가
                const lastNumSegment = calculatorFormula.split(/[+\-*\/]/).pop();
                if (!lastNumSegment.includes('.') && (calculatorIsNumber || calculatorFormula === "" || /[+\-*\/]$/.test(calculatorFormula.trim()))) {
                    // 숫자가 없으면 0.으로 시작
                    if (!calculatorIsNumber && calculatorFormula !== "" && !/[+\-*\/]$/.test(calculatorFormula.trim())) {
                        // 이 경우는 발생하기 어려움 (연산자 뒤에는 isNumber가 false)
                    } else if (calculatorFormula === "" || /[+\-*\/]$/.test(calculatorFormula.trim())){
                        calculatorFormula += "0" + value;
                    } else {
                        calculatorFormula += value;
                    }
                    calculatorIsNumber = true; 
                    calculatorLastNumber = value;
                    returncalculatorNumber(replacedFormula(true));
                }
            } else { // 숫자 입력
                // 숫자 또는 0으로 시작 허용
                calculatorFormula += String(value);
                calculatorIsNumber = true;
                calculatorLastNumber = String(value);
                returncalculatorNumber(replacedFormula(true));
            }
        });

        // 다시하기 버튼 클릭 시 계산기 초기화
        // .btn-re 클래스를 가진 버튼은 다른 스크립트(예: btn_act.js)에서 처리할 수 있으므로,
        // 중복 이벤트 리스너 방지를 위해 필요 시 이 부분을 주석 처리하거나 제거
        // const btnRe = document.getElementsByClassName("btn-re")[0];
        // if (btnRe) {
        //   btnRe.addEventListener("click", function () {
        //     if (calculatorDisplay) {
        //       calculatorFormula = "";
        //       calculatorLastNumber = "";
        //       calculatorCurrentInput = "";
        //       returncalculatorNumber(0);
        //     }
        //   });
        // }

        // 계산기 팝업버튼
        $(".cal_icon").click(function () {
            popup = document.querySelector(".cal_popup");
            if (!popup) return;
            $(this).toggleClass("on");

            // clickSound(); // 사운드 관련 주석 처리

            if ($(this).hasClass("on")) {
                $(this).addClass("on");
                $(".cal_popup").show();
            } else {
                $(this).removeClass("on");
                $(".cal_popup").hide();
            }
        });

        // 계산기 닫기 버튼
        $(document).off("click", ".img_close").on("click", ".img_close", function () {
            popup = document.querySelector(".cal_popup");
            if (!popup) return;
            $(".cal_popup").hide();
            $(".cal_icon").removeClass("on");

            // clickSound(); // 사운드 관련 주석 처리
        });

        // 계산기 팝업으로 제시 및 드래그 (jQuery UI draggable 사용)
        if ($.ui && $.ui.draggable) { // jQuery UI draggable 로드 확인
            if ($(".cal_popup").hasClass('ui-draggable')) {
                try { $(".cal_popup").draggable('destroy'); } catch(e) {}
            }
            $(".cal_popup").draggable({
                containment: "parent", // 화면 내에서만 드래그 가능하도록 설정
                start: startFix,
                drag: dragFix,
                stop: function (event, ui) {
                    if (ui.helper) ui.helper.css("cursor", "move");
                },
            });
        } else {
            console.warn("jQuery UI Draggable is not loaded. Calculator drag functionality disabled.");
        }

        function startFix(event, ui) { // ui 인자 사용
             click.x = event.clientX;
             click.y = event.clientY;

            // Get the element's visual position using getBoundingClientRect
            const rect = ui.helper[0].getBoundingClientRect();
            const initialElementX = rect.left;
            const initialElementY = rect.top;

            // Get the current scale, default to 1 if not defined
            window.scale = globalScale || 1;

            // Calculate the offset between the mouse and the element's top-left corner
            // in the *viewport's* coordinate system (unscaled)
            const offsetX_viewport = event.clientX - initialElementX;
            const offsetY_viewport = event.clientY - initialElementY;

            // Store the initial *unscaled* offset (relative to the element's top-left)
            // This represents where within the element the drag started
            rotateCalcLeft = offsetX_viewport / window.scale;
            rotateCalcTop = offsetY_viewport / window.scale;

             // Keep track of the initial position reported by jQuery UI (might be useful)
             // click.initialLeft = ui.position.left;
             // click.initialTop = ui.position.top;

             ui.helper.css("cursor", "grabbing");
        }

        function dragFix(event, ui) { // ui 인자 사용
            // Only update cursor style. Let jQuery UI handle the position updates
            // based on containment and mouse movement.
             if (!ui.helper) return;
             ui.helper.css("cursor", "grabbing");

             // DO NOT directly manipulate ui.position here:
             // window.scale = globalScale || 1;
             // ui.position.left = ???;
             // ui.position.top = ???;
        }
    } else {
        console.warn(".cal_display 요소를 찾을 수 없어 계산기 로직 초기화에 실패했습니다."); // 메시지 내 클래스명 수정
    }
} // initializeCalculator 함수 종료

// app.js에서 스크립트 로드가 완료된 후 실행되도록 큐에 추가
if (window.afterAppReadyQueue) {
    if (!window.afterAppReadyQueue.includes(initializeCalculator)) {
        window.afterAppReadyQueue.push(initializeCalculator);
    }
} else {
    // app.js 로드 전에 이 파일이 로드되는 예외적인 경우 대비
    document.addEventListener('DOMContentLoaded', initializeCalculator);
}


/* // 사운드 관련 주석 처리 시작
function clickSound() {
  // audio_click 변수가 정의되어 있지 않으므로 이 함수는 현재 에러를 발생시킴
  // if (!audio_click.paused && !audio_click.ended) {
  //   audio_click.pause();
  //   audio_click.currentTime = 0;
  //   audio_click.play();
  // } else {
  //   audio_click.play();
  // }
}
*/ // 사운드 관련 주석 처리 끝

// getScaleValue 함수 제거됨
// // 특정 요소의 scale 값을 가져오는 함수
// function getScaleValue(element) {
//   const style = window.getComputedStyle(element);
//   const matrix = style.transform || style.webkitTransform || style.mozTransform;

//   if (!matrix || matrix === "none") {
//     return 1; // 변환이 없으면 scale은 1
//   }

//   const matrixType = matrix.includes("3d") ? "3d" : "2d";
//   const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");

//   if (matrixType === "2d") {
//     return Math.sqrt(matrixValues[0] * matrixValues[0] + matrixValues[1] * matrixValues[1]);
//   } else {
//     // 3D 스케일의 경우, x축 스케일(첫 번째 값)을 반환하는 것이 일반적
//     return parseFloat(matrixValues[0]);
//   }
// }
