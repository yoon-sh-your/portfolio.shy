document.addEventListener('DOMContentLoaded', function() {
    const choices = document.querySelectorAll('.choice span');
    const texts = document.querySelectorAll('.txt_are .txt');
  
    choices.forEach((choice, index) => {
      choice.addEventListener('click', function() {
        // 모든 txt 요소에서 on 클래스를 제거
        texts.forEach(txt => {
          txt.classList.remove('on');
        });
  
        // 클릭한 choice에 대응하는 txt에 on 클래스 추가
        const selectedTxt = document.querySelector(`.txt${String(index + 1).padStart(2, '0')}`);
        if (selectedTxt) {
          selectedTxt.classList.add('on');
        }
      });
    });
  });
  