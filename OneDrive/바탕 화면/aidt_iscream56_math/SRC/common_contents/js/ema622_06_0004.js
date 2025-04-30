window.onload = function () {
    const toggleBox = document.getElementById('toggleBox');

    toggleBox.classList.add('show-one');

    toggleBox.addEventListener('click', () => {
        if (toggleBox.classList.contains('show-one')) {
            toggleBox.classList.remove('show-one');
            toggleBox.classList.add('show-two');
        } else {
            toggleBox.classList.remove('show-two');
            toggleBox.classList.add('show-one');
        }
    });
}