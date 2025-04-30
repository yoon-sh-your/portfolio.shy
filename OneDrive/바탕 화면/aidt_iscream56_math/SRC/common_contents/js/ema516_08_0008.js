function checkAnswers(onCorrect, onIncorrect, onIncorrectTwice, onEmpty) {
    // data-answer-single 속성을 가진 모든 요소 선택
    const targets = pagenation.activePage.querySelectorAll("[data-answer-single]");

    let incorrectOccurred = false;
    let emptyOccurred = false;

    if (targets.length === 0) return;

    // 드롭다운이 비어있는지 체크
    targets.forEach((el) => {
        const selectedValue = el.value;

        // 선택되지 않은 드롭다운이 있으면 emptyOccurred = true
        if (selectedValue === "") {
            emptyOccurred = true;
        }

        const correction = el.dataset.correction;

        // 정답이 아닌 경우 incorrectOccurred = true
        if (correction === "false") {
            incorrectOccurred = true;
        }
    });

    // 선택되지 않은 값이 있을 경우 onEmpty 호출
    if (emptyOccurred) {
        onEmpty();
        return;
    }

    // 오답인 경우
    if (incorrectOccurred) {
        updateGlobalFaultCount(globalFaultCount + 1);
        if (globalFaultCount > 1) {
            onIncorrectTwice();
        } else {
            onIncorrect();
        }
        audioManager.playSound("incorrect");
    } else {
        // 정답인 경우
        onCorrect();
        globalFaultCount = 0;
        audioManager.playSound("correct");
    }
}