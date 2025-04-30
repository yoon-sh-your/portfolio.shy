runAfterAppReady(() => {
  // drag_checkout 드래그앤드롭 초기화
  const $draggable = $(".drag_checkout .draggable");
  const $droppable = $(".drag_checkout .droppable");
  let selectedDraggable = null; // 선택된 원본 드래그 아이템 추적

  // --- 하이라이트 업데이트 함수 (클릭 시 사용) ---
  function updateCheckoutHighlights(apply) {
      // 모든 드롭 영역에서 관련 클래스 제거
      $droppable.removeClass('ui-state-hover ui-droppable-active highlight-click-target drag-over');
      if (apply && selectedDraggable) {
          const isTriangle = selectedDraggable.hasClass("triangle");
          const isCircle = selectedDraggable.hasClass("circle");
          const typeClass = isTriangle ? "triangle" : isCircle ? "circle" : null;

          if (typeClass) {
              $droppable.each(function() {
                  const $drop = $(this);
                  // 해당 타입의 요소가 없는 드롭 영역만 하이라이트
                  if ($drop.find(`.${typeClass}`).length === 0) {
                      // jQuery UI hover 클래스 추가
                      $drop.addClass('ui-state-hover ui-droppable-active');
                  }
              });
          }
      }
  }

  // 드래그 가능한 요소 초기화 (원본)
  $draggable.draggable({
    helper: "clone",
    revert: "invalid",
    revertDuration: 0,
    cursor: "move",
    start: function (event, ui) {
      // 드래그 시작 시 클릭 선택/하이라이트 해제
      if (selectedDraggable) {
          selectedDraggable.removeClass('selected');
          selectedDraggable = null;
          updateCheckoutHighlights(false);
      }
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
      audioManager.playSound("drag");
    },
    drag: function (event, ui) {
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
    },
    stop: function (event, ui) {
      // 드래그 종료 시 클릭 하이라이트 제거
      updateCheckoutHighlights(false);
      // 기존 stop 로직 (checkAnswer 등)
      setTimeout(function () {
        checkAnswer(); // Check answer first

        // Now, check if any items remain and remove correction if empty
        const $group = $(".drag_group.g1");
        const hasDroppedItems =
          $group.find(".droppable .triangle, .droppable .circle").length > 0;
        if (!hasDroppedItems) {
          $group.removeAttr("data-correction");
          window.forceWatchEvaluation?.(); // ?. 추가
        }
      }, 50);
    },
  });

  // 드롭 가능한 영역 초기화
  $droppable.droppable({
    accept: ".drag_checkout .draggable", // 원본 draggable만 받도록 명시
    tolerance: "pointer",
    // over/out 핸들러 제거하여 jQuery UI 기본 hover 클래스 사용 유도
    // over: function() { $(this).addClass('drag-over'); },
    // out: function() { $(this).removeClass('drag-over'); },
    drop: function (event, ui) {
      // drop 시에는 over/out이 자동으로 처리되므로 클래스 제거는 불필요할 수 있으나 안전하게 제거
      $(this).removeClass('ui-state-hover ui-droppable-active drag-over');
      const $drop = $(this);
      const $dragItem = $(ui.draggable); // 드래그된 원본 아이템

      // 드롭 유효성 검사 (해당 타입 요소 없는지)
      const isTriangle = $dragItem.hasClass("triangle");
      const isCircle = $dragItem.hasClass("circle");
      const typeClass = isTriangle ? "triangle" : isCircle ? "circle" : null;

      if (!typeClass || $drop.find(`.${typeClass}`).length > 0) {
           // 드롭 불가 시 (이미 있거나 타입 불일치)
           audioManager.playSound("wrong");
           return;
      }

      // 유효하면 드롭 처리 함수 호출
      handleCheckoutDrop($dragItem, $drop);
    },
  });

  // --- 클릭-투-클릭 로직 --- 
  // 원본 드래그 요소 클릭
  $draggable.off('click').on('click', function(e) {
      e.stopPropagation();
      const $this = $(this);

      if (selectedDraggable && selectedDraggable[0] === this) {
          selectedDraggable.removeClass('selected');
          selectedDraggable = null;
      } else {
          if (selectedDraggable) {
              selectedDraggable.removeClass('selected');
          }
          selectedDraggable = $this;
          selectedDraggable.addClass('selected');
          audioManager.playSound('click');
      }
      // 하이라이트 업데이트
      updateCheckoutHighlights(true);
  });

  // 드롭 영역 클릭
  $droppable.off('click').on('click', function(e) {
      e.stopPropagation();
      const $drop = $(this);

      if (selectedDraggable) {
          const isTriangle = selectedDraggable.hasClass("triangle");
          const isCircle = selectedDraggable.hasClass("circle");
          const typeClass = isTriangle ? "triangle" : isCircle ? "circle" : null;

          if (typeClass && $drop.find(`.${typeClass}`).length === 0) {
              // 유효한 클릭 (선택된 아이템 O, 해당 타입 요소 X)
              handleCheckoutDrop(selectedDraggable, $drop);
              // 클릭 드롭 후 선택 해제
              selectedDraggable.removeClass('selected');
              selectedDraggable = null;
              updateCheckoutHighlights(false);
          } else {
              // 클릭 실패 (이미 있거나 타입 불일치)
              audioManager.playSound("wrong");
              // 실패 시에도 선택 해제
              selectedDraggable.removeClass('selected');
              selectedDraggable = null;
              updateCheckoutHighlights(false);
          }
      } else {
          // 선택된 아이템 없을 때 클릭은 아무 동작 안 함
      }
  });

  // 외부 클릭 시 선택 해제
  $(document).off("click.checkoutDragDrop").on("click.checkoutDragDrop", function(e) {
      if (selectedDraggable && !$(e.target).closest('.drag_checkout .draggable').length && !$(e.target).closest('.drag_checkout .droppable').length) {
          selectedDraggable.removeClass('selected');
          selectedDraggable = null;
          updateCheckoutHighlights(false);
      }
  });

  // --- 드롭 로직 함수화 --- 
  // $dragItem: 원본 드래그 요소
  // $drop: 드롭 대상 영역
  function handleCheckoutDrop($dragItem, $drop) {
      const isTriangle = $dragItem.hasClass("triangle");
      const isCircle = $dragItem.hasClass("circle");
      const typeClass = isTriangle ? "triangle" : isCircle ? "circle" : null;

      if (!typeClass) return; // 타입 없으면 종료

      // 이미 요소가 있는지 재확인 (중복 방지)
      if ($drop.find(`.${typeClass}`).length > 0) {
           console.warn("handleCheckoutDrop called but item already exists.");
           return;
       }

      // data-value 업데이트
      let valueParts = ($drop.attr("data-value") || "false false").split(" ");
      let currentValues = [valueParts[0] === "true", valueParts[1] === "true"];
      if (isTriangle) currentValues[0] = true;
      else if (isCircle) currentValues[1] = true;
      $drop.attr("data-value", currentValues.join(" "));

      // 새 요소 생성 및 추가
      const $droppedEl = $(`<div class="${typeClass}"></div>`);
      $drop.append($droppedEl);

      // 추가된 요소에 draggable 설정 (제거 기능)
      $droppedEl.draggable({
        revert: "invalid",
        revertDuration: 0,
        containment: "document",
        helper: "original",
        start: function (event, ui) {
          ui.position.left /= globalScale;
          ui.position.top /= globalScale;
          audioManager.playSound("drag");
        },
        drag: function (event, ui) {
          ui.position.left /= globalScale;
          ui.position.top /= globalScale;
        },
        stop: function (event, ui) {
          // --- 기존 제거 로직 유지 --- 
          const scale = globalScale || 1;
          const droppedElSize = this.getBoundingClientRect();
          const droppableRect = $drop[0].getBoundingClientRect(); // $drop 참조 유지

          const droppedCenterX = (ui.offset.left + droppedElSize.width / 2) / scale;
          const droppedCenterY = (ui.offset.top + droppedElSize.height / 2) / scale;

          const droppableLeft = droppableRect.left / scale;
          const droppableRight = droppableRect.right / scale;
          const droppableTop = droppableRect.top / scale;
          const droppableBottom = droppableRect.bottom / scale;

          const isOutside =
            droppedCenterX < droppableLeft ||
            droppedCenterX > droppableRight ||
            droppedCenterY < droppableTop ||
            droppedCenterY > droppableBottom;

          if (isOutside) {
            let valuePartsStop = ($drop.attr("data-value") || "false false").split(" ");
            let currentValuesStop = [valuePartsStop[0] === "true", valuePartsStop[1] === "true"];

            if ($(this).hasClass("triangle")) currentValuesStop[0] = false;
            else if ($(this).hasClass("circle")) currentValuesStop[1] = false;
            $drop.attr("data-value", currentValuesStop.join(" "));

            $(this).remove();
            audioManager.playSound("drop");
             // 제거 후 checkAnswer 호출 필요
            checkAnswer(); // Check answer first
            // 추가: 제거 후 correction 상태 업데이트
            const $group = $(".drag_group.g1");
            const hasDroppedItems =
              $group.find(".droppable .triangle, .droppable .circle").length > 0;
            if (!hasDroppedItems) {
              $group.removeAttr("data-correction");
              window.forceWatchEvaluation?.(); // ?. 추가
            }
          } else {
            $(this).css({ top: 0, left: 0 });
             // 제자리로 돌아올 때도 checkAnswer 호출 가능 (선택 사항)
            // checkAnswer();
          }
          // 여기서는 checkAnswer를 stop 로직의 isOutside 분기 내부로 옮김
        },
      });

      audioManager.playSound("drop");
      checkAnswer(); // 드롭 성공 후 답 확인
  }

  // Function to check the answer
  function checkAnswer() {
    const $group = $(".drag_group.g1"); // Target the specific group
    const $droppables = $group.find(".droppable");
    const answerString = $group.attr("data-answer-single");

    if (!answerString) {
      console.error(
        "Answer data (data-answer-single) not found on .drag_group.g1"
      );
      return;
    }

    let answerArray;
    try {
      // Replace single quotes with double quotes for valid JSON
      const validJsonString = answerString.replace(/'/g, '"');
      answerArray = JSON.parse(validJsonString); // Parse the JSON string e.g., [[true, true], ...]
    } catch (e) {
      console.error(
        "Failed to parse answer data from data-answer-single:",
        e,
        "Input string:",
        answerString
      );
      return;
    }

    let isCorrect = true;
    if ($droppables.length !== answerArray.length) {
      console.warn(
        "Mismatch between the number of droppable elements and the answer array length."
      );
      isCorrect = false;
    } else {
      $droppables.each(function (index) {
        const $drop = $(this);
        const valueStr = $drop.attr("data-value") || "false false"; // Get "true false" string
        const valueParts = valueStr.split(" ");
        const currentValue = [
          valueParts[0] === "true",
          valueParts[1] === "true",
        ]; // Convert to [true, false]
        const expectedValue = answerArray[index]; // Get expected [true, false] from answer

        // Compare current value with expected value
        if (
          currentValue[0] !== expectedValue[0] ||
          currentValue[1] !== expectedValue[1]
        ) {
          isCorrect = false;
          return false; // Exit the .each loop early if a mismatch is found
        }
      });
    }

    // Update data-correction attribute on the group
    $group.attr("data-correction", isCorrect.toString());
    window.forceWatchEvaluation(); // 상태 변경 후 강제 평가
    // console.log("Answer check complete. Correct:", isCorrect); // For debugging

    // Remove the feedback block, rely on btn_act.js using data-correction
    // /*
    // if (window.checkAnswerFeedback) {
    //      window.checkAnswerFeedback();
    // } else {
    //     console.log("Feedback function window.checkAnswerFeedback not found.")
    //     // Basic visual feedback as fallback
    //      $group.removeClass('correct incorrect');
    //      if (isCorrect) {
    //          $group.addClass('correct');
    //      } else {
    //          $group.addClass('incorrect');
    //      }
    // }
    // */
  }

  // 두 번째 오답 시: 정답과 다른 부분에 클래스 추가하고 모든 드래그 비활성화
  window.onIncorrectTwiceCustom = function () {
    const $sourceDraggables = $(".drag_checkout .draggable"); // 원본 드래그 요소 선택
    const $droppedDraggables = $(
      ".drag_group.g1 .droppable .triangle, .drag_group.g1 .droppable .circle"
    ); // 드롭된 요소 선택
    const $group = $(".drag_group.g1");
    const $droppables = $group.find(".droppable");
    const answerString = $group.attr("data-answer-single");

    // 원본 드래그 요소 비활성화
    $sourceDraggables.draggable("disable");
    // 드롭된 요소 드래그 비활성화
    $droppedDraggables.draggable("disable");

    // 기존 피드백 클래스 초기화
    $droppables.removeClass("triangle circle");

    if (!answerString) {
      console.error(
        "onIncorrectTwiceCustom: Answer data (data-answer-single) not found."
      );
      return;
    }

    let answerArray;
    try {
      const validJsonString = answerString.replace(/'/g, '"');
      answerArray = JSON.parse(validJsonString);
    } catch (e) {
      console.error("onIncorrectTwiceCustom: Failed to parse answer data:", e);
      return;
    }

    if ($droppables.length !== answerArray.length) {
      console.warn(
        "onIncorrectTwiceCustom: Mismatch between droppables and answer length."
      );
      // 길이가 다르면 비교가 무의미하므로 여기서 종료하거나 다른 처리를 할 수 있습니다.
      return;
    }

    $droppables.each(function (index) {
      const $drop = $(this);
      const valueStr = $drop.attr("data-value") || "false false";
      const valueParts = valueStr.split(" ");
      const currentValue = [valueParts[0] === "true", valueParts[1] === "true"];
      const expectedValue = answerArray[index]; // 예: [true, false]

      // 첫 번째 값(triangle) 비교
      if (currentValue[0] !== expectedValue[0]) {
        $drop.addClass("triangle");
      }

      // 두 번째 값(circle) 비교
      if (currentValue[1] !== expectedValue[1]) {
        $drop.addClass("circle");
      }
    });

    // (선택사항) 사용자에게 정답이 표시되었음을 알리는 메시지
    // alert("틀린 부분에 정답 표시가 추가되었습니다.");

    // 추가: 클릭 선택 상태 및 하이라이트 해제
    if (selectedDraggable) {
        selectedDraggable.removeClass('selected');
        selectedDraggable = null;
    }
    updateCheckoutHighlights(false);
  };

  // 리셋 시 드래그 활성화 추가 (필요한 경우)
  window.resetCustom = function () {
    const $group = $(".drag_group.g1");
    const hadCorrection = $group.attr("data-correction") !== undefined;
    $group.removeAttr("data-correction");
    // window.forceWatchEvaluation(); // 상태 변경 후 강제 평가 (이전 코드, 주석 처리)
    $group.removeClass("correct incorrect");
    $group.find(".droppable").each(function () {
      $(this).attr("data-value", "false false");
      $(this).find(".triangle, .circle").remove();
      $(this).removeClass("triangle circle"); // 리셋 시 피드백 클래스도 제거
    });

    // 드래그 요소 다시 활성화
    const $draggables = $(".drag_checkout .draggable");
    $draggables.draggable("enable");

    // Call update function directly if attribute was removed
    // if (hadCorrection) { // updateButtonStates 제거됨
    //     updateButtonStates();
    // }
  };

  try {
    // 버튼 활성화 조건 추가
    defineButtonClassRules([
      {
        selector: ".drag_group.g1",
        key:"custom_check_btn_active",
        test: function (el) {
          // data-correction 속성이 요소에 존재하는지 확인합니다.
          const correction = $(el).attr("data-correction");
          console.log("correction 속성 값:", correction); // 로그 추가: 속성 값 확인
          // 속성이 존재하면(null 또는 undefined가 아니면) true를 반환하고,
          // 그렇지 않으면 false를 반환합니다. data-correction이 설정되면 버튼이 활성화됩니다.
          return correction !== undefined && correction !== null;
        },
      },
    ]);
    console.log("defineButtonClassRules 호출 성공");
  } catch (e) {
    console.error("defineButtonClassRules 호출 중 오류 발생:", e);
  }
});
