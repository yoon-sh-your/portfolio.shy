document.addEventListener('DOMContentLoaded', function() {
  
  document.querySelectorAll('.boolean_wrap').forEach(function(wrapper) {
      wrapper.querySelectorAll('button').forEach(function(button) {
          button.addEventListener('click', function() {
              let clickButton = this;

              wrapper.querySelectorAll('button').forEach(function(btn) {
                  if (btn.classList.contains('selected') && btn !== clickButton) {
                      btn.click();
                  }
              });
          });
      });
  });
});

function addResult () {
  let booleanWraps = document.querySelectorAll('.boolean_wrap');

  booleanWraps.forEach(function(booleanWrap) {
      booleanWrap.classList.add('result');
  });
}

function removeResult () {
  let booleanWraps = document.querySelectorAll('.boolean_wrap');

  booleanWraps.forEach(function(booleanWrap) {
      booleanWrap.classList.remove('result');
  });
}

// 정답일 때
function onCorrectCustom () {
  addResult();
}

// 리셋일 떄
function resetCustom () {
  removeResult();
}

// 첫번째 틀렸을 때
function onIncorrectCustom() {
  removeResult();
}

// 두번째 틀렸을 때
function onIncorrectTwiceCustom () {
  addResult();
}

// 빈칸일 때
function onEmptyCustom () {
  removeResult();
}


runAfterAppReady(function () {

  // 페이지 로드시 버튼 상태 초기화 (비활성화)
  //$(".btn_area button").removeClass("active");

  const $droppables = $(".drop_group .figure_triangle");
  const $draggables = $(".drag_group .drag_item");
  

  // 드래그 설정
  $draggables.draggable({
    helper: "clone",
    cursor: "grabbing",
    zIndex: 1000,
    containment: "document",
    start: function () { 
      const $drop = $(".drop_group .figure_triangle");
      const answer = $drop.attr("data-answer-single");
      const value = $drop.attr("data-value");

      // data-answer-single 값과 data-value 값을 비교하여 data-correction 설정
      const correction = (answer && answer === value) ? "true" : "false";  // 값이 같으면 true, 아니면 false
      $drop.data("correction", correction);  // data()로 데이터 속성 설정
      $drop.attr("data-correction", correction);  // DOM 속성에도 반영

      $(".btn_area button").addClass("active");
      
    }
  });

  $draggables.each(function () {
    bindRotation($(this));
  });
  

  // 드롭 설정
  $droppables.droppable({
  tolerance: "pointer",
  drop: function (event, ui) {
    const $drop = $(this);
    const $helper = $(ui.helper);
    const $original = $(ui.draggable);
  
    const dropW = $drop.outerWidth();
    const dropH = $drop.outerHeight();
    const cloneW = 232;
    const cloneH = 232;
  
    const offsetLeft = (dropW - cloneW) / 2;
    const offsetTop = (dropH - cloneH) / 2;
  
    // 기존 복제 도형 제거
    $drop.find(".from-drop").remove();
  
    let $clone;
  
    if (!$original.hasClass("from-drop")) {
      if ($original.hasClass("used")) return;
  
      $original.addClass("used disabled");
  
      $clone = $helper.clone(true, true)
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
          transformOrigin: "center center"
        })
        .attr({
          "data-rotation": $original.attr("data-rotation") || "0",
          "data-value": $original.attr("data-value")
        });

         // 드롭된 후 처리
        const rotation = parseFloat($original.attr("data-rotation")) || 0;

        // 원본 초기화
        $original.attr("data-rotation", "0");
        $original.find(".rotate_wrap").css({
          transform: "rotate(0deg)",
          transformOrigin: "center center"
        });

        // 복제본 회전값 유지
        $clone.attr("data-rotation", rotation);
        $clone.find(".rotate_wrap").css({
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center center"
        });

        $drop.append($clone);
        makeDraggable($clone);
        bindRotation($clone);
    } else {
      $clone = $original;
  
      $clone.css({
        left: offsetLeft,
        top: offsetTop
      });
  
      if (!$drop[0].contains($clone[0])) {
        $clone.detach().appendTo($drop);
      }
    }
  
    // ✅ 위치 기준으로 다시 정답 여부 판별
    const answer = $drop.attr("data-answer-single");
    const droppedValue = $clone.attr("data-value") || "";
  
    // data-answer-single 값과 data-value 값 비교하여 data-correction 설정
    if (answer && answer === droppedValue) {
      $drop.data("correction", "true");  // data()로 correction 값 업데이트
      $drop.attr("data-correction", "true");  // DOM 속성에도 반영
    } else {
      $drop.data("correction", "false");  // data()로 correction 값 업데이트
      $drop.attr("data-correction", "false");  // DOM 속성에도 반영
    }
  
    //$(".btn_area button").addClass("active");
    $drop.parent().addClass("on");
    audioManager.playSound("drop");
  }
  });

  function makeDraggable($elem) {
    $elem.draggable({
      helper: "original",
      cursor: "grabbing",
      zIndex: 1000,
      containment: "document",
  
      start: function () {
        if (isRotating) return false;
      },
  
      stop: function (event, ui) {
        const $dragItem = $(this);
        const offset = $dragItem.offset();
        const $dropGroup = $(".page.on .drop_group");
        const $dragGroup = $(".page.on .drag_group");
  
        const dropOffset = $dropGroup.offset();
        const dropWidth = $dropGroup.outerWidth();
        const dropHeight = $dropGroup.outerHeight();
  
        const insideDrop =
          offset.left > dropOffset.left &&
          offset.left < dropOffset.left + dropWidth &&
          offset.top > dropOffset.top &&
          offset.top < dropOffset.top + dropHeight;
  
        if (!insideDrop && $dragItem.hasClass("from-drop")) {
          const dataValue = $dragItem.attr("data-value");
  
          // ✅ 원본 찾고 used/disabled 해제
          const $original = $dragGroup.find(`.drag_item[data-value="${dataValue}"]`);
          $original.removeClass("used disabled");
  
          // ✅ 복제 도형 제거
          $dragItem.remove();
        }
  
        $(".btn_area button").addClass("active");
      }
    });
  }
  
  
  //let isRotating = false; // 전역에 위치

  function bindRotation($elem) {
    $elem.find(".btn_rotation").on("mousedown.rotate touchstart.rotate", function (e) {
      e.stopPropagation();
      const $dragItem = $(this).closest(".drag_item");
      const $rotateWrap = $dragItem.find(".rotate_wrap");
  
      const rect = $rotateWrap[0].getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
  
      const pageX = e.pageX || e.originalEvent.touches?.[0]?.pageX;
      const pageY = e.pageY || e.originalEvent.touches?.[0]?.pageY;
  
      const startAngle = Math.atan2(pageY - center.y, pageX - center.x) * (180 / Math.PI);
      const initialRotation = parseFloat($dragItem.attr("data-rotation") || "0");
      isRotating = true;
  
      $(document).on("mousemove.rotate touchmove.rotate", function (e) {
        if (!isRotating) return;
  
        const moveX = e.pageX || e.originalEvent.touches?.[0]?.pageX;
        const moveY = e.pageY || e.originalEvent.touches?.[0]?.pageY;
        const currentAngle = Math.atan2(moveY - center.y, moveX - center.x) * (180 / Math.PI);
        const rotation = (initialRotation + currentAngle - startAngle + 360) % 360;
  
        $dragItem.attr("data-rotation", rotation);
  
        $rotateWrap.css({
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center center"
        });

          // 로그 확인
          console.log("▶ rotateWrap 회전 적용:", rotation);
          console.log("▶ btn_rotation 반대 회전 적용:", -rotation);

          const $button = $rotateWrap.find(".btn_rotation");
          $button.css({
            transform: `rotate(${-rotation}deg)`
          });
      });
  
      $(document).on("mouseup.rotate touchend.rotate", function () {
        isRotating = false;
        $(document).off(".rotate");
      });
    });
  }
  
  function getCurrentPageDropItems() {
    return $(".page.on .drop_group .figure_triangle");
  }
  
  // 오답 횟수 커스텀 반응
  window.onCustomIncorrect = function (count) {
    if (count !== 2) return;
  
    const $droppables = getCurrentPageDropItems();
  
    $droppables.each(function () {
      const $drop = $(this);
  
      if ($drop.hasClass("hint")) {
        const originalValue = $drop.attr("data-answer-single");
  
        const $origin = $(".page.on .drag_group .drag_item").filter(function () {
          return $(this).attr("data-value") === originalValue;
        }).first();
  
        if ($origin.length) {
          const $clone = $origin.clone(true, true)
            .addClass("from-drop")
            .removeClass("used hint")
            .css({
              width: "232px",
              height: "232px",
              position: "absolute",
              left: ($drop.outerWidth() - 232) / 2,
              top: ($drop.outerHeight() - 232) / 2,
              pointerEvents: "auto",
              userSelect: "none",
              transform: "rotate(180deg)",
              transformOrigin: "center center"
            })
            .attr({
              "data-rotation": "180",
              "data-value": originalValue
            });
  
          $clone.find("svg.img_svg path").attr({
            fill: "#EEF9FF",
            stroke: "#3B71FE",
            "stroke-width": "4px"
          });
  
          $drop.find(".from-drop").remove();
          $drop.append($clone);
        }
      }
    });
  };
  
  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function () {
    const $droppables = getCurrentPageDropItems(); // 현재 페이지 대상만 선택
  
    $droppables.each(function () {
      const $drop = $(this);
      const answer = $drop.attr("data-answer-single") || "";
  
      $drop.find(".from-drop").remove(); // 기존 드롭 도형 제거
      $drop.removeClass("ui-state-hover hint correct disabled");
      $drop.parent().removeClass("on");
  
      $drop.attr("data-value", "1").data("value", "1");
  
      // 회전 초기화
      $drop.find(".drag_item").attr("data-rotation", "0").css({
        transform: "rotate(0deg)",
        transformOrigin: "center center"
      });
  
      $drop.removeAttr("data-correction");
    });

    $(".page.on .drag_group .drag_item").each(function () {
      $(this).attr("data-rotation", "0");
      $(this).find(".rotate_wrap").css({
        transform: "rotate(0deg)",
        transformOrigin: "center center"
      });
    });
  
    // 현재 페이지의 drag_item만 초기화
    $(".page.on .drag_group .drag_item").removeClass("used disabled");
  
    // 전체 도형 대상 중에서도 현재 페이지 것만 correction 제거
    $(".page.on .figure_triangle").removeAttr("data-correction");
  
    window.forceWatchEvaluation();
  };
  
  defineButtonClassRules([
    {
      selector: ".dragndrop_fraction_wrap .figure_triangle", //변경될 값을 감지할 태그 설정
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
});


