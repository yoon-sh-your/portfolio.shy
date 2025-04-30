runAfterAppReady(() => {
  // 앱 준비 후 실행, jQuery 사용가능
  console.log("custom_answer_check.js 실행");

  // 커스텀 채점 대상 추가
  window.getCustomTargets = function (page) {
    return $(page).find(".custom_check_target");
  };

  // 커스텀 정답 조건
  window.customCheckCondition = function (el) {
    // 이곳에 체크버튼을 클릭했을때 실행할 커스텀 채점 로직을 작성합니다.
    // 체크버튼 클릭시 실행되는 함수입니다.
    // return true 반환하면 정답 처리 됩니다.
    // return false 반환하면 오답 처리 됩니다.
    // return "empty" 반환하면 비어있는 경우 처리(풀이 독려 토스트 메시지 발생)됩니다.

    // ex) 숫자 입력창에 값이 1이상이면 정답 처리, 1이하이면 오답 처리, 비어있으면 풀이 독려 토스트 메시지(기본값) 발생
    const $el = $(el); //채점 대상 추가에서 추가한 요소를 가져옵니다.
    const rule = $el.data("answerCustom"); //채점 대상 추가에서 추가한 요소의 data-answer-custom 속성을 가져옵니다.
    const val = $el.val(); //채점 대상 추가에서 추가한 요소의 값을 가져옵니다.

    // 조건 설정
    if (val === "" || val == null) return "empty"; // 비어있으면 empty 처리

    const num = parseFloat(val); //숫자로 변환
    if (isNaN(num)) return "empty"; // empty 반환하면 비어있는 경우 처리 됩니다.

    if (rule === "min-1") {
      return num >= 1; //false 반환하면 오답 처리 됩니다.
    }

    return true; //true 반환하면 정답 처리 됩니다.
  };

  // 오답 횟수 커스텀 반응
  window.onCustomIncorrect = function (count) {
    console.log(count);
    if (count === 2) {
      console.log("오답 횟수 2회");
    }
  };

  // 커스텀 정답 처리 콜백 선언 방법
  // 정답 시 추가 동작
  window.onCorrectCustom = function () {
    alert("🎉 정답이에요!");
  };

  // 오답 시 추가 동작
  window.onIncorrectCustom = function () {
    alert("❗ 다시 생각해보세요.");
  };

  // 두 번째 오답 시
  window.onIncorrectTwiceCustom = function () {
    alert("🚨 정답 공개됩니다!");
  };

  // 입력 안 했을 때
  window.onEmptyCustom = function () {
    alert("👀 입력을 먼저 해보세요!");
  };

  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function () {
    alert("🔄 리셋 버튼 클릭됨");
    $(".custom_check_target").val("");
  };

  // 예시 버튼 클릭 시 실행할 커스텀 함수
  window.sampleCustom = function () {
    alert("💡 예시 버튼 클릭됨");
  };

  //이렇게가 연동된 함수의 선언 방법입니다.
  //버튼 활성화 부분은 아래와 같은 패턴으로 선언하면 됩니다.
  const target = $(".custom_check_target");

  // 1. 값 변경을 감지
  // 2. 값 변경시 버튼 활성화 여부 결정
  // ex) 숫자 입력창에 값이 있으면 모든 버튼 활성화, 없으면 비활성화

  defineButtonClassRules([
    {
      selector: ".custom_check_target", //변경될 값을 감지할 태그 설정
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
        const val = $(el).val();
        if (val == "" || val == null) {
          return false;
        }
        return true;
      }
    },
  ]);
  // 버튼 상태 변경 후 강제 평가 문 실행
  window.forceWatchEvaluation();

  // 제출 버튼 클릭 시 커스텀 검증 로직
  window.customValidateBeforeSubmit = function ({ hasEmpty, isSelfCheckMissing, rules }) {
    console.log("🔍 커스텀 제출 전 검증 로직 실행됨");
    console.log("빈 항목 존재 여부:", hasEmpty);
    console.log("자기 점검 미선택 여부:", isSelfCheckMissing);
    console.log("검사 규칙:", rules);

    // 조건에 따라 사용자에게 알림 표시
    if (hasEmpty) {
      alert("⚠️ 빈 항목이 존재합니다. 제출을 중단합니다.");
      return false; // 기본 토스트 방지
    }

    return true; // 기본 로직 계속 실행
  };
});
