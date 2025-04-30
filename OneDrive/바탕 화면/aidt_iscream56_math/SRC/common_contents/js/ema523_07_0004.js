
runAfterAppReady(function () {

  function updateDropValueAndCorrection($drop, value) {
    console.log("✅ updateDropValueAndCorrection 실행됨");
    console.log("📌 $drop:", $drop);
    console.log("📌 value:", value);
  
    if (!$drop || !$drop.length || value === undefined) {
      console.warn("❌ drop 또는 값이 잘못됨");
      return;
    }
  
    $drop.attr("data-value", value);
  
    const answer = $drop.attr("data-answer-single");
  
    let isCorrect = false;
    if (answer === "empty_answer") {
      isCorrect = true;
    } else {
      const numAnswer = parseFloat(answer);
      const numValue = parseFloat(value);
      isCorrect = Math.abs(numAnswer - numValue) <= 1;
    }
  
    $drop.attr("data-correction", isCorrect ? "true" : "false");
    console.log("🎯 최종 data-correction:", $drop.attr("data-correction"));

    setTimeout(() => {
      $drop.attr("data-correction", isCorrect ? "true" : "false");
      console.log("🛡 forced data-correction reapply:", $drop.attr("data-correction"));
    }, 0); 
  }
  
  // ✅ 회전값을 추출하는 유틸리티 함수 선언
  function getRotationDegrees($img) {
    const transform = $img.css("transform");
    if (!transform || transform === "none") return 0;
  
    const values = transform.match(/matrix\(([^)]+)\)/);
    if (!values || values.length < 2) return 0;
  
    const [a, b] = values[1].split(',').map(parseFloat);
    const radians = Math.atan2(b, a);
    return Math.round((radians * (180 / Math.PI)) * 10) / 10;
  }  

  const $droppables = $(".drop_group .figure_triangle");
  const $draggables = $(".drag_group .drag_item");

  $droppables.css("position", "relative");

  // 초기 정답 상태 설정
  $droppables.each(function () {
    const $drop = $(this);
  
    $drop.find(".from-drop").remove();
    $drop.removeClass("ui-state-hover hint selected disabled");
    $drop.parent().removeClass("on");
  
    $drop.attr("data-value", "");
    $drop.removeAttr("data-correction"); // ✅ 초기화 시 data-correction 제거
  });
  
  // 드래그 설정 (모바일 대응 포함)
  $draggables.draggable({
    helper: "clone",
    cursor: "grabbing",
    zIndex: 1000,
    containment: "document",
    start: function () {
      $(".btn_area button").addClass("active");
    }
  });

  // ✅ 드래그 아이템에 회전 버튼 이벤트 바인딩
  bindRotation($draggables);

  $droppables.droppable({
    tolerance: "pointer",
    drop: function (event, ui) {
      const $drop = $(this);
      const $original = $(ui.draggable);
      const $helper = $(ui.helper);
      const $img = $helper.find("img");
    
      const dropW = $drop.outerWidth();
      const dropH = $drop.outerHeight();
      const cloneW = $helper.outerWidth();
      const cloneH = $helper.outerHeight();
      const offsetLeft = (dropW - cloneW) / 2;
      const offsetTop = (dropH - cloneH) / 2;
    
      // 회전값 계산
      let rotationValue = getRotationDegrees($original.find("img"));
      if (Math.abs(rotationValue - 180) <= 1) rotationValue = 180;
      rotationValue = rotationValue.toFixed(1);
    
      // ✅ 원본 초기화
      $original
        .addClass("used disabled")
        .attr({
          "data-rotation": "0",
          "data-value": "0"
        })
        .css({ opacity: 1 });
    
      $original.find("img").css({
        transform: "rotate(0deg)",
        transformOrigin: "center center"
      });
    
      // ✅ 기존 도형 제거
      $drop.find(".from-drop").remove();
    
      // ✅ 복제 도형 생성
      const $clone = $helper.clone(true, true)
        .addClass("from-drop")
        .removeClass("used disabled")
        .css({
          width: `${cloneW}px`,
          height: `${cloneH}px`,
          position: "absolute",
          left: offsetLeft,
          top: offsetTop,
          pointerEvents: "auto",
          userSelect: "none",
          opacity: 1
        })
        .attr({
          "data-rotation": rotationValue,
          "data-value": rotationValue
        });
    
      $clone.find("img").css({
        transform: `rotate(${rotationValue}deg)`,
        transformOrigin: "center center"
      });
    
      // ✅ 드롭에 회전값 반영
      updateDropValueAndCorrection($drop, rotationValue);
    
      $drop.append($clone);
      makeDraggable($clone);
      bindRotation($clone);
      $drop.parent().addClass("on");

      // ✅ ui-state-hover 제거 및 텍스트 숨김
      $drop.removeClass("ui-state-hover");
      const dropIndex = $(".drop_group .drop_item").index($drop);
      $(".drop_group .text_box span").eq(dropIndex).hide();

      // ✅ 드롭한 drop_item 안의 img_bg 표시
      $drop.children(".img_bg").css("display", "block");

      //$drop.children(".from-drop").remove();

      // ✅ img_bg가 없으면 정확한 구조로 추가
      if ($drop.children(".img_bg").length === 0) {
        $drop.prepend(`
          <div class="img_bg" style="display: block;">
            <span class="img1">
              <img src="../../common_contents/img/EMA523_07_SU/0004_bg.svg" alt="이미지">
            </span>
          </div>
        `);
      } else {
        $drop.children(".img_bg").css("display", "block");
      }


      audioManager.playSound("drop");

      // ✅ 한 프레임 뒤에 정확하게 drop 상태 검사
      setTimeout(() => {
        const $allDropItems = $(".drop_group .drop_item");
        let filledCount = 0;
      
        $allDropItems.each(function () {
          if ($(this).find(".from-drop").length > 0) {
            filledCount++;
          }
        });
      
        console.log("✅ 드롭된 개수:", filledCount); // 확인용
      
        if (filledCount === 2) {
          $(".drag_group .drag_item").css("opacity", 0.8);
        }
      }, 50); // ← 50ms로 약간의 지연을 주어 DOM 반영 보장
      
    }
    
  });
  
  

  // ✅ 회전 바인딩 함수
// 자유 회전 + 정확한 90/180/270도 스냅 기능 완성본

function bindRotation($elem) {
  $elem.find(".btn_rotation").off("mousedown touchstart").on("mousedown touchstart", function (evt) {
    evt.preventDefault();
    evt.stopPropagation();

    const $item = $(this).closest(".drag_item");

    if ($item.hasClass("rotating")) return;
    $item.addClass("rotating");

    const calcAngleDegrees = (x, y) => (Math.atan2(y, x) * 180) / Math.PI;
    const rect = $item.get(0).getBoundingClientRect();
    const cX = rect.left + rect.width / 2;
    const cY = rect.top + rect.height / 2;

    const clientX = evt.type.startsWith("touch") ? evt.originalEvent.touches[0].clientX : evt.clientX;
    const clientY = evt.type.startsWith("touch") ? evt.originalEvent.touches[0].clientY : evt.clientY;

    const startAngle = calcAngleDegrees(clientX - cX, clientY - cY);
    const baseRotation = parseFloat($item.attr("data-rotation")) || 0;

    const moveHandler = function (e) {
      const moveX = e.type.startsWith("touch") ? e.originalEvent.touches[0].clientX : e.clientX;
      const moveY = e.type.startsWith("touch") ? e.originalEvent.touches[0].clientY : e.clientY;

      const moveAngle = calcAngleDegrees(moveX - cX, moveY - cY);
      let degree = baseRotation + (moveAngle - startAngle);
      degree = (degree + 360) % 360;

      // ✅ 스냅 기능 추가
      const snapAngles = [0, 90, 180, 270, 360];
      const snapThreshold = 5; // 5도 이내로 근접하면 스냅

      for (let snapAngle of snapAngles) {
        if (Math.abs(degree - snapAngle) <= snapThreshold) {
          degree = snapAngle;
          break;
        }
      }

      $item.css({
        transform: `rotate(${degree}deg)`,
        transformOrigin: "center center"
      });
      $item.attr("data-rotation", degree.toFixed(1));
      $item.attr("data-value", degree.toFixed(1));

      const $drop = $item.closest(".drop_item.figure_triangle");
      if ($drop.length) {
        updateDropValueAndCorrection($drop, degree.toFixed(1));
      }
    };

    const endHandler = function (e) {
      e.preventDefault();
      e.stopPropagation();
      $item.removeClass("rotating");

      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("mouseup", endHandler);
      document.removeEventListener("touchend", endHandler);
    };

    document.addEventListener("mousemove", moveHandler, { passive: false });
    document.addEventListener("touchmove", moveHandler, { passive: false });
    document.addEventListener("mouseup", endHandler);
    document.addEventListener("touchend", endHandler);
  });
}

  
  

  // ✅ 복제 도형 드래그 가능하게
  function makeDraggable($elem) {
    $elem.draggable({
      helper: "original",
      cursor: "grabbing",
      zIndex: 1000,
      containment: "document",
      stop: function (event, ui) {
        const offset = $(this).offset();
        const $dragGroup = $(".drag_group");
        const groupOffset = $dragGroup.offset();
        const groupWidth = $dragGroup.outerWidth();
        const groupHeight = $dragGroup.outerHeight();

        if (
          offset.left > groupOffset.left &&
          offset.left < groupOffset.left + groupWidth &&
          offset.top > groupOffset.top &&
          offset.top < groupOffset.top + groupHeight
        ) {
          const originalIndex = $(this).index();
          $(this).remove();
          $draggables.eq(originalIndex).removeClass("used disabled").css("opacity", 1);
        }
      }
    });
  }

  // 리셋
  $(".btnReset").on("click", function () {
    checkCount = 0; // 오답 횟수 초기화
  
    // ✅ 버튼 상태 초기화
    $(".btn_area button").removeClass("active");
  
    const currentPageId = $("#app_wrap").attr("data-current-page");
    const $currentPage = $(`.page.${currentPageId}`);
    if (!$currentPage.length) return;
  
    // 현재 페이지 내 도형만 리셋
    const $droppables = $currentPage.find(".drop_group .figure_triangle");
    const $draggables = $currentPage.find(".drag_group .drag_item");
  
    $droppables.each(function () {
      const $drop = $(this);
    
      // ✅ 기존 드롭된 복제 아이템 삭제
      $drop.children(".from-drop").remove();
    
      // ✅ img_bg가 없으면 정확한 구조로 다시 추가
      if ($drop.children(".img_bg").length === 0) {
        $drop.prepend(`
          <div class="img_bg" style="display: none;">
            <span class="img1">
              <img src="../../common_contents/img/EMA523_07_SU/0004_bg.svg" alt="이미지">
            </span>
          </div>
        `);
      } else {
        $drop.children(".img_bg").css("display", "none");
      }
    
      $drop.removeClass("ui-state-hover hint selected disabled");
      $drop.parent().removeClass("on");
      $drop.attr("data-value", "");
      $drop.removeAttr("data-correction");
    
      const dropIndex = $(".drop_group .drop_item").index($drop);
      $(".drop_group .text_box span").eq(dropIndex).css("display", "flex");
    });    
        
    $draggables.each(function () {
      const $item = $(this);
      $item.removeClass("used disabled").css({ opacity: 1 });
      $item.attr({
        "data-rotation": "0",
        "data-value": "0"
      });
    
      // ✅ drag_item 자체 회전도 0도 초기화
      $item.css({
        transform: "rotate(0deg)",
        transformOrigin: "center center"
      });
    
      // ✅ img 안쪽도 초기화 (필요 없는 경우 생략 가능하지만 안전하게)
      $item.find("img").css({
        transform: "rotate(0deg)",
        transformOrigin: "center center"
      });
    });
    
    window.forceWatchEvaluation(); // 버튼 활성화 상태 재평가
  });
  

  // 오답 횟수 커스텀 반응
  window.onCustomIncorrect = function (count) {
    $(".drop_group .figure_triangle").each(function () {
      const $drop = $(this);
      const answer = $drop.attr("data-answer-single");
      const value = $drop.attr("data-value");
      const isCorrect = $drop.attr("data-correction") === "true";
  
      if (answer === value && isCorrect) {
        $drop.addClass("selected");
      } else {
        $drop.removeClass("selected");
      }
  
      // ✅ 두 번째 확인 클릭 && hint 클래스가 있는 경우만 처리
      if (count === 2 && $drop.hasClass("hint")) {
        const $dragItem = $drop.find(".drag_item");
  
        if ($dragItem.length && answer !== "") {
          const targetAngle = parseFloat(answer) || 0;
  
          $dragItem.attr("data-rotation", targetAngle.toFixed(1));
          $dragItem.find("img").css({
            transform: `rotate(${targetAngle}deg)`,
            transformOrigin: "center center"
          });
  
          // ✅ data-value도 answer로 업데이트
          $drop.attr("data-value", targetAngle.toFixed(1));
  
          // ✅ 정답 재확인
          const isNowCorrect = Math.abs(parseFloat(answer) - targetAngle) <= 1;
          $drop.attr("data-correction", isNowCorrect ? "true" : "false");
        }
      }
    });
  
    console.log("check count:", count);
  };
  
  
  defineButtonClassRules([
    {
      selector: ".drop_group .figure_triangle", //변경될 값을 감지할 태그 설정
      //아래 중 하나 활용
      //key: "check_target", // 공통 버튼과 똑같이 결정되는 활성화 여부 결정 키
      //key: "custom_reset_btn_active", // 리셋버튼 활성화 여부 결정 키
      //key: "custom_sample_btn_active", // 예시버튼 활성화 여부 결정 키
      key: "custom_check_btn_active", // 확인버튼 활성화 여부 결정 키
      //key: "custom_submit_btn_active", // 제출버튼 활성화 여부 결정 키
      test: (el) => {
        //활성화 여부 결정 로직 true 반환하면 버튼 활성화, false 반환하면 비활성화
        //el은 타겟을 의미하는 요소
        //ex) 값이 비어있거나 null인 경우로 조건 설정한 경우 예시
        const isCorrection = $(el).attr("data-correction") !== undefined;
        return isCorrection;
      }
    },
  ]);
  // 버튼 상태 변경 후 강제 평가 문 실행

});