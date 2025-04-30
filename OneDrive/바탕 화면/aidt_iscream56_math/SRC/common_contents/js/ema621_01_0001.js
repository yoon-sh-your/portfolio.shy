// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 예시 버튼 클릭 이벤트 처리
    const btnSample = document.querySelector('.btnSample');
    if (btnSample) {
      btnSample.addEventListener('click', function() {
        // 입력 필드 비활성화
        const mathField = document.querySelector('.input_wrap math-field');
        if (mathField) {
          mathField.disabled = true;
        }
      });
    }
  });
  