document.addEventListener("DOMContentLoaded", () => {
    const selctLineType = document.querySelector('.selctLineType');
    const optionsList = selctLineType ? selctLineType.querySelector('.select_type_options') : null;
    const canvas = document.querySelector('.line_canvas');
    let lastCreatedLine = null;
    let isDropdownManuallyOpened = false;

    const imgBox = document.querySelector('.drawline_grid') || document.querySelector('.img_box');
    if (imgBox) imgBox.style.position = "relative";

    if (optionsList) {
        optionsList.querySelectorAll('li').forEach(li => {
            li.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!lastCreatedLine) return;
                lastCreatedLine.classList.remove('guide-solid', 'guide-dash');
                if (li.dataset.value === 'solid') lastCreatedLine.classList.add('guide-solid');
                else if (li.dataset.value === 'dotted') lastCreatedLine.classList.add('guide-dash');
                selctLineType.style.display = "none";
            });
        });
    } else {
        console.error('optionsList (.select_type_options) 요소를 찾을 수 없습니다!');
    }

    function showDropdownAtPage(absX, absY) {
        if (!canvas || !selctLineType) return;

        isDropdownManuallyOpened = true;

        selctLineType.style.display = "block";
        selctLineType.style.zIndex = 1000;

        const canvasRect = canvas.getBoundingClientRect();
        const selctLineTypeRect = selctLineType.getBoundingClientRect();

        const dropdownWidth = selctLineTypeRect.width;
        const dropdownHeight = selctLineTypeRect.height;

        let left = absX - canvasRect.left - dropdownWidth / 2;
        let top = absY - canvasRect.top - dropdownHeight / 2;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left < 0) left = 10;
        if (left + dropdownWidth > viewportWidth) {
            left = viewportWidth - dropdownWidth - 10;
        }
        if (top < 0) top = 10;
        if (top + dropdownHeight > viewportHeight) {
            top = viewportHeight - dropdownHeight - 10;
        }

        selctLineType.style.left = `${Math.round(left)}px`;
        selctLineType.style.top = `${Math.round(top)}px`;
    }

    function svgToScreen(svg, x, y) {
        const pt = svg.createSVGPoint();
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(svg.getScreenCTM());
    }

    function handleInteraction(event, isTouch = false) {
        const point = isTouch ? event.touches[0] : event;
        const target = isTouch
            ? document.elementFromPoint(point.clientX, point.clientY)
            : event.target;

        if (target instanceof SVGLineElement) {
            event.stopPropagation();
            canvas.querySelectorAll('line.selected').forEach(l => l.classList.remove('selected'));
            target.classList.add('selected');
            lastCreatedLine = target;

            const rect = canvas.getBoundingClientRect();
            const pt = canvas.createSVGPoint();
            pt.x = point.clientX - rect.left;
            pt.y = point.clientY - rect.top;
            const screenPt = pt.matrixTransform(canvas.getScreenCTM());
            showDropdownAtPage(screenPt.x, screenPt.y);
        }
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.tagName === 'line') {
                    lastCreatedLine = node;
                    canvas.querySelectorAll('line.selected').forEach(l => l.classList.remove('selected'));
                    node.classList.add('selected');
                    const x2 = Number(node.getAttribute('x2'));
                    const y2 = Number(node.getAttribute('y2'));
                    const screenPt = svgToScreen(canvas, x2, y2);
                    showDropdownAtPage(screenPt.x, screenPt.y);
                }
            });
        });
    });
    observer.observe(canvas, { childList: true });

    // 클릭 이벤트
    canvas.addEventListener('click', (e) => handleInteraction(e));

    // 터치 이벤트
    canvas.addEventListener('touchstart', (e) => handleInteraction(e, true));

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.line_canvas') && !e.target.closest('.selctLineType')) {
            if (!isDropdownManuallyOpened) {
                canvas.querySelectorAll("line.selected, path.selected").forEach((l) =>
                    l.classList.remove("selected")
                );
                lastCreatedLine = null;

                if (selctLineType.style.display === "block") {
                    selctLineType.style.display = "none"; // 드롭다운 숨기기
                }
            }
            isDropdownManuallyOpened = false; // 플래그 초기화
        }
    });
});


runAfterAppReady(() => {
    defineButtonClassRules([
        {
            selector: ".img_box .drawing_grid_area",
            key: "custom_submit_btn_active",
            test: (el) => {
                return el.dataset.connection !== undefined && el.dataset.connection !== "[]";
            }
        },
    ]);
});