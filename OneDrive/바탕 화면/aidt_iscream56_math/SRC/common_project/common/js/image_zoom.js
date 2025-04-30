// 이미지 줌 인아웃 및 드래그 기능 변수
const imageZoom = {
  scale: 1,
  isDragging: false,
  startX: 0,
  startY: 0,
  scrollLeft: 0,
  scrollTop: 0,
  touchStartX: 0,
  touchStartY: 0,
  imgWidth: 0,
  imgHeight: 0,
};

// 앱 컨테이너
const appWrap = document.querySelector('#app_wrap');

// 팝업 생성 함수
function createZoomPopup(targetPicture) {
  if (document.querySelector('.pop_area')) return; // 중복 실행 방지

  const titleText = document.querySelector('section.title h2');

  // 🔹 .heading 클래스를 제외한 HTML 구조를 포함하도록 수정
  let pureText = '';
  if (titleText) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = titleText.innerHTML;
    // .heading 클래스를 가진 모든 요소를 찾아 제거
    tempDiv.querySelectorAll('.heading').forEach(headingEl => headingEl.remove());
    pureText = tempDiv.innerHTML.trim();
  }

  const dataHead = targetPicture.dataset.head || '';
  const dataTit = targetPicture.dataset.tit || pureText;

  // 🔹 `<svg>` 요소를 복사
  const svgElement = targetPicture.querySelector('svg') ? targetPicture.querySelector('svg').cloneNode(true) : null;

  // 🔹 `<img>` 요소를 복사
  const imgElement = targetPicture.querySelector('img') ? targetPicture.querySelector('img').cloneNode(true) : null;

  if (!svgElement && !imgElement) return;

  // 🔹 SVG 및 이미지 구조 그대로 포함
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('image-content');
  if (svgElement) contentContainer.appendChild(svgElement);
  if (imgElement) contentContainer.appendChild(imgElement);

  // 팝업 생성
  const popArea = document.createElement('div');
  popArea.classList.add('pop_area');
  popArea.innerHTML = `
        <div class="image_zoom_wrap">
            <div class="title">
                <h3 lang="y">${dataHead ? '<span>' + dataHead + '</span>' : ''}${dataTit}</h3>
                <button class="close"></button>
            </div>
            <div class="image_zoom scrollable"></div>
            <div class="controller">
                <button class="scale_down" disabled></button>
                <button class="scale_up"></button>
            </div>
        </div>
    `;

  popArea.querySelector('.image_zoom').appendChild(contentContainer);
  appWrap.appendChild(popArea);

  // 팝업 위치 조정
  const popWrap = popArea.querySelector('.image_zoom_wrap');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = appWrap.offsetHeight;

  // 팝업 높이 계산 (측정을 위해 잠시 스타일 변경)
  popWrap.style.visibility = 'hidden';
  popWrap.style.display = 'block';
  const popHeight = popWrap.offsetHeight;
  popWrap.style.display = ''; // 원래 display 속성 복원 (CSS에 정의된 값)
  popWrap.style.visibility = ''; // 다시 보이게 함

  // 고정된 top 위치 값 설정 (예: 100px)
  // popWrap.style.top = '100px';

  // 팝업 닫기 기능
  popArea.querySelector('.close').addEventListener('click', () => {
    imageZoom.scale = 1;
    popArea.remove();
  });

  // 확대/축소 및 드래그 기능 초기화
  initializeZoomAndMove();
}

// 외부 버튼과 picture_wrap 연결
document.querySelectorAll('.btn_zoom[data-target]').forEach((button) => {
  const targetClass = button.dataset.target;
  const targetPicture = document.querySelector(`.picture_wrap.${targetClass}`);

  if (targetPicture) {
    button.addEventListener('click', () => {
      createZoomPopup(targetPicture);
    });
  }
});

// ✅ `.picture_wrap` 내의 SVG + 이미지 구조 그대로 유지하여 팝업 생성
document.querySelectorAll('.picture_wrap').forEach((picture) => {
  const zoomBtn = picture.querySelector('.zoom');

  if (!zoomBtn) return;
  zoomBtn.addEventListener('click', () => {
    createZoomPopup(picture);
  });
});

/** 이미지 및 SVG 확대 및 드래그 기능 초기화 */
function initializeZoomAndMove() {
  if (document.querySelector('.image_zoom').dataset.init === 'true') return;

  const imgWrap = document.querySelector('.image_zoom');
  const content = imgWrap.querySelector('.image-content'); // 🔹 SVG + IMG 포함 컨테이너
  const scaleUpBtn = document.querySelector('.scale_up');
  const scaleDownBtn = document.querySelector('.scale_down');

  // ✅ 원본 크기 저장
  imageZoom.imgWidth = imgWrap.offsetWidth;
  imageZoom.imgHeight = imgWrap.offsetHeight;

  // 이벤트 리스너 등록
  scaleUpBtn.addEventListener('click', zoomInImage);
  scaleDownBtn.addEventListener('click', zoomOutImage);
  imgWrap.addEventListener('mousedown', startImageMove);
  imgWrap.addEventListener('mousemove', onImageMove);
  document.addEventListener('mouseup', stopImageMove);
  imgWrap.addEventListener('touchstart', startTouchImageMove);
  imgWrap.addEventListener('touchmove', onTouchImageMove);
  imgWrap.addEventListener('touchend', stopImageMove);

  imgWrap.dataset.init = 'true';
}

/** 이미지 확대 */
function zoomInImage() {
  if (imageZoom.scale < 2) {
    imageZoom.scale += 0.5;
    updateImageSize(true);
  }
}

/** 이미지 축소 */
function zoomOutImage() {
  if (imageZoom.scale > 1) {
    imageZoom.scale -= 0.5;
    updateImageSize(imageZoom.scale > 1);
  }
}

/** 이미지 크기 업데이트 */
function updateImageSize(center = false) {
  const content = document.querySelector('.image_zoom .image-content');
  const imgWrap = document.querySelector('.image_zoom');
  const scaleUpBtn = document.querySelector('.scale_up');
  const scaleDownBtn = document.querySelector('.scale_down');

  if (!imageZoom.imgWidth || !imageZoom.imgHeight || imageZoom.scale === 1) {
    content.style.removeProperty('width');
    content.style.removeProperty('height');
  } else {
    const newWidth = imageZoom.imgWidth * imageZoom.scale;
    const newHeight = imageZoom.imgHeight * imageZoom.scale;

    content.style.width = `${newWidth}px`;
    content.style.height = `${newHeight}px`;
  }

  imgWrap.style.overflow = imageZoom.scale > 1 ? 'auto' : 'hidden';

  if (center) {
    imgWrap.scrollLeft = (imgWrap.scrollWidth - imgWrap.clientWidth) / 2;
    imgWrap.scrollTop = (imgWrap.scrollHeight - imgWrap.clientHeight) / 2;
  } else if (imageZoom.scale === 1) {
    imgWrap.scrollLeft = 0;
    imgWrap.scrollTop = 0;
  }

  imageZoom.scale > 1 ? imgWrap.classList.add('grab') : imgWrap.classList.remove('grab');

  // 버튼 disabled 상태 관리
  scaleUpBtn.disabled = imageZoom.scale >= 2;
  scaleDownBtn.disabled = imageZoom.scale <= 1;
}

/** 이미지 드래그 시작 */
function startImageMove(e) {
  if (imageZoom.scale > 1) {
    imageZoom.isDragging = true;
    imageZoom.startX = e.clientX;
    imageZoom.startY = e.clientY;
    imageZoom.scrollLeft = e.currentTarget.scrollLeft;
    imageZoom.scrollTop = e.currentTarget.scrollTop;
  }
}

/** 이미지 드래그 이동 */
function onImageMove(e) {
  if (!imageZoom.isDragging) return;
  const imgWrap = document.querySelector('.image_zoom');
  imgWrap.scrollLeft = imageZoom.scrollLeft + (imageZoom.startX - e.clientX) * imageZoom.scale;
  imgWrap.scrollTop = imageZoom.scrollTop + (imageZoom.startY - e.clientY) * imageZoom.scale;
}

/** 드래그 종료 */
function stopImageMove() {
  imageZoom.isDragging = false;
}

/** 터치 드래그 시작 */
function startTouchImageMove(e) {
  if (imageZoom.scale > 1) {
    imageZoom.isDragging = true;
    imageZoom.touchStartX = e.touches[0].clientX;
    imageZoom.touchStartY = e.touches[0].clientY;
    imageZoom.scrollLeft = e.currentTarget.scrollLeft;
    imageZoom.scrollTop = e.currentTarget.scrollTop;
  }
}

/** 터치 드래그 이동 */
function onTouchImageMove(e) {
  if (!imageZoom.isDragging || e.touches.length !== 1) return;
  const imgWrap = document.querySelector('.image_zoom');
  imgWrap.scrollLeft = imageZoom.scrollLeft + (imageZoom.touchStartX - e.touches[0].clientX) * imageZoom.scale;
  imgWrap.scrollTop = imageZoom.scrollTop + (imageZoom.touchStartY - e.touches[0].clientY) * imageZoom.scale;
  e.preventDefault();
}
