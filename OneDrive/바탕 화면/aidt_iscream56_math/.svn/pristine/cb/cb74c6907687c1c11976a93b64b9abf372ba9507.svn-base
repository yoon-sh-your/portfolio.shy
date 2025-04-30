document.addEventListener("DOMContentLoaded", () => {
    const dragItems = document.querySelectorAll(".drag_item")
    const dropItems = document.querySelectorAll(".drop_item")

    dropItems.forEach(dropItem => {
        dropItem.addEventListener("drop", (event) => {
            event.preventDefault()

            const draggedElement = document.querySelector(".dragging")
            if (!draggedElement) return

            const dragValue = parseInt(draggedElement.getAttribute("data-value"), 10)
            const dropAnswer = parseInt(dropItem.getAttribute("data-answer-single"), 10)

            if (dragValue === dropAnswer) {
                const buttons = dropItem.querySelectorAll(".boolean_count_wrap button")
                buttons.forEach((button, index) => {
                    if (index < dragValue) {
                        button.classList.add("selected")
                    }
                })
            }

            draggedElement.classList.remove("dragging")
        })

        dropItem.addEventListener("dragover", (event) => {
            event.preventDefault()
        })
    })

    dragItems.forEach(dragItem => {
        dragItem.addEventListener("dragstart", () => {
            dragItem.classList.add("dragging")
        })

        dragItem.addEventListener("dragend", () => {
            dragItem.classList.remove("dragging")
        })
    })
})