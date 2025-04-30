document.addEventListener('DOMContentLoaded', function () {
   document.querySelectorAll('.boolean_wrap').forEach(function (wrapper) {
       const buttons = wrapper.querySelectorAll('button');

       buttons.forEach(function (button) {
           button.addEventListener('click', function (e) {
               e.preventDefault();
               e.stopImmediatePropagation(); // btn_act.js 이벤트 차단

               // 버튼 하나만 선택되도록
               buttons.forEach(btn => btn.classList.remove('selected'));
               this.classList.add('selected');

               // ✅ change 이벤트 강제로 발생시켜서 btnCheck 상태 갱신되게 함
               const event = new Event('change', { bubbles: true });
               wrapper.dispatchEvent(event);
           }, true); // 캡처 단계
       });
   });
});


// ✅ 해당 boolean_wrap과 부모 page에 result 클래스 추가
function markResult(wrapper) {
   wrapper.classList.add('result');
   const page = wrapper.closest('.page');
   if (page) {
       page.classList.add('result');
   }
}

// ✅ result 클래스 제거
function unmarkResult(wrapper) {
   wrapper.classList.remove('result');
   const page = wrapper.closest('.page');
   if (page) {
       page.classList.remove('result');
   }
}

// ✅ 정답일 때 (정답 버튼에 selected가 있으면 처리)
function onCorrectCustom () {
   document.querySelectorAll('.boolean_wrap').forEach(function(wrapper) {
       const correctBtn = wrapper.querySelector('button[data-answer-single="true"]');
       if (correctBtn && correctBtn.classList.contains('selected')) {
           markResult(wrapper);
       } else {
           unmarkResult(wrapper);
       }
   });
}

// ✅ 리셋, 오답, 빈칸일 때는 모두 초기화
function resetCustom () {
   clearAllResults();
}

function onIncorrectCustom () {
   clearAllResults();
}

function onIncorrectTwiceCustom () {
   onCorrectCustom(); // 정답 공개
}

function onEmptyCustom () {
   clearAllResults();
}

// ✅ 모든 result 제거
function clearAllResults() {
   document.querySelectorAll('.boolean_wrap').forEach(function(wrapper) {
       unmarkResult(wrapper);
   });
}
