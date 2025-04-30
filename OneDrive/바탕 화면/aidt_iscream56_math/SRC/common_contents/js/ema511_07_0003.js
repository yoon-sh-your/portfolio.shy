const imgList = [
  {
    index: 1,
    name: '담요 2개',
    weight: '3000 g',
    src: '../../common_contents/img/EMA511_07_SU/0002_list02.png',
    alt: '담요',
  },
  {
    index: 2,
    name: '성냥개비 10세트',
    weight: '150 g',
    src: '../../common_contents/img/EMA511_07_SU/0002_list08.png',
    alt: '성냥개비',
  },
  {
    index: 3,
    name: '물 6병',
    weight: '9000 g',
    src: '../../common_contents/img/EMA511_07_SU/0002_list09.png',
    alt: '물',
  },
  {
    index: 4,
    name: '초콜릿 5개',
    weight: '1000 g',
    src: '../../common_contents/img/EMA511_07_SU/0002_list10.png',
    alt: '초콜릿',
  },
  {
    index: 5,
    name: '통조림 10개',
    weight: '5000 g',
    src: '../../common_contents/img/EMA511_07_SU/0002_list11.png',
    alt: '통조림',
  },
];

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.toggle_box .img_box').forEach(function (img) {
    img.addEventListener('click', function () {
      let clickedBox = this.closest('.toggle_box');

      document.querySelectorAll('.toggle_box').forEach(function (box) {
        if (box !== clickedBox) {
          box.classList.remove('on');
        }
      });

      clickedBox.classList.add('on');

      const boxClass = clickedBox.className.split(' ')[1];
      const boxNumber = boxClass.match(/\d{2}$/);

      if (boxNumber) {
        const index = parseInt(boxNumber[0], 10) - 1;

        const imgItem = imgList[index];
        const textBox = document.querySelector('.text_box');

        textBox.innerHTML = `
                    <div class="img_box">
                        <img src="${imgItem.src}" alt="${imgItem.alt}">
                    </div>
                    <div class="text">
                        <span lang="y">${imgItem.name}</span>
                        <span lang="y">${imgItem.weight}</span>
                    </div>
                `;
      }
    });
  });
});
