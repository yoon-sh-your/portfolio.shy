// runAfterAppReady(() => {
  // 제출 버튼 클릭 시 커스텀 검증 로직
  // window.customValidateBeforeSubmit = function ({
  //   hasEmpty,
  //   isSelfCheckMissing,
  //   rules,
  // }) {
  //   console.log("🔍 커스텀 제출 전 검증 로직 실행됨");
  //   console.log("빈 항목 존재 여부:", hasEmpty);
  //   console.log("자기 점검 미선택 여부:", isSelfCheckMissing);
  //   console.log("검사 규칙:", rules);

  //   // 조건에 따라 사용자에게 알림 표시
  //   if (hasEmpty) {
  //     alert("⚠️ 빈 항목이 존재합니다. 제출을 중단합니다.");
  //     return false; // 기본 토스트 방지
  //   }

  //   return true; // 기본 로직 계속 실행

    
  // };

  // 제출버튼 토스트
  function toastSubmit() {
   // 제출버튼 비활성화
   let blockBtnSubmit = document.querySelector(".btn_area .btnSubmit");
   let blockBtnReset = document.querySelector(".btn_area .btnReset");
   blockBtnSubmit.classList.add("unactiveBtn");


    let toastTarget = document.querySelector("#app_wrap");
    let createDiv = document.createElement("div");
    createDiv.innerHTML = `
      <div class="imgBox">
      <img src="../../common_contents/common/img/charactor_toast_5.svg" alt="">
      </div>
      <div class="txtBox">
      <h3>선생님께 제출되었습니다.</h3>
      </div>
   `;
    let showToast3s = createDiv.classList.add("toastSubmit");

    toastTarget.appendChild(createDiv);
    createDiv.style.opacity = "1";
    setTimeout(() => {
      createDiv.style.opacity = "0";
      createDiv.style.display = "none";
    }, 3000);

 

    // defineButtonClassRules([
    //   {
    //     selector: ".btnSubmit", //변경될 값을 감지할 태그 설정
    //     test: (el) => {
    //       //el은 타겟을 의미하는 요소
    //       //ex) 값이 비어있거나 null인 경우
    //       const val = $(el).val();
    //       if (val == "" || val == null) {
    //         return false;
    //       }
    //       return false;

  
    //       //true 반환하면 버튼 활성화, false 반환하면 비활성화
    //     },
    //     setClass: [
    //       //원하는 버튼 클래스 부여 설정합니다.
    //       { target: ".btnCheck", class: "" },
    //       { target: ".btnSubmit", class: "unactiveBtn" },
    //       { target: ".btnSample", class: "active" },
    //       { target: ".btnSample", class: "close" },
    //       { target: ".btnReset", class: "active" },
    //     ],
    //   },
    // ]);
    // // 버튼 상태 변경 후 강제 평가 문 실행
    // window.forceWatchEvaluation();

  }

 // 리셋 버튼 클릭 시 실행할 커스텀 함수
 window.resetCustom = function () {
    // alert("🔄 리셋 버튼 클릭됨");
    $(".btn_area .btnSubmit").removeClass('unactiveBtn');
  };
// });

