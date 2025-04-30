//common.js
import { playSound } from './audio.js';

// 특정 요소의 scale 값을 가져오는 함수
function getScaleValue(element) {
  const style = window.getComputedStyle(element);
  const transform = style.transform;

  if (transform === 'none') {
    return 1; // transform이 없는 경우 기본 값은 1입니다.
  }

  // scale 값을 추출하기 위해 정규 표현식을 사용합니다.
  const match = transform.match(/matrix\(([^,]+),[^,]+,[^,]+,[^,]+,[^,]+,[^,]+\)/);
  if (match) {
    return parseFloat(match[1]);
  }

  // 2D 변환이 아닌 경우 (예: scale3d 등)
  const scaleMatch = transform.match(/scale\(([^,]+)\)/);
  if (scaleMatch) {
    return parseFloat(scaleMatch[1]);
  }

  return 1; // 일치하는 변환 값이 없으면 기본 값은 1입니다.
}

// 전역 등록
window.pageStates = {};
window.submissionStates = {};
window.enterActive = true;

// 초기 상태 세팅 (모든 문제 상태를 "미제출"로 초기화)
window.questionTypes.forEach((type, index) => {
  window.submissionStates[index + 1] = {
    type: type,
    answered: false,
    isCorrect: null,
    submissionTime: 0,
  };
});

window.visitedPages = { active: true, 1: false, 2: false, 3: false, 4: false, 5: false };
window.wrongCnt = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

// 제출 버튼 활성화 여부 업데이트
window.updateSubmitButton = function () {
  const currentPage = $('.pagination button.on').index() + 1;

  // if (window.submissionStates?.[currentPage]?.answered) {
  //   $('.submit').addClass('disable');
  //   return;
  // }

  const allVisited = Object.values(window.visitedPages).every((visited) => visited);
  // const keyCount = Object.keys(window.pageStates).length === 5 ? true : false;
  // console.log('allVisited---', allVisited);
  // console.log('keyCount---', keyCount);

  if (allVisited) {
    $('.submit').removeClass('disable');
  } else {
    $('.submit').addClass('disable');
  }
};

// 각 페이지의 응답 상태 확인
window.checkPageAnswerStates = function (page) {
  const type = window.questionTypes[page - 1];
  const $page = $(`#q${page}`);
  let isAnswered = false;

  switch (type) {
    case 1:
      isAnswered = $page
        .find('.answer')
        .toArray()
        .some((input) => $(input).val()?.trim() !== '');
      checkAnswerPop();
      break;
    case 2:
    case 3:
      isAnswered = $page.find('input[type="checkbox"]:checked').length > 0;

      const chkInput = $page.find('input[type="checkbox"]:checked').length;
      const ansCnt = window.correctAnswers[page]?.length;

      if (isAnswered && chkInput == ansCnt) {
        checkAnswerPop();
      }
      break;
    case 4:
      isAnswered = $('.page.on .qe_area').hasClass('disabled');
      break;
    case 5:
      isAnswered = $('.page.on .qe_area').hasClass('disabled');
      break;
  }

  window.pageStates[page] = isAnswered;
  window.updateSubmitButton();
};

// 페이징 UI 업데이트
function updatePaginationUI(page, isCorrect) {
  const button = $(`.pagination .p${page}`);
  if (isCorrect) {
    button.removeClass('x-icon').addClass('o-icon').attr('aria-label', `페이지${page} (정답)`);
  } else {
    if (window.wrongCnt[page] === 1) {
      button.removeClass('o-icon').addClass('x-icon').attr('aria-label', `페이지${page} (오답)`);
    }
  }

  $('.page.on .btnReset').removeClass('disable');
}

function inactiveVisitedPages() {
  window.visitedPages = { active: false, 1: false, 2: false, 3: false, 4: false, 5: false };
}

// 제출된 문제 수정 불가 처리
window.disableAnswerEditing = function (page) {
  const questionType = window.questionTypes[page - 1];
  ++window.submissionStates[page - 1].submissionTime;

  switch (questionType) {
    case 1:
      $(`#q${page} .answer`).attr('readonly', true).attr('disabled', true);
      break;
    case 2:
      if (window.submissionStates[page].isCorrect || window.submissionStates[page - 1].submissionTime >= 2) {
        $(`#q${page} input[type="checkbox"]`).prop('disabled', true);
        $(`#q${page} label.item`).addClass('disabled');
      }
      break;
    case 3:
      if (window.submissionStates[page].isCorrect || window.submissionStates[page - 1].submissionTime >= 2) {
        $(`#q${page} .answer`).css('pointer-events', 'none').addClass('disabled');
      }
      break;
    case 4:
      $(`#q${page} .draggable`).each(function () {
        if (!$(this).hasClass('dragged')) {
          $(this).attr('draggable', 'false').css('opacity', '0.5');
        }
      });
      break;
    case 5:
      $(`#q${page} .port-scrim`).each(function () {
        this.removeAttribute('data-drag');
      });
      $(`#q${page} .connector`).each(function () {
        this.querySelectorAll('[data-drag]').forEach((el) => {
          el.removeAttribute('data-drag');
        });
      });
      // ✅ SVG 자체에 pointer-events 차단
      $(`#q${page} svg`).css('pointer-events', 'none');
      break;
  }

  if (window.submissionStates[page].answered) {
    $(`#q${page} .answer`).removeClass('active');
    $(`#q${page} .calc_check`).off('click').addClass('disable');
  }
};

$(document).on('click', '.btnReset', function (e, keepWrongCnt) {
  const preserveWrongCnt = keepWrongCnt ?? false;
  const currentPage = $('.pagination button.on').index() + 1;

  // const allReset = window.visitedPages[currentPage] === 2;

  playSound('click');
  $(this).addClass('disable');
  $(`.pagination .p${currentPage}`).removeClass('x-icon o-icon');

  $('.page.on .qe_area.disabled').removeClass('disabled');

  $('.page.on .item.selected').removeClass('selected');
  $('.page.on .draggable.disabled').removeClass('disabled');
  $('.page.on .droppable.disabled .draggable').remove();
  $('.page.on .droppable.disabled').removeClass('disabled');
  $('.page.on .draggable').removeClass('is-answer');
  $('.page.on .droppable .hint').remove();
  $('.page.on svg circle').css('pointer-events', 'all').removeClass('disabled');
  $('.page.on svg line').remove();
  $('.page.on .dot').removeClass('on done correct ans');

  $('.page.on .item').removeClass('is-answer');

  if (!preserveWrongCnt) {
    window.visitedPages[currentPage] = false;
    window.wrongCnt[currentPage] = 0;
  }
});
// 제출 버튼 클릭 시
$('.submit').on('click', function () {
  // if ($(this).hasClass('disable')) return;
  playSound('click');

  // const currentPage = $('.pagination button.on').index() + 1;
  // const questionType = window.questionTypes[currentPage - 1];

  // let userAnswers = [];
  // let correctAnswers = [];

  // 사용자 입력 처리
  // if (questionType === 1) {
  //   userAnswers = $(`#q${currentPage} .answer`)
  //     .map((_, input) => $(input).val().trim())
  //     .get()
  //     .filter((answer) => answer !== '')
  //     .map(Number);

  //   correctAnswers = window.correctAnswers[currentPage].map(Number);
  // } else if (questionType === 2) {
  //   userAnswers = $(`#q${currentPage} input[type="checkbox"]:checked`)
  //     .map((_, el) => $(el).val())
  //     .get();

  //   correctAnswers = window.correctAnswers[currentPage].map(String);
  // } else if (questionType === 4) {
  //   userAnswers = $(`#q${currentPage} .droppable.dropped .drag_circle`)
  //     .map((_, el) => $(el).attr('aria-label'))
  //     .get()
  //     .filter((label) => label);

  //   correctAnswers = window.correctAnswers[currentPage].map(String);
  // } else if (questionType === 5) {
  //   const rawAnswers = $(`#q${currentPage} .connector`)
  //     .map((_, el) => {
  //       const inputEl = el.querySelector('.input-handle');
  //       const outputEl = el.querySelector('.output-handle');

  //       const inputId = $(inputEl).attr('data-drag')?.replace(/port_/, 'item')?.split(':')[0];
  //       const outputId = $(outputEl).attr('data-drag')?.replace(/port_/, 'item')?.split(':')[0];

  //       if (inputId && outputId) {
  //         const ids = [inputId, outputId].sort();
  //         return `${ids[0]}-${ids[1]}`;
  //       }
  //       return null;
  //     })
  //     .get()
  //     .filter(Boolean);

  //   correctAnswers = window.correctAnswers[currentPage].map((pair) => {
  //     const [a, b] = pair.split('-').sort();
  //     return `${a}-${b}`;
  //   });

  //   userAnswers = rawAnswers;
  // }

  // 정답 비교
  // const isCorrect = JSON.stringify(userAnswers.sort()) === JSON.stringify(correctAnswers.sort());

  // 모달 설정
  // $('#submitModal').data('currentPage', currentPage);
  // $('#submitModal').data('isCorrect', isCorrect);

  const values = Object.values(window.pageStates);
  const hasItems = values.length > 0;
  const allCompleted = hasItems && values.every((value) => value === true);
  const keyCount = Object.keys(window.pageStates).length === 5;

  const modalMessage = allCompleted && keyCount ? '<p>이대로 제출하겠습니까?</p>' : '<p>아직 풀지 못한 문제가 있습니다.</p><p>이대로 제출하겠습니까?</p>';

  $('#submitModal .modal-message').html(modalMessage);
  $('#submitModal').css('display', 'flex').hide().fadeIn(200);

  // $('.page').each(function (index) {
  //   let pageNum = index + 1;
  //   let pageAnswers = $(this)
  //     .find('.answer')
  //     .map((_, input) => $(input).val().trim())
  //     .get();
  // });
});

// 정오답 팝업
export function checkAnswerPop() {
  const currentPage = $('.pagination button.on').index() + 1;
  const questionType = window.questionTypes[currentPage - 1];

  let userAnswers = [];
  let correctAnswers = [];

  if (questionType === 1) {
    userAnswers = $(`#q${currentPage} .answer`)
      .map((_, input) => $(input).val().trim().replace(/\s+/g, ''))
      .get()
      .filter((answer) => answer !== '');

    correctAnswers = window.correctAnswers[currentPage];

    // 이중 배열이면 곱하기나 나누기 문제, 둘 중에 맞는 정답이 없다면 첫번쨰 배열을 넣어 오답 처리
    let doubleArrayAnswer = [];
    if (Array.isArray(correctAnswers) && Array.isArray(correctAnswers[0])) {
      const matchedIndex = correctAnswers.findIndex((candidate) => candidate.length === userAnswers.length && candidate.every((val, i) => String(val) === String(userAnswers[i])));
      doubleArrayAnswer = matchedIndex > -1 ? correctAnswers[matchedIndex] : correctAnswers[0];
      correctAnswers = doubleArrayAnswer;
    }

    $(`#q${currentPage} .answer`).each((i, input) => {
      const $input = $(input).val().trim().replace(/\s+/g, '');
      let parts = String(correctAnswers[i])
        .split('//')
        .map((part) => part.trim().replace(/\s+/g, ''));

      $(input).removeClass('is-incorrect is-correct');
      if (parts.includes($input)) {
        correctAnswers[i] = $input;
        $(input).addClass('is-correct');
      } else {
        $(input).addClass('is-incorrect');
      }
    });
    correctAnswers = doubleArrayAnswer.length ? doubleArrayAnswer : window.correctAnswers[currentPage].map(String);

    // $(`#q${currentPage} .answer`).each(function () {
    //   const $input = $(this);
    //   const inputVal = $input.val();
    //   const hintVal = $input.siblings('.hint').text().trim();
    //   console.log($(this), '//', $(this).index());
    //   $input.removeClass('is-incorrect is-correct');
    //   if (inputVal !== hintVal) {
    //     $input.addClass('is-incorrect');
    //   } else {
    //     $input.addClass('is-correct');
    //   }
    // });
  } else if (questionType === 2 || questionType === 3) {
    userAnswers = $(`#q${currentPage} input[type="checkbox"]:checked`)
      .map((_, el) => $(el).val())
      .get()
      .sort();

    correctAnswers = window.correctAnswers[currentPage].map(String).sort();
  } else if (questionType === 4) {
    correctAnswers = true;
    if ($('.page.on .qe_area').hasClass('disabled')) {
      userAnswers = true;
    } else {
      userAnswers = false;
    }

    // userAnswers = $(`#q${currentPage} .droppable.dropped .drag_circle`)
    //   .map((_, el) => $(el).attr('aria-label'))
    //   .get()
    //   .filter((label) => label);

    // correctAnswers = window.correctAnswers[currentPage].map(String);
  } else if (questionType === 5) {
    correctAnswers = true;
    if ($('.page.on .qe_area').hasClass('disabled')) {
      userAnswers = true;
    } else {
      userAnswers = false;
    }
  }
  const isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);
  window.submissionStates[currentPage].answered = true;
  window.submissionStates[currentPage].isCorrect = isCorrect;

  updatePaginationUI(currentPage, isCorrect);

  if (isCorrect || !isCorrect) {
    const isPositive = isCorrect;

    // 오답일 경우 틀린 횟수 증가
    if (!isPositive) {
      window.wrongCnt[currentPage] += 1;
    }

    const wrongCount = window.wrongCnt[currentPage];
    // 메시지 설정
    let messageText = '';
    if (isPositive) {
      messageText = '정답이에요!';
      $('.page.on .qe_area').addClass('disabled');
      $('.page.on .keypad .calc_num, .page.on .keypad .calc_check').addClass('disabled');
    } else {
      messageText = wrongCount >= 2 ? '정답을 확인해 보세요.' : '한 번 더 생각해 보세요.';
    }
    if (wrongCount >= 2) {
      $('.page.on .qe_area').addClass('disabled');
      $('.page.on .keypad .calc_num, .page.on .keypad .calc_check').addClass('disabled');
    }

    const $message = $('<p>').text(messageText);

    // 메시지만 업데이트
    $('#submitModal .modal-message').empty().append($message);

    // 스타일 업데이트
    $('#submitModal .modal-content')
      .removeClass('good bad')
      .addClass(isPositive ? 'good' : 'bad');

    // 버튼 숨김
    $('#submitModal .modal-buttons').addClass('hidden');

    $('#submitModal').css('display', 'flex').hide().fadeIn(100);

    playSound(isPositive ? 'o' : 'x');

    setTimeout(() => {
      $('#submitModal').fadeOut(300, function () {
        window.enterActive = true;
        // 버튼 다시 보이게
        $('#submitModal .modal-buttons').removeClass('hidden');
        $('#submitModal .modal-content').removeClass('good bad'); // 스타일도 원복
      });

      // 첫 오답일 땐 wrong count 유지하고 리셋, 두 번째 오답일때는 정답 표시
      if (!isPositive) {
        if (wrongCount >= 2) {
          if (questionType === 2 || questionType === 3) {
            $(`#q${currentPage} input[type="checkbox"]:checked`).prop('checked', false).closest('.item').removeClass('selected');
            window.correctAnswers[currentPage].forEach((val) => {
              const $checkbox = $(`#q${currentPage} input[type="checkbox"][value="${val}"]`);
              $checkbox.prop('checked', true); // 체크박스 체크
              $checkbox.closest('.item').addClass('is-answer'); // 가장 가까운 .item 부모에 클래스 추가
            });
          } else if (questionType === 4) {
            $(`#q${currentPage} .droppable`).each(function () {
              const dragItem = $(`#q${currentPage} .draggable-items .draggable[aria-label="${$(this).data('answer')}"]`);
              dragItem.addClass('is-answer');
              if (!$(this).find('.draggable')[0]) {
                let ans = dragItem.html();
                if (dragItem.attr('aria-label') === '크다') {
                  $(this).append(`<span class="hint">&gt;</span>`);
                } else if (dragItem.attr('aria-label') === '같다') {
                  $(this).append(`<span class="hint">=</span>`);
                } else if (dragItem.attr('aria-label') === '작다') {
                  $(this).append(`<span class="hint">&lt;</span>`);
                } else {
                  $(this).append(`<span class="hint">${ans}</span>`);
                }
              }
            });
          } else if (questionType === 5) {
            const pairs = {};
            // circle 요소들을 n 값 기준으로 그룹화
            $(`#q${currentPage} svg.theboard circle`).each(function () {
              const $circle = $(this);
              const n = $circle.attr('n');
              const cx = $circle.attr('cx');
              const cy = $circle.attr('cy');

              if (!pairs[n]) pairs[n] = [];
              pairs[n].push({ cx, cy });
            });

            // 각 n에 대해 짝이 두 개 있을 때만 <line> 만들어서 추가
            Object.entries(pairs).forEach(([n, points]) => {
              if (points.length === 2 && points[0].cx && points[0].cy && points[1].cx && points[1].cy) {
                $(`#q${currentPage} svg.theboard g.area-solution`)[0].appendChild(createSvgLine(points[0].cx, points[0].cy, points[1].cx, points[1].cy));
              }
            });

            $(`#q${currentPage} .dot_area .wrap .dot`).addClass('ans');
          }
        } else {
          $('.page.on .calc_reset').trigger('click');
          $('.page.on .btnReset').trigger('click', [true]);
          $(`#q${currentPage} input[type="checkbox"]:checked`).prop('checked', false);
          $(`#q${currentPage} input.answer`).val('').removeClass('active is-incorrect is-correct');

          if ($(`#q${currentPage} .answer`).first().parents('.frac_ans').length > 0) {
            const parentAns0 = $(`#q${currentPage} .answer`).first().parents('.frac_ans').find('.answer')[0];
            const parentAns = $(`#q${currentPage} .answer`).first().parents('.frac_ans').find('.answer')[1];
            if (parentAns) {
              $(parentAns).addClass('active');
            } else {
              $(parentAns0).addClass('active');
            }
          } else {
            $(`#q${currentPage} .answer`).first().addClass('active');
          }
        }
      }
    }, 2000);
  }
}

// 모달 취소
$('.modal-cancel').on('click', function () {
  playSound('click');
  $('#submitModal').fadeOut();
});

// 모달에서 제출 확정 시
$('.modal-confirm').on('click', function () {
  // 제출
});

// 초기 페이징 처리
export function setupPagingHandlers() {
  $('.pagination button').on('click', function () {
    playSound('click');
    const newPage = $(this).index() + 1;

    window.visitedPages[newPage] = true;

    $('.pagination button').removeClass('on');
    $(this).addClass('on');
    $('.page').removeClass('on');
    $(`#q${newPage}`).addClass('on');
    $('.page.on .withKeypad.txt  .calc_result_input').focus();
    // ✅ 여기에 hidden 처리 추가!
    $('.page').addClass('hidden');
    $(`#q${newPage}`).removeClass('hidden');

    $(`#q${newPage} .answer`).removeClass('active');
    if ($(`#q${newPage} .answer`).first().parents('.frac_ans').length > 0) {
      const parentAns0 = $(`#q${newPage} .answer`).first().parents('.frac_ans').find('.answer')[0];
      const parentAns = $(`#q${newPage} .answer`).first().parents('.frac_ans').find('.answer')[1];
      if (parentAns) {
        $(parentAns).addClass('active');
      } else {
        $(parentAns0).addClass('active');
      }
    } else {
      $(`#q${newPage} .answer`).first().addClass('active');
    }
    // window.checkPageAnswerStates(newPage);

    // hover 효과 추가
    selectTypeQuestionHoverEffect();

    if (window.submissionStates?.[newPage]?.answered) {
      $('.submit').addClass('disable');
      // window.disableAnswerEditing?.(newPage);
    }
    window.updateSubmitButton();

    $('.page.on .dot').each(function () {
      const $dot = $(this);
      const pos = $dot.attr('pos');

      const $circle = $(`.page.on circle[pos="${pos}"]`);
      const $svg = $('.page.on svg');

      if ($circle.length && $svg.length) {
        const dotRect = this.getBoundingClientRect();
        const svgRect = $svg[0].getBoundingClientRect();

        const scale = getScaleValue($('#scaleWrapper')[0] || document.body);

        const cx = (dotRect.left + dotRect.width / 2 - svgRect.left) / scale;
        const cy = (dotRect.top + dotRect.height / 2 - svgRect.top) / scale;

        $circle.attr({ cx, cy });
      }
    });
  });
}

// 문제 타입 2, 3에 한하여 재시도 기회를 위한 제출버튼 활성화
function setupReselectionListeners() {
  $('input[type="checkbox"]').on('change', function () {
    const pageId = $(this).closest('.page').attr('id');
    if (!pageId) return;

    const pageNum = parseInt(pageId.replace('q', ''));
    const questionType = window.questionTypes[pageNum - 1];

    if ((questionType === 2 || questionType === 3) && window.submissionStates[pageNum]?.answered) {
      window.submissionStates[pageNum].answered = false;

      if (currentQuestionType === 2) {
        $(`#q${currentPage} .item`).hover(
          function () {
            $(this).css('background-color', '#e6f2ff');
          },
          function () {
            $(this).css('background-color', '');
          }
        );
      }
    }
  });
}

function selectTypeQuestionHoverEffect() {
  const currentPage = $('.pagination button.on').index() + 1;
  const currentQuestionType = window.questionTypes[currentPage - 1];

  if (currentQuestionType === 2) {
    $(`#q${currentPage} .item`).hover(
      function () {
        $(this).css('background-color', '#EEEEEE');
      },
      function () {
        $(this).css('background-color', '');
      }
    );
  }
}

$(document).ready(function () {
  // setupReselectionListeners();

  // 입력형 힌트 셋팅
  window.questionTypes.forEach(function (type, index) {
    if (type === 1) {
      const questionNumber = index + 1;
      const correctAnswers = window.correctAnswers[questionNumber];
      const corrects = Array.isArray(correctAnswers) && Array.isArray(correctAnswers[0]) ? correctAnswers[0] : correctAnswers;

      // id가 q1~q5인 요소 내 .ans 들을 찾음
      const $questionBox = $('#q' + questionNumber).find('.ans');

      $questionBox.each(function (i) {
        if ($(this).find('.hint').length > 0) return;

        let correct = corrects[i];

        if (typeof correct === 'string' && correct.includes('//')) {
          correct = correct.replaceAll('//', ' 또는 ');
        }

        if (typeof correct !== 'undefined') {
          $(this).append('<div class="hint">' + correct + '</div>');
        }
      });
    }
    // 문제 유형에 맞는 배경 삽입
    $(`#q${index + 1} .bg`).addClass(`bg${type}`);
  });
});

function createSvgLine(x1, y1, x2, y2, color = '#FF0000') {
  const svgNS = 'http://www.w3.org/2000/svg';
  const line = document.createElementNS(svgNS, 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', '8');
  line.setAttribute('stroke-linecap', 'round');
  line.setAttribute('style', 'pointer-events: none;');
  return line;
}
