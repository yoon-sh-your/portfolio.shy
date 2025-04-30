runAfterAppReady(() => {
    const buttons = document.querySelectorAll('.boolean_wrap1 button');
    const buttons2 = document.querySelectorAll('.boolean_wrap2 button');

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        // 모든 버튼에서 selected 클래스 제거
        buttons.forEach(btn => btn.classList.remove('selected'));
        // 클릭한 버튼에 selected 클래스 추가
        button.classList.add('selected');
      });
    });

    buttons2.forEach(button2 => {
      button2.addEventListener('click', () => {
        // 모든 버튼에서 selected 클래스 제거
        buttons2.forEach(btn => btn.classList.remove('selected'));
        // 클릭한 버튼에 selected 클래스 추가
        button2.classList.add('selected');
      });
    });
});