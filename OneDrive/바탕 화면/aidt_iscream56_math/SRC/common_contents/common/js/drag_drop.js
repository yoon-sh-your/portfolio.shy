/** 알아보기 문제용 */
function initializeNotiDragDrop() {
  const draggables = $(".letKnow .draggable");
  const droppables = $(".letKnow .droppable");
  let selectedDraggable = null; // 선택된 드래그 아이템 추적

  droppables.each(function () {
    createScratchMask(this);
  });

  draggables.draggable({
    start: function (event, ui) {
      // 드래그 시작 시 선택 해제
      if (selectedDraggable) {
        selectedDraggable.removeClass("selected");
        selectedDraggable = null;
      }
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
      audioManager.playSound("drag");
    },
    drag: function (event, ui) {
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
    },
    revert: function () {
      return true;
    },
    revertDuration: 0
  });

  droppables.droppable({
    accept: ".letKnow .draggable",
    tolerance: "fit",
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
      handleNotiDrop($drag, $drop); // 드롭 로직 함수화
    }
  });

  // 클릭-투-클릭 기능 추가
  draggables.off('click').on("click", function (e) { // 이전 핸들러 제거 후 등록
    e.stopPropagation();
    const $this = $(this);

    if (selectedDraggable && selectedDraggable[0] === this) {
      selectedDraggable.removeClass("selected");
      selectedDraggable = null;
    } else {
      if (selectedDraggable) {
        selectedDraggable.removeClass("selected");
      }
      selectedDraggable = $this;
      selectedDraggable.addClass("selected");
      audioManager.playSound("click");
    }
  });

  droppables.off('click').on("click", function (e) { // 이전 핸들러 제거 후 등록
    e.stopPropagation();
    const $drop = $(this);

    if (selectedDraggable) {
      handleNotiDrop(selectedDraggable, $drop);
      // 드롭 후 선택 해제 (성공 여부 관계없이)
      selectedDraggable.removeClass("selected");
      selectedDraggable = null;
    }
  });

  // 외부 클릭 시 선택 해제
  $(document).off("click.notiDragDrop"); // 이전 핸들러 제거
  $(document).on("click.notiDragDrop", function(e) { // 네임스페이스 추가
    // 드래그 요소나 드롭 요소가 아닌 영역 클릭 시
    if (selectedDraggable && !$(e.target).closest('.letKnow .draggable').length && !$(e.target).closest('.letKnow .droppable').length) {
      selectedDraggable.removeClass("selected");
      selectedDraggable = null;
    }
  });

  // 드롭 로직 함수화
  function handleNotiDrop($drag, $drop) {
    const dragPair = $drag.data("pair");
    const dropPair = $drop.data("pair");

    if (dragPair === dropPair) {
      $drop.parent().toggleClass("on");
      audioManager.playSound("drop");
    } else {
      audioManager.playSound("wrong");
    }
  }
}

/** ✅ 마스크 적용 함수 */
function createScratchMask(droppable) {
  const dropWidth = droppable.offsetWidth;
  const dropHeight = droppable.offsetHeight;
  const maskId = `scratchMask_${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  const scratchSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  scratchSVG.setAttribute("width", dropWidth);
  scratchSVG.setAttribute("height", dropHeight);
  scratchSVG.innerHTML = `
      <mask id="${maskId}">
        <rect width="100%" height="100%" fill="white" />
        <polyline class="scratch_path" points="833.29 42.74 785.92 60.28 808.73 -5.8 674.22 105.89 705.8 18.18 585.92 114.67 626.27 -13.99 463.99 119.93 499.37 -11.65 428.61 67.3 428.61 28.12 370.71 78.99" />
      </mask>
      <rect width="100%" height="100%" mask="url(#${maskId})" />
    `;

  droppable.prepend(scratchSVG);
}

// 실행
initializeNotiDragDrop();

/**
 * 단일 드래그 요소를 여러 그룹의 드롭 대상에 드롭할 수 있는 기능
 * 그룹당 총 드롭 횟수는 6회로 제한되고, 그룹의 드롭 현황은 data-group-value에 저장됨
 */
let isDropHandled = false;

function initializeSingleDragMultiDrop() {
  const $draggable = $(".drag_share .single_draggable");
  let isSelected = false; // 클릭 선택 상태 추적
  let currentHoverElement = null; // 기존 hover 로직 유지

  // --- 하이라이트 업데이트 함수 (클릭 시 사용) ---
  function updateSingleDropHighlights(apply) {
    $(".drag_group[data-group-limit]").each(function () {
        const $group = $(this);
        const limit = parseInt($group.data("group-limit"), 10) || 6;
        const $droppablesInGroup = $group.find(".droppable");

        if (apply) {
             const total = $droppablesInGroup.toArray().reduce((sum, el) => {
                 return sum + (parseInt(el.dataset.value) || 0);
             }, 0);

            $droppablesInGroup.each(function() {
                if (total < limit) {
                    $(this).addClass("ui-state-hover ui-droppable-active");
                } else {
                    $(this).removeClass("ui-state-hover ui-droppable-active");
                }
            });
        } else {
             $droppablesInGroup.removeClass("ui-state-hover ui-droppable-active");
        }
    });
     // 드래그 중 hover 관리를 위한 currentHoverElement는 이 함수에서 직접 제어하지 않음
  }

  $(".drag_group[data-group-limit]").each(function () {
    const $group = $(this);
    const limit = parseInt($group.data("group-limit"), 10) || 6;
    const $droppables = $group.find(".droppable");

    $droppables.droppable({
      accept: ".single_draggable",
      tolerance: "fit",
      over: function (event, ui) {
        // 드래그 중 hover 로직 (기존 유지, 클릭 하이라이트와 별개로 동작)
        const total = $droppables.toArray().reduce((sum, el) => {
            return sum + (parseInt(el.dataset.value) || 0);
        }, 0);
        if (currentHoverElement && currentHoverElement !== this) {
          $(currentHoverElement).removeClass("ui-state-hover ui-droppable-active");
        }
        if (total < limit) {
          $(this).addClass("ui-state-hover ui-droppable-active");
          currentHoverElement = this;
        } else {
          $(this).removeClass("ui-state-hover ui-droppable-active");
          currentHoverElement = null;
        }
      },
      out: function () {
        // 드래그 중 out 로직 (기존 유지)
        $(this).removeClass("ui-state-hover ui-droppable-active");
        if (currentHoverElement === this) {
          currentHoverElement = null;
        }
      },
      drop: function (event, ui) {
        // 드래그 드롭 시 hover 상태 및 유효성 체크
        const isValidDrop = $(this).hasClass("ui-state-hover"); // over에서 설정된 클래스 확인
        // 드롭 시에는 모든 hover 클래스 제거 (성공/실패 무관)
        $(this).removeClass("ui-state-hover ui-droppable-active");
        currentHoverElement = null;

        if (!isValidDrop) return; // 유효하지 않으면 드롭 무시

        handleSingleDrop($(this), $group, $droppables, limit);
      }
    });

    // 클릭-투-클릭: 드롭 영역 클릭
    $droppables.off('click').on("click", function(e) {
        e.stopPropagation();
        const $drop = $(this);
        if (isSelected) {
             handleSingleDrop($drop, $group, $droppables, limit);
             $draggable.removeClass("selected");
             isSelected = false;
             // 클릭 드롭 시도 후 모든 클릭 하이라이트 제거
             updateSingleDropHighlights(false);
        }
    });
  });

  $draggable.draggable({
      helper: function () {
         if (isSelected) {
             $draggable.removeClass("selected");
             isSelected = false;
             updateSingleDropHighlights(false); // 하이라이트 제거
         }
        const $helper = $(this).clone();
        $helper.css({
          opacity: 0.8,
          pointerEvents: "none"
        });
        return $helper;
      },
      revert: "invalid",
      revertDuration: 0,
      start: function (event, ui) {
        if (isSelected) {
             $draggable.removeClass("selected");
             isSelected = false;
             updateSingleDropHighlights(false); // 하이라이트 제거
         }
        ui.position.left /= globalScale;
        ui.position.top /= globalScale;
        currentHoverElement = null;
        audioManager.playSound("drag");
      },
      drag: function (event, ui) {
        ui.position.left /= globalScale;
        ui.position.top /= globalScale;
      },
      stop: function() {
          // 드래그 종료 시 hover 상태 및 클릭 하이라이트 모두 제거
          updateSingleDropHighlights(false);
          currentHoverElement = null; // 드래그 hover 상태 초기화
      }
    });

  // 클릭-투-클릭: 드래그 아이템 클릭
  $draggable.off('click').on("click", function(e) {
      e.stopPropagation();
      isSelected = !isSelected;
      $(this).toggleClass("selected", isSelected);
      // 클릭 선택 상태에 따라 하이라이트 업데이트
      updateSingleDropHighlights(isSelected);
      if (isSelected) {
           audioManager.playSound("click");
      }
  });

   // 외부 클릭 시 선택 해제
   $(document).off("click.singleDragDrop").on("click.singleDragDrop", function(e) {
       if (isSelected && !$(e.target).closest('.drag_share .single_draggable').length && !$(e.target).closest('.drag_group .droppable').length) {
           $draggable.removeClass("selected");
           isSelected = false;
           // 외부 클릭 시 하이라이트 제거
           updateSingleDropHighlights(false);
       }
   });

  // --- 드롭 로직 함수화 (클릭, 드래그 공통) ---
  function handleSingleDrop($drop, $group, $droppables, limit) {
      const total = $droppables.toArray().reduce((sum, el) => {
          return sum + (parseInt(el.dataset.value) || 0);
      }, 0);

      // 드롭 시점에도 limit 재확인
      if (total < limit) {
          const index = $droppables.index($drop);
          if (index < 0) return;

          const currentValue = parseInt($drop[0].dataset.value) || 0;
          $drop[0].dataset.value = currentValue + 1;

          const groupValues = $droppables.toArray().map(el => parseInt(el.dataset.value) || 0);
          $group.attr("data-group-value", JSON.stringify(groupValues));

          audioManager.playSound("drop");
          // 시각적 피드백 (예: 카운터 업데이트)
          $drop.find('.count').text($drop[0].dataset.value);
      } else {
          // 제한 도달 시 (클릭 또는 드롭 시)
          audioManager.playSound("wrong");
      }
  }
}

initializeSingleDragMultiDrop();

/**보정 함수 */


// ✅ 스케일 포함 중심 좌표 기반 바깥 판정 함수
function isOutsideDropArea(dropEl, elementEl) {
  const scale = globalScale || 1;

  const dropRect = dropEl.getBoundingClientRect();
  const elRect = elementEl.getBoundingClientRect();

  const elCenterX = (elRect.left + elRect.width / 2) / scale;
  const elCenterY = (elRect.top + elRect.height / 2) / scale;

  const dropLeft = dropRect.left / scale;
  const dropRight = dropRect.right / scale;
  const dropTop = dropRect.top / scale;
  const dropBottom = dropRect.bottom / scale;

  return (
    elCenterX < dropLeft ||
    elCenterX > dropRight ||
    elCenterY < dropTop ||
    elCenterY > dropBottom
  );
}

function isPointerInsideDropArea(event, dropEl) {
  const scale = globalScale || 1;
  const dropRect = dropEl.getBoundingClientRect();

  const x = event.pageX / scale;
  const y = event.pageY / scale;

  const left = dropRect.left / scale;
  const right = dropRect.right / scale;
  const top = dropRect.top / scale;
  const bottom = dropRect.bottom / scale;

  return x >= left && x <= right && y >= top && y <= bottom;
}

function isOverlapScaled(dropEl, dragEl) {
  const scale = globalScale || 1;

  const dropRect = dropEl.getBoundingClientRect();
  const dragRect = dragEl.getBoundingClientRect();

  const dropBox = {
    left: dropRect.left / scale,
    top: dropRect.top / scale,
    right: dropRect.right / scale,
    bottom: dropRect.bottom / scale,
  };

  const dragBox = {
    left: dragRect.left / scale,
    top: dragRect.top / scale,
    right: dragRect.right / scale,
    bottom: dragRect.bottom / scale,
  };

  return !(
    dragBox.right < dropBox.left ||
    dragBox.left > dropBox.right ||
    dragBox.bottom < dropBox.top ||
    dragBox.top > dropBox.bottom
  );
}

function initializeDragDropFraction() {
  const $wrap = $(".dragndrop_fraction_wrap");
  // 원본 드래그 아이템만 선택 (클릭/드래그 대상)
  const $draggables = $wrap.find(".drag_item:not(.dropped)");
  const $droppables = $wrap.find(".drop_item");
  let selectedDraggable = null; // 선택된 원본 아이템 추적
  let currentHoverElement = null; // 기존 hover 로직 유지

  // 드래그 중인 요소의 pair와 일치하는 드롭 요소의 보더 강조 CSS 추가
  $("<style>")
    .prop("type", "text/css")
    .html(`
      .dragndrop_fraction_wrap .drop_item.highlight-border {
        border: 1px solid var(--secondary-green) !important;
      }
    `)
    .appendTo("head");

   // --- 하이라이트 업데이트 함수 (클릭 시 사용) ---
   function updateClickHighlight() {
       $droppables.removeClass('highlight-border'); // 모든 하이라이트 제거
       if (selectedDraggable) {
           const selectedPair = selectedDraggable.data('pair');
           $droppables.each(function() {
               const $drop = $(this);
               if ($drop.data('pair') === selectedPair && $drop.find('.drag_item').length === 0) {
                   $drop.addClass('highlight-border');
               }
           });
       }
   }

  $draggables.draggable({
    helper: function () {
      // 드래그 시작 시 클릭 선택/하이라이트 해제
      if (selectedDraggable) {
        selectedDraggable.removeClass("selected");
        selectedDraggable = null;
        $droppables.removeClass('highlight-border');
      }
      const $helper = $(this).clone();
      $helper.css({
        opacity: 0.8,
        pointerEvents: "none"
      });
      return $helper;
    },
    revert: "invalid",
    revertDuration: 0,
    start: function (event, ui) {
      // 드래그 시작 시 클릭 선택/하이라이트 해제 (중복 체크)
       if (selectedDraggable) {
            selectedDraggable.removeClass("selected");
            selectedDraggable = null;
            $droppables.removeClass('highlight-border');
        }
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
      currentHoverElement = null;
      audioManager.playSound("drag");

      // 드래그 시작 시 pair가 같은 드롭 요소 보더 강조 (기존 로직)
      const dragPair = $(this).data("pair");
      $droppables.each(function () {
        const $drop = $(this);
        const dropPair = $drop.data("pair");
        // 드래그 시작 시에는 비어있지 않아도 하이라이트 (기존 방식 유지)
        if (dragPair === dropPair) {
          $drop.addClass("highlight-border");
        }
      });
    },
    drag: function (event, ui) {
      ui.position.left /= globalScale;
      ui.position.top /= globalScale;
    },
    stop: function () {
      // 드래그 종료 시 모든 보더 강조 제거 (기존 로직)
      $droppables.removeClass("highlight-border");
    }
  });

  $droppables.droppable({
    accept: function (draggable) {
      // draggable: helper 또는 복제본(.dropped)일 수 있음
      const dragPair = $(draggable).data("pair");
      const dropPair = $(this).data("pair");
      const isEmpty = $(this).find(".drag_item").length === 0;

      // 원본 드래그 (helper) 또는 복제본 드래그 모두 pair 맞고 비어있으면 accept
      return dragPair === dropPair && isEmpty;
    },
    tolerance: "pointer",
    over: function (event, ui) {
      // 다른 hover 상태 제거
      if (currentHoverElement && currentHoverElement !== this) {
        $(currentHoverElement).removeClass("ui-state-hover ui-droppable-active");
      }

      $(this).addClass("ui-state-hover ui-droppable-active");
      currentHoverElement = this;
    },
    out: function () {
      $(this).removeClass("ui-state-hover ui-droppable-active");
      if (currentHoverElement === this) {
        currentHoverElement = null;
      }
    },
    drop: function (event, ui) {
      // 드래그 드롭 이벤트 핸들러 (원본/복제본 공통 처리)
      const $drop = $(this).removeClass("ui-droppable-hover highlight-border ui-state-hover ui-droppable-active"); // 모든 강조/호버 제거 (여기서도 확실히)
      const $draggedOriginal = $(ui.draggable); // 드래그 시작된 실제 요소 참조
      currentHoverElement = null;

      if ($draggedOriginal.hasClass('dropped')) {
           // --- 복제본 이동 --- 
           // console.log("Clone dropped, moving..."); // 로그 제거
           // stop 이벤트에서 참고할 플래그 설정
           ui.helper.data('dropped-onto-valid', true);
           $drop.empty().append($draggedOriginal.css({position: 'relative', top: 'auto', left: 'auto'}));
           $drop.parent().addClass("on");
           $drop.attr("data-value", $draggedOriginal.data("value"));
           audioManager.playSound("drop");
      } else if (!$draggedOriginal.hasClass('used')) {
          // 원본 아이템 드롭 (아직 사용되지 않은 경우)
          // console.log("Original item dropped. Processing:", $draggedOriginal[0]); // 로그 제거
          // stop 이벤트에서 참고할 플래그 설정
          ui.helper.data('dropped-onto-valid', true);
          handleFractionDrop($draggedOriginal, $drop, 'drag'); // 드롭 로직 함수화 (ui.draggable 전달)
      } else {
          // 이미 사용된 원본 아이템을 드롭 시도한 경우
          // console.log("Attempted to drop an already used original item."); // 로그 제거
          audioManager.playSound("wrong");
      }
       // 드롭 후 하이라이트 제거 (클릭 하이라이트 관련)
       updateClickHighlight();
    }
  });

  // 클릭-투-클릭: 원본 드래그 아이템 클릭
  $draggables.off('click').on("click", function(e) {
      // console.log("Fraction Draggable clicked:", this, "Used:", $(this).hasClass('used')); // 로그 제거
      e.stopPropagation();
      const $this = $(this);

      if ($this.hasClass('used')) return; // 이미 사용된 아이템 클릭 불가

      if (selectedDraggable && selectedDraggable[0] === this) {
          // 선택 해제
          selectedDraggable.removeClass("selected");
          selectedDraggable = null;
      } else {
          // 새 아이템 선택
          if (selectedDraggable) {
              selectedDraggable.removeClass("selected");
          }
          selectedDraggable = $this;
          selectedDraggable.addClass("selected");
          audioManager.playSound("click");
      }
      // 클릭 선택 상태에 따라 하이라이트 업데이트
      updateClickHighlight();
  });

  // 클릭-투-클릭: 드롭 영역 클릭
  $droppables.off('click').on("click", function(e) {
      // console.log("Droppable clicked (Click-to-click attempt)", this); // 로그 제거
      e.stopPropagation();
      const $drop = $(this);

      if (selectedDraggable) {
          // console.log("... Draggable item is selected:", selectedDraggable[0]); // 로그 제거
          // 선택된 아이템이 있을 때 드롭 영역 클릭
          if ($drop.find(".drag_item").length === 0) {
              // console.log("... Drop area is empty."); // 로그 제거
              // 빈 영역 클릭 시
              const dragPair = selectedDraggable.data("pair");
              const dropPair = $drop.data("pair");
              // console.log(`... Checking pair: Drag=${dragPair}, Drop=${dropPair}`); // 로그 제거

              if (dragPair === dropPair) {
                  // Pair 맞으면 드롭 실행
                  // console.log("... Pair matches! Calling handleFractionDrop."); // 로그 제거
                  handleFractionDrop(selectedDraggable, $drop, 'click');
              } else {
                  // Pair 틀리면 실패 처리
                  // console.log("... Pair mismatch. Undoing selection."); // 로그 제거
                  audioManager.playSound("wrong");
                  selectedDraggable.removeClass("selected");
                  selectedDraggable = null;
                  updateClickHighlight();
              }
          } else {
              // 이미 아이템 있는 영역 클릭 시 실패 처리
              // console.log("... Drop area is NOT empty. Undoing selection."); // 로그 제거
              audioManager.playSound("wrong");
              selectedDraggable.removeClass("selected");
              selectedDraggable = null;
              updateClickHighlight();
          }
      } else {
          // console.log("... No draggable item selected."); // 로그 제거
          // 선택된 아이템 없을 때 클릭은 아무 동작 안 함
      }
  });

   // 외부 클릭 시 선택 해제
   $(document).off("click.fractionDragDrop").on("click.fractionDragDrop", function(e) {
       if (selectedDraggable && !$(e.target).closest('.drag_item:not(.dropped):not(.ui-draggable-dragging)').length && !$(e.target).closest('.drop_item').length) {
           // console.log("Fraction Deselecting draggable due to outside click:", selectedDraggable[0]); // 로그 제거
           selectedDraggable.removeClass("selected");
           selectedDraggable = null;
           updateClickHighlight();
       }
   });

  // --- 드롭 로직 함수화 (클릭 또는 첫 드래그 시 호출) ---
  function handleFractionDrop($originalDragInput, $drop, callContext = 'drag') {
      const $originalDrag = $originalDragInput.first();
      // if ($originalDragInput.length > 1) {
      //     console.warn("handleFractionDrop: Multiple original items passed, using the first one:", $originalDrag[0]); // 로그 제거
      // }
      // console.log(`handleFractionDrop called from [${callContext}]: Processing original:`, $originalDrag[0], "into drop:", $drop[0]); // 로그 제거

      const dragPair = $originalDrag.data("pair");
      const dropPair = $drop.data("pair");

      // 최종 유효성 검사
      if (dragPair === dropPair && $drop.find(".drag_item").length === 0 && !$originalDrag.hasClass('used')) {
          // console.log("handleFractionDrop: Validation passed. Cloning..."); // 로그 제거
          const $clone = $originalDrag.clone().removeClass('selected');
          // console.log("handleFractionDrop: Clone created:", $clone[0]); // 로그 제거

          // 드롭된 위치(부모 drop_item) 정보를 복제본에 저장
          $clone.data('original-drop-item', $drop[0]);

          $clone
              .addClass("dropped")
              .removeAttr("style")
              .css({ position: 'relative', left: 'auto', top: 'auto', zIndex: 1 })
              .draggable({ // 복제본 드래그 설정
                  helper: "original",
                  containment: $wrap,
                  zIndex: 1000,
                  revert: function(isValidDropTarget) {
                      // 유효한 드롭 영역에 놓이지 *않았을* 경우 revert 시도
                      if (!isValidDropTarget) {
                          // drop 이벤트가 발생 안 함. stop 이벤트에서 최종 처리.
                          // 원본 아이템은 stop에서 처리되므로 여기서는 제거 안 함.
                          audioManager.playSound("wrong");
                          return true; // 시각적으로 되돌아가는 효과만 표시
                      }
                      // 유효한 드롭 영역에 놓이면 drop 이벤트 발생, revert 안 함
                      return false;
                  },
                  revertDuration: 0,
                  start: function(event, ui) {
                      ui.position.left /= globalScale;
                      ui.position.top /= globalScale;
                      // 복제본 시작 시 원위치의 상태만 임시 제거 (empty() 대신)
                      const $parentDrop = $(this).parent('.drop_item');
                      if ($parentDrop.length) {
                          $parentDrop.removeClass("on").removeAttr("data-value");
                      }
                      $originalDrag.removeClass('used'); // 원본 다시 사용 가능
                      audioManager.playSound("drag");
                      // 복제본 드래그 시 하이라이트
                      const clonePair = $(this).data("pair");
                      $droppables.each(function () {
                          const $d = $(this);
                          const dPair = $d.data("pair");
                           // 비어있는 칸만 하이라이트
                          if (clonePair === dPair && $d.find(".drag_item").length === 0) {
                               $d.addClass("highlight-border");
                           }
                      });
                  },
                  drag: function(event, ui) {
                      ui.position.left /= globalScale;
                      ui.position.top /= globalScale;
                  },
                  stop: function(event, ui) {
                       // 하이라이트 및 hover 상태 모두 제거
                       $droppables.removeClass("highlight-border ui-droppable-hover ui-state-hover ui-droppable-active");

                       const $stoppedClone = $(this);
                       const originalDropItem = $stoppedClone.data('original-drop-item');

                        // revert: true 로 인해 제자리로 돌아왔거나, drop 이벤트가 발생하지 않았을 때
                        // (즉, 유효하지 않은 곳에 최종적으로 놓였을 때)
                       if (!ui.helper.data('dropped-onto-valid')) {
                            // 마우스 위치가 원래 드롭 영역 밖인지 확인
                            const scale = globalScale || 1;
                            const dropRect = originalDropItem.getBoundingClientRect();
                            const x = event.pageX / scale;
                            const y = event.pageY / scale;

                            const isOutsideOriginal = !(
                                x >= dropRect.left / scale &&
                                x <= dropRect.right / scale &&
                                y >= dropRect.top / scale &&
                                y <= dropRect.bottom / scale
                            );

                            // 최종 위치가 원래 드롭 영역 밖이면 복제본 제거 및 원본 활성화
                            if (isOutsideOriginal) {
                                // console.log("Clone stopped outside original drop area. Removing clone."); // 로그 제거
                                $stoppedClone.remove();
                                $originalDrag.removeClass('used');
                                // 원래 드롭 영역 상태 복구 (이미 비워져 있을 수 있음)
                                $(originalDropItem).removeClass("on").removeAttr("data-value");
                                window.triggerDropoutEvaluation?.();
                            } else {
                                // 원래 드롭 영역 안에 놓였으면, 상태 복구 (on 클래스 등)
                                // console.log("Clone stopped inside original drop area. Restoring state."); // 로그 제거
                                $(originalDropItem).addClass("on").attr("data-value", $stoppedClone.data("value"));
                                $originalDrag.addClass('used'); // 원본 다시 사용 처리
                            }
                       } else {
                           // 유효한 곳에 드롭되어 drop 이벤트가 처리된 경우, stop에서는 할 일 없음
                           // console.log("Clone stopped after successful drop on valid target."); // 로그 제거
                       }
                       // 플래그 초기화
                       ui.helper.removeData('dropped-onto-valid');
                  }
              });

          $drop.empty().append($clone);
          $drop.parent().addClass("on");
          $drop.attr("data-value", $originalDrag.data("value"));
          audioManager.playSound("drop");

          $originalDrag.addClass('used'); // 원본 사용 처리

          // 성공 시 선택/하이라이트 해제
          if (selectedDraggable && selectedDraggable[0] === $originalDrag[0]) {
              selectedDraggable.removeClass("selected");
              selectedDraggable = null;
          }
          updateClickHighlight(); // 하이라이트 제거

      } else {
          // 실패 시
          audioManager.playSound("wrong");
          if (selectedDraggable) {
              selectedDraggable.removeClass("selected");
              selectedDraggable = null;
          }
          updateClickHighlight(); // 하이라이트 제거
      }
  }
}

initializeDragDropFraction();

//드랍된 요소를 제거하는 드랍액션에서 동작하는 전역 트리거 함수 추가
window.triggerDropoutEvaluation = function () {
  document.dispatchEvent(new CustomEvent("dropoutEvaluate"));
};

/** 모든 드래그 앤 드롭 상태 초기화 함수 */
window.resetDragDrop = function (targetPage) {
  const pageSelector = targetPage ? $(targetPage) : $(document);

  // 1. initializeNotiDragDrop 리셋
  pageSelector.find(".letKnow .droppable").each(function () {
    $(this).removeClass("ui-state-hover ui-droppable-active");
    if ($(this).parent().hasClass("on")) {
      $(this).parent().removeClass("on");
    }
    // 마스크 관련 리셋이 필요하다면 여기에 추가 (예: 스크래치 효과 초기화)
  });

  // 2. initializeSingleDragMultiDrop 리셋
  pageSelector.find(".drag_group[data-group-limit]").each(function () {
    const $group = $(this);
    const $droppables = $group.find(".droppable");

    $droppables.each(function () {
      $(this).removeClass("ui-state-hover ui-droppable-active");
      this.dataset.value = "0"; // data-value 초기화
    });

    // 그룹 값 초기화 (빈 배열 또는 초기 상태 문자열)
    const initialGroupValues = JSON.stringify(Array($droppables.length).fill(0));
    $group.attr("data-group-value", initialGroupValues);
  });
  // single_draggable 관련 리셋 (필요 시)

  // 3. initializeDragDropFraction 리셋
  pageSelector.find(".dragndrop_fraction_wrap .drop_item").each(function () {
    const $drop = $(this);
    $drop.removeClass("ui-state-hover ui-droppable-active highlight-border");
    $drop.empty(); // 드롭된 복제 요소 제거
    $drop.parent().removeClass("on");
    $drop.removeAttr("data-value"); // data-value 속성 제거
  });

  // 드래그 가능한 원본 요소들의 상태 리셋
  pageSelector.find(".dragndrop_fraction_wrap .drag_item:not(.dropped)").removeClass("used selected");

  // 드래그 가능한 요소들의 상태 리셋 (필요 시 draggable의 상태 변경이 있다면 추가)
  // 예: pageSelector.find(".drag_item.dropped").removeClass("dropped");

  // console.log("Drag and drop reset completed.");
};

