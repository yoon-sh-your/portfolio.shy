let initPositions = {};
let attemptCount = 0;

runAfterAppReady(function () {
    const $page1 = $(".page_1");
    const positions = {
        ractangleBox1: { x: 360, y: 150 },
        ractangleBox2: { x: 570, y: 250 }
    };

    // 1페이지 도형 위치 설정
    Object.entries(positions).forEach(([className, pos]) => {
        const $el = $page1.find(`.${className}`);
        $el.css({
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: "none",
            willChange: "transform"
        });
    });

 // 드래그 세팅
setTimeout(() => {
    Object.entries(positions).forEach(([className, pos]) => {
        const $el = $page1.find(`.${className}`);
        $el.css({
            transform: "none",
            top: pos.y,
            left: pos.x,
            position: "absolute"
        });

        initPositions[className] = { top: pos.y, left: pos.x };

        // ✅ 클로저를 보장하기 위해 함수로 분리
        setupDraggable($el, className);
    });
}, 0);

// 드래그 설정 함수 (클로저 안전)
function setupDraggable($el, className) {
    const $page1 = $(".page_1");

    $el.draggable({
        containment: $page1.find(".ractangleWrap"),
        scroll: false,
        stop: function () {
            const current = $(this).position();
            const start = initPositions[className];
            const isMoved = current.top !== start.top || current.left !== start.left;
            const isPage1Visible = $page1.is(":visible");

            if (isMoved && isPage1Visible) {
                const $resetBtn = $(".btnReset-page1");
                $resetBtn
                    .removeClass("is-disabled")
                    .addClass("active")
                    .prop("disabled", false)
                    .css("pointer-events", "auto")
                    .css("transition", "all 0.2s ease"); // 시각적 효과 보장
            }
        }
    });
}


    // 👉 버튼 비활성화는 1페이지만 해당되도록
    if ($page1.is(":visible")) {
        $(".btnReset-page1").addClass("is-disabled").removeClass("active").prop("disabled", true);
    }

    // ✅ 2페이지 입력 이벤트 감지
    const $page2 = $(".page_2");
    const $mathField = $page2.find(".textarea");
    const $resetBtn2 = $(".btnReset-page2");
    const $submitBtn = $(".btnSubmit");

    // 초기 비활성화
    $resetBtn2.addClass("is-disabled").removeClass("active").prop("disabled", true);
    $submitBtn.addClass("is-disabled").removeClass("active").prop("disabled", true);

    // 입력 감지 이벤트
    $mathField.on("input", function () {
        let value = "";

        try {
            value = $mathField[0].getValue?.() || $mathField.text();
        } catch (e) {
            value = $mathField.text();
        }

        const isEmpty = !value.trim();

        $resetBtn2
            .toggleClass("is-disabled", isEmpty)
            .toggleClass("active", !isEmpty)
            .prop("disabled", isEmpty);

        $submitBtn
            .toggleClass("is-disabled", isEmpty)
            .toggleClass("active", !isEmpty)
            .prop("disabled", isEmpty);
    });
});


// ✅ 리셋 버튼 클릭 처리 (1페이지)
$(document).on("click", ".btnReset-page1", function () {
    const $page1 = $(".page_1");

    // 도형 위치 초기화
    Object.entries(initPositions).forEach(([className, pos]) => {
        $page1.find(`.${className}`).css({
            top: pos.top,
            left: pos.left,
            position: "absolute"
        });
    });

    // 커스텀 초기화 함수 실행
    window.resetCustom($page1);

    // 리셋 버튼 비활성화 (추가 안전 처리)
    const $resetBtn1 = $(".btnReset-page1");
    $resetBtn1
        .addClass("is-disabled")
        .removeClass("active")
        .prop("disabled", true)
        .css("pointer-events", "none");
});

// ✅ 리셋 버튼 클릭 처리 (2페이지)
$(document).on("click", ".btnReset-page2", function () {
    const $page2 = $(".page_2");

    console.log("2페이지 리셋 로직 실행");

    // 입력 필드 초기화
    const $mathField = $page2.find(".textarea");
    try {
        $mathField[0].setValue(""); // MathLive 입력 초기화
    } catch (e) {
        $mathField.text("");
    }

    // 버튼 비활성화
    $(this).addClass("is-disabled").removeClass("active").prop("disabled", true);
    $(".btnSubmit").addClass("is-disabled").removeClass("active").prop("disabled", true);

    window.resetCustom($page2);
});


// ✅ 공통 리셋 함수 정의
window.resetCustom = function ($container) {
    $container.find(".dragndrop_fraction_wrap").each(function () {
        const $wrap = $(this);

        $wrap.find(".drop_item").each(function () {
            $(this).find(".drag_item").remove();
            $(this)
                .removeAttr("data-value data-correction")
                .removeClass("correct incorrect on selected");
        });

        $wrap.find(".drag_item_group .drag_item").removeAttr("style");
    });

    // 버튼 상태 초기화는 여기선 제외 (각 버튼 별도 제어)
    attemptCount = 0;
};
