
document.addEventListener("DOMContentLoaded", function () {
  const connectionToGifIndex = {
    "s1-e1": "02",
    "s2-e2": "01",
    "s3-e3": "03",
    "s4-e4": "04",
    "s5-e5": "05",
    "s6-e6": "06",
    "s7-e8": "07",
    "s8-e7": "08",
    "s9-e10": "09",
    "s10-e9": "10"
  };

  document.querySelectorAll(".connect_wrap").forEach((wrap) => {
    const points = wrap.querySelectorAll(".connect_point");
    const figure = wrap.closest(".figure");

    let selectedFirst = null;
    let isConnecting = false;

    points.forEach((point) => {
      point.addEventListener("click", () => {
        if (isConnecting) return;

        const currentId = point.getAttribute("data-id");

        if (!selectedFirst) {
          // 첫 번째 점 선택
          selectedFirst = currentId;
        } else {
          const secondId = currentId;

          // 같은 점을 두 번 클릭한 경우 무시
          if (selectedFirst === secondId) {
            selectedFirst = null;
            return;
          }

          isConnecting = true;

          // 두 점 조합을 양방향으로 확인
          const key1 = `${selectedFirst}-${secondId}`;
          const key2 = `${secondId}-${selectedFirst}`;
          const gifIndex = connectionToGifIndex[key1] || connectionToGifIndex[key2];

          if (gifIndex) {
            showFoldingAnimation(figure, gifIndex);
          }

          selectedFirst = null;
          setTimeout(() => {
            isConnecting = false;
          }, 100);
        }
      });
    });

    function showFoldingAnimation(figureElement, gifIndex) {
      const fileName = `0004_gif_${gifIndex}.gif`;
      const gifPath = `../../common_contents/img/EMA523_04_SU/${fileName}`;
    
      // 기존 gif 제거
      const existingGif = figureElement.querySelector(".folding_gif");
      if (existingGif) existingGif.remove();
    
      // ✅ 새 gif 이미지 생성
      const gif = document.createElement("img");
      gif.src = gifPath;
      gif.className = `folding_gif gif${gifIndex}`;
      gif.style.display = "block";
    
      // ✅ figure 내 svg 숨김
      const svg = figureElement.querySelector("svg");
      if (svg) svg.style.opacity = "0";
    
      figureElement.appendChild(gif);
    
      // ✅ 2초 후: gif 숨김 + svg 다시 보이기
      setTimeout(() => {
        gif.style.display = "none";
        if (svg) svg.style.opacity = "1";
      }, 3000);
    }
    
  });
});




