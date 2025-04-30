document.addEventListener('DOMContentLoaded', () => {
   const dropdown = document.querySelector('.custom_dropdown');
   const mathFields = document.querySelectorAll('math-field');
 
   const timeValues = {
     '방콕': [6, 7, 8, 9],
     '나이로비': [2, 3, 4, 5]
   };
 
   dropdown.addEventListener('change', (e) => {
     const selected = e.target.value;
     const values = timeValues[selected];
 
     if (values) {
       mathFields.forEach((field, index) => {
         field.setAttribute('data-answer-single', values[index]);
         // 값도 표시해주고 싶으면 아래 라인도 추가
         field.value = values[index];
       });
     }
   });
 });