window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".boolean_count_wrap").forEach(wrapper => {
      const buttons = Array.from(wrapper.querySelectorAll("button"));
  
      buttons.forEach((btn, index) => {
        btn.addEventListener("click", (e) => {
          e.stopImmediatePropagation();
  
          const isSelected = btn.classList.contains("selected");
  
          if (isSelected) {
            // 클릭된 버튼과 그 뒤 버튼들의 selected 제거
            for (let i = index; i < buttons.length; i++) {
              buttons[i].classList.remove("selected");
            }
          } else {
            // 클릭된 버튼과 앞 버튼들에 selected 추가
            for (let i = 0; i <= index; i++) {
              buttons[i].classList.add("selected");
            }
          }
  
          if (typeof window.forceWatchEvaluation === "function") {
            window.forceWatchEvaluation();
          }
        }, true);
      });
    });
  });
  