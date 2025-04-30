document.addEventListener("DOMContentLoaded", () => {
  const diagram = document.querySelector(".diagram");
  const numbers = document.querySelectorAll(".imgArea .number");
  let currentIndex = 0;
  let hasStarted = false;

  diagram.addEventListener("click", () => {
    if (hasStarted) return;
    hasStarted = true;

    numbers.forEach((el, index) => {
      setTimeout(() => {
        el.style.display = "block";
        el.innerHTML = index + 1;
        el.classList.add("active");
      }, index * 500);
    });
  });
});
