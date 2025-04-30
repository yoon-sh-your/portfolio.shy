runAfterAppReady(() => {
    const answerMap = {
        diw1: [181, 570],
        diw2: [0, 373],
    };

    function updateInputWrap(selector, width, left, dw1State, dw2State) {
        const $inputWrap = $(selector);
        $inputWrap.css({
            width: `${width}px`,
            left: `${left}px`,
        });
        $inputWrap.find(".dw1").toggleClass("on", dw1State);
        $inputWrap.find(".dw2").toggleClass("on", dw2State);
    }

    function resetInputWrap() {
        $(".dropdown_wrap").removeClass("on val-1 val-2");
        $(".input-wrap").each(function () {
            const $this = $(this);
            $this.removeAttr("style");
        });
        $(".input-wrap").find(".dw1").removeClass("on");
        $(".input-wrap").find(".dw2").removeClass("on");
        $(".draws-input-wrap").each(function () {
            $(this).data("pos", []);
        });
        $(".btn_area button").removeClass("active");
    }

    function renderResult($wrap, isCorrect, fromX, toX, y) {
        const $container = $wrap.find(".draw-area");

        // 정답/오답 배경선
        $("<div>")
            .addClass(isCorrect ? "line-bg-correct" : "line-bg-wrong")
            .css({
                top: `${y + 1}px`,
                left: `${fromX}px`,
                width: `${toX - fromX}px`,
            })
            .appendTo($container);

        // 원 표시
        [fromX, toX].forEach((x) => {
            $("<div>")
                .addClass(isCorrect ? "point-correct" : "point-wrong")
                .css({
                    top: `${y - 4}px`,
                    left: `${x - 12}px`,
                })
                .appendTo($container);
        });
    }



    function checkAndRenderResults() {
        Object.entries(answerMap).forEach(([key, [answerStart, answerEnd]]) => {
            const $wrap = $("." + key);
            const pos = $wrap.data("pos") || [];

            if (pos.length !== 2) return;

            const [userStart, userEnd] = pos.slice().sort((a, b) => a - b);
            const isCorrect = userStart === answerStart && userEnd === answerEnd;

            const userFromX = userStart + 25;
            const userToX = userEnd + 25;
            const answerFromX = answerStart;
            const answerToX = answerEnd;

            const y = 0;

            // 사용자 선택선
            // renderResult($wrap, false, userFromX, userToX, y);

            // 정답/오답 오버레이
            renderResult($wrap, isCorrect, answerFromX, answerToX, y);
        });
    }

    function clearAllDrawAreas() {
        $(".draw-area").empty();
    }

    $(".draws-input-wrap").each(function () {
        $(this).on("click", function (e) {
            $(".btn_area button").addClass("active");
            audioManager.playSound("click");

            let scale = getScale();
            console.log("scale", scale);
            let $wrap = $(this);
            let pos = $wrap.data("pos") || [];
            let x = e.pageX - $wrap.offset().left;
            let gap = parseFloat($wrap.attr("data-gap"));

            if (pos.length === 2) return;

            // 클릭 좌표 저장
            posX = Math.floor(x / scale / gap) * gap;

            // posX 값에 따라 처리
            if (posX <= gap / 2) {
                posX = 0;
            } else if (posX < 0) {
                posX = 0;
            } else if (posX > $wrap.width() - gap) {
                posX = $wrap.width();
            } else {
                posX = posX + 25; // 공통적으로 25px padding 고려
            }

            pos.push(posX);
            $wrap.data("pos", pos);

            // 클릭 1번째
            if (pos.length === 1) {
                $wrap.find(".input-wrap").css("left", `${pos[0]}px`);
                $wrap.find(".input-wrap .dw1").addClass("on");
            }

            // 클릭 2번째
            if (pos.length === 2) {
                const [start, end] = [pos[0], pos[1]].sort((a, b) => a - b); // 위치 계산만 정렬
                const width = end - start;

                $wrap.find(".input-wrap").css({
                    left: `${start}px`,
                    width: `${width}px`,
                });
                $wrap.find(".input-wrap .dw2").addClass("on");
            }
        });

        $(this).find(".custom_dropdown").off("change").on("change", function () {
            const selectedVal = $(this).val();
            const $wrap = $(this).closest(".draws-input-wrap");

            $wrap.removeClass(function (_, className) {
                return (className.match(/(^|\s)val-\d+/g) || []).join(" ");
            });

            if (selectedVal) {
                $wrap.addClass(`val-${selectedVal}`);
            }
        });
    });

    $(".dropdown_wrap").each(function () {
        $(this).find("select").on("click", function (e) {
            e.stopPropagation();
        });
    });

    // 커스텀 정답 조건
    window.customCheckCondition = function (el) {
        // let cnt11 = $(".diw1 .input-wrap").width();
        // let cnt12 = $(".diw1 .input-wrap").css("left");

        // let cnt21 = $(".diw2 .input-wrap").width();
        // let cnt22 = $(".diw2 .input-wrap").css("left");

        // if (cnt11 === 389 && cnt12 === "181px" && cnt21 === 373 && cnt22 === "0px") {
        //     // 첫 번째 조건
        //     return true;
        // }

        // return false;
        let isCorrect = true;

        // answerMap을 순회하며 각 diw의 조건 확인
        Object.entries(answerMap).forEach(([key, [expectedStart, expectedEnd]]) => {
            const $wrap = $("." + key); // 해당 diw 요소 선택
            const actualWidth = $wrap.find(".input-wrap").width();
            const actualLeft = parseFloat($wrap.find(".input-wrap").css("left"));

            // 실제 값 계산
            const actualStart = actualLeft;
            const actualEnd = actualLeft + actualWidth;

            // 정답 조건 확인
            if (actualStart !== expectedStart || actualEnd !== expectedEnd) {
                isCorrect = false; // 조건이 맞지 않으면 false로 설정
            }
        });

        return isCorrect;
    };
    // 정답 처리
    window.onCorrectCustom = function () {
        document.body.classList.add("success", "result");
        checkAndRenderResults();
    };
    // 첫 번째 오답 시
    window.onIncorrectCustom = function () {
        $(".draws-input-wrap").each(function () {
            $(this).data("pos", []);
        });
    };
    // 두 번째 오답 시
    window.onIncorrectTwiceCustom = function () {
        // updateInputWrap(".diw1 .input-wrap", 389, 181, true, false);
        // updateInputWrap(".diw2 .input-wrap", 373, 0, false, true);

        $(".draws-input-wrap").each(function () {
            $(this).data("pos", [{}, {}]);
        });

        checkAndRenderResults();
    };

    // 리셋 버튼 클릭 시 실행할 커스텀 함수
    window.resetCustom = function () {
        resetInputWrap();
        clearAllDrawAreas();
    };
});
