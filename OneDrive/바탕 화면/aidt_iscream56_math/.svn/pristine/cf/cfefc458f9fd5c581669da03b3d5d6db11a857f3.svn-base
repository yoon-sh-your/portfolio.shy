function initPopupPagination() {
    const pagenation = {
        wrap: document.querySelector(".pop_goal_wrap"),
        pages: document.querySelectorAll(".pop_goal_wrap section.contents.paging_layout article.popup_page"),
        totalPages: 0,
        currentPage: 1,
        activePage: null,
    };

    pagenation.totalPages = pagenation.pages.length;
    pagenation.activePage = pagenation.pages[0] || null;

    // 이미 생성된 경우 중복 방지
    if (
        pagenation.totalPages === 0 ||
        !pagenation.wrap ||
        pagenation.wrap.querySelector(".paging_controller.popup_only")
    ) return;

    // 컨트롤러 생성
    const pagingController = document.createElement("div");
    pagingController.classList.add("paging_controller", "popup_only");

    const prevButton = document.createElement("button");
    prevButton.classList.add("prev");
    prevButton.textContent = "이전";

    const nextButton = document.createElement("button");
    nextButton.classList.add("next");
    nextButton.textContent = "다음";

    const pagination = document.createElement("div");
    pagination.classList.add("pagenation");

    const pageButtons = [];
    for (let i = 0; i < pagenation.totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i + 1;
        btn.dataset.page = i + 1;
        pageButtons.push(btn);
        pagination.appendChild(btn);
    }

    pagingController.appendChild(prevButton);
    pagingController.appendChild(nextButton);
    pagingController.appendChild(pagination);

    const goalInner = pagenation.wrap.querySelector(".pop_goal_inner");
    (goalInner || pagenation.wrap).appendChild(pagingController);

    function updatePagination() {
        if (window.getComputedStyle(pagenation.wrap).display === "none") return;

        pagenation.pages.forEach((page, idx) => {
            page.classList.toggle("on", idx === pagenation.currentPage - 1);
        });

        pageButtons.forEach((btn, idx) => {
            btn.classList.toggle("on", idx === pagenation.currentPage - 1);
        });

        prevButton.classList.toggle("disabled", pagenation.currentPage === 1);
        nextButton.classList.toggle("disabled", pagenation.currentPage === pagenation.totalPages);

        const prefix = pagenation.wrap.classList.contains("pop_goal_wrap") ? "popup_page" : "page";
        pagenation.wrap.dataset.currentPage = `${prefix}_${pagenation.currentPage}`;

    }

    prevButton.addEventListener("click", () => {
        if (pagenation.currentPage > 1) {
            pagenation.currentPage--;
            updatePagination();
        }
    });

    nextButton.addEventListener("click", () => {
        if (pagenation.currentPage < pagenation.totalPages) {
            pagenation.currentPage++;
            updatePagination();
        }
    });

    pageButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const page = Number(btn.dataset.page);
            if (page !== pagenation.currentPage) {
                pagenation.currentPage = page;
                updatePagination();
            }
        });
    });

    // 팝업 열릴 때 자동으로 첫 페이지 표시
    const observer = new MutationObserver(() => {
        if (window.getComputedStyle(pagenation.wrap).display !== "none") {
            updatePagination();
        }
    });

    observer.observe(pagenation.wrap, { attributes: true, attributeFilter: ["style"] });

    // 즉시 1페이지로 초기화 (팝업 열릴 경우 대비)
    updatePagination();
    // 페이지 버튼 클릭 이벤트 설정
        pageButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const page = Number(btn.dataset.page);
                if (page !== pagenation.currentPage) {
                    pagenation.currentPage = page;
                    updatePagination();
                }
            });
        });

        // reveal_btn 토글 기능 추가
        const revealButtons = pagenation.wrap.querySelectorAll(".reveal_btn");
        revealButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                btn.classList.toggle("on");
            });
        });

}

function openPop(selector) {
    document.querySelector(selector).style.display = "block";

    if (selector === ".pop_goal_wrap") {
        initPopupPagination(); // ✨ 팝업용 페이지네이션 초기화
    }

    console.log('wrewer')
}
