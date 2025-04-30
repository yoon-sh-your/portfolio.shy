runAfterAppReady(() => {
    const pageSelector = ".page_5";
    const mathFields = document.querySelectorAll(`${pageSelector} math-field`);
    const submitBtn = document.querySelector(".btnSubmit");
    const resetBtn = document.querySelector(".btnReset");

    function isFilled(field) {
        const value = typeof field.getValue === "function"
            ? field.getValue().trim()
            : field.textContent.trim();
        return value !== "";
    }

    if (mathFields.length > 0 && submitBtn && resetBtn) {
        defineButtonClassRules([
            {
                selector: `${pageSelector} math-field`,
                key: "all_math_fields_filled",
                test: () => Array.from(mathFields).every(isFilled),
                setClass: [
                    { target: ".btnSubmit", class: "active" },
                    { target: ".btnSubmit", class: "is-disabled", remove: true },
                ],
            },
        ]);


        window.forceWatchEvaluation();
    }
});
