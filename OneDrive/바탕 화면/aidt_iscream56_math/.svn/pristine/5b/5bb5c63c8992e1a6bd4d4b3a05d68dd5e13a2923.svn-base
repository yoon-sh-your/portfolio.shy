const pagenation = {
  wrap: document.querySelector('#app_wrap'),
  pages: document.querySelectorAll('section.contents.paging_layout article.page'),
  totalPages: 0,
  currentPage: 1,
  activePage: null,
};

pagenation.totalPages = pagenation.pages.length;
pagenation.activePage = isPaging ? document.querySelector('article.page.on') : document.querySelector('#app_wrap');

if (pagenation.totalPages === 0 || !pagenation.wrap) {
  // console.warn("🚨 페이지가 없거나 `#app_wrap`이 없습니다.");
} else {
  isPaging = true;
  const pagingController = document.createElement('div');
  pagingController.classList.add('paging_controller');

  const prevButton = document.createElement('button');
  prevButton.classList.add('prev');

  const nextButton = document.createElement('button');
  nextButton.classList.add('next');

  const pagination = document.createElement('div');
  pagination.classList.add('pagenation');

  const pageButtons = [];
  for (let i = 0; i < pagenation.totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.innerText = i + 1;
    pageButton.dataset.page = i + 1;
    if (i === 0) pageButton.classList.add('on');
    pageButtons.push(pageButton);
    pagination.appendChild(pageButton);
  }

  pagingController.appendChild(prevButton);
  pagingController.appendChild(nextButton);
  pagingController.appendChild(pagination);
  pagenation.wrap.appendChild(pagingController);

  // 페이지 변경 시 활성화된 모듈 숨기는 함수
  function hideActiveModules() {
    // 250420 김성미 - 익힘에서 슬라이드 페이지 입력 토글 버튼 필요 없는 경우 숨김 처리 추가
    if ($('.paging_layout .page.on math-field').length > 0) {
      $('.btnType.key').css('display', 'block');
    } else {
      $('.btnType.key').css('display', 'none');
    }
    // 그리기 도구 팝업 숨기기
    const drawingTool = document.querySelector('.draw-tool-wrap');
    if (drawingTool && drawingTool.classList.contains('show')) {
      drawingTool.classList.remove('show');
    }

    // 계산기 팝업 제거 및 버튼 비활성화
    const calculatorPopup = document.querySelector('.cal_popup');
    if (calculatorPopup) {
      calculatorPopup.remove();
    }
    const calculatorButton = document.querySelector('.calculator');
    if (calculatorButton) {
      calculatorButton.classList.remove('on');
    }

    // 자(ruler) 숨기기 및 버튼 비활성화
    const rulerElement = document.querySelector('.obj_ruler');
    if (rulerElement) {
      rulerElement.style.display = 'none';
    }
    const rulerButton = document.querySelector('.btn.ruler');
    if (rulerButton) {
      rulerButton.classList.remove('active');
    }

    // 삼각자(triangle) 숨기기 및 버튼 비활성화
    const triangleElements = document.querySelectorAll('.obj_triangle');
    triangleElements.forEach((element) => {
      element.style.display = 'none';
    });
    const triangleButton = document.querySelector('.btn.triangle');
    if (triangleButton) {
      triangleButton.classList.remove('active');
    }

    // 각도기(protractor) 숨기기 및 버튼 비활성화
    const protractorElements = document.querySelectorAll('.obj_protractor');
    protractorElements.forEach((element) => {
      element.style.display = 'none';
    });
    const protractorButton = document.querySelector('.btn.protractor');
    if (protractorButton) {
      protractorButton.classList.remove('active');
    }
  }

  function showCurrentHowtoText() {
    const howtoItems = document.querySelectorAll('.howto');
    howtoItems.forEach((item) => (item.style.display = 'none'));

    const currentHowto = document.querySelector(`.howto.num${pagenation.currentPage}`);
    if (currentHowto) {
      currentHowto.style.display = '';
    }
  }

  function updatePagination() {
    globalFaultCount = 0;
    pagenation.pages.forEach((page) => page.classList.remove('on'));
    pagenation.pages[pagenation.currentPage - 1].classList.add('on');

    pagenation.activePage = pagenation.pages[pagenation.currentPage - 1];

    // Call the score update function if it exists (from score.js)
    if (typeof updateTitleScoreClass === 'function') {
      updateTitleScoreClass();
    } else {
      // console.warn("pagenation.js: updateTitleScoreClass function not found.");
    }

    pageButtons.forEach((button) => button.classList.remove('on'));
    pageButtons[pagenation.currentPage - 1].classList.add('on');

    prevButton.classList.toggle('disabled', pagenation.currentPage === 1);
    nextButton.classList.toggle('disabled', pagenation.currentPage === pagenation.totalPages);

    pagenation.wrap.dataset.currentPage = `page_${pagenation.currentPage}`;
    showCurrentHowtoText();
    // console.log(pagenation.currentPage, pagenation.activePage)

    hideActiveModules();

    // ✅ 페이지 변경 후 버튼 상태 재평가 트리거
    if (typeof window.forceWatchEvaluation === 'function') {
      window.forceWatchEvaluation();
    }
  }

  prevButton.addEventListener('click', () => {
    if (pagenation.currentPage > 1) {
      pagenation.currentPage--;
      updatePagination();
    }
  });

  nextButton.addEventListener('click', () => {
    if (pagenation.currentPage < pagenation.totalPages) {
      pagenation.currentPage++;
      updatePagination();
    }
  });

  pageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const page = Number(e.target.dataset.page);
      if (page !== pagenation.currentPage) {
        pagenation.currentPage = page;
        updatePagination();
      }
    });
  });

  updatePagination();
}
