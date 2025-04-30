/** 알아보기 문제용 */
function initializeNotiDragDrop() {
    const draggables = $(".letKnow .draggable");
    const droppables = $(".letKnow .droppable");

    droppables.each(function () {
        createScratchMask(this);
    });

    draggables.draggable({
        start: function (event, ui) {
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

            const dragPair = $drag.data("pair");
            const dropPair = $drop.data("pair");

            if (dragPair === dropPair) {
                $drop.parent().toggleClass("on");
                audioManager.playSound("drop");
            }
        }
    });
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
    const $draggable = $(".single_draggable");

    $(".drag_group[data-group-limit]").each(function () {
        const $group = $(this);
        const limit = parseInt($group.data("group-limit"), 10) || 6;
        const $droppables = $group.find(".droppable");

        $droppables.droppable({
            accept: ".single_draggable",
            tolerance: "fit",
            over: function () {
                const total = $droppables.toArray().reduce((sum, el) => {
                    return sum + (parseInt(el.dataset.value) || 0);
                }, 0);

                if (total < limit) {
                    $(this).addClass("ui-state-hover ui-droppable-active");
                    isDropHandled = true;
                } else {
                    $(this).removeClass("ui-state-hover ui-droppable-active");
                    isDropHandled = false;
                }
            },
            out: function () {
                $(this).removeClass("ui-state-hover ui-droppable-active");
                isDropHandled = false;
            },
            drop: function (event, ui) {
                $(this).removeClass("ui-state-hover ui-droppable-active");

                if (!isDropHandled) return;

                const $drop = $(this);
                const index = $droppables.index($drop);
                if (index < 0) return;

                const currentValue = parseInt($drop[0].dataset.value) || 0;
                $drop[0].dataset.value = currentValue + 1;

                // 그룹의 모든 드롭 요소들의 value 값을 배열로 만들어 업데이트
                const groupValues = $droppables.toArray().map(el => parseInt(el.dataset.value) || 0);
                $group.attr("data-group-value", JSON.stringify(groupValues));

                audioManager.playSound("drop");
            }
        });
    });

    $draggable.draggable({
        start: function (event, ui) {
            ui.position.left /= globalScale;
            ui.position.top /= globalScale;
            isDropHandled = false;
            audioManager.playSound("drag");
        },
        drag: function (event, ui) {
            ui.position.left /= globalScale;
            ui.position.top /= globalScale;
        },
        revert: true,
        revertDuration: 0
    });
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
  const $draggables = $wrap.find(".drag_item");
  const $droppables = $wrap.find(".drop_item");

  $draggables.draggable({
    helper: function () {
      const $helper = $(this).clone();
      $helper.css({
        opacity: 0.8,
        pointerEvents: "none",
      });
      return $helper;
    },
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
    accept: function (draggable) {
      const dragPair = $(draggable).data("pair");
      const dropPair = $(this).data("pair");
      return dragPair === dropPair && $(this).find(".drag_item").length === 0;
    },
    tolerance: "pointer",
    over: function () {
      $(this).addClass("ui-state-hover ui-droppable-active");
    },
    out: function () {
      $(this).removeClass("ui-state-hover ui-droppable-active");
    },
    drop: function (event, ui) {
      const $drop = $(this).removeClass("ui-state-hover ui-droppable-active");
      const $drag = $(ui.draggable);
      const dragPair = $drag.data("pair");
      const dropPair = $drop.data("pair");
    
      if (dragPair === dropPair && $drop.find(".drag_item").length === 0) {
        const $clone = $drag.clone();
    
        $clone
          .addClass("dropped")
          .removeAttr("style")
          .draggable({
            helper: "original",
            containment: "document",
            zIndex: 1000,
            revert: "invalid",
            revertDuration: 0,
            start: function (event, ui) {
              ui.position.left /= globalScale;
              ui.position.top /= globalScale;
            },
            drag: function (event, ui) {
              ui.position.left /= globalScale;
              ui.position.top /= globalScale;
            },
            stop: function (event, ui) {
              const dropEl = this.parentElement;
              const scale = globalScale || 1;
              const dropRect = dropEl.getBoundingClientRect();
              const x = event.pageX / scale;
              const y = event.pageY / scale;
    
              const isInside =
                x >= dropRect.left / scale &&
                x <= dropRect.right / scale &&
                y >= dropRect.top / scale &&
                y <= dropRect.bottom / scale;
    
              if (!isInside) {
                $(this).remove();
                $(dropEl).parent().removeClass("on");
                dropEl.removeAttribute("data-value");
                window.triggerDropoutEvaluation(); // ✅ 평가 트리거
              }
            }
          });
    
        $drop.append($clone);
        $drop.parent().addClass("on");
        $drop.attr("data-value", $drag.data("value")); // ✅ 드롭 시 value 갱신
        audioManager.playSound("drop");
      }
    }
    
  });
}

initializeDragDropFraction();

//드랍된 요소를 제거하는 드랍액션에서 동작하는 전역 트리거 함수 추가
window.triggerDropoutEvaluation = function () {
  document.dispatchEvent(new CustomEvent("dropoutEvaluate"));
};
