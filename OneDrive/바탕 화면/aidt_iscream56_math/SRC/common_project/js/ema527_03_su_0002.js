document.addEventListener("DOMContentLoaded", () => {
    const gridReset = document.querySelector('.gridReset');
    const hitArea = document.querySelectorAll('.hit_area');
    const canvas = document.querySelector('.drawing_grid_area');

    canvas.addEventListener('click', () => {
      const connectionData = canvas.getAttribute('data-connection');
      if (connectionData && connectionData !== '[]') {
        gridReset.classList.add('active');
      } else {
        gridReset.classList.remove('active'); // 필요 시 비활성화 처리도
      }
    });

    gridReset.addEventListener('click', () => {
      document.querySelectorAll('.drawing_grid_area').forEach(el => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        el.querySelectorAll('.add_line').forEach(line => line.remove());
        // 기존 resetDrawing 함수 호출 (있다면)
        if (typeof resetDrawing === 'function') {
          resetDrawing(el);
        }
        gridReset.classList.remove('active');
      });
    });
  });


  runAfterAppReady(() => {
    // 체크박스 초기화 함수
    function resetCheckboxes(popup) {
      popup.find('input[type=checkbox]').prop('checked', false);
    }

    // 확인하기 버튼 클릭 시 자기평가 팝업 노출
    $('.btn_popup').on('click', function () {
      $('#' + $(this).data('target')).addClass('active');
    });

    // 팝업 닫기 버튼 클릭 시 팝업 닫고 체크박스 초기화
    $('.popup .close').on('click', function () {
      const popup = $(this).closest('.popup');
      popup.removeClass('active');
      resetCheckboxes(popup);
    });

    // 리셋 버튼 클릭 시 체크박스 초기화
    $('.btnReset').on('click', function () {
      const popup = $(this).closest('.popup');
      resetCheckboxes(popup);
    });

  });