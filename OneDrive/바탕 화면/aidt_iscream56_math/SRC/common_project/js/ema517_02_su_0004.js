document.addEventListener("DOMContentLoaded", () => {

  // 드롭다운 상태 변경 감지
  document.querySelectorAll(".custom_check_target").forEach(dropdown => {
    dropdown.addEventListener("change", () => {
      const answerValue = dropdown.dataset.answerSingle;
      const userValue = dropdown.value;

      if (answerValue === "empty_answer") {
        dropdown.dataset.correction = !userValue ? "true" : "false";
        return;
      }

      if (!userValue) {
        delete dropdown.dataset.correction;
        return;
      }

      dropdown.dataset.correction = (userValue === answerValue) ? "true" : "false";
    });
  });

  const group1 = {
    "브로콜리": ["△", "○", "×", 6],
    "배추": ["△", "○", "×", 6],
    "무": ["△", "○", "×", 6],
    "파": ["△", "○", "×", 6],
    "부추": ["△", "○", "×", 2],
    "호박": ["△", "○", "×", 2]
  };

  const group2 = {
    "브로콜리": ["○", "△", "÷", 6],
    "배추": ["○", "△", "÷", 6],
    "무": ["○", "△", "÷", 6],
    "파": ["○", "△", "÷", 6],
    "부추": ["○", "△", "÷", 2],
    "호박": ["○", "△", "÷", 2]
  };

  const rows = document.querySelectorAll(".answer_row");

  rows.forEach(row => {
    const select1 = row.querySelector('.answer1');
    const select2 = row.querySelector('.answer2'); // ❗ 이 줄이 row 안에서 실행돼야 함
    const targets = row.querySelectorAll('.custom_check_target');
    const target = row.querySelector('.input');

    const resetAll = () => {
      if (select2) select2.value = "";
      targets.forEach(target => {
        target.value = "";
        target.removeAttribute("data-answer-single");
      });

      target.value = "";
      target.removeAttribute("data-answer-single");
    };

    const updateAnswer = () => {
      const veg = select1?.value;
      const symbol = select2?.value;
      if (!veg || !symbol) return;

      let ref = null;
      if (group1[veg]?. [0] === symbol) {
        ref = group1[veg];
      } else if (group2[veg]?. [0] === symbol) {
        ref = group2[veg];
      }

      if (ref && targets.length >= 2) {
        const [, b, op, result] = ref;
        targets[0].setAttribute('data-answer-single', b);
        targets[1].setAttribute('data-answer-single', op);
        target.setAttribute('data-answer-single', String(result));
      }
    };

    // ✅ 이벤트 바인딩
    if (select1) {
      select1.addEventListener('change', () => {
        resetAll();
      });
    }

    if (select2) {
      select2.addEventListener('change', updateAnswer);
    } else {
      console.warn("⚠️ select2(.answer2) not found in row:", row);
    }
  });


  function isCurrentPage(pageClass) {
    const currentPage = pagenation?.activePage;
    return currentPage && currentPage.classList.contains(pageClass) ? currentPage : null;
  }


  window.customCheckCondition = function () {
    const currentPage = isCurrentPage("page_1");
    if (!currentPage) return false;

    let allCorrect = true;
    let hasEmpty = false;

    $('.custom_check_target').each(function () {
      const $el = $(this);
      const valRaw = $el.val();

      // 빈값 검사
      if (valRaw === "" || valRaw === null) {
        hasEmpty = true;
        return false; // each 중단
      }

      // 정답 여부는 data-correction 속성으로만 판단
      const correction = $el.attr("data-correction");
      if (correction !== "true") {
        allCorrect = false;

      }
    });

    if (hasEmpty) {
      return "empty";
    }
    return allCorrect;
  };
  window.resetCustom = function () {

    if (isCurrentPage("page_1")) {
      $(".page_1 .value").text('');
    };

    if (isCurrentPage("page_2")) {
      $(".page_2 .value").text('');
      $(".page_2 .result").text('');
    };
  }


});

runAfterAppReady(() => {
  function checkCorrection($el) {
    const answer = $el.data("answerSingle");
    const valRaw = $el.val();
    let userVal = valRaw;

    if ($el.prop("tagName").toLowerCase() === "math-field") {
      const match = String(valRaw).match(/\d+/);
      if (match) {
        userVal = match[0];
      }
    }

    if (String(userVal).trim() === String(answer).trim()) {
      $el.attr("data-correction", "true");
    } else {
      $el.attr("data-correction", "false");
    }
  }

  $('.input').on('input', function () {
    checkCorrection($(this));
  });

  // 포커스 빠질 때
  $('.input').on('blur', function () {
    checkCorrection($(this));
  });
  $('.answer1').on('change', function () {
    const selectedValue = $(this).find('option:selected').data('value');
    const $row = $(this).closest('tr');
    $row.find('.value').text(selectedValue);
  });


  // math-field 실시간 입력 시 계산
  $('.page_2 math-field').on('input', function () {
    const selectedValue = $(this).find('option:selected').data('value');
    const $row = $(this).closest('tr');
    const val = $row.find('.value').text(); // 해당 row의 value span 텍스트
    const multiplier = parseFloat(val); // 숫자로 변환


    const math = $(this).val();
    let num = math.match(/\d+/);
    let number = parseInt(num, 10);
    $row.find('.result').text(multiplier * number);


    if (isNaN(multiplier) || isNaN(number)) {
      $row.find('.result').text('');
      return;
    }

    if (val) {
      $('.btnSubmit').addClass("active");
      $('.btnReset').addClass("active");
    }
  });

});