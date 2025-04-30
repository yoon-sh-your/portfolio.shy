runAfterAppReady(() => {
    const zoomBtn = document.querySelector(".btn_zoom");
    const zoomArea = document.querySelector(".content_zoom_area");
    const zoomScrollContent = zoomArea?.querySelector(".zoom_scroll_content");
    const zoomController = document.querySelector(".controller");
    const zoomClose = document.querySelector(".btn_close");

    const minZoomLevel = 0;
    const maxZoomLevel = 2;
    let currentZoomLevel = 0;
    let isDragging = false;
    let startX, startY, scrollLeftStart, scrollTopStart;

//팝업 슬라이드
    const popupItems = ["#pop_item01", "#pop_item02", "#pop_item03", "#pop_item04"];
    let currentPopupIndex = 0;

    function updatePopupDisplay() {
      $(".popup_slide").css("display", "none");
      $(popupItems[currentPopupIndex]).css("display", "block");


      const prevBtn = document.querySelector(".popup_prev");
      const nextBtn = document.querySelector(".popup_next");

      if (currentPopupIndex === 0) {
        prevBtn.classList.add('disabled');
      }
      else if (currentPopupIndex === popupItems.length - 1) {
        nextBtn.classList.add('disabled');
      } else {
        prevBtn.classList.remove('disabled');
        nextBtn.classList.remove('disabled');
      }
    }


    zoomBtn.addEventListener("click", () => {
      if (!zoomArea) return;
      const isOn = zoomArea.classList.toggle("on");

      currentPopupIndex = 0;
      updatePopupDisplay(); // 첫 팝업 보이기
    });


    zoomClose.addEventListener("click", () => {
      if (!zoomArea) return;
      zoomArea.classList.remove("on");
      $(".popup_slide").css("display", "block");
    });

    document.querySelector(".popup_prev")?.addEventListener("click", () => {
      if (currentPopupIndex > 0) {
        currentPopupIndex--;
        updatePopupDisplay();
      }
    });

    document.querySelector(".popup_next")?.addEventListener("click", () => {
      if (currentPopupIndex < popupItems.length - 1) {
        currentPopupIndex++;
        updatePopupDisplay();
      }
    });

    // ✅ 드래그 관련
    function startDrag(e) {
      if (currentZoomLevel > 0 && e.button === 0) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        scrollLeftStart = zoomScrollContent.scrollLeft;
        scrollTopStart = zoomScrollContent.scrollTop;
        zoomScrollContent.classList.add("grabbing");
        zoomScrollContent.style.userSelect = "none";
      }
    }

    function onDrag(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      zoomScrollContent.scrollLeft = scrollLeftStart - dx;
      zoomScrollContent.scrollTop = scrollTopStart - dy;
    }

    function stopDrag() {
      if (isDragging) {
        isDragging = false;
        zoomScrollContent.classList.remove("grabbing");
        zoomScrollContent.style.removeProperty("user-select");
      }
    }

    function startTouchDrag(e) {
      if (currentZoomLevel > 0 && e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        scrollLeftStart = zoomScrollContent.scrollLeft;
        scrollTopStart = zoomScrollContent.scrollTop;
        zoomScrollContent.classList.add("grabbing");
      }
    }

    function onTouchDrag(e) {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      zoomScrollContent.scrollLeft = scrollLeftStart - dx;
      zoomScrollContent.scrollTop = scrollTopStart - dy;
      e.preventDefault();
    }

    if (zoomScrollContent) {
      zoomScrollContent.addEventListener("mousedown", startDrag);
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDrag);

      zoomScrollContent.addEventListener("touchstart", startTouchDrag, { passive: false });
      document.addEventListener("touchmove", onTouchDrag, { passive: false });
      document.addEventListener("touchend", stopDrag);
      document.addEventListener("touchcancel", stopDrag);
    }
  });
