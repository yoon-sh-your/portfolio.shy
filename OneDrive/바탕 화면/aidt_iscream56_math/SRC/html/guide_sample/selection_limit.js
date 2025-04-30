runAfterAppReady(() => {
  console.log("selection_limit.js 실행");

  const selectionWrap = document.querySelector('.selection_limit_wrap');
  const limit = parseInt(selectionWrap.dataset.limit);
  const items = document.querySelectorAll('.selection_limit_item');

  // 각 아이템의 체크박스 상태를 관리하는 함수
  function handleItemChange(currentItem) {
    const currentCheckbox = currentItem.querySelector('input[type="checkbox"]');
    const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
    
    // 현재 아이템이 체크된 경우
    if (currentCheckbox.checked) {
      // 체크된 개수가 제한에 도달했을 때
      if (checkedCount >= limit) {
        items.forEach(item => {
          const checkbox = item.querySelector('input[type="checkbox"]');
          if (!checkbox.checked) {
            checkbox.disabled = true;
            item.classList.add('disabled');
          }
        });
      }
    } else {
      // 체크가 해제된 경우 모든 아이템 활성화
      items.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.disabled = false;
        item.classList.remove('disabled');
      });
    }
  }

  // 각 아이템에 이벤트 리스너 추가
  items.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => handleItemChange(item));
  });

  // 버튼 활성화 규칙 정의
  defineButtonClassRules([
    {
      selector: "input[type='checkbox']",
      test: (el) => {
        const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
        return checkedCount > 0;
      },
      setClass: [
        { target: ".btnCheck", class: "active" },
        { target: ".btnReset", class: "active" }
      ]
    }
  ]);

  // 버튼 상태 변경 후 강제 평가
  window.forceWatchEvaluation();

  // 리셋 버튼 클릭 시 실행할 커스텀 함수
  window.resetCustom = function() {
    items.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox.checked = false;
      checkbox.disabled = false;
      item.classList.remove('disabled');
    });
  };
});
