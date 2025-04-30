const fillAnswerBoxes = () => {
   const articles = document.querySelectorAll('article.page');
   articles.forEach((article, index) => {
     const correctBtn = article.querySelector('[data-answer-single="true"][data-correction="true"]');
     if (correctBtn) {
       const answerText = correctBtn.querySelector('.txt')?.textContent?.trim();
       const targetBox = document.querySelector(`.left .box${index + 1}`);
       if (answerText && targetBox && !targetBox.textContent) {
         targetBox.textContent = answerText;
         targetBox.classList.add('filled'); // 스타일링용
       }
     }
   });
 };
 
 // check 버튼 감지 후 자동 호출
 const observeCheckAndFill = () => {
   const checkBtn = document.querySelector('.btnCheck');
   if (!checkBtn) return;
 
   checkBtn.addEventListener('click', () => {
     // 일정 시간 후 DOM에 data-correction 속성 생김
     setTimeout(() => {
       fillAnswerBoxes();
     }, 100); // 100~300ms 사이로 조정 가능
   });
 };
 
 // 페이지 로드 후 실행
 document.addEventListener('DOMContentLoaded', () => {
   observeCheckAndFill();
 });
 