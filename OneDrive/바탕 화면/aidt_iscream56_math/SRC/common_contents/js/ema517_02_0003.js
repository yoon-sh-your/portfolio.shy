document.addEventListener("DOMContentLoaded", () => {
    const gridReset = document.querySelector('.gridReset');
    const hitArea = document.querySelectorAll('.hit_area');
    const canvas =  document.querySelector('.drawing_grid_area');
    
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
    