runAfterAppReady(() => {
  console.log("custom_answer_check.js 실행");
  
  window.customCheckCondition = function(el) {
    const $el = $(el);
    const correctAnswer = $el.data("answerCustom");
    const $radio = $el.find('input[type="radio"]');
    const groupName = $radio.attr("name");
    const $selected = $(`input[name="${groupName}"]:checked`);

    if ($selected.length === 0) return "empty";

    const selectedValue = $selected.val();
    return selectedValue === String(correctAnswer);
  };

  window.onCustomIncorrect = function(count) {
    console.log(count);
    if (count === 2) {
      console.log("오답 횟수 2회");
      window.onIncorrectTwiceCustom?.();
      $(".custom_check_radio").each(function () {
        const $container = $(this);
        const answerValue = String($container.data("answerCustom"));
        const name = $container.find('input[type="radio"]').attr("name");
  
        $(`input[name="${name}"][value="${answerValue}"]`).prop("checked", true);
      });
    }
  };

  let wrongAnswer = 0;

  window.onCorrectCustom = function() {
    alert("🎉 정답이에요!");
  };

  window.onIncorrectCustom = function() {
    alert("❗ 다시 생각해보세요.");
    wrongAnswer++;
    console.log("오답 횟수:", wrongAnswer);
  };

  window.onIncorrectTwiceCustom = function() {
    alert("🚨 정답 공개됩니다!");
  };

  window.onEmptyCustom = function() {
    alert("👀 입력을 먼저 해보세요!");
  };

  window.resetCustom = function() {
    alert("🔄 리셋 버튼 클릭됨");
    $(".custom_check_radio input[type='radio']").prop("checked", false);
  };

  defineButtonClassRules([
    {
      selector: ".custom_check_radio",
      test: el => {
        const $checked = $(el).find("input[type='radio']:checked");
        return $checked.length > 0;
      },
      setClass: [
        { target: ".btnCheck", class: "active" },
        { target: ".btnSubmit", class: "active" },
        { target: ".btnSample", class: "active" },
        { target: ".btnSample", class: "close" },
        { target: ".btnReset", class: "active" }
      ]
    }
  ]);

  window.forceWatchEvaluation();

  window.customValidateBeforeSubmit = function({ hasEmpty, isSelfCheckMissing, rules }) {
    console.log("🔍 커스텀 제출 전 검증 로직 실행됨");
    console.log("빈 항목 존재 여부:", hasEmpty);
    console.log("자기 점검 미선택 여부:", isSelfCheckMissing);
    console.log("검사 규칙:", rules);
  
    if (hasEmpty) {
      alert("⚠️ 빈 항목이 존재합니다. 제출을 중단합니다.");
      return false;
    }

    return true;
  };


  $(".btnCheck").on("click", function () {
    const target = $(".custom_check_radio");

    const hasChecked = target.find("input[type='radio']:checked").length > 0;

    if (!hasChecked) {
      window.onEmptyCustom?.();
      return;
    }

    const result = window.customCheckCondition(target);


    if (result === true) {
      window.onCorrectCustom?.();
    } else if (result === false) {
      window.onIncorrectCustom?.();
      window.onCustomIncorrect?.(wrongAnswer);
    }
    
    const $btn = $(this);

    if ( $btn.hasClass("close") ) {
      $(".custom_check_radio input[type='radio']").prop("checked", false);
      console.log("리셋 버튼 클릭됨");
      return; 
    }
  });
});
