import { playSound } from './audio.js';

$(function () {
  // 버튼 상태 업데이트 함수
  function updateCalcButtons(currentPage) {
    const $input = $(`#q${currentPage} .calc_result_input`);
    const $resetBtn = $(`#q${currentPage} .calc_reset`);
    const $checkBtn = $(`#q${currentPage} .calc_check`);

    if ($input.val()?.trim() !== '') {
      $resetBtn.removeClass('disable');
      $checkBtn.removeClass('disable');
      $('.calc_result').addClass('on');
    } else {
      $resetBtn.addClass('disable');
      $checkBtn.addClass('disable');
      $('.calc_result').removeClass('on');
    }
  }
  $('input').on('input', function () {
    $(this).parents('.ans').addClass('on');
  });
  $('.withKeypad input[type="text"]').on('input', function () {
    let val = $(this).val();
    let btns = $(this).parents('.withKeypad').find('.calc_option > button');
    if (val !== '') {
      btns.removeClass('disable');
    } else {
      btns.addClass('disable');
    }
  });

  // 초기 로딩 시 모든 페이지의 버튼을 disabled 처리
  $('.page').each(function () {
    const pageId = $(this).attr('id');
    const $resetBtn = $(`#${pageId} .calc_reset`);
    const $checkBtn = $(`#${pageId} .calc_check`);
    $(`#${pageId} .calc_check`).text('정답확인');

    $resetBtn.addClass('disable');
    $checkBtn.addClass('disable');
  });

  // 키패드 버튼 클릭 이벤트
  $('.calc_num').on('click', 'button', function () {
    playSound('click');

    let currentPage = $('.pagination button.on').index() + 1;
    let $input = $(`#q${currentPage} .calc_result_input`);
    let currentValue = $input.val();
    let newValue = $(this).text();

    if (!$(this).hasClass('del')) {
      if (newValue === '.' && currentValue.includes('.')) return;
      $input.val(currentValue + newValue);
    } else {
      $input.val(currentValue.slice(0, -1));
    }

    // 버튼 상태 업데이트
    updateCalcButtons(currentPage);

    // 다른 페이지의 "on" 제거
    $('.page').each(function () {
      let pageId = $(this).attr('id');
      if (pageId !== `q${currentPage}`) {
        $(this).removeClass('on');
      }
    });
  });

  // 리셋 버튼 클릭 이벤트
  $('.calc_reset').on('click', function () {
    playSound('click');

    let currentPage = $('.pagination button.on').index() + 1;

    // active된 정답 입력 필드 초기화
    $('.answer.active').val('');

    // 키패드 입력창 리셋
    $(`#q${currentPage} .calc_result_input`).val('');

    // 버튼 상태 업데이트
    updateCalcButtons(currentPage);

    // 다른 페이지의 "on" 제거
    $('.page').each(function () {
      let pageId = $(this).attr('id');
      if (pageId !== `q${currentPage}`) {
        $(this).removeClass('on');
      }
    });

    // 현재 페이지만 유지
    $(`#q${currentPage}`).addClass('on');
    $('.page.on .ans').each(function () {
      const hasValue =
        $(this)
          .find('input')
          .filter(function () {
            return $(this).val().trim() !== '';
          }).length > 0;

      if (!hasValue) {
        $(this).removeClass('on');
      }
    });

    // 제출 버튼 상태 업데이트
    let hasAnswer = $('.page.on .answer')
      .toArray()
      .some((input) => $(input).val().trim() !== '');
    window.pageStates[currentPage] = hasAnswer;
    window.updateSubmitButton();
  });

  // 키보드 입력 방지
  $('.calc_result_input').on('keydown', function (e) {
    if (!$(this).parents('.withKeypad').hasClass('txt')) e.preventDefault();
    $(this).parents('.calc_result').addClass('on');
  });

  // 입력칸 클릭 시 활성화
  $('input.answer').on('click', function (e) {
    $('.page.on .answer').removeClass('active');
    $(this).addClass('active');
    $(this).parents('.page').find('.calc_result_input').val($(this).val());
    let currentPage = $('.pagination button.on').index() + 1;
    updateCalcButtons(currentPage);
  });

  // 정답 확인
  function answerConfirmation() {
    let allCompleted = true;
    playSound('click');

    let currentPage = $('.pagination button.on').index() + 1;
    let $input = $(`#q${currentPage} .calc_result_input`);
    let currentValue = $input.val().trim();

    if (currentValue !== '') {
      let formattedValue = currentValue.toString();
      $('.page.on .answer.active').val(formattedValue);
      $('.page.on .answer.active').parents('.ans').addClass('on');
      //   $input.val('');

      // 버튼 상태 업데이트
      //   updateCalcButtons(currentPage);
    }
    $('.page.on .answer').each(function () {
      if (!$(this).val()) {
        $('.page.on .answer').removeClass('active');
        $(this).addClass('active');
        allCompleted = false;
        $('.page.on .calc_reset').click();
        return false; // 루프 멈춤 (break 효과)
      }
    });
    if (allCompleted) window.checkPageAnswerStates(currentPage);
  }

  // 키패드 체크 버튼 클릭 이벤트
  $('.calc_check').on('click', function () {
    answerConfirmation();
  });
 
  // 입력형 문제 키보드 엔터 입력 시 "정답 확인" 버튼 클릭과 동일한 이벤트
  $(document).on('keydown', function(e) {
    const currentPage = $('.pagination button.on').index() + 1;
    const $input = $(`#q${currentPage} .calc_result_input`);
    if (window.questionTypes[currentPage - 1] === 1 && $input?.[0]?.value && (e.key === 'Enter' || e.keyCode === 13)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      answerConfirmation();
    }
  });
});
