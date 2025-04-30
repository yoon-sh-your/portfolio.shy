document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.session_grid_col');
  const imageBox = document.querySelector('.image_box');
  const btnReset = document.querySelector('.btnReset');
  let currentMaxSession = 1;

  function updateSessionAccess() {
    buttons.forEach(button => {
      const session = parseInt(button.dataset.session);
      if (session <= currentMaxSession) {
        button.classList.remove('disabled');
      } else {
        button.classList.add('disabled');
      }
    });

    document.querySelectorAll('math-field').forEach(field => {
      const column = field.closest('.group_grid_col');
      if (column) {
        const parentRow = column.parentNode;
        const colIndex = Array.from(parentRow.children).indexOf(column);
        field.disabled = colIndex > currentMaxSession;
      }
    });
  }

  updateSessionAccess();
  buttons[0].click();
  btnReset.classList.remove('active');

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      if (this.classList.contains('disabled')) return;

      const session = this.dataset.session;
      const imagePath = `../../common_contents/img/EMA621_10_SU/621_card_${session}.png`;
      
      imageBox.innerHTML = `<img src="${imagePath}" alt="${session}회차 이미지" style="width: 100%; height: 100%; object-fit: contain;">`;
      
      buttons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      btnReset.classList.add('active');

      if (currentMaxSession < 6) {
        currentMaxSession++;
        updateSessionAccess();
      }
    });
  });

  btnReset.addEventListener('click', function() {
    if (btnReset.classList.contains('active')) {  
      location.reload();
    }
  });
});