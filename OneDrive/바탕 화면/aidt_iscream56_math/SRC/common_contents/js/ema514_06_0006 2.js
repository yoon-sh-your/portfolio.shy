runAfterAppReady(function () {
  const $droppables = $(".card.droppable");
  const $draggables = $(".card.draggable");

  // 드래그앤드롭 초기화
  $draggables.draggable({
    helper: "clone",
    revert: "invalid",
    revertDuration: 0,
    start: function (event, ui) {
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
      audioManager.playSound("drag");
    },
    drag: function (event, ui) {
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
    }
  });

  $droppables.droppable({
    accept: ".card.draggable",
    tolerance: "intersect",
    over: function () {
      $(this).addClass("ui-state-hover ui-droppable-active");
    },
    out: function () {
      $(this).removeClass("ui-state-hover ui-droppable-active");
    },
    drop: function (event, ui) {
      $(this).removeClass("ui-state-hover ui-droppable-active");

      const $drag = $(ui.draggable);
      const $drop = $(this);
      const $dropGroup = $drop.closest(".drag_group");

      // 이미 사용된 카드인지 확인
      if ($drag.hasClass("used")) return;

      // 드롭 영역에 이미 카드가 있는지 확인
      if ($drop.find("img").length > 0) return;

      const $img = $drag.find("img").clone();
      $drop.empty().append($img).attr("data-value", "1");
      $dropGroup.addClass("on");
      $drag.addClass("used");
      audioManager.playSound("drop");
    }
  });

  // 5. 샘플 버튼 클릭 시 정답 이미지 자동 배치
  $(".btnCheck").on("click", function () {
    const imageBasePath = "../../common_contents/img/EMA514_06_SU/";

    $droppables.each(function () {
      const $drop = $(this);
      const answer = $drop.closest("[data-answer-single]").attr("data-answer-single"); 

      if (!answer) return;

      const imgSrc = `${imageBasePath}0006_obj${answer}.png`;

      const $img = $("<img>", {
        src: imgSrc,
      });

      $drop.empty().append($img).attr("data-value", "1");
      $drop.parent().addClass("on");

      const $correctDrag = $draggables.filter(`.obj${answer}`);
      $correctDrag.addClass("used");
    });

    $(".droppable").removeClass("ui-state-hover");
  });
  
  // 리셋 버튼 클릭 시 카드 초기화
  $(".btnReset").on("click", function() {
    // 드롭 영역 초기화
    $droppables.empty();
    $droppables.removeAttr("data-value");
    
    // 드래그 요소 초기화
    $draggables.removeClass("used");
    
    // 드롭 그룹 초기화
    $(".drag_group").removeClass("on");
    
    // 호버 상태 초기화
    $(".ui-state-hover").removeClass("ui-state-hover");
    $(".ui-droppable-active").removeClass("ui-droppable-active");
    
    // math-field 초기화
    $(".input_wrap math-field").each(function() {
      // 방법 1: val() 메서드 사용
      if (typeof $(this).val === "function") {
        $(this).val("");
      }
      
      // 방법 2: value 속성 직접 접근
      if (this.value !== undefined) {
        this.value = "";
      }
      
      // 방법 3: setValue 메서드 사용 (MathLive 라이브러리)
      if (typeof this.setValue === "function") {
        this.setValue("");
      }
    });
  });
});


