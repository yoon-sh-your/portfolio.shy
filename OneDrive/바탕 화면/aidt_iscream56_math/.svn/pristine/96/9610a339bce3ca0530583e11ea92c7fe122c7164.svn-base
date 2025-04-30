(function () {
   document.addEventListener('DOMContentLoaded', () => {
   const section = document.querySelector('section.contents');
   if (!section || !section.querySelector('select[data-answer-single]')) return;

   const getKey = () => {
      const isPaging = document.querySelector('.contents')?.classList.contains('paging_layout');
      return isPaging ? document.querySelector('article.on') : 'global';
   };

   const checkCountMap = new Map();

   const evaluateSelect = (select) => {
      const answer = select.dataset.answerSingle;
      const value = select.value;

      if (answer === 'empty_answer') {
         select.dataset.correction = (!value || value.trim() === '') ? 'true' : 'false';
      } else {
         select.dataset.correction = value === answer ? 'true' : 'false';
      }
   };

   const evaluateAllSelects = () => {
      const selects = section.querySelectorAll('select[data-answer-single]');
      selects.forEach(evaluateSelect);
   };

   const getValidSelectCount = () => {
      const selects = section.querySelectorAll('select[data-answer-single]');
      return [...selects].filter(select => select.value && select.value.trim() !== '').length;
   };

   const allCorrected = () => {
      const selects = section.querySelectorAll('select[data-answer-single]');
      return [...selects].every(select => select.dataset.correction === 'true');
   };

   const handleCheckClick = () => {
      evaluateAllSelects();

      const validCount = getValidSelectCount();

      if (validCount < 2) {
         if (typeof toastCheckMsg === 'function') {
         toastCheckMsg('문제를 풀어보세요!', 1, false);
         }
         return;
      }

      const key = getKey();
      const count = checkCountMap.get(key) || 0;

      if (allCorrected()) {
         checkCountMap.set(key, 0);
         if (typeof updateBodyClassByScore === 'function') {
         updateBodyClassByScore();
         }
         return;
      }

      if (count === 0) {
         checkCountMap.set(key, 1);
         if (typeof toastCheckMsg === 'function') {
         toastCheckMsg('한 번 더 생각해 보세요.', 2, false);
         }
      } else {
         checkCountMap.set(key, count + 1);
         if (typeof updateBodyClassByScore === 'function') {
         updateBodyClassByScore();
         }
         if (typeof toastCheckMsg === 'function') {
         toastCheckMsg('정답을 확인해 보세요.', 3, false);
         }
      }
   };

   document.addEventListener('click', (e) => {
      const btnCheck = e.target.closest('.btnCheck');
      if (!btnCheck || !section.contains(btnCheck)) return;

      handleCheckClick();
   });

   section.addEventListener('change', (e) => {
      const select = e.target;
      if (select.tagName === 'SELECT' && select.dataset.answerSingle) {
         evaluateSelect(select);
      }
   });

   evaluateAllSelects();

   document.querySelector('.btnReset')?.addEventListener('click', () => {
      checkCountMap.clear();
      evaluateAllSelects();
   });
   });
})();