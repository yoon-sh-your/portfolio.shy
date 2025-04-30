window.watchSampleButtonActivation = function () {
    const sampleBtn = document.querySelector(".btn_area .btnSample");
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

    window.sampleCustomDrop = function (btn) {
        if ( $(".btnSample").hasClass("close")) {
            $('.answer_img').css('display', 'block');
            $('.page_2 .select_trigger').addClass('completion');

        } else {
            $('.answer_img').css('display', 'none');
        }
    };

    $(".btnSample").on("click", function () {
        window.sampleCustomDrop(this);
    });
});
