import { checkAnswerPop } from './common.js';

export function setupDragAndDrop() {
  let scale = 1;

  function getScale() {
    const transform = $('#scaleWrapper').css('transform');
    if (transform && transform !== 'none') {
      const match = transform.match(/matrix\((.+)\)/);
      if (match) {
        const values = match[1].split(', ');
        scale = parseFloat(values[0]);
        return scale;
      }
    }
    return 1;
  }

  getScale(); // 초기 scale 적용

  let originalPosition = {};

  $('.draggable').draggable({
    revert: function (isValidDrop) {
      if (!isValidDrop) {
        // 수동 위치 복귀
        $(this).animate({ top: 0, left: 0 }, 200);
        playSound('x');
      }
      return false; // 기본 revert 막고 커스텀 처리
    },
    start: function (event, ui) {
      scale = getScale();
      originalPosition = {
        top: ui.helper.position().top,
        left: ui.helper.position().left,
      };
    },
    drag: function (event, ui) {
      ui.position.left = ui.position.left / scale;
      ui.position.top = ui.position.top / scale;
    },
  });

  $('.droppable').droppable({
    drop: function (event, ui) {
      const $dropZone = $(this);
      const $dragItem = $(ui.draggable);

      const answer = $dropZone.data('answer');
      const userAnswer = $dragItem.attr('aria-label');

      if (String(answer) === String(userAnswer)) {
        $dropZone.addClass('disabled');
        $dragItem
          .css({ top: 0, left: 0 }) // 위치만 초기화
          .addClass('disabled');

        let $clone = $dragItem.clone();
        // $clone.removeAttr('style');
        $(this).append($clone);
        // ui.helper.remove();

        let dropCnt = $('.page.on .droppable');
        let droppableCnt = $('.page.on .droppable.disabled');

        playSound('o');
        if (dropCnt.length === droppableCnt.length) {
          $('.page.on .droppable').parents('.qe_area').addClass('disabled');
          checkAnswerPop();
        }
      } else {
        $dragItem.animate({ top: 0, left: 0 }, 200);
        playSound('x');
        checkAnswerPop();
      }
      let currentPage = $('.pagination button.on').index() + 1;
      checkPageAnswerStates(currentPage);
    },
  });

  // resize 시 스케일 다시 계산할 수도 있음
  window.addEventListener('resize', getScale);
}
