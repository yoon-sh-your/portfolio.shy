// questionTypes.js
import { playSound } from './audio.js';
import { setupPagingHandlers } from './common.js';

jQuery(function ($) {
  // ■■■■ 유형1: 단답 입력형 (input 클릭 시 active) ■■■■
  $(document).on('click', '.page.on .answer', function () {
    playSound('click');
    $('.page.on .answer').removeClass('active');
    $(this).addClass('active');
  });

  // ■■■■ 유형2, 3: 체크박스 선택형 ■■■■
  const maxSelection = {};
  for (let key in window.correctAnswers) {
    const qNum = parseInt(key);
    const type = window.questionTypes[qNum - 1];
    if (type === 2) {
      maxSelection[qNum] = window.correctAnswers[qNum].length;
    }
  }

  $(document).on('change', 'input[type="checkbox"]', function () {
    playSound('click');
    const $checkbox = $(this);
    const $item = $checkbox.closest('.item');
    const page = parseInt($checkbox.closest('.page').attr('id').replace('q', ''));
    const type = window.questionTypes[page - 1];
    const isType2or3 = type === 2 || type === 3;

    if (!isType2or3) return;

    const limit = window.correctAnswers[page]?.length || 1;
    const $checkboxes = $(`#q${page} input[type="checkbox"]`);

    if ($checkbox.is(':checked')) {
      $checkbox.attr('data-checked-time', Date.now());
      $item.addClass('selected');
    } else {
      $checkbox.removeAttr('data-checked-time');
      $item.removeClass('selected');
    }

    const $checked = $checkboxes.filter(':checked');

    if (limit === 1) {
      $checkboxes.not($checkbox).prop('checked', false).removeAttr('data-checked-time').closest('.item').removeClass('selected');
    }
    // else if ($checked.length > limit) {
    //   const $lastChecked = $checked
    //     .not($checkbox)
    //     .sort((a, b) => {
    //       return $(b).attr('data-checked-time') - $(a).attr('data-checked-time');
    //     })
    //     .first();

    //   $lastChecked.prop('checked', false).removeAttr('data-checked-time').closest('.item').removeClass('selected');
    // }

    if ($checkbox.is(':checked')) {
      $item.addClass('selected');
    } else {
      $item.removeClass('selected');
    }

    window.checkPageAnswerStates?.(page);
  });

  // 유형2,3: 번호 추가
  window.questionTypes.forEach((type, index) => {
    const pageNum = index + 1;
    if (type === 2 || type === 3) {
      const $items = $(`#q${pageNum} .item_wrap .item`);
      $items.each(function (i) {
        const $txt = $(this).find('.txt');
        if ($(this).find('.checked').length === 0) {
          // $('<span class="num">').text(i + 1).insertBefore($txt);
          $('<span class="checked">').insertBefore($txt);
        }
      });
    }
  });

  // 페이징 버튼 초기 핸들러 등록
  setupPagingHandlers();

  // ■■■■ 유형5: 선긋기 ■■■■
  document.querySelectorAll('.line-matching').forEach(setupMatching);

  function setupMatching(container) {
    const canvas = container.querySelector('.line-canvas');
    const ctx = canvas.getContext('2d');
    let startEl = null;
    let connections = [];

    resizeCanvas();

    function resizeCanvas() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      redrawLines();
    }

    window.addEventListener('resize', resizeCanvas);

    const startItems = container.querySelectorAll('.start-items li');
    const endItems = container.querySelectorAll('.end-items li');

    startItems.forEach((item) => {
      item.addEventListener('mousedown', (e) => {
        startEl = item;
      });
    });

    endItems.forEach((item) => {
      item.addEventListener('mouseup', (e) => {
        if (startEl) {
          connections.push({
            start: startEl.getAttribute('data-id'),
            end: item.getAttribute('data-id'),
            startEl: startEl,
            endEl: item,
          });
          redrawLines();
          startEl = null;
        }
      });
    });

    function redrawLines() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      connections.forEach((conn) => {
        const startRect = conn.startEl.getBoundingClientRect();
        const endRect = conn.endEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const x1 = startRect.left + startRect.width / 2 - containerRect.left;
        const y1 = startRect.top + startRect.height / 2 - containerRect.top;
        const x2 = endRect.left + endRect.width / 2 - containerRect.left;
        const y2 = endRect.top + endRect.height / 2 - containerRect.top;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  }
});
