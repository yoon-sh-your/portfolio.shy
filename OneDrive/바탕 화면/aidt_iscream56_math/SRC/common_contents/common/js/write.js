// 키패드 모드 상태 관리
// keypadModeState는 app.js에서 전역 변수로 선언됨

const handler = {
    set(target, key, value) {
        if (key === "isKeypadMode") {
            if (value === true) {
                onKeypadModeActivated();
            } else {
                onKeypadModeDeactivated();
            }
        }
        target[key] = value;
        return true;
    }
};

const keypadModeProxy = new Proxy(keypadModeState, handler);

// 실행 예제
function onKeypadModeActivated() {
    // console.log("🖊️ 키패드 모드 활성화");
    document.querySelectorAll(".input_wrap").forEach(element => {
        element.classList.add('keypad_mode')
    });
    document.querySelectorAll(".btn_area .btnType").forEach(element => {
        element.classList.add('formula')
    });
}

function onKeypadModeDeactivated() {
    // console.log("❌ 키패드 모드 비활성화");
    document.querySelectorAll(".input_wrap").forEach(element => {
        element.classList.remove('keypad_mode')
    });
    document.querySelectorAll(".btn_area .btnType").forEach(element => {
        element.classList.remove('formula')
    });
}