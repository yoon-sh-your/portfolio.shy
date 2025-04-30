document.addEventListener("DOMContentLoaded", () => {
   const booleanWrap = document.querySelector(".boolean_wrap");
   const buttons = booleanWrap.querySelectorAll("button");

   const numCols = 11; // 가로 칸 수 (11)
   const numRows = Math.ceil(buttons.length / numCols);

   const getTrueAnswers = () => {
     const correctIndexes = [];
     buttons.forEach((btn, i) => {
       if (btn.dataset.answerSingle === "true") {
         correctIndexes.push(i);
       }
     });
     return correctIndexes;
   };

   const getSelectedIndexes = () => {
     const selected = [];
     buttons.forEach((btn, i) => {
       if (btn.classList.contains("selected")) {
         selected.push(i);
       }
     });
     return selected;
   };

   const groupByRows = (indexes) => {
     const grouped = {};
     indexes.forEach((i) => {
       const row = Math.floor(i / numCols);
       if (!grouped[row]) grouped[row] = [];
       grouped[row].push(i % numCols);
     });
     return grouped;
   };

   const isSimilarMountainShape = (correct, selected) => {
     const correctByRow = groupByRows(correct);
     const selectedByRow = groupByRows(selected);

     const rows = Object.keys(correctByRow);
     if (rows.length !== Object.keys(selectedByRow).length) return false;

     return rows.every((row) => {
       const correctCols = correctByRow[row];
       const selectedCols = selectedByRow[row];

       if (correctCols.length !== selectedCols.length) return false;

       return correctCols.every((col, i) => {
         const sel = selectedCols[i];
         return Math.abs(col - sel) <= 1; // 한 칸 이내 이동 허용
       });
     });
   };

   // 정답 체크용 외부 접근 함수 예시
   window.customCheckCondition = function (el) {
     if (!el.closest(".boolean_wrap")) return null;

     const correct = getTrueAnswers();
     const selected = getSelectedIndexes();

     if (selected.length === 0) return "empty";
     return isSimilarMountainShape(correct, selected);
   };
 });