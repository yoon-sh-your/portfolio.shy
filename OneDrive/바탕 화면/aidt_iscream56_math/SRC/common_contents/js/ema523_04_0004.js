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
  });
  // ✅ 드래그 연결 감지 및 gif 처리 추가
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "data-connections") {
        const wrap = mutation.target;
        const figure = wrap.closest(".figure");
        const newValue = wrap.getAttribute("data-connections");

        if (!newValue) return;

        try {
          const connections = JSON.parse(newValue);

          connections.forEach(pair => {
            const [startId, endId] = pair;
            const key1 = `${startId}-${endId}`;
            const key2 = `${endId}-${startId}`;
            const gifIndex = connectionToGifIndex[key1] || connectionToGifIndex[key2];

            if (gifIndex) {
              showFoldingAnimation(figure, gifIndex);
            }
          });
        } catch (err) {
          console.warn("❌ data-connections 파싱 실패:", err);
        }
      }
    }
  });

  document.querySelectorAll(".connect_wrap").forEach(wrap => {
    observer.observe(wrap, { attributes: true });
  });

  // ✅ gif 표시 함수 (공통 사용)
  function showFoldingAnimation(figureElement, gifIndex) {
    const fileName = `0004_gif_${gifIndex}.gif`;
    const gifPath = `../../common_contents/img/EMA523_04_SU/${fileName}`;

    const existingGif = figureElement.querySelector(".folding_gif");
    if (existingGif) existingGif.remove();

    const gif = document.createElement("img");
    gif.src = gifPath;
    gif.className = `folding_gif gif${gifIndex}`;
    gif.style.display = "block";

    const svg = figureElement.querySelector("svg");
    if (svg) svg.style.opacity = "0";

    figureElement.appendChild(gif);

    setTimeout(() => {
      gif.style.display = "none";
      if (svg) svg.style.opacity = "1";
    }, 3000);
  }

  // ✅ 클릭 및 드래그 시 연결선은 절대 사라지지 않으며, 항상 gif 모션은 실행됨

  window.onCorrectCustom = function () {
    console.log("🔥 onCorrectCustom 실행됨");
    setTimeout(() => {
      const wraps = document.querySelectorAll(".connect_wrap.correct, .connect_wrap_click.correct");
      console.log("✅ correct 대상 수:", wraps.length);
  
      wraps.forEach(wrap => {
        const figure = wrap.closest(".figure");
        if (!figure) return;
  
        // 기존 gif 제거
        try {
          figure.querySelectorAll(".folding_gif").forEach(el => el.remove());
        } catch (e) {
          console.warn("❌ folding_gif 초기화 중 예외 발생:", e);
        }
        const answerRaw = wrap.getAttribute("data-sample-line");
        const userConnectionsRaw = wrap.getAttribute("data-connections");

        if (!answerRaw || !userConnectionsRaw) return;

        let answer, userConnections;
        try {
          if (!answerRaw || !userConnectionsRaw) throw new Error("속성이 비어있음");

          // JSON 파싱
          answer = JSON.parse(answerRaw);
          userConnections = JSON.parse(userConnectionsRaw);

          if (!Array.isArray(answer) || !Array.isArray(userConnections)) {
            throw new Error("배열이 아님");
          }
        } catch (err) {
          console.warn("❌ answer 또는 connections 파싱 실패:", err, {
            answerRaw,
            userConnectionsRaw
          });
          return;
        } 
        // ✅ 배열 내용 비교 (순서 상관 없이)
        const normalize = arr => arr.map(pair => pair.sort()).sort();
        const isEqual = JSON.stringify(normalize(answer)) === JSON.stringify(normalize(userConnections));

        if (isEqual) {
          userConnections.forEach(pair => {
            const [startId, endId] = pair;
            const key1 = `${startId}-${endId}`;
            const key2 = `${endId}-${startId}`;
            const gifIndex = connectionToGifIndex[key1] || connectionToGifIndex[key2];
            if (!gifIndex) return;

            const fileName = `0004_gif_${gifIndex}.gif`;
            const gifPath = `../../common_contents/img/EMA523_04_SU/${fileName}`;
            
            const existingGif = figure.querySelector(`.folding_gif.gif${gifIndex}`);
            if (existingGif) {
              existingGif.style.display = "block"; // 숨겨져 있으면 다시 보이게
            } else {
              const gif = document.createElement("img");
              gif.src = `${gifPath}?t=${Date.now()}`;
              gif.className = `folding_gif gif${gifIndex}`;
              gif.style.display = "block";
              const svg = figure.querySelector("svg");
              if (svg) svg.style.opacity = "0";
              figure.appendChild(gif);
            }
          });
        }
  
        // sample-line 기준으로 연결된 gifIndex만 추출하여 모션 표시
        figure.querySelectorAll("line[data-sample-line]").forEach(line => {
          const startId = line.getAttribute("data-from");
          const endId = line.getAttribute("data-to");
          const key1 = `${startId}-${endId}`;
          const key2 = `${endId}-${startId}`;
          const gifIndex = connectionToGifIndex[key1] || connectionToGifIndex[key2];
  
          console.log("🔍 startId:", startId, "endId:", endId, "gifIndex:", gifIndex);
          if (!gifIndex) return;
  
          // GIF 파일명과 경로 올바르게 조합
          const fileName = `0004_gif_${gifIndex}.gif`;
          const gifPath = `../../common_contents/img/EMA523_04_SU/${fileName}`;
  
          const gif = document.createElement("img");
          gif.src = `${gifPath}?t=${Date.now()}`;  // 캐시 방지용 타임스탬프 추가
          gif.className = `folding_gif gif${gifIndex}`;
          gif.style.display = "block";
  
          const svg = figure.querySelector("svg");
          if (svg) svg.style.opacity = "0";
  
          figure.appendChild(gif);
        });
      });
    }, 50);
  };
  

window.resetCustom = function () {
  //alert("🔄 리셋 버튼 클릭됨");

  const currentPageId = document.querySelector('#app_wrap')?.getAttribute('data-current-page');
  if (!currentPageId) return;

  const currentPage = document.querySelector(`.page.${currentPageId}`);
  if (!currentPage) return;

  currentPage.querySelectorAll(".folding_gif").forEach(el => el.remove());
  currentPage.querySelectorAll("svg").forEach(svg => svg.style.opacity = "1");

  $(currentPage).find(".custom_check_target").val("");
};


  window.onCustomIncorrect = function (count) { 
    console.log(count);
    if (count === 2) {
      setTimeout(() => {
        document.querySelectorAll(".connect_wrap.correct, .connect_wrap_click.correct").forEach(wrap => {
          const figure = wrap.closest(".figure");
          if (!figure) return;
  
          try {
            figure.querySelectorAll(".folding_gif").forEach(el => el.remove());
          } catch (e) {
            console.warn("❌ folding_gif 초기화 중 예외 발생:", e);
          }
  
          const connectionsRaw = wrap.getAttribute("data-connections");
          if (!connectionsRaw || connectionsRaw === "[]") return;
  
          let connections;
          try {
            connections = JSON.parse(connectionsRaw);
            if (!Array.isArray(connections)) throw new Error("connections is not an array");
          } catch (err) {
            // console.warn("❌ data-connections 파싱 실패 또는 형식 오류:", err);
            return;
          }
  
          connections.forEach(pair => {
            if (!Array.isArray(pair) || pair.length !== 2) return;
  
            const [startId, endId] = pair;
            const key1 = `${startId}-${endId}`;
            const key2 = `${endId}-${startId}`;
            const gifIndex = connectionToGifIndex[key1] || connectionToGifIndex[key2];
            if (!gifIndex) return;
  
            // ✅ gif는 유지하고 svg만 숨김 처리
            try {
              figure.querySelectorAll(".folding_gif").forEach(el => el.remove());
            } catch (e) {
              console.warn("❌ gif 초기화 실패:", e);
            }
  
            const fileName = `0004_gif_${gifIndex}.gif`;
            const gifPath = `../../common_contents/img/EMA523_04_SU/${fileName}`;
  
            const gif = document.createElement("img");
            gif.src = `${gifPath}?t=${Date.now()}`;
            gif.className = `folding_gif gif${gifIndex}`;
            gif.style.display = "block";
  
            const svg = figure.querySelector("svg");
            if (svg) svg.style.opacity = "0";
  
            figure.appendChild(gif);
  
            // ✅ gif는 유지, svg는 계속 숨김 상태 유지
          });
        });
      }, 50);
    }
  };
});

