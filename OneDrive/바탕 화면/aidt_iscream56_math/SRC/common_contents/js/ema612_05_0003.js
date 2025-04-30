window.watchSampleButtonActivation = function () {
    const sampleBtn = document.querySelector("[data-current-page='page_2'] .btn_area .btnSample");
    if (!sampleBtn) return;

    const evaluate = () => {
        const page = pagenation?.activePage;
        if (!page) return;

        const hasTextareaWithExample = [...page.querySelectorAll("math-field.textarea")].some(el => {
        const val = typeof el.getValue === "function" ? el.getValue() : el.value || "";
        const filled = val.trim() !== "";
        const hasExample = !!el.closest(".input_wrap")?.querySelector(".example_box");
        return filled && hasExample;
        });

        const hasBooleanCountSelected = page.querySelectorAll(".boolean_count_wrap button.selected").length > 0;
        const hasDropdownSelected = [...page.querySelectorAll(".custom_dropdown")].some(el => el.value?.trim() !== "");

        const shouldActivate = hasTextareaWithExample || hasBooleanCountSelected || hasDropdownSelected;
        sampleBtn.classList.toggle("active", shouldActivate);
    };

    ["input", "change", "click", "keyup"].forEach(evt => {
        document.addEventListener(evt, evaluate);
    });

    evaluate(); // 최초 실행
};

runAfterAppReady(() => {
    //드롭다운 클릭시 예시 버튼 활성화 
    window.watchSampleButtonActivation();

    //컬러피커 활성화
    /*
    const targetElement = $("[data-current-page]");
    let triggered = false;

    const checkPageChange = () => {
        const currentPage = targetElement.attr("data-current-page");

        if (currentPage === "page_2" && !triggered) {
            $(".pc01 .select_trigger").trigger("click");
            triggered = true; // 실행 후 중복 실행 방지
        } else if (currentPage !== "page_2") {
            triggered = false;
        }
    };

    setInterval(checkPageChange, 300);
    */

    $(".btnSample").on("click", function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(this).addClass("close");
            $('.answer_img').css('display', 'flex');
            $('.page_2 .custom_dropdown').addClass('hint');
        } else {
            $(this).addClass("active");
            $(this).removeClass("close");
            $('.answer_img').css('display', 'none');
            $('.page_2 .custom_dropdown').removeClass('hint');
            $('.page_2 .select_trigger').removeClass('completion');
        }
    });
});
