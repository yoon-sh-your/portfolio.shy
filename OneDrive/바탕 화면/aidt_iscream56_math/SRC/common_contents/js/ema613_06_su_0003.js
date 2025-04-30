document.addEventListener("DOMContentLoaded", function () {
    const gridButtons = document.querySelectorAll(".boolean_count_wrap button");
    let isDragging = false;

    function toggleFill(button) {
        button.classList.toggle("filled");
    }

    gridButtons.forEach((button) => {
        button.addEventListener("click", function () {
            toggleFill(this);
        });

        button.addEventListener("mousedown", function () {
            isDragging = true;
            toggleFill(this);
        });

        button.addEventListener("mouseenter", function () {
            if (isDragging) {
                toggleFill(this);
            }
        });
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
    });
});