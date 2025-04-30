
/* 1페이지 모션 gif */
$(document).on("click", ".foldTrigger", function () {
    //추후 접히는 GIF 애니메이션으로 대체
    handleFoldMotion($(this));
});

function handleFoldMotion($target) {
    console.log("접히는 모션 추가 예정", $target);
}



//2page jquery drag 이벤트 추가
let initPositionsPage2 = {};
let attemptCountPage2 = 0;

runAfterAppReady(function () {
    const $page2 = $(".page_2");

    // 2페이지 도형 초기 위치 설정
    const positionsPage2 = {
        drop_item1: { x: -32, y: 0 },
        drop_item2: { x: 343, y: 0 },
    };

    // 2페이지 도형 위치 설정
    Object.entries(positionsPage2).forEach(([className, pos]) => {
        const $el = $page2.find(`.${className}`);
        $el.css({
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: "none",
            willChange: "transform",
        });
    });

    // 2페이지 드래그 설정
    setTimeout(() => {
        Object.entries(positionsPage2).forEach(([className, pos]) => {
            const $el = $page2.find(`.${className}`);
            $el.css({
                transform: "none",
                top: pos.y,
                left: pos.x,
                position: "absolute",
            });

            initPositionsPage2[className] = { top: pos.y, left: pos.x };

            $el.draggable({
                containment: $page2.find(".drag_area"),
                scroll: false,
                stop: function () {
                    const current = $(this).position();
                    const start = initPositionsPage2[className];
                    const isMoved = current.top !== start.top || current.left !== start.left;
                    const isPage2Visible = $page2.is(":visible");

                    if (isMoved && isPage2Visible) {
                        $(".btnReset-page2").removeClass("is-disabled").addClass("active").prop("disabled", false).css("pointer-events", "auto");
                    }
                },
            });
        });
    }, 0);

    // custom_dropdown의 상태가 변경될 때마다 리셋 버튼 활성화
    $page2.find(".custom_dropdown").on("change", function () {
        $(".btnReset-page2").removeClass("is-disabled").addClass("active").prop("disabled", false).css("pointer-events", "auto");
    });

    // 리셋 버튼 비활성화
    if ($page2.is(":visible")) {
        $(".btnReset-page2").addClass("is-disabled").removeClass("active").prop("disabled", true);
    }
});

// ✅ 2페이지 리셋 버튼 클릭 처리
$(document).on("click", ".btnReset-page2", function () {
    const $page2 = $(".page_2");

    // 드래그 요소 리셋
    Object.entries(initPositionsPage2).forEach(([className, pos]) => {
        $page2.find(`.${className}`).css({
            top: pos.top,
            left: pos.left,
            position: "absolute",
            transform: "none", // transform 초기화
        });
    });

    // custom_dropdown 초기화 (이 부분은 실제 구현에 맞게 조정)
    $page2.find(".custom_dropdown").val(""); // 기본값으로 초기화

    window.resetCustom($page2);
    $(this).addClass("is-disabled").removeClass("active").prop("disabled", true);
});

// ✅ 공통 리셋 함수 정의
window.resetCustom = function ($container) {
    // 각 페이지에서의 드래그 요소 초기화
    $container.find(".dragndrop_fraction_wrap").each(function () {
        const $wrap = $(this);

        $wrap.find(".drop_item").each(function () {
            $(this).find(".drag_item").remove();
            $(this).removeAttr("data-value data-correction").removeClass("correct incorrect on selected");
        });

        $wrap.find(".drag_item_group .drag_item").removeAttr("style");
    });

    // 버튼 상태 복구
    $container.find(".btn_area button").removeClass("active").prop("disabled", false);

    // 시도 횟수 초기화
    attemptCountPage2 = 0;
};