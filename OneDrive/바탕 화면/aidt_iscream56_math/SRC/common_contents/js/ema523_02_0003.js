runAfterAppReady(() => {
  const $dragItems = $(".drag_item");
  const $dropItems = $(".drop_item");
  const $iconHand = $(".icon_hand");
  const $btnReset = $(".btnReset");
  const $canvas = $("#pathCanvas")[0];
  const ctx = $canvas.getContext("2d");

  function resizeCanvas() {
    const wrap = $(".dragndrop_fraction_wrap");
    $canvas.width = wrap.width();
    $canvas.height = wrap.height();
  }
  resizeCanvas();
  $(window).on("resize", resizeCanvas);

  function positionHandCenter(target) {
    const containerOffset = $(".dragndrop_fraction_wrap").offset();
    const targetOffset = $(target).offset();

    const centerX = targetOffset.left - containerOffset.left + $(target).outerWidth() / 2;
    const centerY = targetOffset.top - containerOffset.top + $(target).outerHeight() / 2;

    $iconHand.css({
      left: centerX - 25 + "px",
      top: centerY + 0 + "px",
      transform: "translate(-50%, -50%)"
    });
  }

  function blinkHand(times, callback) {
    $iconHand.show();
    $iconHand.removeClass("visible");
    let blinkCount = 0;
    const interval = setInterval(() => {
      $iconHand.toggleClass("visible");
      blinkCount++;
      if (blinkCount >= times * 2) {
        clearInterval(interval);
        $iconHand.addClass("visible");
        if (callback) callback();
      }
    }, 300);
  }

  function moveHand(startEl, endEl, duration = 2000, callback) {
    if (!startEl || !endEl || $(startEl).length === 0 || $(endEl).length === 0) return;

    const startOffset = $(startEl).offset();
    const endOffset = $(endEl).offset();
    const containerOffset = $(".dragndrop_fraction_wrap").offset();

    if (!startOffset || !endOffset || !containerOffset) return;

    const startCenterX = startOffset.left - containerOffset.left + $(startEl).outerWidth() / 2;
    const startCenterY = startOffset.top - containerOffset.top + $(startEl).outerHeight() / 2;
    const endCenterX = endOffset.left - containerOffset.left + $(endEl).outerWidth() / 2;
    const endCenterY = endOffset.top - containerOffset.top + $(endEl).outerHeight() / 2;
  
    const deltaX = endCenterX - startCenterX;
    const deltaY = endCenterY - startCenterY;
    const startTime = performance.now();
  
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
  
    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
  
      const currentX = startCenterX + deltaX * progress;
      const currentY = startCenterY + deltaY * progress;
  
      ctx.clearRect(0, 0, $canvas.width, $canvas.height);
      ctx.beginPath();
      ctx.moveTo(startCenterX, startCenterY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
  
      $iconHand.css({
        left: currentX + "px",  // ✅ 더 가운데로 미세 조정
        top: currentY + "px",   // ✅ 위로 조금 더 올림
        transform: "translate(-50%, -50%)"
      });
  
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, $canvas.width, $canvas.height);
        
        // ✅ 도착 후 1초 후 손가락 숨김
        setTimeout(() => {
          $iconHand.hide();
          if (callback) callback();
        }, 500);
      }
    }
  
    requestAnimationFrame(animate);
  }

  function guidePaper() {
    const $start = $(".drag_item[data-pair='1']");
    const $end = $(".drop_item[data-pair='1']");
  
    if (!$start.length || !$end.length || !$start.is(":visible") || !$end.is(":visible")) {
      console.warn("❌ guidePaper: 도형이 숨겨져 있어 손가락 안내 생략");
      return;
    }
  
    positionHandCenter($start);
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    $iconHand.show();
  
    blinkHand(5, () => {
      moveHand($start, $end);
    });
  }
  
  

  function guideScissors() {
    const $scissors = $(".drag_item.scissors");
    const $dropTarget = $(".drop_item.scissors");
  
    // ✅ 손가락 정확한 중앙 위치 먼저 계산
    positionHandCenter($scissors);
  
    // ✅ X, Y 보정값 따로 적용 (직접 위치 덮어쓰지 않음)
    const containerOffset = $(".dragndrop_fraction_wrap").offset();
    const scissorsOffset = $scissors.offset();
    const centerX = scissorsOffset.left - containerOffset.left + $scissors.outerWidth() / 2;
    const centerY = scissorsOffset.top - containerOffset.top + $scissors.outerHeight() / 2;
  
    // ✅ 보정된 위치로 손가락 위치 재조정
    $iconHand.css({
      'left': centerX + 30 + 'px',  // X축 보정
      'top' : centerY + 30 + 'px',
      transform: "translate(-50%, -50%)"
    });
  
    $iconHand.show();
  
    blinkHand(5, () => {
      moveHand($scissors, $dropTarget);
    });
  }
  

  function spreadPiecesSeparated() {
    const $piece1 = $(".spread-piece1");
    const $piece2 = $(".spread-piece2");
  
    // ✅ 시작할 때는 포개어져 있게
    $piece1.css({
      transform: "scale(1) translate(0, 0)",
      opacity: 1
    });
    $piece2.css({
      transform: "scale(1) translate(0, 0)",
      opacity: 1
    });
  
    // ✅ 퍼지는 애니메이션 트리거
    setTimeout(() => {
      $piece1.css({
        "--dx": "-359px",
        "--dy": "0px"
      }).addClass("spread-piece");
  
      $piece2.css({
        "--dx": "130px",
        "--dy": "0px"
      }).addClass("spread-piece");
    }, 100); // 살짝 딜레이 주고 애니메이션
  } 
  
  function updateResetButtonState() {
    const currentPageId = $("#app_wrap").attr("data-current-page");
    if (!currentPageId) return;
  
    const isPage1 = currentPageId === "page_1";
  
    // ✅ page_1이 아니면 무조건 비활성화 (근데 깜빡이지 않게 현재 상태 비교)
    if (!isPage1) {
      if (!$btnReset.prop("disabled")) {
        $btnReset.prop("disabled", true);
        $btnReset.removeClass("active");
      }
      return;
    }
  
    // ✅ page_1이면 현재 page_1의 드롭 상태 확인
    const $currentPage = $(`.page.${currentPageId}.on`);
    if ($currentPage.length === 0) return;
  
    const $wrap = $currentPage.find(".dragndrop_fraction_wrap");
    if ($wrap.length === 0) return;
  
    const hasDrop = $wrap.find(".drop_item").toArray().some(item => $(item).children().length > 0);
  
    if (hasDrop) {
      if ($btnReset.prop("disabled")) {
        $btnReset.prop("disabled", false);
        $btnReset.addClass("active");
      }
    } else {
      if (!$btnReset.prop("disabled")) {
        $btnReset.prop("disabled", true);
        $btnReset.removeClass("active");
      }
    }
  }
  
  $dragItems.draggable({
    helper: "clone",
    revert: "invalid",
    cursor: "grabbing",
    start: function (event, ui) {
      if ($(this).data("pair") == 1) {
        $(ui.helper).find("path").css({
          animation: "none",
          strokeDashoffset: 0
        });
      }
    }
  });

  $dropItems.droppable({
    accept: ".drag_item",
    drop: function (event, ui) {
      const $dropZone = $(this);
      const dropPair = $dropZone.data("pair");
      const dragPair = ui.draggable.data("pair");

      if (dropPair != dragPair) return;

      const $clone = ui.helper.clone();
      $clone.removeClass("ui-draggable-dragging").css({
        position: "relative",
        left: 0,
        top: 0
      });

      $clone.find("path").css({
        animation: "none",
        strokeDashoffset: 0
      });

      $dropZone.empty().append($clone);
      $dropZone.data("dropped", true);

      const currentPageId = $("#app_wrap").attr("data-current-page");
      if (!currentPageId) return;

      if (currentPageId === "page_1") {
        const $currentPage = $(`.page.on.${currentPageId}`);
        if ($currentPage.find(".drop_item").children().length > 0) {
          $btnReset.addClass("active").prop("disabled", false);
        }
      }

      updateResetButtonState();

      if (dragPair == 1) {
        // ✅ 종이 드롭 성공 시 가위 등장
        $(".drag_item.scissors").fadeIn().css({ opacity: 1, pointerEvents: "" });
      
        // 종이 도형은 비활성화
        $(".drag_group .drag_item[data-pair='1']").css({
          opacity: 0.7,
          pointerEvents: "none"
        });
      
        setTimeout(() => {
          guideScissors();
        }, 300);
      }      

      if (dragPair == 2) {
        ui.draggable.hide();
        const $dropGroup = $dropZone.closest(".drop_group");
      
        const $paperDropItem = $dropGroup.find('.drop_item[data-pair="1"]');
        const $gifBox = $dropGroup.find('.img_motion');
        const $gif = $gifBox.find("img");
      
        $dropGroup.find('.drop_item.scissors').hide();
        $paperDropItem.hide();
      
        // ✅ GIF 이미지 강제 재생
        if ($gif.length) {
          const src = $gif.attr("src");
          $gif.attr("src", src); // 재할당하여 리플레이
          $gifBox.fadeIn();      // gif 박스 show
        }
      
        setTimeout(() => {
          $(".drag_group, .icon_arrow:not(.spread-piece_group .icon_arrow), .drop_group").hide();
          $(".spread-piece_group").css("display", "flex");
          spreadPiecesSeparated(); // ✅ 정상 작동
        }, 7500);
      }
      

      window.forceWatchEvaluation();
    }
    
  });

  $btnReset.on("click", function () {
    const currentPageId = $("#app_wrap").attr("data-current-page");
    if (currentPageId !== "page_1") return;
  
    const $currentPage = $(`.page.${currentPageId}.on`);
    if ($currentPage.length === 0) return;
  
    const $wrap = $currentPage.find(".dragndrop_fraction_wrap");
    if ($wrap.length === 0) return;
  
    // ✅ 상태 초기화
    $wrap.find(".drop_item").empty().show();
    $wrap.find(".drag_item").show().css({ opacity: 1, pointerEvents: "" });
    $wrap.find(".img_motion").hide();
    $wrap.find(".drag_group, .icon_arrow:not(.spread-piece_group .icon_arrow), .drop_group").show();
    $wrap.find(".spread-piece_group").hide();
    $wrap.find(".spread-piece_group svg").removeClass("spread-piece");
  
    // ✅ 가위 도형도 복원
    $wrap.find(".drag_item.scissors").hide().css({ opacity: 1, pointerEvents: "" });
    $wrap.find(".drop_item.scissors").show();
  
    // ✅ 캔버스 및 손가락 숨기기
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    $iconHand.hide();
  
    updateResetButtonState();
    window.forceWatchEvaluation();
  
    // ✅ guidePaper → guideScissors 순차 실행 보장
    setTimeout(() => {
      const $paper = $(".drag_item[data-pair='1']");
      const $paperDrop = $(".drop_item[data-pair='1']");
      const $scissors = $(".drag_item.scissors");
      const $scissorsDrop = $(".drop_item.scissors");
    
      // ✅ 종이 드래그 요소와 드롭 대상이 모두 존재하고, 보여야 함
      if (
        $paper.length && $paperDrop.length &&
        $paper.is(":visible") && $paperDrop.is(":visible")
      ) {
        guidePaper(); // 내부에서 blink → moveHand → guideScissors 순으로 작동
      } else {
        console.warn("❌ guidePaper 대상 요소가 보이지 않음 또는 존재하지 않음");
      }
    }, 800); // 렌더 완료 후 약간의 딜레이
    
  });
  
  
  

  $(document).on("click", ".paging_controller button", function () {
    // ✅ 일단 클릭할 때 리셋버튼 건드리지 않는다
    
    setTimeout(() => {
      // ✅ 페이지 이동이 완료된 후, currentPageId 다시 읽는다
      const currentPageId = $("#app_wrap").attr("data-current-page");
  
      if (currentPageId !== "page_1") {
        // ✅ 1페이지가 아니면 리셋버튼 비활성화
        if ($btnReset.hasClass("active")) {
          $btnReset.removeClass("active");
        }
        if (!$btnReset.prop("disabled")) {
          $btnReset.prop("disabled", true);
        }
      } else {
        // ✅ 1페이지면 정상 상태 재설정
        updateResetButtonState();
      }
    }, 100); // setTimeout으로 페이지 on 붙은 후 실행
  });
  
  defineButtonClassRules([
    {
      selector: ".dragndrop_fraction_wrap .drop_group .drop_item",
      key: "custom_check_btn_active",
      test: (el) => {
        const isCorrection = $(el).attr("data-correction") !== undefined;
        return isCorrection;
      }
    },
  ]);

  setTimeout(() => {
    guidePaper();
  }, 500);
});
