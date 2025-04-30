/**
 * 전역변수
 */
let globalScale = 1;
let globalFaultCount = 0;
let penModeState = { isPenMode: false };
let isPaging = false;
const cardFlip = { cards: [] };
const isTeacher = location.pathname.endsWith('_t.html');


// 외부 CDN 사용 권장 (버전 명시)
const externalScriptPaths = [
    "https://code.jquery.com/jquery-3.6.4.min.js",
    "https://code.jquery.com/ui/1.13.2/jquery-ui.min.js",
    "https://cdn.jsdelivr.net/gh/furf/jquery-ui-touch-punch@latest/jquery.ui.touch-punch.min.js",
];
// 전역 실행 대기 큐
window.afterAppReadyQueue = [];

// 내부 공통 스크립트
const scriptPaths = [
    // 통신 규약 필요한 스크립트
    "../../common_practice/common/js/receiver.js",
    "../../common_practice/common/js/serviceFuncs.js",

    "../../common_practice/common/js/htmlparser.js",
    "../../common_practice/common/js/html2json.js",
    "../../common_practice/common/js/html2canvas.min.js",

    // 고객사 금칙어 스크립트
    "https://cdn.smart-aidt.com/common/aidtBlockWordsV1.js",
    // 고객사 번역
    "https://cdn.smart-aidt.com/common/axios.min.js",
    "https://cdn.smart-aidt.com/common/transfer-v22.js",
    "https://cdn.smart-aidt.com/common/core.min.js",
    "https://cdn.smart-aidt.com/common/sha256.min.js",

    "../../common_practice/common/js/audio.js",
    "../../common_practice/common/js/dynamic_tag.js",
    "../../common_practice/common/js/scrollbar.js",
    "../../common_practice/common/js/dropdown.js",
    "../../common_practice/common/js/pagenation.js",
    "../../common_practice/common/js/toast_message.js",
    "../../common_practice/common/js/video_player.js",
    "../../common_practice/common/js/btn_act.js",
    "../../common_practice/common/js/write.js",
    "../../common_practice/common/js/drawline.js",
    "../../common_practice/common/js/drag_drop.js",
    "../../common_practice/common/js/image_zoom.js",
    "../../common_practice/common/js/problem_generator.js",
    "../../common_practice/common/js/badwords.js",
    
    //키패드기능 전역함수
    "../../common_practice/common/js/keypad/selvypen-math-keyboard.min.js",
    "../../common_practice/common/js/keypad/keypad.js"
    "../../common_practice/common/js/keypad/math_compare.js",
];

// 전체 스크립트 리스트
const allScripts = [...externalScriptPaths, ...scriptPaths];

// 초기 실행 및 창 크기 변경 시 대응
window.addEventListener("DOMContentLoaded", scaleScreen);
window.addEventListener("resize", scaleScreen);

// 스크립트 비동기 로딩
function loadScriptAsync(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.type = "text/javascript";
        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(`Script load error: ${src}`));
        document.head.append(script);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        for (const script of allScripts) {
            await loadScriptAsync(script);
        }

        console.log("모든 스크립트가 순차적으로 로드되었습니다.");
        initKeypad();
        
        if (isTeacher) {
            // 교사용 추가 UI or 기능
            document.getElementById("app_wrap").classList.add("teacher")
        }

        if (window.afterAppReadyQueue) {
            window.afterAppReadyQueue.forEach(fn => {
                try {
                    fn();
                } catch (e) {
                    console.error("afterAppReadyQueue 함수 실행 중 오류:", e);
                }
            });
        }

        initializeCardFlip();

    } catch (error) {
        console.error("스크립트 로드 실패:", error);
    }
});


/**
 * 화면 스케일링
 */
function scaleScreen() {
    const container = document.getElementById("app_wrap");
    if (!container) return;

    const scaleX = window.innerWidth / 1715;
    const scaleY = window.innerHeight / 764;
    globalScale = Math.min(scaleX, scaleY);

    container.style.transform = `scale(${globalScale})`;
}

/**
 * 전역 오답 수 업데이트
 */
function updateGlobalFaultCount(newCount) {
    globalFaultCount = newCount;
    document.dispatchEvent(new CustomEvent("globalFaultUpdated", {
        detail: globalFaultCount
    }));
}
/****************************************************************************************************************/

/****************************************************************************************************************/
/** 카드 플립 기능을 초기화하는 함수 */
function initializeCardFlip() {
    cardFlip.cards = Array.from(document.querySelectorAll(".letCheck li"));
    
    cardFlip.cards.forEach(card => {
        card.addEventListener("click", () => handleCardClick(card));
    });
}

/** 카드 클릭 이벤트 핸들러 */
function handleCardClick(card) {
    const cover = card.querySelector(".cover");
    
    if (cover && !cover.classList.contains("removed")) {
        cover.classList.add("removed"); // 커버 제거 플래그 추가
        cover.remove(); // 첫 클릭 시 cover 제거
    } else {
        if(card.querySelector(".back")){
            card.classList.toggle("flip"); // 두 번째 클릭부터 카드 뒤집기
        }
    }
    
    audioManager.playSound("click");
}
/****************************************************************************************************************/
/** 네비게이션 기능*/
async function navigate(dir) {
    const clickAudio = audioManager.audioElements['click'];
    
    if (clickAudio) {//버튼 클릭 오디오 실행 후 기능 실행
        await new Promise(resolve => {
            clickAudio.onended = resolve;
            clickAudio.play().catch(resolve);
        });
    }
    // 추가 기능 실행 및 완료 대기
    // await 함수();

    if (dir === 'back') {
        window.history.back();
    } else {
        window.location.href = `${dir}.html`;
    }
}


/****************************************************************************************************************/
/** 클래스 선택자 팝업 제어 기능 함수 */
function openPop(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = 'block';
    }
}

function closePop(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.display = 'none';
    }
}
/****************************************************************************************************************/
/**공통js 호출후 실행 hleper함수 */
function runAfterAppReady(fn) {
    window.afterAppReadyQueue = window.afterAppReadyQueue || [];
    if (typeof fn === "function") {
        window.afterAppReadyQueue.push(fn);
    } else {
        console.warn("runAfterAppReady에 함수가 전달되지 않았습니다.");
    }
}
