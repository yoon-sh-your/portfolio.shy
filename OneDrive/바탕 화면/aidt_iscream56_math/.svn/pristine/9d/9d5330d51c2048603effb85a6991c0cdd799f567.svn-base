let nowSupplies;

// 준비물 버튼
const buttonSupplies = document.querySelectorAll("button.icon_supplies");
if(buttonSupplies.length > 0){
    buttonSupplies.forEach(btn => {
        btn.addEventListener('click', function(e){
            const supplies = document.querySelector("."+btn.dataset.supplies);
            supplies.classList.add('show');

            nowSupplies = supplies;
            popupSet(nowSupplies);
        });
    });
}

// 준비물 팝업
const suppliesWrap = document.querySelectorAll('.supplies_zoom_wrap');

if(suppliesWrap.length > 0){
  suppliesWrap.forEach(supplies => {
    supplies.querySelector('.close').addEventListener('click', () => {
      supplies.parentElement.classList.remove('show');

      refreshPopupSetting();
      nowSupplies = null;
    });
  })
}

function popupSet(supplies) {
  const MAX_ZOOM = 2;
  const MIN_ZOOM = 1;
  const ZOOM_INCREASE_VALUE = 0.5;
  let zoomMode = 'plus';
  let nowScale = 1;
  const maxRange = {};

  supplies.querySelector('.supplies_scale_down').addEventListener('click', () => {
    zoomMode = 'minus';
    changeZoom();
  });

  supplies.querySelector('.supplies_scale_up').addEventListener('click', () => {
    zoomMode = 'plus';
    changeZoom();
  });

  setTimeout(() => {
    setImageSize();
    imageDrag();
  }, 200);

  function setImageSize() {
    const suppliesWrap = supplies.querySelector('.supplies_zoom');
    const contents = supplies.querySelector('.supplies_box_wrap');

    if (contents) {
      contents.style.width = `${suppliesWrap.offsetWidth}px`;
      contents.style.height = `${suppliesWrap.offsetHeight}px`;
    }
  }

  function changeZoom() {
    nowScale += zoomMode === 'plus' ? ZOOM_INCREASE_VALUE : -ZOOM_INCREASE_VALUE;
    nowScale = Math.max(MIN_ZOOM, Math.min(nowScale, MAX_ZOOM));
    
    const scaleUpBtn = supplies.querySelector('.supplies_scale_up');
    const scaleDownBtn = supplies.querySelector('.supplies_scale_down');
    scaleUpBtn.disabled = nowScale >= 2;
    scaleDownBtn.disabled = nowScale <= 1;

    setImgScale();
  }

  function setImgScale() {
    const contents = supplies.querySelector('.supplies_box_wrap');
    const suppliesWrap = supplies.querySelector('.supplies_zoom');

    contents.style.scale = nowScale;
    setMaxRange();
    moveImage(suppliesWrap.offsetLeft, suppliesWrap.offsetTop, 0, 0, true);

    if (nowScale <= MIN_ZOOM) {
      nowScale = MIN_ZOOM;
    }
  }

  function setMaxRange() {
    const suppliesWrap = supplies.querySelector('.supplies_zoom');
    const viewerW = suppliesWrap.offsetWidth;
    const viewerH = suppliesWrap.offsetHeight;
    const contents = supplies.querySelector('.supplies_box_wrap');
    const imgScale = parseFloat(contents.style.scale) || 1;
    const imgW = contents.offsetWidth;
    const imgH = contents.offsetHeight;

    maxRange.overWidth = imgW - viewerW;
    maxRange.overHeight = imgH - viewerH;
    maxRange.width = Math.abs((imgW - imgW * imgScale) / 2) + maxRange.overWidth;
    maxRange.height = Math.abs((imgH - imgH * imgScale) / 2) + maxRange.overHeight;
  }

  function moveImage(elementLeft, elementTop, dx, dy, zoomChange) {
    const imgScaled = supplies.querySelector('.supplies_box_wrap');
    const imgScale = parseFloat(imgScaled.style.scale) || 1;
    const img = supplies.querySelector('.supplies_box_wrap');

    if (imgScale === 1) {
      imgScaled.style.left = '';
      imgScaled.style.top = '';
      return;
    }

    const scaledWidth = img.offsetWidth * imgScale;
    const scaledHeight = img.offsetHeight * imgScale;

    if (supplies.offsetWidth < scaledWidth) {
      if (zoomChange) {
        imgScaled.style.left = '';
      } else {
        const newLeft = elementLeft + dx;
        if (newLeft + maxRange.overWidth > maxRange.width) {
          imgScaled.style.left = `${maxRange.width - maxRange.overWidth}px`;
        } else if (newLeft < -maxRange.width) {
          imgScaled.style.left = `${-maxRange.width}px`;
        } else {
          imgScaled.style.left = `${newLeft}px`;
        }
      }
    } else if (zoomChange) {
      imgScaled.style.left = '';
    }

    if (supplies.offsetHeight < scaledHeight) {
      if (zoomChange) {
        imgScaled.style.top = '';
      } else {
        const newTop = elementTop + dy;
        if (newTop + maxRange.overHeight > maxRange.height) {
          imgScaled.style.top = `${maxRange.height - maxRange.overHeight}px`;
        } else if (newTop < -maxRange.height) {
          imgScaled.style.top = `${-maxRange.height}px`;
        } else {
          imgScaled.style.top = `${newTop}px`;
        }
      }
    } else if (zoomChange) {
      imgScaled.style.top = '';
    }
  }

  function imageDrag() {
    const item = supplies.querySelector('.supplies_box_wrap');
    let scale = parseFloat(getComputedStyle(document.getElementById('app_wrap')).transform.split(',')[3]) || 1;

    item.addEventListener('mousedown', startDrag);
    item.addEventListener('touchstart', startDrag, { passive: false });

    function startDrag(e) {
      e.preventDefault();
      const isTouch = e.type === 'touchstart';
      const startX = isTouch ? e.touches[0].pageX / scale : e.clientX / scale;
      const startY = isTouch ? e.touches[0].pageY / scale : e.clientY / scale;

      const elementLeft = item.offsetLeft;
      const elementTop = item.offsetTop;
      const imgScale = parseFloat(item.style.scale) || 1;

      if (imgScale === 1) return;

      const moveHandler = evt => {
        const moveX = (evt.touches ? evt.touches[0].pageX : evt.clientX) / scale;
        const moveY = (evt.touches ? evt.touches[0].pageY : evt.clientY) / scale;
        moveImage(elementLeft, elementTop, moveX - startX, moveY - startY, false);
      };

      const endHandler = () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', endHandler);
        document.removeEventListener('touchmove', moveHandler);
        document.removeEventListener('touchend', endHandler);
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', endHandler);
      document.addEventListener('touchmove', moveHandler, { passive: false });
      document.addEventListener('touchend', endHandler);
    }
  }
}

function refreshPopupSetting() {
  const scaled = nowSupplies.querySelector('.supplies_box_wrap');
  scaled.style.scale = '1';
  scaled.style.removeProperty('left');
  scaled.style.removeProperty('top');
    
  const scaleUpBtn = nowSupplies.querySelector('.supplies_scale_up');
  const scaleDownBtn = nowSupplies.querySelector('.supplies_scale_down');
  scaleUpBtn.disabled = false;
  scaleDownBtn.disabled = true;
}