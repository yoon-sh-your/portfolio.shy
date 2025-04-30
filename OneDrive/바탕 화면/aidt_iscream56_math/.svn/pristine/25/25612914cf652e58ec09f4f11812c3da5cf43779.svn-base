  document.addEventListener("DOMContentLoaded", () => {
    const btnSubmit = document.querySelector('.btnSubmit');
    const btnReset = document.querySelector('.btnReset');
    const fields = document.querySelectorAll('math-field.textarea');

    function checkAllFields() {
      const allFilled = Array.from(fields).every(field => {
        return field.value && field.value.trim() !== '';
      });

      if (allFilled) {
        btnSubmit.classList.add('active');
      } else {
        btnSubmit.classList.remove('active');
      }
    }

    fields.forEach(field => {
      field.addEventListener('input', () => {
        btnReset.classList.add('active');
        btnSubmit.classList.remove('active');
        checkAllFields();
      });
    });

    btnSubmit.addEventListener("click", () => {
      toastCheckMsg("선생님께 제출되었습니다.", 5, false);
    });

    btnReset.addEventListener("click", () => {
      btnSubmit.classList.remove('active');
    });
    // 제출 버튼 활성화 막기 //
    const observer = new MutationObserver(() => {
      const allFilled = Array.from(fields).every(field => {
        return field.value && field.value.trim() !== '';
      });

      if (!allFilled && btnSubmit.classList.contains('active')) {
        btnSubmit.classList.remove('active');
      }
    });

    observer.observe(btnSubmit, {
      attributes: true,
      attributeFilter: ['class']
    });
  });

