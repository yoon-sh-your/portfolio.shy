
document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.querySelector('.custom_select .select_trigger');
    const select = document.querySelector('.dropdown_wrap .custom_dropdown');

    const canvas = document.querySelector('.line_canvas');
    const answerData = canvas.dataset.answerSingle;

    let selectedLine = null;

    function answerMatchClassName(target, answers) {
        const lines = target.querySelectorAll("line, path");
        if (lines.length !== anssers.length) return false;
        if (answers.length === 0) return false;

        const answerData = JSON.parse(answers);
        const ansser = answerData.map((item, index) => {
            const lineClasses = Array.from(lines[index].classList);
            return lineClasses.includes(item);
        });

        return ansser.every((item) => item === true);


        // 정답과 비교
        // return Array.from(lines).every((line, index) => {
        //     const lineClasses = Array.from(line.classList);
        //     return lineClasses.includes(anssers[index]);
        // });
    }

    function checkAnswer() {
        const svg = document.querySelector("svg");
        if (!svg) return false;

        const lines = svg.querySelectorAll("line, path");
        if (lines.length === 0) return false;

        const answers = answerData.map((item) => item.className);
        const result = answerMatchClassName(svg, answers);

        return result;
    }
    // 정답과 비교
    // return Array.from(lines).every((line, index) => {
    //     const lineClasses = Array.from(line.classList);
    //     return lineClasses.includes(answers[index]);
    // });
    // const answers = [
    //     "guide-dash",
    //     "guide-dash",
    //     "guide-dash",
    //     "guide-dash",
    //     "guide-solid",
    //     "guide-solid",
    //     "guide-solid",
    //     "guide-solid",
    //     "guide-solid",
    //     "red-solid",     
    //     "red-solid",
    //     "red-solid",
    //     "red-solid",
    //     "red-solid",
    // ];
    // const result = answerMatchClassName(svg, answers);
    // console.log(result);

    // show select line type
    function displaySelectLineType() {
        const selectedLine = document.querySelector('.line_canvas line.selected');
        if (selectedLine) {
            if (selectedLine.classList.contains('guide-dash')) select.value = 'dotted';
            else if (selectedLine.classList.contains('guide-solid')) select.value = 'solid';
            else select.value = '';
        } else {
            select.value = '';
        }
        select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    document.querySelector('.line_canvas').addEventListener('click', (e) => {
        if (!(e.target instanceof SVGLineElement)) return;

        document.querySelectorAll('.line_canvas line.selected').forEach(line => {
            line.classList.remove('selected');
        });

        e.target.classList.add('selected');
        selectedLine = e.target;

        if (selectedLine.classList.contains('guide-dash')) select.value = 'dotted';
        else if (selectedLine.classList.contains('guide-solid')) select.value = 'solid';
        else select.value = '';

        select.dispatchEvent(new Event('change', { bubbles: true }));
        handleSelectOption(select, trigger, select.querySelector('.options_list'), { value: select.value });
    });

    select.addEventListener('change', function () {
        if (!selectedLine) return;
        selectedLine.classList.remove('guide-dash', 'guide-solid');
        if (this.value === 'solid') selectedLine.classList.add('guide-solid');
        else if (this.value === 'dotted') selectedLine.classList.add('guide-dash');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.line_canvas') && !e.target.closest('.dropdown_wrap')) {
            document.querySelectorAll('.line_canvas line.selected').forEach(line => {
                line.classList.remove('selected');
            });
            selectedLine = null;
            select.value = '';
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    // svg 직접 그리시 시에
    const svg = document.querySelector("svg");

    // SVG 내 모든 line, path에 클릭 이벤트
    svg.querySelectorAll('line, path').forEach(svgElem => {
        svgElem.addEventListener('click', function () {
            const value = select.value;

            // 기존 스타일 클래스 제거
            this.classList.remove('guide-solid', 'guide-dash', 'red-solid');

            // 선택값 적용
            if (value === 'solid') this.classList.add('guide-solid');
            else if (value === 'dotted') this.classList.add('guide-dash');
            // 빈 값이면 아무 class 없음(초기화)
        });
    });
});

runAfterAppReady(() => {
    window.customCheckCondition = () => {
        const svg = document.querySelector("svg");
        if (!svg) return false;
        const lines = svg.querySelectorAll("line, path");

        const answers = [
            "guide-dash",
            "guide-dash",
            "guide-dash",
            "guide-dash",
            "guide-solid",
            "guide-solid",
            "guide-solid",
            "guide-solid",
            "guide-solid",
            "red-solid",
            "red-solid",
            "red-solid",
            "red-solid",
            "red-solid",
        ];

        // 정답과 비교
        return Array.from(lines).every((line, index) => {
            const lineClasses = Array.from(line.classList);
            return lineClasses.includes(answers[index]);
        });

        // 정답과 비교
        // return Array.from(lines).every((line, index) => {
        //     const lineClasses = Array.from(line.classList);
        //     return lineClasses.includes("guide-dash") || lineClasses.includes("guide-solid");
        // });
    }

    defineButtonClassRules([
        // {
        //     selector: ".grid-canvas .userLines",
        //     key: "custom_submit_btn_active",
        //     test: (el) => {
        //         const lines = el.querySelectorAll("line");
        //         return lines.length > 0 && Array.from(lines).some((line) => {
        //             const x1 = parseFloat(line.getAttribute("x1"));
        //             const y1 = parseFloat(line.getAttribute("y1"));
        //             const x2 = parseFloat(line.getAttribute("x2"));
        //             const y2 = parseFloat(line.getAttribute("y2"));

        //             return x1 !== x2 || y1 !== y2;
        //         }
        //         );
        //     }
        // },
        {
            selector: ".img_paper .drawing_grid_area",
            key: "custom_submit_btn_active",
            test: (el) => {
                return el.dataset.connection !== undefined && el.dataset.connection !== "[]";
            }
        },
        // {
        //     selector: ".grid-canvas .userLines",
        //     key: "custom_reset_btn_active",
        //     test: (el) => el.children.length > 0, // 자식 노드가 있으면 활성화
        // },
    ]);
});