import { checkAnswerPop } from './common.js';

export function setupDragAndDrop() {
  let scale = 1;
  let selectedDraggable = null;

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

  // 문서 전체에 클릭 이벤트 추가
  $(document).on('click', function (e) {
    // 드래그 요소나 드롭 영역이 아닌 곳을 클릭했을 때
    if (!$(e.target).closest('.draggable').length && !$(e.target).closest('.droppable').length) {
      if (selectedDraggable) {
        selectedDraggable.removeClass('selected');
        selectedDraggable = null;
        $('.droppable').removeClass('highlight');
      }
    }
  });

  // 드래그 가능한 요소에 클릭 이벤트 추가
  $('.draggable').on('click', function (e) {
    e.stopPropagation(); // 이벤트 버블링 방지

    if ($(this).hasClass('disabled')) return;

    if (selectedDraggable) {
      selectedDraggable.removeClass('selected');
      $('.droppable').removeClass('highlight');
    }

    selectedDraggable = $(this);
    selectedDraggable.addClass('selected');

    // 선택된 드래그 요소와 매칭되는 드롭 영역 하이라이트
    const userAnswer = selectedDraggable.attr('aria-label');
    $('.droppable').each(function () {
      const answer = $(this).data('answer');
      if (String(answer) === String(userAnswer)) {
        $(this).addClass('highlight');
      }
    });
  });

  // 드롭 가능한 영역에 클릭 이벤트 추가
  $('.droppable').on('click', function (e) {
    e.stopPropagation(); // 이벤트 버블링 방지

    if (!selectedDraggable || $(this).hasClass('disabled')) return;

    const $dropZone = $(this);
    const $dragItem = selectedDraggable;

    const answer = $dropZone.data('answer');
    const userAnswer = $dragItem.attr('aria-label');

    if (String(answer) === String(userAnswer)) {
      $dropZone.addClass('disabled');
      $dragItem.css({ top: 0, left: 0 }).addClass('disabled');

      let $clone = $dragItem.clone();
      $(this).append($clone);
      if ($('.page.on .btnReset').hasClass('disable')) {
        $('.page.on .btnReset').removeClass('disable');
        $('.page.on .btnReset').removeClass('disable');
      }
      playSound('o');

      let dropCnt = $('.page.on .droppable');
      let droppableCnt = $('.page.on .droppable.disabled');

      if (dropCnt.length === droppableCnt.length) {
        $('.page.on .droppable').parents('.qe_area').addClass('disabled');
        checkAnswerPop();
      }
    } else {
      playSound('x');
      checkAnswerPop();
    }

    selectedDraggable.removeClass('selected');
    selectedDraggable = null;
    $('.droppable').removeClass('highlight');

    let currentPage = $('.pagination button.on').index() + 1;
    checkPageAnswerStates(currentPage);
  });

  $('.draggable').draggable({
    revert: function (isValidDrop) {
      if (!isValidDrop) {
        $(this).animate({ top: 0, left: 0 }, 200);
        playSound('x');
      }
      return false;
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
        $dragItem.css({ top: 0, left: 0 }).addClass('disabled');

        let $clone = $dragItem.clone();
        $(this).append($clone);

        if ($('.page.on .btnReset').hasClass('disable')) {
          $('.page.on .btnReset').removeClass('disable');
          $('.page.on .btnReset').removeClass('disable dd');
        }

        playSound('o');

        let dropCnt = $('.page.on .droppable');
        let droppableCnt = $('.page.on .droppable.disabled');

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
