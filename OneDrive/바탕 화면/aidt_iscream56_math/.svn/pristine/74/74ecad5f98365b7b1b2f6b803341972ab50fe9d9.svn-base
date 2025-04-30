runAfterAppReady(function () {
  const $draggables = $(".draggable_bag");
  const $droppables = $(".droppable_bag");

  const itemDataMap = {
    "라디오": { formula: (n) => `500×${n}`, answer: (n) => 500 * n },
    "담요": { formula: (n) => `3000÷2×${n}`, answer: (n) => (3000 / 2) * n },
    "호루라기": { formula: (n) => `20×${n}`, answer: (n) => 20 * n },
    "손전등": { formula: (n) => `1000÷2×${n}`, answer: (n) => (1000 / 2) * n },
    "휴지": { formula: (n) => `1000÷10×${n}`, answer: (n) => (1000 / 10) * n },
    "물티슈": { formula: (n) => `1300÷20×${n}`, answer: (n) => (1300 / 20) * n },
    "우비": { formula: (n) => `600×${n}`, answer: (n) => 600 * n },
    "성냥개비": { formula: (n) => `150÷10×${n}`, answer: (n) => (150 / 10) * n },
    "물": { formula: (n) => `9000÷6×${n}`, answer: (n) => (9000 / 6) * n },
    "초콜릿": { formula: (n) => `1000÷5×${n}`, answer: (n) => (1000 / 5) * n },
    "통조림": { formula: (n) => `5000÷10×${n}`, answer: (n) => (5000 / 10) * n },
    "쿠키": { formula: (n) => `800÷40×${n}`, answer: (n) => (800 / 40) * n },
  };

  let isDropHandled = false;

  function handleHoverClass(helperEl) {
    $droppables.each(function () {
      const dropEl = this;
      const isOver = isOverlapScaled(dropEl, helperEl);
      $(dropEl).toggleClass("ui-state-hover ui-droppable-active", isOver);
    });
  }

  $draggables.draggable({
    helper: "clone",
    revert: "invalid",
    revertDuration: 0,
    zIndex: 1000,
    containment: "document",
    start: function (event, ui) {
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
      ui.helper.removeClass("already-dropped"); // ✅ 클론에 클래스 제거
      isDropHandled = false;
    },
    drag: function (event, ui) {
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
      handleHoverClass(ui.helper[0]);
    }
  });

  $droppables.droppable({
    accept: ".draggable_bag:not(.already-dropped)",
    tolerance: "pointer",
    drop: function (event, ui) {
      if (isDropHandled) return;
      isDropHandled = true;

      const $drop = $(this).removeClass("ui-state-hover ui-droppable-active");

      const pointerX = event.clientX / globalScale;
      const pointerY = event.clientY / globalScale;
      const dropRect = this.getBoundingClientRect();

      const dropLeft = dropRect.left / globalScale;
      const dropTop = dropRect.top / globalScale;
      const dropRight = dropRect.right / globalScale;
      const dropBottom = dropRect.bottom / globalScale;

      const isInside =
        pointerX >= dropLeft &&
        pointerX <= dropRight &&
        pointerY >= dropTop &&
        pointerY <= dropBottom;

      if (!isInside) return;

      const currentCount = $drop.find(".draggable_bag.already-dropped").length;
      if (currentCount >= 4) return;

      const $original = $(ui.draggable);
      const $clone = ui.helper.clone();

      const dropOffset = $drop.offset();
      const dragOffset = ui.helper.offset();
      const left = (dragOffset.left - dropOffset.left) / globalScale;
      const top = (dragOffset.top - dropOffset.top) / globalScale;

      $clone
        .removeClass("ui-draggable-dragging")
        .addClass("already-dropped")
        .css({
          position: "absolute",
          left: `${left}px`,
          top: `${top}px`,
          transform:'scale(0.8)',
        })
        .appendTo($drop)
        .draggable({
          helper: "original",
          containment: "document",
          zIndex: 1000,
          start: function (event, ui) {
            ui.position.left /= globalScale;
            ui.position.top /= globalScale;
          },
          drag: function (event, ui) {
            ui.position.left /= globalScale;
            ui.position.top /= globalScale;
            handleHoverClass(this);
          },
          stop: function (event, ui) {
            if (isOutsideDropArea($drop[0], this)) {
              const info = extractItemInfo($(this));
              if (info) updateInputArea(info.name, -1);
              $(this).remove();
              syncDroppedItemsToPages();
              updateItemCountTable();
              updateTotalWeightFormula();

              // 드롭된 요소가 하나도 없는지 확인
              if ($(".droppable_bag .draggable_bag.already-dropped").length === 0) {
                // 현재 활성화된 페이지의 math-field 초기화 및 비활성화
                const $activePage = $(".page.on");
                if ($activePage.length) {
                  $activePage.find(".answer1 math-field:not(.textarea)").attr("data-answer-single", "").attr("disabled", "");
                  $activePage.find(".answer2 math-field:not(.textarea)").attr("data-answer-single", "").attr("disabled", "");
                  $activePage.find(".answer3 math-field:not(.textarea)").attr("data-answer-single", "").attr("disabled", "");
                }
                // 버튼 비활성화
                $(".btn_area button:not(.btnType)").removeClass("active");
              }
            } else {
              syncDroppedItemsToPages();
              updateItemCountTable();
            }
          }
        });

      audioManager?.playSound("drop");

      const info = extractItemInfo($original);
      if (info) updateInputArea(info.name, 1);

      syncDroppedItemsToPages();
      updateItemCountTable();
      updateTotalWeightFormula();
    }
  });

  function extractItemInfo($element) {
    const fullText = $element.find(".text_box span").first().text().trim();
    const name = fullText.replace(/\s*\d+\s*\S*$/, "");
    return { name, count: 1 };
  }

  function updateInputArea(name, delta) {
    const $li = $(`.input_area li[value="${name}"]`);
    const $input = $li.find(".answer1 math-field:not(.textarea)");
    let count = parseInt($input.val(), 10) + delta;

    $input.val(count);
    console.log(count)

    const itemInfo = itemDataMap[name];
    if (itemInfo) {
      const formula = itemInfo.formula(count);
      const result = itemInfo.answer(count);

      $li.find(".answer2 math-field:not(.textarea)").attr("data-answer-single", formula).removeAttr('disabled');
      $li.find(".answer3 math-field:not(.textarea)").attr("data-answer-single", result).removeAttr('disabled');

      $li.find(".answer2 .text_hint").text(formula);
      $li.find(".answer3 .text_hint").text(result);
    }
  }

  function syncDroppedItemsToPages() {
    const $originalDrop = $(".page.drop .droppable_bag");
    console.log($originalDrop);
    const droppedItems = $originalDrop.find(".draggable_bag.already-dropped");
  
    // 수동 비율 조절 (page_1 : page_2, page_4)
    const widthRatio = 0.666; // 예: 2:3 → 2 ÷ 3 = 0.666
    const heightRatio = 0.666;
  
    // 대상 페이지
    const $targets = $(".page_2 .droppable_bag, .page_3 .droppable_bag, .page_4 .droppable_bag, .page_6 .droppable_bag");
  
    $targets.each(function () {
      const $targetDrop = $(this);
      $targetDrop.empty();
  
      droppedItems.each(function () {
        const $original = $(this);
        const left = parseFloat($original.css("left")) || 0;
        const top = parseFloat($original.css("top")) || 0;
  
        const adjustedLeft = left ;
        const adjustedTop = top / heightRatio;
  
        const $clone = $original.clone().css({
          position: "absolute",
          left: `${adjustedLeft}px`,
          top: `${adjustedTop}px`,
          transform: "scale(0.8)"
        });
  
        $targetDrop.append($clone);
      });
    });
  }

  function updateItemCountTable() {
    // 드랍된 모든 항목 가져오기 (모든 페이지의 드롭된 아이템을 찾도록 수정)
    const $dropped = $(".droppable_bag .draggable_bag.already-dropped");
  
    // 항목별 카운트 저장
    const itemCounts = {};
  
    $dropped.each(function () {
      const $item = $(this);
      const $nameSpan = $item.find(".text_box span[lang='y']");
      const fullText = $nameSpan.text().trim(); // 예: 라디오 1개
      const name = fullText.split(" ")[0]; // 첫 번째 단어만 사용 (예: "라디오")
  
      if (!itemCounts[name]) {
        itemCounts[name] = 0;
      }
      itemCounts[name]++;
    });
  
    console.log("Found items:", itemCounts); // 디버깅용 로그
  
    // page_4의 테이블 업데이트
    $(".page_4 .table_box td.name span[lang='y']").each(function () {
      const $nameSpan = $(this);
      const itemName = $nameSpan.text().trim();
      const $countCell = $nameSpan.closest("td.name").next("td.num").find("span");
  
      if (itemCounts[itemName]) {
        $countCell.text(`${itemCounts[itemName]}개`);
      } else {
        $countCell.text(""); // 0이면 비워두기
      }
    });
  }

  function updateTotalWeightFormula() {
    const $dropped = $(".droppable_bag .draggable_bag.already-dropped");
  
    const itemCounts = {};
    $dropped.each(function () {
      const $item = $(this);
      const $nameSpan = $item.find(".text_box span[lang='y']");
      const fullText = $nameSpan.text().trim();
      const name = fullText.split(" ")[0];
      if (!itemCounts[name]) itemCounts[name] = 0;
      itemCounts[name]++;
    });
  
    const formulas = [];
    let total = 0;
  
    for (const name in itemCounts) {
      const count = itemCounts[name];
      const item = itemDataMap[name];
      if (!item) continue;
  
      const formula = item.formula(count);
      const value = item.answer(count);
      formulas.push(formula);
      total += value;
    }
  
    const fullFormula = formulas.join("+");
  
    // ✅ 반영
    $(".page_2 .answer1 math-field:not(.textarea)").attr("data-answer-single", fullFormula);
    $(".page_2 .answer2 math-field:not(.textarea)").attr("data-answer-single", total);
    $(".page_2 .answer3 math-field:not(.textarea)").attr("data-answer-single", total);

    // page_4의 math-field 업데이트
    $(".page_4 .answer3 math-field:not(.textarea)").attr("data-answer-single", total);

    // 버튼 활성화 체크
    updateButtonState();
  }

  function updateButtonState() {
    const $activePage = $(".page.on");
    if (!$activePage.length) return;

    // page_1, 2, 3인 경우에만 드롭된 요소 체크
    if ($activePage.hasClass("page_1") || $activePage.hasClass("page_2") || $activePage.hasClass("page_3")) {
      const hasDroppedItems = $(".droppable_bag .draggable_bag.already-dropped").length > 0;
      $(".btn_area button:not(.btnType)").toggleClass("active", hasDroppedItems);
    } else {
      // page_4 이상인 경우는 항상 버튼 활성화
      $(".btn_area button:not(.btnType)").addClass("active");
    }

    // 드롭된 요소가 없으면 모든 페이지에서 버튼 비활성화
    if ($(".droppable_bag .draggable_bag.already-dropped").length === 0) {
      $(".btn_area button:not(.btnType)").removeClass("active");
    }
  }

  // 초기 버튼 상태 설정
  updateButtonState();

  function resetPage1State() {
    // 현재 활성화된 페이지 찾기
    const $activePage = $(".page.on");
    if (!$activePage.length) {
      console.log("No active page found");
      return;
    }
    
    console.log("Active page:", $activePage.attr("class"));

    if ($activePage.hasClass("page_1") || $activePage.hasClass("page_2") || $activePage.hasClass("page_3")) {
      // 현재 페이지의 드롭된 아이템과 드롭 영역의 아이템 제거
      $(".droppable_bag .draggable_bag.already-dropped").remove();

      // 현재 페이지의 수식 초기화
      $activePage.find(".answer1 math-field:not(.textarea)").attr("data-answer-single", "");
      $activePage.find(".answer2 math-field:not(.textarea)").attr("data-answer-single", "");
      $activePage.find(".answer3 math-field:not(.textarea)").attr("data-answer-single", "");

      // page_4 관련 데이터도 초기화
      $(".page_4 .table_box .num span").text("");
    } 

    // 버튼 상태 업데이트
    updateButtonState();
  }
  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function() {
      resetPage1State();

      return false
  };

});