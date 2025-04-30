document.addEventListener("DOMContentLoaded", () => {
   document.querySelectorAll("h2[data-puzzle]").forEach(h2 => {
       const section = h2.closest("section");
       if (!section) return;
       
       section.classList.add("puzzle", h2.dataset.puzzle);
       
       section.insertAdjacentHTML("afterbegin", `
           <div class="puzzle_tit">
               <span class="tag" lang="y">창의</span>
               <span class="tit" lang="y">
                   <span class="emph">퍼즐</span>
                   <span class="txt1">로</span>
                   <span class="txt2">정리해요</span>
               </span>
           </div>
       `);
   });
});